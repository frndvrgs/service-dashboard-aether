import { Entity, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectType, InputType, Field, ID } from "@nestjs/graphql";
import { IsEmail, IsOptional, IsArray, IsString } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";
import { StatusOutput } from "../../../../common/interface/common.model";

import { AccountEntity } from "../../domain/account.entity";

@ObjectType()
@Entity({ schema: "account_read_schema", name: "account" })
export class Account implements Partial<AccountEntity> {
  @Field(() => ID, { name: "id_account", nullable: true })
  @Column("uuid", { name: "id_account" })
  idAccount!: string;

  @Field({ name: "created_at", nullable: true })
  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @Field({ name: "updated_at", nullable: true })
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @Field(() => [String], { nullable: true })
  @Column("text", { array: true })
  email!: string[];

  @Field({ nullable: true })
  @Column({ default: "user" })
  scope!: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Column({ type: "jsonb", default: "{}" })
  document!: Record<string, any>;
}

@InputType()
export class UpsertAccountInput {
  @Field(() => [String])
  @IsString()
  email!: string;

  @Field(() => GraphQLJSONObject)
  @Column({ type: "jsonb", default: "{}" })
  details!: Record<string, any>;
}

@InputType()
export class UpdateAccountInput {
  @Field()
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  email?: string;

  @Field(() => GraphQLJSONObject)
  @Column({ type: "jsonb", default: "{}" })
  details?: Record<string, any>;
}

@ObjectType()
export class AccountOutput {
  @Field(() => StatusOutput)
  status!: StatusOutput;

  @Field(() => Account, { nullable: true })
  output?: Account;
}

@ObjectType()
export class AccountsOutput {
  @Field(() => StatusOutput)
  status!: StatusOutput;

  @Field(() => [Account], { nullable: true })
  output?: Account[];
}
