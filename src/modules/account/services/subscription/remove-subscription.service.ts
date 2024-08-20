import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { SubscriptionRepository } from "../../repositories/subscription.repository";

import type { AccountTypes } from "../../account.types";

@Injectable()
export class RemoveSubscriptionService {
  constructor(private repository: SubscriptionRepository) {}

  async execute(
    service: AccountTypes.Payload.Service.RemoveSubscription.Input,
  ): Promise<AccountTypes.Payload.Service.RemoveSubscription.Output> {
    const { subscription } = service;

    const result = await this.repository.remove(subscription);
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
        description: "SUBSCRIPTION_REMOVED",
        code: 204,
        context: "APPLICATION",
      },
    };
  }
}
