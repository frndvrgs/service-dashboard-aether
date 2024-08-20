import { Injectable } from "@nestjs/common";
import { FeatureEntity } from "../../domain/feature.entity";
import { FeatureRepository } from "../../repositories/feature.repository";

import type { ContentTypes } from "../../content.types";

@Injectable()
export class CreateFeatureService {
  constructor(private repository: FeatureRepository) {}

  async execute(
    service: ContentTypes.Payload.Service.CreateFeature.Input,
  ): Promise<ContentTypes.Payload.Service.CreateFeature.Output> {
    const { input } = service;

    const newFeature = new FeatureEntity();

    newFeature.name = input.name;
    newFeature.subscriptionScope = input.subscriptionScope;

    const resource = await this.repository.save(newFeature);
    return {
      status: {
        description: "FEATURE_CREATED",
        code: 201,
        context: "APPLICATION",
      },
      output: resource,
    };
  }
}
