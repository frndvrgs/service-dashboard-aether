import { Injectable } from "@nestjs/common";
import { AccountEntity } from "../../domain/account.entity";
import { AccountRepository } from "../../repositories/account.repository";
import { CreateProfileService } from "../../../content/services/profile";
import { ArrayContains } from "typeorm";

import type { AccountTypes } from "../../account.types";

@Injectable()
export class UpsertAccountService {
  constructor(
    private repository: AccountRepository,
    private createProfileService: CreateProfileService,
  ) {}

  async execute(
    service: AccountTypes.Payload.Service.UpsertAccount.Input,
  ): Promise<AccountTypes.Payload.Service.UpsertAccount.Output> {
    const { input } = service;

    let entity: AccountEntity;

    const existingAccount = await this.repository.read({
      where: {
        email: ArrayContains([input.email]),
      },
    });
    if (existingAccount) {
      entity = existingAccount;
    } else {
      entity = new AccountEntity();
    }

    // avoiding duplicates
    if (!entity.email?.includes(input.email)) {
      (entity.email ??= []).push(input.email);
    }

    // Oauth account details
    entity.document = {
      ...entity.document,
      ...input.document,
    };

    const resource = await this.repository.save(entity);

    // to be improved with transaction
    if (!existingAccount) {
      await this.createProfileService.execute({
        account: resource.id_account,
      });
    }

    return {
      output: resource,
      status: {
        description: "ACCOUNT_CREATED",
        code: 201,
        context: "APPLICATION",
      },
    };
  }
}
