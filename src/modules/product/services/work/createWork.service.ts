import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { WorkEntity } from "../../domain/work.entity";
import { WorkRepository } from "../../repositories/work.repository";

import { AccountRepository } from "../../../account/repositories/account.repository";
import { SubscriptionRepository } from "../../../account/repositories/subscription.repository";
import { FeatureRepository } from "../../../content/repositories/feature.repository";

import type { ProductTypes } from "../../product.types";

@Injectable()
export class CreateWorkService {
  constructor(
    private workRepository: WorkRepository,
    private accountRepository: AccountRepository,
    private subscriptionRepository: SubscriptionRepository,
    private featureRepository: FeatureRepository,
  ) {}

  async execute(
    service: ProductTypes.Payload.Service.CreateWork.Input,
  ): Promise<ProductTypes.Payload.Service.CreateWork.Output> {
    const { account, feature, input } = service;

    const accountResource = await this.accountRepository.read({
      where: { idAccount: account },
    });
    if (!accountResource) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "account does not exist.",
        account,
      );
    }

    const featureResource = await this.featureRepository.read({
      where: { idFeature: feature },
    });
    if (!featureResource) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "feature does not exist.",
        feature,
      );
    }

    const subscriptionResource = await this.subscriptionRepository.read({
      where: { idAccount: accountResource.idAccount },
    });
    if (!subscriptionResource) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "subscription does not exist.",
        accountResource.idAccount,
      );
    }

    // check if subscription type allows the selected feature
    if (
      !featureResource.subscriptionScope.includes(subscriptionResource.type)
    ) {
      throw new AppException(
        "NOT_ALLOWED",
        403,
        "subscription type does not allow the use of this feature.",
        `type: ${subscriptionResource.type}, input scope: ${featureResource.subscriptionScope}`,
      );
    }

    const newWork = new WorkEntity();

    newWork.idAccount = accountResource.idAccount;
    newWork.idFeature = featureResource.idFeature;
    newWork.name = input.name;
    newWork.level = input.level;
    newWork.document = {
      feature_name: featureResource.name,
      feature_tier: subscriptionResource.type,
    };

    const resource = await this.workRepository.save(newWork);

    return {
      status: {
        description: "WORK_CREATED",
        code: 201,
        context: "APPLICATION",
      },
      output: resource,
    };
  }
}
