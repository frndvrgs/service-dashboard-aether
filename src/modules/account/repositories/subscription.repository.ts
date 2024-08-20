import { Injectable, OnModuleInit } from "@nestjs/common";
import { DataSource } from "typeorm";
import { DatabaseService } from "../../../core/services/database/database.service";
import { BaseRepository } from "../../../common/abstracts/repository.base";
import { SubscriptionEntity } from "../domain/subscription.entity";

@Injectable()
export class SubscriptionRepository
  extends BaseRepository<SubscriptionEntity>
  implements OnModuleInit
{
  private dataSource!: DataSource;

  constructor(private databaseService: DatabaseService) {
    super(SubscriptionEntity);
  }

  async onModuleInit() {
    this.dataSource = await this.databaseService.getDataSource("account");
    this.initialize(this.dataSource);
  }
}
