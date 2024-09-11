import { Injectable } from "@nestjs/common";
import { ProfileEntity } from "../../domain/profile.entity";
import { AppException } from "../../../../common/exceptions/app.exception";
import { ProfileRepository } from "../../repositories/profile.repository";
import crypto from "node:crypto";

import type { ContentTypes } from "../../content.types";

@Injectable()
export class CreateProfileService {
  constructor(private repository: ProfileRepository) {}

  async execute(
    service: ContentTypes.Payload.Service.CreateProfile.Input,
  ): Promise<ContentTypes.Payload.Service.CreateProfile.Output> {
    const { account, input } = service;
    if (!account) {
      throw new AppException(
        "INVALID_INPUT",
        404,
        "missing account argument value",
        "account argument is required to create a profile",
      );
    }

    const entity = new ProfileEntity();

    entity.id_account = account;
    entity.username = crypto.randomBytes(5).toString("hex");

    // adding OAuth account profile details
    if (input?.document) {
      entity.document = {
        ...input.document,
      };
    }

    const resource = await this.repository.save(entity);
    return {
      status: {
        description: "PROFILE_CREATED",
        code: 201,
        context: "APPLICATION",
      },
      output: resource,
    };
  }
}
