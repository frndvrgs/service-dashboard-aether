import { Module } from "@nestjs/common";
import { AccountRepository } from "./account.repository";
import { AccountResolver } from "./account.resolver";
import { CreateAccountService } from "./services/create-account.service";
import { ReadAccountService } from "./services/read-account.service";
import { UpdateAccountService } from "./services/update-account.service";

@Module({
  providers: [
    AccountRepository,
    AccountResolver,
    ReadAccountService,
    CreateAccountService,
    UpdateAccountService,
  ],
  exports: [AccountRepository],
})
export class AccountModule {}
