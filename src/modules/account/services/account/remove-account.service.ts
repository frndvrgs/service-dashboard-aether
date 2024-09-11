import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { AccountRepository } from "../../repositories/account.repository";

import type { AccountTypes } from "../../account.types";

@Injectable()
export class RemoveAccountService {
  constructor(private repository: AccountRepository) {}

  async execute(
    service: AccountTypes.Payload.Service.RemoveAccount.Input,
  ): Promise<AccountTypes.Payload.Service.RemoveAccount.Output> {
    const { account } = service;

    const result = await this.repository.remove("id_account", account);
    if (result.affected === 0) {
      throw new AppException(
        "INTERNAL_SERVER_ERROR",
        500,
        "database error.",
        "repository.remove() returning null.",
      );
    }

    return {
      status: {
        description: "ACCOUNT_REMOVED",
        code: 204,
        context: "APPLICATION",
      },
    };
  }
}
