import { Module } from "@nestjs/common";
import { CommonModule } from "../../common/common.module";

import { AccountRepository } from "./repositories/account.repository";
import { SubscriptionRepository } from "./repositories/subscription.repository";

import { AccountResolver } from "./resolvers/account.resolver";
import { SessionController } from "./controllers/session.controller";
import { AccountController } from "./controllers/account.controller";
import { SubscriptionResolver } from "./resolvers/subscription.resolver";

import * as account from "./services/account";
import * as session from "./services/session";
import * as subscription from "./services/subscription";

@Module({
  imports: [CommonModule],
  controllers: [SessionController, AccountController],
  providers: [
    AccountRepository,
    SubscriptionRepository,
    AccountResolver,
    SubscriptionResolver,
    // account
    account.ListAccountsService,
    account.ReadAccountService,
    account.UpsertAccountService,
    account.UpdateAccountService,
    account.RemoveAccountService,
    // session
    session.CreateSessionService,
    // subscription
    subscription.ListSubscriptionsService,
    subscription.ReadSubscriptionService,
    subscription.CreateSubscriptionService,
    subscription.UpdateSubscriptionService,
    subscription.RemoveSubscriptionService,
  ],
  exports: [AccountRepository, SubscriptionRepository],
})
export class AccountModule {}
