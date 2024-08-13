import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { SettingsService } from "../../settings.service";

import type { PrismaClientOptions } from "@prisma/client/runtime/library";
import type { Prisma } from "@prisma/client";

@Injectable()
export class DatabaseService
  extends PrismaClient<
    Prisma.PrismaClientOptions,
    "query" | "info" | "warn" | "error"
  >
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(DatabaseService.name);

  constructor(settingsService: SettingsService) {
    const config: Prisma.Subset<
      Prisma.PrismaClientOptions,
      PrismaClientOptions
    > = {
      log: [
        { emit: "event", level: "query" },
        { emit: "event", level: "info" },
        { emit: "event", level: "warn" },
        { emit: "event", level: "error" },
      ],
      datasources: {
        db: {
          url: settingsService.database.url,
        },
      },
    };

    super(config);
  }

  async onModuleInit() {
    await this.$connect();
    this.setupEventListeners();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private setupEventListeners() {
    this.$on("query", (event: Prisma.QueryEvent) => {
      this.logger.debug(`Query: ${event.query}`);
      this.logger.debug(`Params: ${event.params}`);
      this.logger.debug(`Duration: ${event.duration}ms`);
    });

    this.$on("info", (event: Prisma.LogEvent) => {
      this.logger.log(`Prisma info: ${event.message}`);
    });

    this.$on("warn", (event: Prisma.LogEvent) => {
      this.logger.warn(`Prisma warning: ${event.message}`);
    });

    this.$on("error", (event: Prisma.LogEvent) => {
      this.logger.error(`Prisma error: ${event.message}`);
    });
  }
}
