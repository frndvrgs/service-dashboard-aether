"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webServer = void 0;
const helmet_1 = __importDefault(require("@fastify/helmet"));
const cors_1 = __importDefault(require("@fastify/cors"));
const compress_1 = __importDefault(require("@fastify/compress"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const server_exception_1 = require("../../../common/exceptions/server.exception");
const app_module_1 = require("../../../app.module");
const logger_1 = require("../../../common/helpers/logger");
const settings_loader_1 = require("../../settings.loader");
class WebServer {
    settings;
    server;
    constructor() {
        this.settings = (0, settings_loader_1.loadSettings)();
    }
    async start() {
        try {
            this.server = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter({
                logger: this.settings.webServer.fastify.logger
            }));
            await this.server.register(helmet_1.default);
            await this.server.register(cors_1.default);
            await this.server.register(compress_1.default);
            await this.server.register(rate_limit_1.default, this.settings.webServer.rateLimit);
            await this.server.listen(this.settings.webServer.port, this.settings.webServer.host);
            logger_1.logger.info(":: web server started.");
        }
        catch (err) {
            throw new server_exception_1.ServerException("WEB_SERVER_ERROR", 500, "web server internal error.", "WebServer server.listen()", err);
        }
    }
    async stop() {
        try {
            await this.server.close();
            logger_1.logger.info(":: web server stopped.");
        }
        catch (err) {
            throw new server_exception_1.ServerException("WEB_SERVER_ERROR", 500, "web server internal error.", "WebServer server.close()", err);
        }
    }
    getInstance() {
        return this.server;
    }
}
exports.webServer = new WebServer();
