import { Resolver, Query, Mutation, Args, ID, Context } from "@nestjs/graphql";
import { UseFilters } from "@nestjs/common";
import { queryTools } from "../../../common/interface/v1/helpers/query-tools";
import { OptionsInput } from "../../../common/interface/v1/common.dto";
import { SessionService } from "../../../common/services/session.service";
import { StatusService } from "../../../common/services/status.service";
import { InterfaceExceptionFilter } from "../../../common/filters/interface.exception.filter";
import { AppExceptionFilter } from "../../../common/filters/app.exception.filter";
import {
  Subscription,
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
  SubscriptionResponse,
  SubscriptionsResponse,
} from "../interface/v1/subscription.dto";

import * as services from "../services/subscription";

import type { AccountTypes } from "../account.types";
import type { MercuriusContext } from "mercurius";

@Resolver(() => Subscription)
@UseFilters(AppExceptionFilter)
@UseFilters(InterfaceExceptionFilter)
export class SubscriptionResolver {
  private queryOptionsHelper: ReturnType<
    typeof queryTools.createQueryOptionsHelper<Subscription>
  >;

  constructor(
    private sessionService: SessionService,
    private status: StatusService,
    private listSubscriptionsService: services.ListSubscriptionsService,
    private readSubscriptionService: services.ReadSubscriptionService,
    private createSubscriptionService: services.CreateSubscriptionService,
    private updateSubscriptionService: services.UpdateSubscriptionService,
    private removeSubscriptionService: services.RemoveSubscriptionService,
  ) {
    const allowedSelectFields: (keyof Subscription)[] = [
      "id_subscription",
      "type",
      "status",
      "created_at",
      "updated_at",
    ];
    this.queryOptionsHelper =
      queryTools.createQueryOptionsHelper<Subscription>(allowedSelectFields);
  }

  @Query(() => SubscriptionsResponse)
  async listSubscriptions(
    @Context() context: MercuriusContext,
    @Args("options") options: OptionsInput,
  ): Promise<SubscriptionsResponse> {
    // minimum scope required for this control operation
    const requiredScopes = ["service"];

    // authorizing session
    await this.sessionService.authorize(context.reply.request, requiredScopes);

    const serviceInput = {
      options: this.queryOptionsHelper.mapQueryOptions(options),
    };
    const service = await this.listSubscriptionsService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Query(() => SubscriptionResponse)
  async readSubscription(
    @Context() context: MercuriusContext,
    @Args("options", { nullable: true }) options?: OptionsInput,
  ): Promise<SubscriptionResponse> {
    // minimum scope required for this control operation

    const requiredScopes = ["user"];

    // authorizing and retrieving identity values from session
    const identity = await this.sessionService.authorize(
      context.reply.request,
      requiredScopes,
    );

    let serviceInput: AccountTypes.Payload.Service.ReadSubscription.Input;

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

    const service = await this.readSubscriptionService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => SubscriptionResponse)
  async createSubscription(
    @Context() context: MercuriusContext,
    @Args("input") input: CreateSubscriptionInput,
    @Args("account", { type: () => ID, nullable: true }) account?: string,
  ): Promise<SubscriptionResponse> {
    // minimum scope required for this control operation

    const requiredScopes = ["user"];

    // authorizing and retrieving identity values from session
    const identity = await this.sessionService.authorize(
      context.reply.request,
      requiredScopes,
    );

    const serviceInput: AccountTypes.Payload.Service.CreateSubscription.Input =
      {
        account: identity.scope.service
          ? account ?? identity.sub
          : identity.sub,
        input,
      };

    const service = await this.createSubscriptionService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => SubscriptionResponse)
  async updateSubscription(
    @Context() context: MercuriusContext,
    @Args("input") input: UpdateSubscriptionInput,
    @Args("account", { type: () => ID, nullable: true }) account?: string,
  ): Promise<SubscriptionResponse> {
    // minimum scope required for this control operation

    const requiredScopes = ["user"];

    // authorizing and retrieving identity values from session
    const identity = await this.sessionService.authorize(
      context.reply.request,
      requiredScopes,
    );

    const serviceInput: AccountTypes.Payload.Service.UpdateSubscription.Input =
      {
        account: identity.scope.service
          ? account ?? identity.sub
          : identity.sub,
        input,
      };

    const service = await this.updateSubscriptionService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => SubscriptionResponse)
  async removeSubscription(
    @Context() context: MercuriusContext,
    @Args("account", { type: () => ID, nullable: true }) account?: string,
  ): Promise<SubscriptionResponse> {
    // minimum scope required for this control operation

    const requiredScopes = ["user"];

    // authorizing and retrieving identity values from session
    const identity = await this.sessionService.authorize(
      context.reply.request,
      requiredScopes,
    );

    const serviceInput: AccountTypes.Payload.Service.RemoveSubscription.Input =
      {
        account: identity.scope.service
          ? account ?? identity.sub
          : identity.sub,
      };

    const service = await this.removeSubscriptionService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
    };
  }
}
