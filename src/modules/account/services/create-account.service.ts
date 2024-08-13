import { Injectable } from "@nestjs/common";
import { AccountRepository } from "../account.repository";
import { Prisma, Account } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { AppException } from "../../../common/exceptions/app.exception";

@Injectable()
export class CreateAccountService {
  constructor(private accountRepository: AccountRepository) {}

  async create(data: Partial<Prisma.AccountCreateInput>): Promise<Account> {
    if (!data.email || !data.password) {
      throw new AppException(
        "INVALID_INPUT",
        400,
        "missing input.",
        "email / password.",
      );
    }

    return this.accountRepository.create({
      idAccount: uuid(),
      createdAt: new Date(),
      updatedAt: new Date(),
      email: data.email,
      password: data.password,
      document: data.document,
    });
  }
}
