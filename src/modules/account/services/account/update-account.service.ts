import { Injectable } from "@nestjs/common";
import { ReadGitHubDataService } from "./read-github-data.service";
import { EncryptionService } from "../../../../common/services/encryption.service";
import { AppException } from "../../../../common/exceptions/app.exception";
import { AccountRepository } from "../../repositories/account.repository";
import { Not } from "typeorm";

import type { AccountTypes } from "../../account.types";

@Injectable()
export class UpdateAccountService {
  constructor(
    private repository: AccountRepository,
    private encryptionService: EncryptionService,
    private readGitHubDataService: ReadGitHubDataService,
  ) {}

  async execute(
    service: AccountTypes.Payload.Service.UpdateAccount.Input,
  ): Promise<AccountTypes.Payload.Service.UpdateAccount.Output> {
    const { account, input } = service;

    const resource = await this.repository.read({
      where: { id_account: account },
    });
    if (!resource) {
      throw new AppException("NOT_FOUND", 404, "resource not found.", account);
    }

    const updateData = { ...resource };

    if (input.email) {
      if (!resource.email.includes(input.email)) {
        const existsEmail = await this.repository.exists({
          where: {
            email: input.email,
            id_account: Not(resource.id_account),
          },
        });
        if (existsEmail) {
          throw new AppException(
            "NOT_UNIQUE_VALUE",
            409,
            "email already exists in another account.",
            input.email,
          );
        }
        resource.email.push(input.email);
      }
    }

    // new github_token value
    if (input.github_token) {
      const repositories = await this.readGitHubDataService.execute({
        github_token: input.github_token,
      });
      Object.assign(updateData.document, { repositories: repositories.output });
      updateData.github_token = this.encryptionService.encrypt(
        input.github_token,
      );
    }

    if (input.scope) {
      updateData.scope = input.scope;
    }

    if (input.document) {
      Object.assign(updateData.document, { ...input.document });
    }

    Object.assign(resource, updateData);

    const updatedResource = await this.repository.save(resource);

    return {
      status: {
        description: "ACCOUNT_UPDATED",
        code: 200,
        context: "APPLICATION",
      },
      output: updatedResource,
    };
  }
}
