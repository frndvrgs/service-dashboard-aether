import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { SubscriptionEntity } from "../../domain/subscription.entity";
import { AccountRepository } from "../../repositories/account.repository";
import { SubscriptionRepository } from "../../repositories/subscription.repository";

import type { AccountTypes } from "../../account.types";

@Injectable()
export class CreateSubscriptionService {
  constructor(
    private accountRepository: AccountRepository,
    private subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute(
    service: AccountTypes.Payload.Service.CreateSubscription.Input,
  ): Promise<AccountTypes.Payload.Service.CreateSubscription.Output> {
    const { account, input } = service;

    const accountResource = await this.accountRepository.read({
      where: { id_account: account },
    });
    if (!accountResource) {
      throw new AppException("NOT_FOUND", 404, "resource not found.", account);
    }

    const existsSubscription = await this.subscriptionRepository.exists({
      where: { id_account: accountResource.id_account },
    });
    if (existsSubscription) {
      throw new AppException(
        "NOT_UNIQUE_VALUE",
        409,
        "a subscription already exists for this account.",
        accountResource.id_account,
      );
    }

    const entity = new SubscriptionEntity();

    entity.id_account = accountResource.id_account;
    entity.type = input.type;
    entity.status = input.status;

    entity.document = {
      ...input.document,
    };

    const resource = await this.subscriptionRepository.save(entity);
    return {
      status: {
        description: "SUBSCRIPTION_CREATED",
        code: 201,
        context: "APPLICATION",
      },
      output: resource,
    };
  }
}
