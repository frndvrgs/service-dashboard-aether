import { Entity, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectType, InputType, Field, ID } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";
import { SubscriptionEntity } from "../../domain/subscription.entity";
import { Status } from "../../../../common/interface/common.model";

@ObjectType()
@Entity({ schema: "account_data_schema", name: "subscription" })
export class Subscription implements Partial<SubscriptionEntity> {
  @Field(() => ID)
  @Column("uuid")
  id_subscription!: string;

  @Field(() => ID)
  @Column("uuid")
  id_account!: string;

  @Field()
  @CreateDateColumn()
  created_at!: Date;

  @Field()
  @UpdateDateColumn()
  updated_at!: Date;

  @Field()
  @Column()
  type!: string;

  @Field()
  @Column()
  status!: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  @Column({ type: "jsonb", default: "{}" })
  document?: Record<string, any>;
}

@InputType()
export class CreateSubscriptionInput {
  @Field()
  @IsString()
  type!: string;

  @Field()
  @IsString()
  status!: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  @Column({ type: "jsonb", default: "{}" })
  document?: Record<string, any>;
}

@InputType()
export class UpdateSubscriptionInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  type?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  status?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  @Column({ type: "jsonb", default: "{}" })
  document?: Record<string, any>;
}

@ObjectType()
export class SubscriptionResponse {
  @Field(() => Status)
  status!: Status;

  @Field(() => Subscription, { nullable: true })
  output?: Subscription;
}

@ObjectType()
export class SubscriptionsResponse {
  @Field(() => Status)
  status!: Status;

  @Field(() => [Subscription], { nullable: true })
  output?: Subscription[];
}
