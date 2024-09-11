import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { SubscriptionRepository } from "../../repositories/subscription.repository";

import type { AccountTypes } from "../../account.types";

@Injectable()
export class UpdateSubscriptionService {
  constructor(private repository: SubscriptionRepository) {}

  async execute(
    service: AccountTypes.Payload.Service.UpdateSubscription.Input,
  ): Promise<AccountTypes.Payload.Service.UpdateSubscription.Output> {
    const { account, input } = service;

    const resource = await this.repository.read({
      where: { id_account: account },
    });
    if (!resource) {
      throw new AppException("NOT_FOUND", 404, "resource not found.", account);
    }

    const updateData = { ...resource };

    if (input.type) {
      updateData.type = input.type;
    }

    if (input.status) {
      updateData.status = input.status;
    }

    if (input.document) {
      updateData.document = {
        ...updateData.document,
        ...input.document,
      };
    }

    Object.assign(resource, updateData);

    const updatedResource = await this.repository.save(resource);

    return {
      status: {
        description: "SUBSCRIPTION_UPDATED",
        code: 200,
        context: "APPLICATION",
      },
      output: updatedResource,
    };
  }
}
