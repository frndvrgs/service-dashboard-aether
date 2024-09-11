import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { FeatureRepository } from "../../repositories/feature.repository";

import type { ContentTypes } from "../../content.types";

@Injectable()
export class RemoveFeatureService {
  constructor(private repository: FeatureRepository) {}

  async execute(
    service: ContentTypes.Payload.Service.RemoveFeature.Input,
  ): Promise<ContentTypes.Payload.Service.RemoveFeature.Output> {
    const { feature } = service;

    const result = await this.repository.remove("id_feature", feature);
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
        description: "ACCOUNT_REMOVED",
        code: 204,
        context: "APPLICATION",
      },
    };
  }
}
