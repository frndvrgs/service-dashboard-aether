import { Entity, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectType, InputType, Field, ID } from "@nestjs/graphql";
import { IsEmail, IsOptional, IsString } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";
import { Status } from "../../../../common/interface/common.model";

import { AccountEntity } from "../../domain/account.entity";

@ObjectType()
@Entity({ schema: "account_read_schema", name: "account" })
export class Account implements Partial<AccountEntity> {
  @Field(() => ID)
  @Column("uuid")
  id_account!: string;

  @Field()
  @CreateDateColumn()
  created_at!: Date;

  @Field()
  @UpdateDateColumn()
  updated_at!: Date;

  @Field(() => [String])
  @Column("text", { array: true })
  email!: string[];

  @Field()
  @Column({ default: "user" })
  scope!: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  @Column({ type: "jsonb", default: "{}" })
  document?: Record<string, any>;

  @Field(() => Boolean)
  @Column({
    type: "boolean",
    generatedType: "STORED",
    asExpression: "github_token IS NOT NULL",
  })
  has_github_token!: boolean;
}

@InputType()
export class UpsertAccountInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  scope?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  @Column({ type: "jsonb", default: "{}" })
  document?: Record<string, any>;
}

@InputType()
export class UpdateAccountInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  github_token?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  scope?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  @Column({ type: "jsonb", default: "{}" })
  document?: Record<string, any>;
}

@ObjectType()
export class AccountResponse {
  @Field(() => Status)
  status!: Status;

  @Field(() => Account, { nullable: true })
  output?: Account;
}

@ObjectType()
export class AccountsResponse {
  @Field(() => Status)
  status!: Status;

  @Field(() => [Account], { nullable: true })
  output?: Account[];
}
