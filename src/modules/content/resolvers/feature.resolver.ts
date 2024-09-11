import { Resolver, Query, Mutation, Args, ID, Context } from "@nestjs/graphql";
import { UseFilters } from "@nestjs/common";
import { queryTools } from "../../../common/interface/v1/helpers/query-tools";
import { OptionsInput } from "../../../common/interface/v1/common.dto";
import { SessionService } from "../../../common/services/session.service";
import { StatusService } from "../../../common/services/status.service";
import { InterfaceExceptionFilter } from "../../../common/filters/interface.exception.filter";
import { AppExceptionFilter } from "../../../common/filters/app.exception.filter";
import {
  Feature,
  CreateFeatureInput,
  UpdateFeatureInput,
  FeatureResponse,
  FeaturesResponse,
} from "../interface/v1/feature.dto";

import * as services from "../services/feature";

import type { ContentTypes } from "../content.types";
import type { MercuriusContext } from "mercurius";

@Resolver(() => Feature)
@UseFilters(AppExceptionFilter)
@UseFilters(InterfaceExceptionFilter)
export class FeatureResolver {
  private queryOptionsHelper: ReturnType<
    typeof queryTools.createQueryOptionsHelper<Feature>
  >;

  constructor(
    private sessionService: SessionService,
    private status: StatusService,
    private listFeaturesService: services.ListFeaturesService,
    private readFeatureService: services.ReadFeatureService,
    private createFeatureService: services.CreateFeatureService,
    private updateFeatureService: services.UpdateFeatureService,
    private removeFeatureService: services.RemoveFeatureService,
  ) {
    const allowedSelectFields: (keyof Feature)[] = [
      "id_feature",
      "name",
      "subscription_scope",
      "created_at",
      "updated_at",
    ];
    this.queryOptionsHelper =
      queryTools.createQueryOptionsHelper<Feature>(allowedSelectFields);
  }

  @Query(() => FeaturesResponse)
  async listFeatures(
    @Args("options") options: OptionsInput,
  ): Promise<FeaturesResponse> {
    const serviceInput: ContentTypes.Payload.Service.ListFeatures.Input = {
      options: this.queryOptionsHelper.mapQueryOptions(options),
    };
    const service = await this.listFeaturesService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Query(() => FeatureResponse)
  async readFeature(
    @Args("options") options: OptionsInput,
  ): Promise<FeatureResponse> {
    const serviceInput: ContentTypes.Payload.Service.ReadFeature.Input = {
      options: this.queryOptionsHelper.mapQueryOptions(options),
    };
    const service = await this.readFeatureService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => FeatureResponse)
  async createFeature(
    @Context() context: MercuriusContext,
    @Args("input") input: CreateFeatureInput,
  ): Promise<FeatureResponse> {
    // minimum scope required for this control operation

    const requiredScopes = ["service"];

    // authorizing and retrieving identity values from session
    await this.sessionService.authorize(context.reply.request, requiredScopes);
    const serviceInput: ContentTypes.Payload.Service.CreateFeature.Input = {
      input,
    };
    const service = await this.createFeatureService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => FeatureResponse)
  async updateFeature(
    @Context() context: MercuriusContext,
    @Args("feature", { type: () => ID }) feature: string,
    @Args("input") input: UpdateFeatureInput,
  ): Promise<FeatureResponse> {
    // minimum scope required for this control operation

    const requiredScopes = ["service"];

    // authorizing and retrieving identity values from session
    await this.sessionService.authorize(context.reply.request, requiredScopes);
    const serviceInput: ContentTypes.Payload.Service.UpdateFeature.Input = {
      feature,
      input,
    };
    const service = await this.updateFeatureService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => FeatureResponse)
  async removeFeature(
    @Context() context: MercuriusContext,
    @Args("feature", { type: () => ID }) feature: string,
  ): Promise<FeatureResponse> {
    // minimum scope required for this control operation

    const requiredScopes = ["service"];

    // authorizing and retrieving identity values from session
    await this.sessionService.authorize(context.reply.request, requiredScopes);
    const serviceInput: ContentTypes.Payload.Service.RemoveFeature.Input = {
      feature,
    };
    const service = await this.removeFeatureService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
    };
  }
}
