import { Injectable, OnModuleInit } from "@nestjs/common";
import { DataSource } from "typeorm";
import { DatabaseService } from "../../../core/services/database/database.service";
import { BaseRepository } from "../../../common/abstracts/repository.base";
import { SourceEntity } from "../domain/source.entity";

@Injectable()
export class SourceRepository
  extends BaseRepository<SourceEntity>
  implements OnModuleInit
{
  private dataSource!: DataSource;

  constructor(private databaseService: DatabaseService) {
    super(SourceEntity);
  }

  async onModuleInit() {
    this.dataSource = await this.databaseService.getDataSource("product");
    this.initialize(this.dataSource);
  }
}
