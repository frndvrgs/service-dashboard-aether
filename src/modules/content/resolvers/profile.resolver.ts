import { Resolver, Query, Mutation, Args, ID, Context } from "@nestjs/graphql";
import { UseFilters } from "@nestjs/common";
import { queryTools } from "../../../common/interface/v1/helpers/query-tools";
import { SessionService } from "../../../common/services/session.service";
import { StatusService } from "../../../common/services/status.service";
import { OptionsInput } from "../../../common/interface/v1/common.dto";
import { InterfaceExceptionFilter } from "../../../common/filters/interface.exception.filter";
import { AppExceptionFilter } from "../../../common/filters/app.exception.filter";
import {
  Profile,
  CreateProfileInput,
  UpdateProfileInput,
  ProfileResponse,
  ProfilesResponse,
} from "../interface/v1/profile.dto";

import * as services from "../services/profile";

import type { ContentTypes } from "../content.types";
import type { MercuriusContext } from "mercurius";

@Resolver(() => Profile)
@UseFilters(AppExceptionFilter)
@UseFilters(InterfaceExceptionFilter)
export class ProfileResolver {
  private queryOptionsHelper: ReturnType<
    typeof queryTools.createQueryOptionsHelper<Profile>
  >;

  constructor(
    private sessionService: SessionService,
    private status: StatusService,
    private listProfilesService: services.ListProfilesService,
    private readProfileService: services.ReadProfileService,
    private createProfileService: services.CreateProfileService,
    private updateProfileService: services.UpdateProfileService,
    private removeProfileService: services.RemoveProfileService,
  ) {
    const allowedSelectFields: (keyof Profile)[] = [
      "id_profile",
      "username",
      "name",
      "created_at",
      "updated_at",
    ];
    this.queryOptionsHelper =
      queryTools.createQueryOptionsHelper<Profile>(allowedSelectFields);
  }

  @Query(() => ProfilesResponse)
  async listProfiles(
    @Context() context: MercuriusContext,
    @Args("options") options: OptionsInput,
  ): Promise<ProfilesResponse> {
    // minimum scope required for this control operation
    const requiredScopes = ["user"];

    // authorizing session
    await this.sessionService.authorize(context.reply.request, requiredScopes);

    const serviceInput = {
      options: this.queryOptionsHelper.mapQueryOptions(options),
    };
    const service = await this.listProfilesService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Query(() => ProfileResponse)
  async readProfile(
    @Context() context: MercuriusContext,
    @Args("options", { nullable: true }) options?: OptionsInput,
  ): Promise<ProfileResponse> {
    // minimum scope required for this control operation

    const requiredScopes = ["user"];

    // authorizing and retrieving identity values from session
    const identity = await this.sessionService.authorize(
      context.reply.request,
      requiredScopes,
    );

    let serviceInput: ContentTypes.Payload.Service.ReadProfile.Input;

    if (options) {
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
    const service = await this.readProfileService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => ProfileResponse)
  async createProfile(
    @Context() context: MercuriusContext,
    @Args("input") input: CreateProfileInput,
    @Args("account", { type: () => ID, nullable: true }) account?: string,
  ): Promise<ProfileResponse> {
    // minimum scope required for this control operation

    const requiredScopes = ["user"];

    // authorizing and retrieving identity values from session
    const identity = await this.sessionService.authorize(
      context.reply.request,
      requiredScopes,
    );

    const serviceInput: ContentTypes.Payload.Service.CreateProfile.Input = {
      account: identity.scope.service ? account ?? identity.sub : identity.sub,
      input,
    };

    const service = await this.createProfileService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => ProfileResponse)
  async updateProfile(
    @Context() context: MercuriusContext,
    @Args("input") input: UpdateProfileInput,
    @Args("account", { type: () => ID, nullable: true }) account?: string,
  ): Promise<ProfileResponse> {
    // minimum scope required for this control operation

    const requiredScopes = ["user"];

    // authorizing and retrieving identity values from session
    const identity = await this.sessionService.authorize(
      context.reply.request,
      requiredScopes,
    );

    const serviceInput: ContentTypes.Payload.Service.UpdateProfile.Input = {
      account: identity.scope.service ? account ?? identity.sub : identity.sub,
      input,
    };

    const service = await this.updateProfileService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => ProfileResponse)
  async removeProfile(
    @Context() context: MercuriusContext,
    @Args("account", { type: () => ID, nullable: true }) account?: string,
  ): Promise<ProfileResponse> {
    // minimum scope required for this control operation

    const requiredScopes = ["user"];

    // authorizing and retrieving identity values from session
    const identity = await this.sessionService.authorize(
      context.reply.request,
      requiredScopes,
    );

    const serviceInput: ContentTypes.Payload.Service.RemoveProfile.Input = {
      account: identity.scope.service ? account ?? identity.sub : identity.sub,
    };

    const service = await this.removeProfileService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
    };
  }
}
