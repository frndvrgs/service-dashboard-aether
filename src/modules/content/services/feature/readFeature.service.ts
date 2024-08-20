import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { FeatureRepository } from "../../repositories/feature.repository";

import type { ContentTypes } from "../../content.types";

@Injectable()
export class ReadFeatureService {
  constructor(private repository: FeatureRepository) {}

  async execute(
    service: ContentTypes.Payload.Service.ReadFeature.Input,
  ): Promise<ContentTypes.Payload.Service.ReadFeature.Output> {
    const { options } = service;
    if (!options) {
      throw new AppException(
        "MISSING_PAYLOAD",
        400,
        "missing payload.",
        "service.payload.select is null or undefined.",
      );
    }

    const resource = await this.repository.read(options);
    if (resource == null) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "resource not found.",
        "service.payload.select invalid field or value.",
      );
    }

    return {
      status: {
        description: "RESOURCE_READ",
        code: 200,
        context: "APPLICATION",
      },
      output: resource,
    };
  }
}
