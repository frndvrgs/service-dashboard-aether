import { Injectable } from "@nestjs/common";
import { AccountRepository } from "../account.repository";
import { Prisma, Account } from "@prisma/client";

@Injectable()
export class UpdateAccountService {
  constructor(private accountRepository: AccountRepository) {}

  async update(
    idAccount: string,
    data: Prisma.AccountUpdateInput,
  ): Promise<Account> {
    return this.accountRepository.update(idAccount, data);
  }
}
