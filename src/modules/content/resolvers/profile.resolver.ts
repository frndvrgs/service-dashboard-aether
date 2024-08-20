import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { UseFilters, ParseUUIDPipe } from "@nestjs/common";
import { queryTools } from "../../../common/interface/v1/helpers/query-tools";
import { OptionsInput } from "../../../common/interface/v1/common.dto";
import { StatusHandler } from "../../../common/handlers/status.handler";
import { AppExceptionFilter } from "../../../common/filters/app.exception.filter";
import {
  Profile,
  CreateProfileInput,
  UpdateProfileInput,
  ProfileOutput,
  ProfilesOutput,
} from "../interface/v1/profile.dto";

import * as services from "../services/profile";

@Resolver(() => Profile)
@UseFilters(AppExceptionFilter)
export class ProfileResolver {
  private queryOptionsHelper: ReturnType<
    typeof queryTools.createQueryOptionsHelper<Profile>
  >;

  constructor(
    private status: StatusHandler,
    private listProfilesService: services.ListProfilesService,
    private readProfileService: services.ReadProfileService,
    private createProfileService: services.CreateProfileService,
    private updateProfileService: services.UpdateProfileService,
    private removeProfileService: services.RemoveProfileService,
  ) {
    const allowedSelectFields: (keyof Profile)[] = [
      "idProfile",
      "username",
      "name",
      "createdAt",
      "updatedAt",
    ];
    this.queryOptionsHelper =
      queryTools.createQueryOptionsHelper<Profile>(allowedSelectFields);
  }

  @Query(() => ProfilesOutput)
  async listProfiles(
    @Args("options", { nullable: true }) options?: OptionsInput,
  ): Promise<ProfilesOutput> {
    const serviceInput = {
      options: this.queryOptionsHelper.mapQueryOptions(options),
    };
    const service = await this.listProfilesService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Query(() => ProfileOutput, { nullable: true })
  async readProfile(
    @Args("options", { nullable: false }) options: OptionsInput,
  ): Promise<ProfileOutput> {
    const serviceInput = {
      options: this.queryOptionsHelper.mapQueryOptions(options),
    };
    const service = await this.readProfileService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => ProfileOutput)
  async createProfile(
    @Args("account", { type: () => ID }, ParseUUIDPipe) account: string,
    @Args("input") input: CreateProfileInput,
  ): Promise<ProfileOutput> {
    const serviceInput = {
      account,
      input,
    };
    const service = await this.createProfileService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => ProfileOutput)
  async updateProfile(
    @Args("profile", { type: () => ID }, ParseUUIDPipe) profile: string,
    @Args("input") input: UpdateProfileInput,
  ): Promise<ProfileOutput> {
    const serviceInput = {
      profile,
      input,
    };
    const service = await this.updateProfileService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
      output: service.output,
    };
  }

  @Mutation(() => ProfileOutput)
  async removeProfile(
    @Args("profile", { type: () => ID }, ParseUUIDPipe) profile: string,
  ): Promise<ProfileOutput> {
    const serviceInput = {
      profile,
    };
    const service = await this.removeProfileService.execute(serviceInput);
    return {
      status: this.status.createHttpStatus(service.status),
    };
  }
}
