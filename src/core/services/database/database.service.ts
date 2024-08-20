import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { DataSource } from "typeorm";
import { ServerException } from "../../../common/exceptions/server.exception";
import { logger } from "../../../common/helpers/logger";
import { databaseTools } from "../../../common/helpers/database-tools";
import { SettingsService } from "../settings/settings.service";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private dataSources: Map<string, DataSource> = new Map();

  constructor(private settingsService: SettingsService) {}

  private async initializeDataSources() {
    const { modules } = this.settingsService.database;
    const { createConnectionMessage } = databaseTools;
    for (const [moduleName, options] of Object.entries(modules)) {
      try {
        const dataSource = new DataSource(options);
        logger.info(createConnectionMessage(options, "testing"));
        await dataSource.initialize();
        this.dataSources.set(moduleName, dataSource);
        logger.info(createConnectionMessage(options, "success"));
      } catch (err) {
        logger.error(createConnectionMessage(options, "failure"));
        throw err;
      }
    }
  }

  public async getDataSource(module: string): Promise<DataSource> {
    const dataSource = this.dataSources.get(module);
    if (!dataSource) {
      throw new ServerException(
        "DATABASE_CLIENT_ERROR",
        500,
        `datasource for module ${module} not found.`,
        "DatabaseService.getDataSource()",
      );
    }
    return dataSource;
  }

  public async onModuleInit() {
    try {
      await this.initializeDataSources();
      logger.info(":: database connection pools checked.");
    } catch (err) {
      throw new ServerException(
        "DATABASE_CLIENT_ERROR",
        500,
        "database service internal error.",
        "DatabaseClient.verify()",
        err,
      );
    }
  }

  public async onModuleDestroy() {
    for (const dataSource of this.dataSources.values()) {
      await dataSource.destroy();
    }
    logger.info(":: database connection pools cleaned.");
  }
}
