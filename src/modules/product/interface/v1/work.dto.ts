import { Entity, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectType, InputType, Field, ID } from "@nestjs/graphql";
import { IsOptional, IsString, IsNumber } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";
import { Status } from "../../../../common/interface/common.model";

import { WorkEntity } from "../../domain/work.entity";

@ObjectType()
@Entity({ schema: "product_read_schema", name: "work" })
export class Work implements Partial<WorkEntity> {
  @Field(() => ID)
  @Column("uuid")
  id_work!: string;

  @Field(() => ID)
  @Column("uuid")
  id_feature!: string;

  @Field(() => ID)
  @Column("uuid")
  id_account!: string;

  @Field()
  @Column()
  id_repository!: string;

  @Field({ nullable: true })
  @Column()
  id_pull_request?: string;

  @Field()
  @CreateDateColumn()
  created_at!: Date;

  @Field()
  @UpdateDateColumn()
  updated_at!: Date;

  @Field()
  @Column()
  name!: string;

  @Field({ nullable: true })
  repository_name?: string;

  @Field({ nullable: true })
  pull_request_name?: string;

  @Field()
  @Column()
  process_type!: string;

  @Field({ defaultValue: "idle" })
  @Column()
  process_status!: string;

  @Field({ defaultValue: false })
  @Column({ type: "boolean" })
  has_code_dump!: boolean;

  @Field({ defaultValue: 0 })
  @Column("numeric", { precision: 5, scale: 2 })
  level!: number;

  @Field(() => GraphQLJSONObject)
  @Column({ type: "jsonb", default: "{}" })
  document!: Record<string, any>;
}

@InputType()
export class CreateWorkInput {
  @Field()
  @IsString()
  id_repository!: string;

  @Field({ nullable: true })
  @IsOptional()
  @Column()
  id_pull_request?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  pull_request_name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  repository_name?: string;

  @Field()
  @IsString()
  name!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  level?: number;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  @Column({ type: "jsonb", default: "{}" })
  document?: Record<string, any>;
}

@InputType()
export class UpdateWorkInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  process_type?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  level?: number;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  @Column({ type: "jsonb", default: "{}" })
  document?: Record<string, any>;
}

@ObjectType()
export class WorkResponse {
  @Field(() => Status)
  status!: Status;

  @Field(() => Work, { nullable: true })
  output?: Work;
}

@ObjectType()
export class WorksResponse {
  @Field(() => Status)
  status!: Status;

  @Field(() => [Work], { nullable: true })
  output?: Work[];
}
