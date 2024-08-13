import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ReadAccountService } from "./services/read-account.service";
import { CreateAccountService } from "./services/create-account.service";
import { UpdateAccountService } from "./services/update-account.service";
import {
  AccountType,
  CreateAccountInput,
  UpdateAccountInput,
} from "./interface/v1/schema.graphql";

@Resolver(() => AccountType)
export class AccountResolver {
  constructor(
    private readAccountService: ReadAccountService,
    private createAccountService: CreateAccountService,
    private updateAccountService: UpdateAccountService,
  ) {}

  @Query(() => AccountType, { nullable: true })
  async getAccountByEmail(@Args("email") email: string) {
    return this.readAccountService.findByEmail(email);
  }

  @Query(() => AccountType, { nullable: true })
  async getAccountById(@Args("idAccount") idAccount: string) {
    return this.readAccountService.findById(idAccount);
  }

  @Mutation(() => AccountType)
  async createAccount(@Args("input") input: CreateAccountInput) {
    return this.createAccountService.create(input);
  }

  @Mutation(() => AccountType)
  async updateAccount(
    @Args("idAccount") idAccount: string,
    @Args("input") input: UpdateAccountInput,
  ) {
    return this.updateAccountService.update(idAccount, input);
  }
}
