import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { WorkEntity } from "../../domain/work.entity";
import { WorkRepository } from "../../repositories/work.repository";
import { SourceEntity } from "../../domain/source.entity";
import { SourceRepository } from "../../repositories/source.repository";

import { AccountRepository } from "../../../account/repositories/account.repository";
import { SubscriptionRepository } from "../../../account/repositories/subscription.repository";
import { FeatureRepository } from "../../../content/repositories/feature.repository";

import type { ProductTypes } from "../../product.types";

@Injectable()
export class CreateWorkService {
  constructor(
    private workRepository: WorkRepository,
    private sourceRepository: SourceRepository,
    private accountRepository: AccountRepository,
    private subscriptionRepository: SubscriptionRepository,
    private featureRepository: FeatureRepository,
  ) {}

  async execute(
    service: ProductTypes.Payload.Service.CreateWork.Input,
  ): Promise<ProductTypes.Payload.Service.CreateWork.Output> {
    const { account, feature, input } = service;

    const accountResource = await this.accountRepository.read({
      where: { id_account: account },
    });
    if (!accountResource) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "account does not exist.",
        account,
      );
    }

    const subscriptionResource = await this.subscriptionRepository.read({
      where: { id_account: accountResource.id_account },
    });
    if (!subscriptionResource) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "subscription does not exist.",
        accountResource.id_account,
      );
    }

    const featureResource = await this.featureRepository.read({
      where: { id_feature: feature },
    });
    if (!featureResource) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "feature does not exist.",
        feature,
      );
    }

    // check if subscription type allows the selected feature
    if (
      !featureResource.subscription_scope.includes(subscriptionResource.type)
    ) {
      throw new AppException(
        "NOT_ALLOWED",
        403,
        "subscription type does not allow the use of this feature.",
        `type: ${subscriptionResource.type}, input scope: ${featureResource.subscription_scope}`,
      );
    }

    if (
      input.id_pull_request &&
      featureResource.process_type !== "PULL_REQUEST"
    ) {
      throw new AppException(
        "NOT_ALLOWED",
        403,
        "id_pull_request is required for pull request works.",
        `feature process_type: ${featureResource.process_type}`,
      );
    }

    let sourceResource: SourceEntity | null;

    // check if this repository is already stored
    sourceResource = await this.sourceRepository.read({
      where: { id_repository: input.id_repository },
    });

    if (!sourceResource) {
      // if not stored, create a new source entity
      const sourceEntity = new SourceEntity();

      sourceEntity.id_account = accountResource.id_account;
      sourceEntity.id_repository = input.id_repository;

      sourceResource = await this.sourceRepository.save(sourceEntity);
    }

    const workEntity = new WorkEntity();

    // if repository is already stored, update the work with has_code_dump
    workEntity.has_code_dump = sourceResource.has_code_dump;

    // mount the new work entity
    workEntity.id_account = accountResource.id_account;
    workEntity.id_feature = featureResource.id_feature;
    workEntity.id_repository = input.id_repository;
    workEntity.id_pull_request = input.id_pull_request;
    workEntity.name = input.name;
    workEntity.repository_name = input.repository_name;
    workEntity.pull_request_name = input.pull_request_name;
    workEntity.process_type = featureResource.process_type;

    // check if has a custom initial level value
    if (input.level) {
      workEntity.level = input.level;
    }

    // create the nosql document with input and new details
    workEntity.document = {
      ...input.document,
      feature: {
        name: featureResource.name,
        type: subscriptionResource.type,
      },
      source: {
        id_repository: sourceResource.id_repository,
        has_code_dump: sourceResource.has_code_dump,
      },
    };

    // save the entity on the repository
    const workResource = await this.workRepository.save(workEntity);

    return {
      status: {
        description: "WORK_CREATED",
        code: 201,
        context: "APPLICATION",
      },
      output: workResource,
    };
  }
}
