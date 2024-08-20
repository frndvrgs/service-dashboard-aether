import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { UseFilters, ParseUUIDPipe } from "@nestjs/common";
import { queryTools } from "../../../common/interface/v1/helpers/query-tools";
import { OptionsInput } from "../../../common/interface/v1/common.dto";
import { StatusHandler } from "../../../common/handlers/status.handler";
import { AppExceptionFilter } from "../../../common/filters/app.exception.filter";
import {
  Subscription,
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
  SubscriptionOutput,
  SubscriptionsOutput,
} from "../interface/v1/subscription.dto";

import * as services from "../services/subscription";

@Resolver(() => Subscription)
@UseFilters(AppExceptionFilter)
export class SubscriptionResolver {
  private queryOptionsHelper: ReturnType<
    typeof queryTools.createQueryOptionsHelper<Subscription>
  >;

  constructor(
    private status: StatusHandler,
    private listSubscriptionsService: services.ListSubscriptionsService,
    private readSubscriptionService: services.ReadSubscriptionService,
    private createSubscriptionService: services.CreateSubscriptionService,
    private updateSubscriptionService: services.UpdateSubscriptionService,
    private removeSubscriptionService: services.RemoveSubscriptionService,
  ) {
    const allowedSelectFields: (keyof Subscription)[] = [
      "idSubscription",
      "type",
      "status",
      "createdAt",
      "updatedAt",
    ];
    this.queryOptionsHelper =
      queryTools.createQueryOptionsHelper<Subscription>(allowedSelectFields);
  }

  @Query(() => SubscriptionsOutput)
  async listSubscriptions(
    @Args("options", { nullable: true }) options?: OptionsInput,
  ): Promise<SubscriptionsOutput> {
    const serviceInput = {
      options: this.queryOptionsHelper.mapQueryOptions(options),
    };
    const service = await this.listSubscriptionsService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Query(() => SubscriptionOutput, { nullable: true })
  async readSubscription(
    @Args("options", { nullable: false }) options: OptionsInput,
  ): Promise<SubscriptionOutput> {
    const serviceInput = {
      options: this.queryOptionsHelper.mapQueryOptions(options),
    };
    const service = await this.readSubscriptionService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => SubscriptionOutput)
  async createSubscription(
    @Args("account", { type: () => ID }, ParseUUIDPipe) account: string,
    @Args("input") input: CreateSubscriptionInput,
  ): Promise<SubscriptionOutput> {
    const serviceInput = {
      account,
      input,
    };
    const service = await this.createSubscriptionService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => SubscriptionOutput)
  async updateSubscription(
    @Args("subscription", { type: () => ID }, ParseUUIDPipe)
    subscription: string,
    @Args("input") input: UpdateSubscriptionInput,
  ): Promise<SubscriptionOutput> {
    const serviceInput = {
      subscription,
      input,
    };
    const service = await this.updateSubscriptionService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => SubscriptionOutput)
  async removeSubscription(
    @Args("subscription", { type: () => ID }, ParseUUIDPipe)
    subscription: string,
  ): Promise<SubscriptionOutput> {
    const serviceInput = {
      subscription,
    };
    const service = await this.removeSubscriptionService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
    };
  }
}
