import { Module } from "@nestjs/common";
import { CommonModule } from "../../common/common.module";

import { WorkRepository } from "./repositories/work.repository";
import { AccountRepository } from "../account/repositories/account.repository";
import { SubscriptionRepository } from "../account/repositories/subscription.repository";
import { FeatureRepository } from "../content/repositories/feature.repository";

import { WorkResolver } from "./resolvers/work.resolver";

import * as work from "./services/work";

@Module({
  imports: [CommonModule],
  providers: [
    WorkRepository,
    WorkResolver,
    AccountRepository,
    SubscriptionRepository,
    FeatureRepository,
    // work
    work.ListWorksService,
    work.ReadWorkService,
    work.CreateWorkService,
    work.UpdateWorkService,
    work.RemoveWorkService,
  ],
  exports: [WorkRepository],
})
export class ProductModule {}
