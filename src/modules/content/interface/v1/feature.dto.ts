import { Entity, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectType, InputType, Field, ID } from "@nestjs/graphql";
import { IsOptional, IsString, IsArray, ArrayNotEmpty } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";
import { Status } from "../../../../common/interface/common.model";

import { FeatureEntity } from "../../domain/feature.entity";

@ObjectType()
@Entity({ schema: "content_read_schema", name: "feature" })
export class Feature implements Partial<FeatureEntity> {
  @Field(() => ID)
  @Column("uuid")
  id_feature!: string;

  @Field()
  @CreateDateColumn()
  created_at!: Date;

  @Field()
  @UpdateDateColumn()
  updated_at!: Date;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  process_type!: string;

  @Field(() => [String])
  @Column("text", { array: true })
  subscription_scope!: string[];

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  @Column({ type: "jsonb", default: "{}" })
  document?: Record<string, any>;
}

@InputType()
export class CreateFeatureInput {
  @Field()
  @IsString()
  name!: string;

  @Field()
  @IsString()
  process_type!: string;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  subscription_scope!: string[];

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  @Column({ type: "jsonb", default: "{}" })
  document?: Record<string, any>;
}

@InputType()
export class UpdateFeatureInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  process_type?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subscription_scope?: string[];

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  @Column({ type: "jsonb", default: "{}" })
  document?: Record<string, any>;
}

@ObjectType()
export class FeatureResponse {
  @Field(() => Status)
  status!: Status;

  @Field(() => Feature, { nullable: true })
  output?: Feature;
}

@ObjectType()
export class FeaturesResponse {
  @Field(() => Status)
  status!: Status;

  @Field(() => [Feature], { nullable: true })
  output?: Feature[];
}
