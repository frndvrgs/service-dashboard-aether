import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { ProfileRepository } from "../../repositories/profile.repository";

import type { ContentTypes } from "../../content.types";

@Injectable()
export class RemoveProfileService {
  constructor(private repository: ProfileRepository) {}

  async execute(
    service: ContentTypes.Payload.Service.RemoveProfile.Input,
  ): Promise<ContentTypes.Payload.Service.RemoveProfile.Output> {
    const { account } = service;

    const result = await this.repository.remove("id_account", account);
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
