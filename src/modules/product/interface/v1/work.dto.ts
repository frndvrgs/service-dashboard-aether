import { Entity, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectType, InputType, Field, ID } from "@nestjs/graphql";
import { IsOptional, IsString, IsNumber } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";
import { HttpStatusModel } from "../../../../common/interface/common.model";

import { WorkEntity } from "../../domain/work.entity";

@ObjectType()
@Entity({ schema: "product_read_schema", name: "work" })
export class Work implements Partial<WorkEntity> {
  @Field(() => ID, { name: "id_work", nullable: true })
  @Column("uuid", { name: "id_work" })
  idWork!: string;

  @Field(() => ID, { name: "id_feature", nullable: true })
  @Column("uuid", { name: "id_feature" })
  idFeature!: string;

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
  name!: string;

  @Field({ nullable: true })
  @Column("numeric", { precision: 5, scale: 2 })
  level!: number;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Column({ type: "jsonb", default: "{}" })
  document!: Record<string, any>;
}

@InputType()
export class CreateWorkInput {
  @Field()
  @IsString()
  name!: string;

  @Field()
  @IsNumber()
  level!: number;
}

@InputType()
export class UpdateWorkInput {
  @Field()
  @IsOptional()
  @IsString()
  name?: string;

  @Field()
  @IsOptional()
  @IsNumber()
  level?: number;
}

@ObjectType()
export class WorkOutput {
  @Field(() => HttpStatusModel)
  status!: HttpStatusModel;

  @Field(() => Work, { nullable: true })
  output?: Work;
}

@ObjectType()
export class WorksOutput {
  @Field(() => HttpStatusModel)
  status!: HttpStatusModel;

  @Field(() => [Work], { nullable: true })
  output?: Work[];
}
