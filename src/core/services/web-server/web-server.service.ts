import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import compress from "@fastify/compress";
import rateLimit from "@fastify/rate-limit";

import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { ServerException } from "../../../common/exceptions/server.exception";
import { AppModule } from "../../../app.module";
import { logger } from "../../../common/helpers/logger";
import { loadSettings } from "../settings/settings.loader";

import type { SettingsService } from "../settings/settings.service";

class WebServer {
  private settings: SettingsService;
  private server!: NestFastifyApplication;

  constructor() {
    this.settings = loadSettings();
  }

  public async start() {
    try {
      this.server = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
          logger: this.settings.webServer.fastify.logger,
        }),
      );

      await this.server.register(helmet);
      await this.server.register(cors, this.settings.webServer.cors);
      await this.server.register(compress);
      await this.server.register(cookie, this.settings.webServer.cookie);
      await this.server.register(rateLimit, this.settings.webServer.rateLimit);

      this.server.useGlobalPipes(new ValidationPipe());

      await this.server.listen(
        this.settings.webServer.port,
        this.settings.webServer.host,
      );

      logger.info(":: web server started.");
    } catch (err) {
      console.error;
      throw new ServerException(
        "WEB_SERVER_ERROR",
        500,
        "web server internal error.",
        "WebServer server.listen()",
        err,
      );
    }
  }

  public async stop() {
    try {
      await this.server.close();
      logger.info(":: web server stopped.");
    } catch (err) {
      throw new ServerException(
        "WEB_SERVER_ERROR",
        500,
        "web server internal error.",
        "WebServer server.close()",
        err,
      );
    }
  }

  public getInstance() {
    return this.server;
  }
}

export const webServer = new WebServer();
