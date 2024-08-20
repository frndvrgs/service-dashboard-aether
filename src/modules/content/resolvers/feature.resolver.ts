import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { UseFilters, ParseUUIDPipe } from "@nestjs/common";
import { queryTools } from "../../../common/interface/v1/helpers/query-tools";
import { OptionsInput } from "../../../common/interface/v1/common.dto";
import { StatusHandler } from "../../../common/handlers/status.handler";
import { AppExceptionFilter } from "../../../common/filters/app.exception.filter";
import {
  Feature,
  CreateFeatureInput,
  UpdateFeatureInput,
  FeatureOutput,
  FeaturesOutput,
} from "../interface/v1/feature.dto";

import * as services from "../services/feature";

@Resolver(() => Feature)
@UseFilters(AppExceptionFilter)
export class FeatureResolver {
  private queryOptionsHelper: ReturnType<
    typeof queryTools.createQueryOptionsHelper<Feature>
  >;

  constructor(
    private status: StatusHandler,
    private listFeaturesService: services.ListFeaturesService,
    private readFeatureService: services.ReadFeatureService,
    private createFeatureService: services.CreateFeatureService,
    private updateFeatureService: services.UpdateFeatureService,
    private removeFeatureService: services.RemoveFeatureService,
  ) {
    const allowedSelectFields: (keyof Feature)[] = [
      "idFeature",
      "name",
      "subscriptionScope",
      "createdAt",
      "updatedAt",
    ];
    this.queryOptionsHelper =
      queryTools.createQueryOptionsHelper<Feature>(allowedSelectFields);
  }

  @Query(() => FeaturesOutput)
  async listFeatures(
    @Args("options", { nullable: true }) options?: OptionsInput,
  ): Promise<FeaturesOutput> {
    const serviceInput = {
      options: this.queryOptionsHelper.mapQueryOptions(options),
    };
    const service = await this.listFeaturesService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Query(() => FeatureOutput, { nullable: true })
  async readFeature(
    @Args("options", { nullable: false }) options: OptionsInput,
  ): Promise<FeatureOutput> {
    const serviceInput = {
      options: this.queryOptionsHelper.mapQueryOptions(options),
    };
    const service = await this.readFeatureService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => FeatureOutput)
  async createFeature(
    @Args("input") input: CreateFeatureInput,
  ): Promise<FeatureOutput> {
    const serviceInput = {
      input,
    };
    const service = await this.createFeatureService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => FeatureOutput)
  async updateFeature(
    @Args("feature", { type: () => ID }, ParseUUIDPipe) feature: string,
    @Args("input") input: UpdateFeatureInput,
  ): Promise<FeatureOutput> {
    const serviceInput = {
      feature,
      input,
    };
    const service = await this.updateFeatureService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => FeatureOutput)
  async removeFeature(
    @Args("feature", { type: () => ID }, ParseUUIDPipe) feature: string,
  ): Promise<FeatureOutput> {
    const serviceInput = {
      feature,
    };
    const service = await this.removeFeatureService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
    };
  }
}
