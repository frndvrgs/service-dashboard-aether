import { Entity, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectType, InputType, Field, ID } from "@nestjs/graphql";
import { IsEmail, IsOptional, IsString } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";
import { HttpStatusModel } from "../../../../common/interface/common.model";

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

  @Field({ nullable: true })
  @Column()
  email!: string;

  @Field({ nullable: true })
  @Column({ default: "user" })
  scope!: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Column({ type: "jsonb", default: "{}" })
  document!: Record<string, any>;
}

@InputType()
export class CreateAccountInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  password!: string;
}

@InputType()
export class UpdateAccountInput {
  @Field()
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field()
  @IsOptional()
  @IsString()
  password?: string;
}

@ObjectType()
export class AccountOutput {
  @Field(() => HttpStatusModel)
  status!: HttpStatusModel;

  @Field(() => Account, { nullable: true })
  output?: Account;
}

@ObjectType()
export class AccountsOutput {
  @Field(() => HttpStatusModel)
  status!: HttpStatusModel;

  @Field(() => [Account], { nullable: true })
  output?: Account[];
}
