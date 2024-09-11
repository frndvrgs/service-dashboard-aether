import { Injectable } from "@nestjs/common";
import { ReadGitHubDataService } from "./read-github-data.service";
import { EncryptionService } from "../../../../common/services/encryption.service";
import { AppException } from "../../../../common/exceptions/app.exception";
import { AccountRepository } from "../../repositories/account.repository";

import type { AccountTypes } from "../../account.types";

@Injectable()
export class FetchAccountGitHubService {
  constructor(
    private repository: AccountRepository,
    private encryptionService: EncryptionService,
    private readGitHubDataService: ReadGitHubDataService,
  ) {}

  async execute(
    service: AccountTypes.Payload.Service.FetchAccountGitHub.Input,
  ): Promise<AccountTypes.Payload.Service.FetchAccountGitHub.Output> {
    const { account } = service;

    const resource = await this.repository.read({
      where: { id_account: account },
    });
    if (!resource) {
      throw new AppException("NOT_FOUND", 404, "resource not found.", account);
    }

    const updateData = { ...resource };

    const github_token = this.encryptionService.decrypt(resource.github_token);

    const githubData = await this.readGitHubDataService.execute({
      github_token,
    });

    updateData.document = {
      ...updateData.document,
      repositories: githubData.output,
    };

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
