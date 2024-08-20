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
      where: { idAccount: account },
    });
    if (!accountResource) {
      throw new AppException("NOT_FOUND", 404, "resource not found.", account);
    }
    const newSubscription = new SubscriptionEntity();

    newSubscription.idAccount = accountResource.idAccount;
    (newSubscription.type = input.type),
      (newSubscription.status = input.status);

    const resource = await this.subscriptionRepository.save(newSubscription);
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
