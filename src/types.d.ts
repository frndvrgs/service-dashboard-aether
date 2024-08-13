import type {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyRequest,
  FastifyReply,
  FastifyHttpOptions,
} from "fastify";
import type { RateLimitPluginOptions } from "@fastify/rate-limit";
import type { FastifyCookieOptions } from "@fastify/cookie";
import type { WebsocketPluginOptions } from "@fastify/websocket";

// utility type
type valueof<T> = T[keyof T];

declare namespace CommonModule {
  namespace DTO {
    interface StatusModel {
      description: Payload.DescriptionCodes;
      code: Payload.StatusCodes;
      message?: string;
      detail?: string;
      context: string;
      scope?: string;
      validation?: Payload.Exception.ValidationObject;
    }

    interface HttpStatusModel {
      type: string;
      name: string;
      description: string;
      code: number;
      context?: string | null;
      scope?: string | null;
      message?: string | null;
      detail?: string | null;
      validation?: Payload.Exception.ValidationObject;
    }
  }

  namespace Payload {
    type DescriptionCodes = keyof typeof DESCRIPTION_CODES;
    type StatusCodes = valueof<typeof STATUS_CODES>;

    namespace Exception {
      type ValidationObject = ErrorObject[] | null | undefined;

      interface Input {
        description: Payload.DescriptionCodes;
        code: Payload.StatusCodes;
        message?: string;
        detail?: string;
        error?: Error | unknown;
        errors?: AggregateError | unknown;
      }
    }
  }

  namespace Handler {
    namespace Status {
      interface CodeList {
        [key: string]: {
          type: string;
          name: {
            [key in valueof<typeof StatusCodes>]?: string;
          };
        };
      }
    }
  }
}

declare namespace Core {
  namespace Settings {
    interface SettingsService {
      app: App;
      webServer: WebServer;
      database: Database;
    }

    interface App {
      name: string;
    }
    interface WebServer {
      host: string;
      port: number;
      fastify: {
        // https: boolean;
        // http2: boolean;
        trustProxy: string | boolean | undefined;
        connectionTimeout: number;
        logger: boolean;
      };
      // cookie: FastifyCookieOptions;
      api: {
        path: string;
      };
      graphql: {
        service: MercuriusOptions;
        user: MercuriusOptions;
        public: MercuriusOptions;
      };
      rateLimit: FastifyRateLimitOptions;
      useRequestScope: boolean;
    }

    // interface SessionCookie {
    //   name: string;
    //   options: SessionCookieOptions;
    // }

    // interface SessionCookieOptions {
    //   path: string;
    //   secure: boolean;
    //   sameSite: boolean | "lax" | "strict" | "none" | undefined;
    //   maxAge: number;
    //   domain: string | undefined;
    //   signed: boolean;
    //   httpOnly: boolean;
    // }

    // interface Session {
    //   tokenSecret: string;
    //   auth: SessionCookie;
    //   user: SessionCookie;
    // }

    // interface DatabaseModuleOptions {
    //   port: number;
    //   host: string;
    //   user: string;
    //   password: string;
    //   database: string;
    //   max: number;
    //   connectionTimeoutMillis: number;
    //   idleTimeoutMillis: number;
    // }

    // type DatabaseModuleNames = "account" | "product" | "content";
    // type DatabaseTableNames =
    //   | "account"
    //   | "subscription"
    //   | "profile"
    //   | "feature"
    //   | "work";

    // type TableNamesForModule<T extends DatabaseModuleNames> =
    //   T extends "account"
    //     ? "account" | "subscription"
    //     : T extends "product"
    //       ? "work"
    //       : T extends "content"
    //         ? "profile" | "feature"
    //         : never;

    type Database = {
      url: string;
    };
  }
}
