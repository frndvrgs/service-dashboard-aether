// import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
// import { DataSource } from "typeorm";
// import { ServerException } from "../../../common/exceptions/server.exception";
// import { logger } from "../../../common/helpers/logger";
// import { databaseTools } from "../../../common/helpers/database-tools";
// import { SettingsService } from "../settings/settings.service";

// @Injectable()
// export class DatabaseService implements OnModuleInit, OnModuleDestroy {
//   private dataSources: Map<string, DataSource> = new Map();
//   private initializedModules: Set<string> = new Set();
//   private initializationPromise: Promise<void> | null = null;

//   constructor(private settingsService: SettingsService) {}

// /**
//  *
//  * ensures that the database initialization process occurs only once, even if called multiple times concurrently.
//  * this 'semaphore' approach prevents multiple simultaneous initializations and ensures thread-safety.
//  *
//  */
//   private async initialize() {
//     if (this.initializationPromise) {
//       await this.initializationPromise;
//       return;
//     }

//     this.initializationPromise = this.initializeDataSources();
//     await this.initializationPromise;
//     this.initializationPromise = null;
//   }

//   private async initializeDataSources() {
//     const { modules } = this.settingsService.database;
//     const { createConnectionMessage } = databaseTools;

//     for (const [moduleName, options] of Object.entries(modules)) {
//       if (this.initializedModules.has(moduleName)) continue;

//       try {
//         const dataSource = new DataSource(options);
//         logger.info(createConnectionMessage(options, "testing"));
//         await dataSource.initialize();
//         this.dataSources.set(moduleName, dataSource);
//         this.initializedModules.add(moduleName);
//         logger.info(createConnectionMessage(options, "success"));
//       } catch (err) {
//         logger.error(createConnectionMessage(options, "failure"));
//         throw new ServerException(
//           "DATABASE_CLIENT_ERROR",
//           500,
//           `failed to initialize datasource for module ${moduleName}`,
//           "DatabaseService.initializeDataSources()",
//           err,
//         );
//       }
//     }
//   }

//   public async getDataSource(module: string): Promise<DataSource> {
//     await this.initialize();

//     const dataSource = this.dataSources.get(module);
//     if (!dataSource) {
//       throw new ServerException(
//         "DATABASE_CLIENT_ERROR",
//         500,
//         `datasource for module ${module} not found.`,
//         "DatabaseService.getDataSource()",
//       );
//     }
//     return dataSource;
//   }

//   public async onModuleInit() {
//     try {
//       await this.initialize();
//       logger.info(":: database connection pools checked.");
//     } catch (err) {
//       logger.error("failed to initialize database connections", err);
//       throw err;
//     }
//   }

//   public async onModuleDestroy() {
//     const destroyPromises = Array.from(this.dataSources.values()).map(
//       (dataSource) => dataSource.destroy(),
//     );
//     await Promise.all(destroyPromises);
//     logger.info(":: database connection pools cleaned.");
//   }
// }

import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { DataSource, DataSourceOptions } from "typeorm";
import { ServerException } from "../../../common/exceptions/server.exception";
import { logger } from "../../../common/helpers/logger";
import { databaseTools } from "../../../common/helpers/database-tools";
import { SettingsService } from "../settings/settings.service";
import { performance } from "node:perf_hooks";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private dataSources: Map<string, DataSource> = new Map();
  private initializedModules: Set<string> = new Set();
  private initializationPromise: Promise<void> | null = null;

  constructor(private settingsService: SettingsService) {}

  /**
   *
   * ensures that the database initialization process occurs only once, even if called multiple times concurrently.
   * this 'semaphore' approach prevents multiple simultaneous initializations and ensures thread-safety.
   *
   */
  private async initialize() {
    if (this.initializationPromise) {
      await this.initializationPromise;
      return;
    }

    this.initializationPromise = this.initializeDataSources();
    await this.initializationPromise;
    this.initializationPromise = null;
  }

  private async initializeDataSources() {
    const { modules } = this.settingsService.database;
    const initPromises: Promise<void>[] = [];

    for (const [moduleName, options] of Object.entries(modules)) {
      if (this.initializedModules.has(moduleName)) continue;
      initPromises.push(this.initializeDataSource(moduleName, options));
    }

    await Promise.all(initPromises);
  }

  private async initializeDataSource(
    moduleName: string,
    options: DataSourceOptions,
    retryCount: number = 3,
  ): Promise<void> {
    const startTime = performance.now();
    const { createConnectionMessage } = databaseTools;

    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        if (attempt > 1) {
          logger.info(
            createConnectionMessage(options, `retrying (attempt ${attempt})`),
          );
        }
        const dataSource = new DataSource(options);
        await dataSource.initialize();
        this.dataSources.set(moduleName, dataSource);
        this.initializedModules.add(moduleName);

        const endTime = performance.now();
        const duration = endTime - startTime;
        logger.info(
          createConnectionMessage(
            options,
            `success (${duration.toFixed(2)}ms)`,
          ),
        );
        return;
      } catch (err) {
        if (attempt === retryCount) {
          logger.error(
            createConnectionMessage(
              options,
              `failed after ${retryCount} attempts`,
            ),
            err,
          );
          throw new ServerException(
            "DATABASE_CLIENT_ERROR",
            500,
            `failed to initialize datasource for module ${moduleName}`,
            "DatabaseService.initializeDataSource()",
            err,
          );
        }
        logger.warn(
          createConnectionMessage(options, `Attempt ${attempt} failed`),
        );
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // exponential backoff
      }
    }
  }

  public async getDataSource(module: string): Promise<DataSource> {
    await this.initialize();

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
    logger.info(":: database connection pools initialized.");
  }

  public async onModuleDestroy() {
    const destroyPromises = Array.from(this.dataSources.values()).map(
      (dataSource) => dataSource.destroy(),
    );
    await Promise.all(destroyPromises);
    logger.info(":: database connection pools cleaned.");
  }
}
