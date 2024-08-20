import { Injectable, OnModuleInit } from "@nestjs/common";
import { DataSource } from "typeorm";
import { DatabaseService } from "../../../core/services/database/database.service";
import { BaseRepository } from "../../../common/abstracts/repository.base";
import { FeatureEntity } from "../domain/feature.entity";

@Injectable()
export class FeatureRepository
  extends BaseRepository<FeatureEntity>
  implements OnModuleInit
{
  private dataSource!: DataSource;

  constructor(private databaseService: DatabaseService) {
    super(FeatureEntity);
  }

  async onModuleInit() {
    this.dataSource = await this.databaseService.getDataSource("content");
    this.initialize(this.dataSource);
  }
}
