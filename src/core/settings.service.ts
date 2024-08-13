import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import type { Core } from "@types";

@Injectable()
export class SettingsService {
  private settings: Core.Settings.SettingsService;

  constructor(private configService: ConfigService) {
    this.settings = this.loadSettings();
  }

  private loadSettings(): Core.Settings.SettingsService {
    return {
      app: this.loadAppSettings(),
      webServer: this.loadWebServerSettings(),
      database: this.loadDatabaseSettings(),
    };
  }

  private loadAppSettings(): Core.Settings.App {
    return {
      name: `${this.configService.get<string>("SERVICE_NAME")} ${this.configService.get<string>("SERVICE_VERSION")} ${this.configService.get<string>("ENVIRONMENT") || "DEVELOPMENT"}`,
    };
  }

  private loadWebServerSettings(): Core.Settings.WebServer {
    return {
      host: this.configService.get<string>("WEB_HOST") || "localhost",
      port: this.configService.get<number>("WEB_PORT") || 20110,
      fastify: {
        // https: this.configService.get<boolean>("WEB_HTTPS") || false,
        // http2: this.configService.get<boolean>("WEB_HTTP2") || false,
        trustProxy: this.configService.get<boolean>("WEB_TRUST_PROXY") || false,
        connectionTimeout: this.configService.get<number>("WEB_TIMEOUT") || 0,
        logger: this.configService.get<boolean>("WEB_LOGGER") || false,
      },
      api: {
        path: "/api",
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

  private loadDatabaseSettings(): Core.Settings.Database {
    return {
      url: this.configService.get<string>("DATABASE_URL") || "",
    };
  }

  get app(): Core.Settings.App {
    return this.settings.app;
  }

  get webServer(): Core.Settings.WebServer {
    return this.settings.webServer;
  }

  get database(): Core.Settings.Database {
    return this.settings.database;
  }
}
