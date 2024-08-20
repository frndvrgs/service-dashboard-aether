import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { SubscriptionRepository } from "../../repositories/subscription.repository";

import type { AccountTypes } from "../../account.types";

@Injectable()
export class ReadSubscriptionService {
  constructor(private repository: SubscriptionRepository) {}

  async execute(
    service: AccountTypes.Payload.Service.ReadSubscription.Input,
  ): Promise<AccountTypes.Payload.Service.ReadSubscription.Output> {
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
