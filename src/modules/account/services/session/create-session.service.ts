import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { AccountRepository } from "../../repositories/account.repository";

import type { AccountTypes } from "../../account.types";

@Injectable()
export class CreateSessionService {
  constructor(private repository: AccountRepository) {}

  async execute(
    service: AccountTypes.Payload.Service.CreateSession.Input,
  ): Promise<AccountTypes.Payload.Service.CreateSession.Output> {
    const { input } = service;

    const resource = await this.repository.read({
      where: { email: input.email },
    });
    if (!resource) {
      throw new AppException(
        "INVALID_SESSION",
        401,
        "invalid credentials.",
        "verification failed: email or password",
      );
    }

    return {
      status: {
        description: "SESSION_VERIFIED",
        code: 202,
        context: "APPLICATION",
      },
      output: resource,
    };
  }
}
