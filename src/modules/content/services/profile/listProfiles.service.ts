import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { ProfileRepository } from "../../repositories/profile.repository";

import type { ContentTypes } from "../../content.types";

@Injectable()
export class ListProfilesService {
  constructor(private repository: ProfileRepository) {}

  async execute(
    service: ContentTypes.Payload.Service.ListProfiles.Input,
  ): Promise<ContentTypes.Payload.Service.ListProfiles.Output> {
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
