"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let SettingsService = class SettingsService {
    configService;
    settings;
    constructor(configService) {
        this.configService = configService;
        this.settings = this.loadSettings();
    }
    loadSettings() {
        return {
            app: this.loadAppSettings(),
            webServer: this.loadWebServerSettings(),
            database: this.loadDatabaseSettings()
        };
    }
    loadAppSettings() {
        return {
            name: `${this.configService.get("SERVICE_NAME")} ${this.configService.get("SERVICE_VERSION")} ${this.configService.get("ENVIRONMENT") || "DEVELOPMENT"}`,
        };
    }
    loadWebServerSettings() {
        return {
            host: this.configService.get("WEB_HOST") || "localhost",
            port: this.configService.get("WEB_PORT") || 20110,
            fastify: {
                trustProxy: this.configService.get("WEB_TRUST_PROXY") || false,
                connectionTimeout: this.configService.get("WEB_TIMEOUT") || 0,
                logger: this.configService.get("WEB_LOGGER") || false,
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
    loadDatabaseSettings() {
        return {
            url: this.configService.get("DATABASE_URL") || ''
        };
    }
    get app() {
        return this.settings.app;
    }
    get webServer() {
        return this.settings.webServer;
    }
    get database() {
        return this.settings.database;
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SettingsService);
