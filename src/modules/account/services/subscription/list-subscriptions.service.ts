import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { SubscriptionRepository } from "../../repositories/subscription.repository";

import type { AccountTypes } from "../../account.types";

@Injectable()
export class ListSubscriptionsService {
  constructor(private repository: SubscriptionRepository) {}

  async execute(
    service: AccountTypes.Payload.Service.ListSubscriptions.Input,
  ): Promise<AccountTypes.Payload.Service.ListSubscriptions.Output> {
    const { options } = service;

    const collection = await this.repository.list(options);
    if (!collection?.length) {
      throw new AppException(
        "NOTHING_FOUND",
        404,
        "collection not found.",
        "repository.list()",
      );
    }

    return {
      status: {
        description: "COLLECTION_LISTED",
        code: 200,
        context: "APPLICATION",
      },
      output: collection,
    };
  }
}
