import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { ProfileRepository } from "../../repositories/profile.repository";

import type { ContentTypes } from "../../content.types";

@Injectable()
export class UpdateProfileService {
  constructor(private repository: ProfileRepository) {}

  async execute(
    service: ContentTypes.Payload.Service.UpdateProfile.Input,
  ): Promise<ContentTypes.Payload.Service.UpdateProfile.Output> {
    const { account, input } = service;

    const resource = await this.repository.read({
      where: { id_account: account },
    });

    if (!resource) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "resource not found.",
        `reference: ${account}`,
      );
    }

    const updateData = { ...resource };

    // check if username input already exists
    if (input.username) {
      const existsUsername = await this.repository.exists({
        where: { username: input.username },
      });
      if (existsUsername) {
        throw new AppException(
          "NOT_UNIQUE_VALUE",
          409,
          "username already exists.",
          input.username,
        );
      }
      updateData.username = input.username;
    }

    if (input.name) {
      updateData.name = input.name;
    }

    if (input.document) {
      updateData.document = {
        ...updateData.document,
        ...input.document,
      };
    }

    Object.assign(resource, updateData);

    const updatedResource = await this.repository.save(resource);

    return {
      status: {
        description: "PROFILE_UPDATED",
        code: 200,
        context: "APPLICATION",
      },
      output: updatedResource,
    };
  }
}
