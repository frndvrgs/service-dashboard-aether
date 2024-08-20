import { Injectable, OnModuleInit } from "@nestjs/common";
import { DataSource } from "typeorm";
import { DatabaseService } from "../../../core/services/database/database.service";
import { BaseRepository } from "../../../common/abstracts/repository.base";
import { AccountEntity } from "../domain/account.entity";

@Injectable()
export class AccountRepository
  extends BaseRepository<AccountEntity>
  implements OnModuleInit
{
  private dataSource!: DataSource;

  constructor(private databaseService: DatabaseService) {
    super(AccountEntity);
  }

  async onModuleInit() {
    this.dataSource = await this.databaseService.getDataSource("account");
    this.initialize(this.dataSource);
  }
}
