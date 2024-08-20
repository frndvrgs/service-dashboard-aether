import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { AccountRepository } from "../../repositories/account.repository";

import type { AccountTypes } from "../../account.types";

@Injectable()
export class ReadAccountService {
  constructor(private repository: AccountRepository) {}

  async execute(
    service: AccountTypes.Payload.Service.ReadAccount.Input,
  ): Promise<AccountTypes.Payload.Service.ReadAccount.Output> {
    const { options } = service;
    if (!options) {
      throw new AppException(
        "MISSING_PAYLOAD",
        400,
        "missing payload.",
        "service.payload.select is null or undefined.",
      );
    }

    const resource = await this.repository.read(options);
    if (resource == null) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "resource not found.",
        "service.payload.select invalid field or value.",
      );
    }

    return {
      status: {
        description: "RESOURCE_READ",
        code: 200,
        context: "APPLICATION",
      },
      output: resource,
    };
  }
}
