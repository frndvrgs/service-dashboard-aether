import { Module } from "@nestjs/common";
import { CommonModule } from "../../common/common.module";

import { ProfileRepository } from "./repositories/profile.repository";
import { FeatureRepository } from "./repositories/feature.repository";

import { ProfileResolver } from "./resolvers/profile.resolver";
import { FeatureResolver } from "./resolvers/feature.resolver";

import * as profile from "./services/profile";
import * as feature from "./services/feature";

@Module({
  imports: [CommonModule],
  providers: [
    ProfileRepository,
    FeatureRepository,
    ProfileResolver,
    FeatureResolver,
    // profile
    profile.ListProfilesService,
    profile.ReadProfileService,
    profile.CreateProfileService,
    profile.UpdateProfileService,
    profile.RemoveProfileService,
    // feature
    feature.ListFeaturesService,
    feature.ReadFeatureService,
    feature.CreateFeatureService,
    feature.UpdateFeatureService,
    feature.RemoveFeatureService,
  ],
  exports: [ProfileRepository, FeatureRepository],
})
export class ContentModule {}
