import { SignJWT, jwtVerify } from "jose";
import { v4 as uuidv4 } from "uuid";

import { Injectable } from "@nestjs/common";
import { SettingsService } from "../../core/services/settings/settings.service";
import { InterfaceException } from "../exceptions/interface.exception";
import { ServerException } from "../exceptions/server.exception";

import type { SessionHandlerPort } from "../ports/session.handler.port";
import type { StatusModel } from "../interface/common.model";
import type { JWTPayload } from "jose";
import type { FastifyRequest, FastifyReply } from "fastify";

import type { CoreTypes } from "@types";

type ServiceScope = "user" | "service";

type SessionScope = {
  [K in ServiceScope]: boolean;
};

const serviceScopes: ServiceScope[] = ["user", "service"];

interface SessionIdentity extends JWTPayload {
  iss: string;
  sub: string;
  jti: string;
  iat: number;
  exp: number;
  scope: SessionScope;
}

interface SessionInput {
  idAccount: string;
  scope: string;
}

interface SessionOutput {
  status: StatusModel;
}

@Injectable()
export class SessionHandler
  implements
    SessionHandlerPort<
      FastifyRequest,
      FastifyReply,
      SessionInput,
      SessionIdentity,
      SessionOutput
    >
{
  constructor(private settings: SettingsService) {}

  private async unsignCookie(
    request: FastifyRequest,
    cookieName: string,
    options: CoreTypes.Settings.SessionCookieOptions,
  ): Promise<string | null> {
    const cookie = request.cookies[cookieName];
    if (!cookie) return null;

    if (options.signed) {
      const unsigned = request.unsignCookie(cookie);
      if (unsigned.valid === false || unsigned.value == null) {
        return null;
      }
      return unsigned.value;
    }

    return cookie;
  }

  private async verifyToken(
    token: string,
    secret: string,
  ): Promise<SessionIdentity | null> {
    try {
      const { payload: claims } = await jwtVerify(
        token,
        new TextEncoder().encode(secret),
      );
      return claims as SessionIdentity;
    } catch (error) {
      return null;
    }
  }

  private createScopeObject(identityScope: string): SessionScope {
    const scopeArray = identityScope.split(" ");
    return serviceScopes.reduce<SessionScope>((acc, scope) => {
      acc[scope] = scopeArray.includes(scope);
      return acc;
    }, {} as SessionScope);
  }

  private verifyIdentityScope(
    identityScope: Record<string, boolean>,
    requiredScopes: string[],
  ): boolean {
    return requiredScopes.every((scope) => identityScope[scope] === true);
  }

  /**
   * Creates session cookies for the authenticated user.
   *
   * @param reply The Fastify reply object.
   * @param claims The user's claims to include in the JWT.
   * @param options The session configuration options.
   * @throws InterfaceException if an error occurs while setting the cookies.
   *
   */

  async create(
    reply: FastifyReply,
    input: SessionInput,
  ): Promise<SessionOutput> {
    try {
      const { session } = this.settings;

      /**
       * Signs the user's claims and returns a JWT.
       *
       * @param claims The user's claims to include in the JWT.
       * @returns The signed JWT.
       *
       */

      const signToken = async (input: SessionInput): Promise<string> => {
        const jti = uuidv4();
        const iat = Math.floor(Date.now() / 1000);
        return new SignJWT({
          sub: input.idAccount,
          jti,
          iat,
          iss: this.settings.app.name,
          scope: this.createScopeObject(input.scope),
        })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime(`${session.auth.options.maxAge}s`)
          .sign(new TextEncoder().encode(session.tokenSecret));
      };

      const token = await signToken(input);

      console.log('## session.auth.options', session.auth.options)

      reply
        .setCookie(session.auth.name, token, session.auth.options)
        .setCookie(session.user.name, input.idAccount, session.user.options);

      return {
        status: {
          description: "SESSION_CREATED",
          code: 201,
          context: "INTERFACE",
        },
      };
    } catch (err) {
      throw new InterfaceException(
        "SET_AUTHENTICATION_ERROR",
        400,
        "session handler internal error.",
        "SessionHandler.create()",
        err,
      );
    }
  }

  /**
   * Removes the session cookies.
   *
   * @param reply The Fastify reply object.
   * @param options The session configuration options.
   *
   */

  remove(reply: FastifyReply): SessionOutput {
    const { session } = this.settings;
    reply.clearCookie(session.auth.name);
    reply.clearCookie(session.user.name);
    return {
      status: {
        description: "SESSION_REMOVED",
        code: 200,
        context: "INTERFACE",
      },
    };
  }

  /**
   * Verifies the session cookies and returns if the user is authenticated.
   *
   * @param request The Fastify request object.
   * @returns A promise that resolves to the authenticated user's identity.
   *
   */

  async verify(request: FastifyRequest): Promise<SessionIdentity | null> {
    const { session } = this.settings;
    const authCookie = await this.unsignCookie(
      request,
      session.auth.name,
      session.auth.options,
    );
    const userCookie = await this.unsignCookie(
      request,
      session.user.name,
      session.user.options,
    );

    if (!authCookie || !userCookie) return null;

    const identity = await this.verifyToken(authCookie, session.tokenSecret);

    return identity;
  }

  /**
   * Authorize the session verifying the cookies and returns the authenticated user's identity.
   *
   * @param request The Fastify request object.
   * @param requiredScopes (optional) An array with the scopes that requires authorization.
   * @returns A promise that resolves to the authenticated user's identity.
   * @throws InterfaceException if authentication fails or an error occurs.
   *
   */

  async authorize(
    request: FastifyRequest,
    requiredScopes?: string[],
  ): Promise<SessionIdentity> {
    try {
      const { session } = this.settings;
      const authCookie = await this.unsignCookie(
        request,
        session.auth.name,
        session.auth.options,
      );

      const userCookie = await this.unsignCookie(
        request,
        session.user.name,
        session.user.options,
      );

      if (!authCookie || !userCookie) {
        throw new Error("missing cookies");
      }
      const identity = await this.verifyToken(authCookie, session.tokenSecret);

      if (!identity) {
        throw new Error("invalid token");
      }

      if (
        requiredScopes &&
        !this.verifyIdentityScope(identity.scope, requiredScopes)
      ) {
        throw new Error("invalid scope");
      }

      return identity;
    } catch (err) {
      if (err instanceof Error) {
        throw new InterfaceException(
          "NOT_AUTHENTICATED",
          401,
          "authorization error.",
          err.message,
        );
      } else {
        throw new ServerException(
          "INTERNAL_SERVER_ERROR",
          500,
          "session handler internal error.",
          "SessionHandler.authorize()",
          err,
        );
      }
    }
  }
}
