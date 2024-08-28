import { Resolver, Query, Mutation, Args, ID, Context } from "@nestjs/graphql";
import { UseFilters, ParseUUIDPipe } from "@nestjs/common";
import { OptionsInput } from "../../../common/interface/v1/common.dto";
import { queryTools } from "../../../common/interface/v1/helpers/query-tools";
import { SessionHandler } from "../../../common/handlers/session.handler";
import { StatusHandler } from "../../../common/handlers/status.handler";
import { InterfaceExceptionFilter } from "../../../common/filters/interface.exception.filter";
import { AppExceptionFilter } from "../../../common/filters/app.exception.filter";
import {
  Account,
  UpsertAccountInput,
  UpdateAccountInput,
  AccountOutput,
  AccountsOutput,
} from "../interface/v1/account.dto";

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
    private status: StatusHandler,
    private session: SessionHandler,
    private listAccountsService: services.ListAccountsService,
    private readAccountService: services.ReadAccountService,
    private upsertAccountService: services.UpsertAccountService,
    private updateAccountService: services.UpdateAccountService,
    private removeAccountService: services.RemoveAccountService,
  ) {
    const allowedSelectFields: (keyof Account)[] = [
      "idAccount",
      "email",
      "createdAt",
      "updatedAt",
    ];
    this.queryOptionsHelper =
      queryTools.createQueryOptionsHelper<Account>(allowedSelectFields);
  }

  @Query(() => AccountsOutput)
  async listAccounts(
    @Context() context: MercuriusContext,
    @Args("options", { nullable: true }) options?: OptionsInput,
  ): Promise<AccountsOutput> {
    // minimum scope required for this control operation
    const requiredScopes = ["user"];

    // authorizing session
    await this.session.authorize(context.reply.request, requiredScopes);

    const serviceInput = {
      options: this.queryOptionsHelper.mapQueryOptions(options),
    };
    const service = await this.listAccountsService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Query(() => AccountOutput, { nullable: true })
  async readAccount(
    @Args("options", { nullable: false }) options: OptionsInput,
  ): Promise<AccountOutput> {
    const serviceInput = {
      options: this.queryOptionsHelper.mapQueryOptions(options),
    };
    const service = await this.readAccountService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => AccountOutput)
  async syncAccount(
    @Context() context: MercuriusContext,
    @Args("input") input: UpsertAccountInput,
  ): Promise<AccountOutput> {
    this.session.verifyOAuth(context.reply.request);
    const serviceInput = {
      input,
    };
    const service = await this.upsertAccountService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => AccountOutput)
  async updateAccount(
    @Context() context: MercuriusContext,
    @Args("account", { type: () => ID }, ParseUUIDPipe) account: string,
    @Args("input") input: UpdateAccountInput,
  ): Promise<AccountOutput> {
    // minimum scope required for this control operation
    // control.scopeType is determined by the api entry point
    const requiredScopes = ["user"];

    // authorizing and retrieving identity values from session
    const identity = await this.session.authorize(
      context.reply.request,
      requiredScopes,
    );

    let serviceInput: AccountTypes.Payload.Service.UpdateAccount.Input;

    if (identity.scope.service) {
      serviceInput = {
        account,
        input,
      };
    } else {
      serviceInput = {
        account: identity.sub,
        input,
      };
    }

    const service = await this.updateAccountService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => AccountOutput)
  async removeAccount(
    @Args("account", { type: () => ID }, ParseUUIDPipe) account: string,
  ): Promise<AccountOutput> {
    const serviceInput = {
      account,
    };
    const service = await this.removeAccountService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
    };
  }
}
