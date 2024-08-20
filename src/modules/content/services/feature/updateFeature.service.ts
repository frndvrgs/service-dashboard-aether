import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { FeatureRepository } from "../../repositories/feature.repository";

import type { ContentTypes } from "../../content.types";

@Injectable()
export class UpdateFeatureService {
  constructor(private repository: FeatureRepository) {}

  async execute(
    service: ContentTypes.Payload.Service.UpdateFeature.Input,
  ): Promise<ContentTypes.Payload.Service.UpdateFeature.Output> {
    const { feature, input } = service;

    const resource = await this.repository.read({
      where: { idFeature: feature },
    });
    if (!resource) {
      throw new AppException("NOT_FOUND", 404, "resource not found.", feature);
    }

    Object.assign(resource, input);

    const updatedResource = await this.repository.save(resource);

    return {
      status: {
        description: "FEATURE_UPDATED",
        code: 200,
        context: "APPLICATION",
      },
      output: updatedResource,
    };
  }
}
