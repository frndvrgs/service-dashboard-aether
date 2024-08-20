import { Injectable, OnModuleInit } from "@nestjs/common";
import { DataSource } from "typeorm";
import { DatabaseService } from "../../../core/services/database/database.service";
import { BaseRepository } from "../../../common/abstracts/repository.base";
import { ProfileEntity } from "../domain/profile.entity";

@Injectable()
export class ProfileRepository
  extends BaseRepository<ProfileEntity>
  implements OnModuleInit
{
  private dataSource!: DataSource;

  constructor(private databaseService: DatabaseService) {
    super(ProfileEntity);
  }

  async onModuleInit() {
    this.dataSource = await this.databaseService.getDataSource("content");
    this.initialize(this.dataSource);
  }
}
