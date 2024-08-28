import { Entity, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectType, InputType, Field, ID } from "@nestjs/graphql";
import { IsEmail, IsOptional, IsString } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";
import { SubscriptionEntity } from "../../domain/subscription.entity";
import { StatusOutput } from "../../../../common/interface/common.model";

@ObjectType()
@Entity({ schema: "account_data_schema", name: "subscription" })
export class Subscription implements Partial<SubscriptionEntity> {
  @Field(() => ID, { name: "id_subscription" })
  @Column("uuid", { name: "id_subscription" })
  idSubscription!: string;

  @Field(() => ID, { name: "id_account" })
  @Column("uuid", { name: "id_account" })
  idAccount!: string;

  @Field({ name: "created_at" })
  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @Field({ name: "updated_at" })
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @Field()
  @Column()
  type!: string;

  @Field()
  @Column()
  status!: string;

  @Field(() => GraphQLJSONObject)
  @Column({ type: "jsonb", default: "{}" })
  document!: string;
}

@InputType()
export class CreateSubscriptionInput {
  @Field()
  @IsEmail()
  type!: string;

  @Field()
  @IsString()
  status!: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  document?: string;
}

@InputType()
export class UpdateSubscriptionInput {
  @Field()
  @IsOptional()
  @IsEmail()
  type?: string;

  @Field()
  @IsOptional()
  @IsString()
  status?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  document?: string;
}

@ObjectType()
export class SubscriptionOutput {
  @Field(() => StatusOutput)
  status!: StatusOutput;

  @Field(() => Subscription, { nullable: true })
  output?: Subscription;
}

@ObjectType()
export class SubscriptionsOutput {
  @Field(() => StatusOutput)
  status!: StatusOutput;

  @Field(() => [Subscription], { nullable: true })
  output?: Subscription[];
}
