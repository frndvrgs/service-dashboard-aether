import { Entity, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectType, InputType, Field, ID } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";
import { StatusOutput } from "../../../../common/interface/common.model";

import { ProfileEntity } from "../../domain/profile.entity";

@ObjectType()
@Entity({ schema: "content_read_schema", name: "profile" })
export class Profile implements Partial<ProfileEntity> {
  @Field(() => ID, { name: "id_profile", nullable: true })
  @Column("uuid", { name: "id_profile" })
  idProfile!: string;

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
  username!: string;

  @Field({ nullable: true })
  @Column()
  name!: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Column({ type: "jsonb", default: "{}" })
  document!: Record<string, any>;
}

@InputType()
export class CreateProfileInput {
  @Field()
  @IsString()
  username!: string;

  @Field()
  @IsOptional()
  @IsString()
  name!: string;
}

@InputType()
export class UpdateProfileInput {
  @Field()
  @IsOptional()
  @IsString()
  username?: string;

  @Field()
  @IsOptional()
  @IsString()
  name?: string;
}

@ObjectType()
export class ProfileOutput {
  @Field(() => StatusOutput)
  status!: StatusOutput;

  @Field(() => Profile, { nullable: true })
  output?: Profile;
}

@ObjectType()
export class ProfilesOutput {
  @Field(() => StatusOutput)
  status!: StatusOutput;

  @Field(() => [Profile], { nullable: true })
  output?: Profile[];
}
