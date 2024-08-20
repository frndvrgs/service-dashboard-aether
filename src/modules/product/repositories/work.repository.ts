import { Injectable, OnModuleInit } from "@nestjs/common";
import { DataSource } from "typeorm";
import { DatabaseService } from "../../../core/services/database/database.service";
import { BaseRepository } from "../../../common/abstracts/repository.base";
import { WorkEntity } from "../domain/work.entity";

@Injectable()
export class WorkRepository
  extends BaseRepository<WorkEntity>
  implements OnModuleInit
{
  private dataSource!: DataSource;

  constructor(private databaseService: DatabaseService) {
    super(WorkEntity);
  }

  async onModuleInit() {
    this.dataSource = await this.databaseService.getDataSource("product");
    this.initialize(this.dataSource);
  }
}
