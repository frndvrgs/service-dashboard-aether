import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { UseFilters, ParseUUIDPipe } from "@nestjs/common";
import { queryTools } from "../../../common/interface/v1/helpers/query-tools";
import { OptionsInput } from "../../../common/interface/v1/common.dto";
import { StatusHandler } from "../../../common/handlers/status.handler";
import { AppExceptionFilter } from "../../../common/filters/app.exception.filter";
import {
  Work,
  CreateWorkInput,
  UpdateWorkInput,
  WorkOutput,
  WorksOutput,
} from "../interface/v1/work.dto";

import * as services from "../services/work";

@Resolver(() => Work)
@UseFilters(AppExceptionFilter)
export class WorkResolver {
  private queryOptionsHelper: ReturnType<
    typeof queryTools.createQueryOptionsHelper<Work>
  >;

  constructor(
    private status: StatusHandler,
    private listWorksService: services.ListWorksService,
    private readWorkService: services.ReadWorkService,
    private createWorkService: services.CreateWorkService,
    private updateWorkService: services.UpdateWorkService,
    private removeWorkService: services.RemoveWorkService,
  ) {
    const allowedSelectFields: (keyof Work)[] = [
      "idWork",
      "idAccount",
      "idFeature",
      "name",
      "level",
      "createdAt",
      "updatedAt",
    ];
    this.queryOptionsHelper =
      queryTools.createQueryOptionsHelper<Work>(allowedSelectFields);
  }

  @Query(() => WorksOutput)
  async listWorks(
    @Args("options", { nullable: true }) options?: OptionsInput,
  ): Promise<WorksOutput> {
    const serviceInput = {
      options: this.queryOptionsHelper.mapQueryOptions(options),
    };
    const service = await this.listWorksService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Query(() => WorkOutput, { nullable: true })
  async readWork(
    @Args("options", { nullable: false }) options: OptionsInput,
  ): Promise<WorkOutput> {
    const serviceInput = {
      options: this.queryOptionsHelper.mapQueryOptions(options),
    };
    const service = await this.readWorkService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => WorkOutput)
  async createWork(
    @Args("account", { type: () => ID }, ParseUUIDPipe) account: string,
    @Args("feature", { type: () => ID }, ParseUUIDPipe) feature: string,
    @Args("input") input: CreateWorkInput,
  ): Promise<WorkOutput> {
    const serviceInput = {
      account,
      feature,
      input,
    };
    const service = await this.createWorkService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => WorkOutput)
  async updateWork(
    @Args("work", { type: () => ID }, ParseUUIDPipe) work: string,
    @Args("input") input: UpdateWorkInput,
  ): Promise<WorkOutput> {
    const serviceInput = {
      work,
      input,
    };
    const service = await this.updateWorkService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => WorkOutput)
  async removeWork(
    @Args("work", { type: () => ID }, ParseUUIDPipe) work: string,
  ): Promise<WorkOutput> {
    const serviceInput = {
      work,
    };
    const service = await this.removeWorkService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
    };
  }
}
