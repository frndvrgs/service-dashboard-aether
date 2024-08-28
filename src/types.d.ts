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
import type { DataSourceOptions, FindOptionsWhere } from "typeorm";
import type { FastifyCorsOptions } from "@fastify/cors";
import type { DescriptionCodes, StatusCodes } from "./common/constants";

// utility type
type valueof<T> = T[keyof T];

declare global {
  namespace CommonTypes {
    interface BaseEntity {
      id: number;
    }

    namespace Payload {
      interface QueryOptions<T> {
        where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
        order?: {
          [P in keyof T]?:
            | "ASC"
            | "DESC"
            | {
                direction: "ASC" | "DESC";
                nulls?: "NULLS FIRST" | "NULLS LAST";
              };
        };
        relations?: string[];
        select?: (keyof T)[];
        skip?: number;
        take?: number;
        withDeleted?: boolean;
        cache?: boolean | number;
      }

      interface ExceptionInput {
        description: keyof typeof DescriptionCodes;
        code: StatusCodes;
        message?: string;
        detail?: string;
        error?: Error | unknown;
        errors?: AggregateError | unknown;
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

  namespace CoreTypes {
    namespace Settings {
      interface SettingsService {
        app: App;
        webServer: WebServer;
        database: Database;
        session: Session;
      }

      interface App {
        name: string;
        environment: string;
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
        cookie: FastifyCookieOptions;
        cors: FastifyCorsOptions;
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

      type DatabaseModuleNames = "account" | "content" | "product";

      type Database = {
        url: string;
        modules: {
          [K in DatabaseModuleNames]: DataSourceOptions & { name: K };
        };
      };

      interface SessionCookieOptions {
        path: string;
        secure: boolean;
        sameSite: boolean | "lax" | "strict" | "none" | undefined;
        maxAge: number;
        domain?: string | undefined;
        signed: boolean;
        httpOnly: boolean;
      }

      interface SessionCookie {
        name: string;
        options: SessionCookieOptions;
      }

      interface Session {
        tokenSecret: string;
        auth: SessionCookie;
        user: SessionCookie;
      }
    }
  }
}
