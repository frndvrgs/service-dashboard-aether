import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { join } from "path";

import type { CoreTypes } from "@types";

@Injectable()
export class SettingsService {
  private settings: CoreTypes.Settings.SettingsService;

  constructor(private configService: ConfigService) {
    this.settings = this.loadSettings();
  }

  private loadSettings(): CoreTypes.Settings.SettingsService {
    return {
      app: this.loadAppSettings(),
      webServer: this.loadWebServerSettings(),
      database: this.loadDatabaseSettings(),
      session: this.loadSessionSettings(),
    };
  }

  private loadAppSettings(): CoreTypes.Settings.App {
    const environment = this.configService.get<string>(
      "ENVIRONMENT",
      "DEVELOPMENT",
    );
    return {
      name: `${this.configService.get<string>("SERVICE_NAME")} ${this.configService.get<string>("SERVICE_VERSION")} ${environment}`,
      environment,
    };
  }

  private loadWebServerSettings(): CoreTypes.Settings.WebServer {
    return {
      host: this.configService.get<string>("WEB_HOST", "localhost"),
      port: this.configService.get<number>("WEB_PORT", 20110),
      fastify: {
        // https: this.configService.get<boolean>("WEB_HTTPS", false),
        // http2: this.configService.get<boolean>("WEB_HTTP2", false),
        trustProxy: this.configService.get<boolean>("WEB_TRUST_PROXY", false),
        connectionTimeout: this.configService.get<number>("WEB_TIMEOUT", 0),
        logger: this.configService.get<boolean>("WEB_LOGGER", false),
      },
      api: {
        path: "/api",
      },
      cookie: {
        secret:
          this.configService.get<string>("SESSION_COOKIE_SECRET") ?? undefined,
      },
      graphql: {
        service: {
          jit: 1,
          path: "/graphql",
        },
        user: {
          jit: 1,
          path: "/graphql",
        },
        public: {
          jit: 1,
          path: "/graphql",
        },
      },
      rateLimit: {
        max: 100,
        timeWindow: "1 minute",
      },
      useRequestScope: true,
    };
  }

  private loadDatabaseSettings(): CoreTypes.Settings.Database {
    return {
      url: this.configService.get<string>("DATABASE_URL", ""),
      modules: {
        account: {
          name: "account",
          type: "postgres",
          username: this.configService.get<string>(
            "DATABASE_ACCOUNT_USER",
            "aether_account",
          ),
          password: this.configService.get<string>(
            "DATABASE_ACCOUNT_PASSWORD",
            "123456",
          ),
          host: this.configService.get<string>(
            "DATABASE_ACCOUNT_HOST",
            "localhost",
          ),
          port: this.configService.get<number>("DATABASE_ACCOUNT_PORT", 5432),
          database: this.configService.get<string>(
            "DATABASE_ACCOUNT_NAME",
            "aether_service_dashboard",
          ),
          schema: this.configService.get<string>(
            "DATABASE_ACCOUNT_SCHEMA",
            "account_data_schema",
          ),
          entities: [
            join(
              process.cwd(),
              "dist",
              "modules",
              "account",
              "domain",
              "*.entity.js",
            ),
          ],
          synchronize: false,
        },
        content: {
          name: "content",
          type: "postgres",
          username: this.configService.get<string>(
            "DATABASE_CONTENT_USER",
            "aether_content",
          ),
          password: this.configService.get<string>(
            "DATABASE_CONTENT_PASSWORD",
            "123456",
          ),
          host: this.configService.get<string>(
            "DATABASE_CONTENT_HOST",
            "localhost",
          ),
          port: this.configService.get<number>("DATABASE_CONTENT_PORT", 5432),
          database: this.configService.get<string>(
            "DATABASE_CONTENT_NAME",
            "aether_service_dashboard",
          ),
          schema: this.configService.get<string>(
            "DATABASE_CONTENT_SCHEMA",
            "content_data_schema",
          ),
          entities: [
            join(
              process.cwd(),
              "dist",
              "modules",
              "content",
              "domain",
              "*.entity.js",
            ),
          ],
          synchronize: false,
        },
        product: {
          name: "product",
          type: "postgres",
          username: this.configService.get<string>(
            "DATABASE_PRODUCT_USER",
            "aether_product",
          ),
          password: this.configService.get<string>(
            "DATABASE_PRODUCT_PASSWORD",
            "123456",
          ),
          host: this.configService.get<string>(
            "DATABASE_PRODUCT_HOST",
            "localhost",
          ),
          port: this.configService.get<number>("DATABASE_PRODUCT_PORT", 5432),
          database: this.configService.get<string>(
            "DATABASE_PRODUCT_NAME",
            "aether_service_dashboard",
          ),
          schema: this.configService.get<string>(
            "DATABASE_PRODUCT_SCHEMA",
            "product_data_schema",
          ),
          entities: [
            join(
              process.cwd(),
              "dist",
              "modules",
              "product",
              "domain",
              "*.entity.js",
            ),
          ],
          synchronize: false,
        },
      },
    };
  }

  private loadSessionSettings(): CoreTypes.Settings.Session {
    return {
      tokenSecret: this.configService.get<string>("SESSION_TOKEN_SECRET", ""),
      auth: {
        name: this.configService.get<string>(
          "SESSION_COOKIE_AUTH_NAME",
          "auth",
        ),
        options: {
          path: "/",
          secure: true,
          sameSite: 'strict', // working on it, something is breaking when reading from .env
          domain: '',
          signed: true,
          httpOnly: true,
          maxAge: 86400,
        },
      },
      user: {
        name: this.configService.get<string>(
          "SESSION_COOKIE_USER_NAME",
          "user",
        ),
        options: {
          path: "/",
          secure: true,
          sameSite: 'strict', // working on it, something is breaking when reading from .env
          domain: '',
          signed: true,
          httpOnly: false,
          maxAge: 86400,
        },
      },
    };
  }

  get app(): CoreTypes.Settings.App {
    return this.settings.app;
  }

  get webServer(): CoreTypes.Settings.WebServer {
    return this.settings.webServer;
  }

  get database(): CoreTypes.Settings.Database {
    return this.settings.database;
  }

  get session(): CoreTypes.Settings.Session {
    return this.settings.session;
  }
}
