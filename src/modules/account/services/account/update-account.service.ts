import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { AccountRepository } from "../../repositories/account.repository";

import type { AccountTypes } from "../../account.types";

@Injectable()
export class UpdateAccountService {
  constructor(private repository: AccountRepository) {}

  async execute(
    service: AccountTypes.Payload.Service.UpdateAccount.Input,
  ): Promise<AccountTypes.Payload.Service.UpdateAccount.Output> {
    const { account, input } = service;

    const resource = await this.repository.read({
      where: { idAccount: account },
    });
    if (!resource) {
      throw new AppException("NOT_FOUND", 404, "resource not found.", account);
    }

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

    Object.assign(resource, input);

    const updatedResource = await this.repository.save(resource);

    return {
      status: {
        description: "ACCOUNT_UPDATED",
        code: 200,
        context: "APPLICATION",
      },
      output: updatedResource,
    };
  }
}
