import { Resolver, Query, Mutation, Args, ID, Context } from "@nestjs/graphql";
import { UseFilters } from "@nestjs/common";
import { OptionsInput } from "../../../common/interface/v1/common.dto";
import { queryTools } from "../../../common/interface/v1/helpers/query-tools";
import { SessionService } from "../../../common/services/session.service";
import { StatusService } from "../../../common/services/status.service";
import { InterfaceExceptionFilter } from "../../../common/filters/interface.exception.filter";
import { AppExceptionFilter } from "../../../common/filters/app.exception.filter";
import {
  Account,
  UpsertAccountInput,
  UpdateAccountInput,
  AccountResponse,
  AccountsResponse,
} from "../interface/v1/account.dto";
import { StatusResponse } from "../../../common/interface/v1/common.dto";

import * as services from "../services/account";

import type { AccountTypes } from "../account.types";
import type { MercuriusContext } from "mercurius";

@Resolver(() => Account)
@UseFilters(AppExceptionFilter)
@UseFilters(InterfaceExceptionFilter)
export class AccountResolver {
  private queryOptionsHelper: ReturnType<
    typeof queryTools.createQueryOptionsHelper<Account>
  >;

  constructor(
    private sessionService: SessionService,
    private statusService: StatusService,
    private listAccountsService: services.ListAccountsService,
    private readAccountService: services.ReadAccountService,
    private upsertAccountService: services.UpsertAccountService,
    private updateAccountService: services.UpdateAccountService,
    private removeAccountService: services.RemoveAccountService,
    private fetchAccountGitHubService: services.FetchAccountGitHubService,
  ) {
    const allowedSelectFields: (keyof Account)[] = [
      "id_account",
      "email",
      "created_at",
      "updated_at",
    ];
    this.queryOptionsHelper =
      queryTools.createQueryOptionsHelper<Account>(allowedSelectFields);
  }

  @Query(() => AccountsResponse)
  async listAccounts(
    @Context() context: MercuriusContext,
    @Args("options") options: OptionsInput,
  ): Promise<AccountsResponse> {
    // minimum scope required for this control operation
    const requiredScopes = ["service"];

    // authorizing session
    await this.sessionService.authorize(context.reply.request, requiredScopes);

    const serviceInput = {
      options: this.queryOptionsHelper.mapQueryOptions(options),
    };
    const service = await this.listAccountsService.execute(serviceInput);
    return {
      status: this.statusService.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Query(() => AccountResponse)
  async readAccount(
    @Context() context: MercuriusContext,
    @Args("options", { nullable: true }) options?: OptionsInput,
  ): Promise<AccountResponse> {
    // minimum scope required for this control operation

    const requiredScopes = ["user"];

    // authorizing and retrieving identity values from session
    const identity = await this.sessionService.authorize(
      context.reply.request,
      requiredScopes,
    );

    let serviceInput: AccountTypes.Payload.Service.ReadAccount.Input;

    if (identity.scope.service && options) {
      serviceInput = {
        options: this.queryOptionsHelper.mapQueryOptions(options),
      };
    } else {
      serviceInput = {
        options: this.queryOptionsHelper.mapQueryOptions({
          where: [{ field: "id_account", operator: "EQ", value: identity.sub }],
        }),
      };
    }

    const service = await this.readAccountService.execute(serviceInput);
    return {
      status: this.statusService.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => AccountResponse)
  async upsertAccount(
    @Context() context: MercuriusContext,
    @Args("input") input: UpsertAccountInput,
  ): Promise<AccountResponse> {
    // minimum scope required for this control operation
    const requiredScopes = ["service"];

    // authorizing session
    await this.sessionService.authorize(context.reply.request, requiredScopes);

    const serviceInput = {
      input,
    };
    const service = await this.upsertAccountService.execute(serviceInput);
    return {
      status: this.statusService.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => AccountResponse)
  async updateAccount(
    @Context() context: MercuriusContext,
    @Args("input") input: UpdateAccountInput,
    @Args("account", { type: () => ID, nullable: true }) account?: string,
  ): Promise<AccountResponse> {
    // minimum scope required for this control operation

    const requiredScopes = ["user"];

    // authorizing and retrieving identity values from session
    const identity = await this.sessionService.authorize(
      context.reply.request,
      requiredScopes,
    );

    const serviceInput: AccountTypes.Payload.Service.UpdateAccount.Input = {
      account: identity.scope.service ? account ?? identity.sub : identity.sub,
      input,
    };

    const service = await this.updateAccountService.execute(serviceInput);
    return {
      status: this.statusService.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => StatusResponse)
  async removeAccount(
    @Context() context: MercuriusContext,
    @Args("account", { type: () => ID, nullable: true }) account?: string,
  ): Promise<StatusResponse> {
    // minimum scope required for this control operation

    const requiredScopes = ["user"];

    // authorizing and retrieving identity values from session
    const identity = await this.sessionService.authorize(
      context.reply.request,
      requiredScopes,
    );

    const serviceInput: AccountTypes.Payload.Service.RemoveAccount.Input = {
      account: identity.scope.service ? account ?? identity.sub : identity.sub,
    };

    const service = await this.removeAccountService.execute(serviceInput);
    return {
      status: this.statusService.createHttpStatus(service.status),
    };
  }

  @Mutation(() => AccountResponse)
  async fetchAccountGitHub(
    @Context() context: MercuriusContext,
    @Args("account", { type: () => ID, nullable: true }) account?: string,
  ): Promise<AccountResponse> {
    // minimum scope required for this control operation

    const requiredScopes = ["user"];

    // authorizing and retrieving identity values from session
    const identity = await this.sessionService.authorize(
      context.reply.request,
      requiredScopes,
    );

    const serviceInput: AccountTypes.Payload.Service.FetchAccountGitHub.Input =
      {
        account: identity.scope.service
          ? account ?? identity.sub
          : identity.sub,
      };

    const service = await this.fetchAccountGitHubService.execute(serviceInput);
    return {
      status: this.statusService.createHttpStatus(service.status),
      output: service.output,
    };
  }
}
