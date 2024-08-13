import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../core/services/database/database.service";
import { Prisma, Account } from "@prisma/client";

@Injectable()
export class AccountRepository {
  constructor(private databaseService: DatabaseService) {}

  async create(data: Prisma.AccountCreateInput): Promise<Account> {
    return this.databaseService.account.create({ data });
  }

  async findByEmail(email: string): Promise<Account | null> {
    return this.databaseService.account.findUnique({
      where: { email },
    });
  }

  async findById(idAccount: string): Promise<Account | null> {
    return this.databaseService.account.findUnique({
      where: { idAccount },
    });
  }

  async update(
    idAccount: string,
    data: Prisma.AccountUpdateInput,
  ): Promise<Account> {
    return this.databaseService.account.update({
      where: { idAccount },
      data,
    });
  }
}
