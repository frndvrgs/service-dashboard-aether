import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { AccountEntity } from "../../domain/account.entity";
import { AccountRepository } from "../../repositories/account.repository";

import type { AccountTypes } from "../../account.types";

@Injectable()
export class CreateAccountService {
  constructor(private repository: AccountRepository) {}

  async execute(
    service: AccountTypes.Payload.Service.CreateAccount.Input,
  ): Promise<AccountTypes.Payload.Service.CreateAccount.Output> {
    const { input } = service;

    // check if email input already exists
    if (input.email != null) {
      const existsEmail = await this.repository.exists({
        where: { email: input.email },
      });
      if (existsEmail) {
        throw new AppException(
          "NOT_UNIQUE_VALUE",
          409,
          "email already exists.",
          input.email,
        );
      }
    }

    const newAccount = new AccountEntity();

    newAccount.email = input.email;
    newAccount.password = input.password;

    const resource = await this.repository.save(newAccount);
    return {
      status: {
        description: "ACCOUNT_CREATED",
        code: 201,
        context: "APPLICATION",
      },
      output: resource,
    };
  }
}
