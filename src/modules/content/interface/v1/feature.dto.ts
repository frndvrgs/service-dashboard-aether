import { Entity, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectType, InputType, Field, ID } from "@nestjs/graphql";
import { IsOptional, IsString, IsArray, ArrayNotEmpty } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";
import { StatusOutput } from "../../../../common/interface/common.model";

import { FeatureEntity } from "../../domain/feature.entity";

@ObjectType()
@Entity({ schema: "content_read_schema", name: "feature" })
export class Feature implements Partial<FeatureEntity> {
  @Field(() => ID, { name: "id_feature", nullable: true })
  @Column("uuid", { name: "id_feature" })
  idFeature!: string;

  @Field({ name: "created_at", nullable: true })
  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @Field({ name: "updated_at", nullable: true })
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @Field({ nullable: true })
  @Column()
  name!: string;

  @Field(() => [String], { nullable: true })
  @Column("text", { array: true })
  subscriptionScope!: string[];

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Column({ type: "jsonb", default: "{}" })
  document!: Record<string, any>;
}

@InputType()
export class CreateFeatureInput {
  @Field()
  @IsString()
  name!: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  subscriptionScope!: string[];
}

@InputType()
export class UpdateFeatureInput {
  @Field()
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subscriptionScope?: string[];
}

@ObjectType()
export class FeatureOutput {
  @Field(() => StatusOutput)
  status!: StatusOutput;

  @Field(() => Feature, { nullable: true })
  output?: Feature;
}

@ObjectType()
export class FeaturesOutput {
  @Field(() => StatusOutput)
  status!: StatusOutput;

  @Field(() => [Feature], { nullable: true })
  output?: Feature[];
}
