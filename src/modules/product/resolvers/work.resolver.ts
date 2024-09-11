import { Resolver, Query, Mutation, Args, ID, Context } from "@nestjs/graphql";
import { UseFilters } from "@nestjs/common";
import { queryTools } from "../../../common/interface/v1/helpers/query-tools";
import { OptionsInput } from "../../../common/interface/v1/common.dto";
import { SessionService } from "../../../common/services/session.service";
import { StatusService } from "../../../common/services/status.service";
import { InterfaceExceptionFilter } from "../../../common/filters/interface.exception.filter";
import { AppExceptionFilter } from "../../../common/filters/app.exception.filter";
import {
  Work,
  CreateWorkInput,
  UpdateWorkInput,
  WorkResponse,
  WorksResponse,
} from "../interface/v1/work.dto";

import * as services from "../services/work";

import type { ProductTypes } from "../product.types";
import type { MercuriusContext } from "mercurius";

@Resolver(() => Work)
@UseFilters(AppExceptionFilter)
@UseFilters(InterfaceExceptionFilter)
export class WorkResolver {
  private queryOptionsHelper: ReturnType<
    typeof queryTools.createQueryOptionsHelper<Work>
  >;

  constructor(
    private sessionService: SessionService,
    private status: StatusService,
    private listWorksService: services.ListWorksService,
    private readWorkService: services.ReadWorkService,
    private createWorkService: services.CreateWorkService,
    private updateWorkService: services.UpdateWorkService,
    private removeWorkService: services.RemoveWorkService,
    private commandWorkService: services.CommandWorkService,
  ) {
    const allowedSelectFields: (keyof Work)[] = [
      "id_work",
      "id_account",
      "id_feature",
      "name",
      "level",
      "created_at",
      "updated_at",
    ];
    this.queryOptionsHelper =
      queryTools.createQueryOptionsHelper<Work>(allowedSelectFields);
  }

  @Query(() => WorksResponse)
  async listWorks(
    @Context() context: MercuriusContext,
    @Args("options", { nullable: true }) options?: OptionsInput,
  ): Promise<WorksResponse> {
    // minimum scope required for this control operation

    const requiredScopes = ["user"];

    // authorizing and retrieving identity values from session
    const identity = await this.sessionService.authorize(
      context.reply.request,
      requiredScopes,
    );

    let serviceInput: ProductTypes.Payload.Service.ListWorks.Input;

    serviceInput = {
      options:
        identity.scope.service && options
          ? this.queryOptionsHelper.mapQueryOptions(options)
          : options
            ? this.queryOptionsHelper.mapQueryOptions({
                ...options,
                where: [
                  { field: "id_account", operator: "EQ", value: identity.sub },
                ],
              })
            : this.queryOptionsHelper.mapQueryOptions({
                where: [
                  { field: "id_account", operator: "EQ", value: identity.sub },
                ],
              }),
    };

    const service = await this.listWorksService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Query(() => WorkResponse)
  async readWork(
    @Context() context: MercuriusContext,
    @Args("options", { nullable: true }) options?: OptionsInput,
  ): Promise<WorkResponse> {
    // minimum scope required for this control operation

    const requiredScopes = ["user"];

    // authorizing and retrieving identity values from session
    const identity = await this.sessionService.authorize(
      context.reply.request,
      requiredScopes,
    );

    let serviceInput: ProductTypes.Payload.Service.ReadWork.Input;

    serviceInput = {
      options:
        identity.scope.service && options
          ? this.queryOptionsHelper.mapQueryOptions(options)
          : options
            ? this.queryOptionsHelper.mapQueryOptions({
                ...options,
                where: [
                  { field: "id_account", operator: "EQ", value: identity.sub },
                ],
              })
            : this.queryOptionsHelper.mapQueryOptions({
                where: [
                  { field: "id_account", operator: "EQ", value: identity.sub },
                ],
              }),
    };

    const service = await this.readWorkService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => WorkResponse)
  async createWork(
    @Context() context: MercuriusContext,
    @Args("feature", { type: () => ID }) feature: string,
    @Args("input") input: CreateWorkInput,
    @Args("account", { type: () => ID, nullable: true }) account?: string,
  ): Promise<WorkResponse> {
    // minimum scope required for this control operation

    const requiredScopes = ["user"];

    // authorizing and retrieving identity values from session
    const identity = await this.sessionService.authorize(
      context.reply.request,
      requiredScopes,
    );

    const serviceInput: ProductTypes.Payload.Service.CreateWork.Input = {
      account: identity.scope.service ? account ?? identity.sub : identity.sub,
      feature,
      input,
    };

    const service = await this.createWorkService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => WorkResponse)
  async updateWork(
    @Context() context: MercuriusContext,
    @Args("work", { type: () => ID }) work: string,
    @Args("input") input: UpdateWorkInput,
    @Args("account", { type: () => ID, nullable: true }) account?: string,
  ): Promise<WorkResponse> {
    // minimum scope required for this control operation

    const requiredScopes = ["user"];

    // authorizing and retrieving identity values from session
    const identity = await this.sessionService.authorize(
      context.reply.request,
      requiredScopes,
    );

    const serviceInput: ProductTypes.Payload.Service.UpdateWork.Input = {
      account: identity.scope.service ? account ?? identity.sub : identity.sub,
      work,
      input,
    };

    const service = await this.updateWorkService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => WorkResponse)
  async removeWork(
    @Context() context: MercuriusContext,
    @Args("work", { type: () => ID }) work: string,
    @Args("account", { type: () => ID, nullable: true }) account?: string,
  ): Promise<WorkResponse> {
    // minimum scope required for this control operation

    const requiredScopes = ["user"];

    // authorizing and retrieving identity values from session
    const identity = await this.sessionService.authorize(
      context.reply.request,
      requiredScopes,
    );

    const serviceInput: ProductTypes.Payload.Service.RemoveWork.Input = {
      account: identity.scope.service ? account ?? identity.sub : identity.sub,
      work,
    };

    const service = await this.removeWorkService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
    };
  }

  @Mutation(() => WorkResponse)
  async commandWork(
    @Context() context: MercuriusContext,
    @Args("work", { type: () => ID }) work: string,
    @Args("command", { type: () => String }) command: string,
    @Args("account", { type: () => ID, nullable: true }) account?: string,
  ): Promise<WorkResponse> {
    // minimum scope required for this control operation

    const requiredScopes = ["user"];

    // authorizing and retrieving identity values from session
    const identity = await this.sessionService.authorize(
      context.reply.request,
      requiredScopes,
    );

    const serviceInput: ProductTypes.Payload.Service.CommandWork.Input = {
      account: identity.scope.service ? account ?? identity.sub : identity.sub,
      work,
      command,
    };

    const service = await this.commandWorkService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
    };
  }
}
