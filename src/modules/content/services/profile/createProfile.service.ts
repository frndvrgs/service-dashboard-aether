import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { ProfileEntity } from "../../domain/profile.entity";
import { ProfileRepository } from "../../repositories/profile.repository";

import type { ContentTypes } from "../../content.types";

@Injectable()
export class CreateProfileService {
  constructor(private repository: ProfileRepository) {}

  async execute(
    service: ContentTypes.Payload.Service.CreateProfile.Input,
  ): Promise<ContentTypes.Payload.Service.CreateProfile.Output> {
    const { input } = service;

    // check if username input already exists
    if (input.username != null) {
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
    }

    const newProfile = new ProfileEntity();

    newProfile.username = input.username;
    newProfile.name = input.name;

    const resource = await this.repository.save(newProfile);
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
