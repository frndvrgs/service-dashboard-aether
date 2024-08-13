import { Injectable } from "@nestjs/common";
import { AccountRepository } from "../account.repository";
import { Account } from "@prisma/client";

@Injectable()
export class ReadAccountService {
  constructor(private accountRepository: AccountRepository) {}

  async findByEmail(email: string): Promise<Account | null> {
    return this.accountRepository.findByEmail(email);
  }

  async findById(idAccount: string): Promise<Account | null> {
    return this.accountRepository.findById(idAccount);
  }
}
