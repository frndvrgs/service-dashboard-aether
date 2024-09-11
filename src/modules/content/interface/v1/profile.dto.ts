import { Entity, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ObjectType, InputType, Field, ID } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";
import { Status } from "../../../../common/interface/common.model";

import { ProfileEntity } from "../../domain/profile.entity";

@ObjectType()
@Entity({ schema: "content_read_schema", name: "profile" })
export class Profile implements Partial<ProfileEntity> {
  @Field(() => ID)
  @Column("uuid")
  id_profile!: string;

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
  username!: string;

  @Field({ nullable: true })
  @Column()
  name?: string;

  @Field(() => GraphQLJSONObject)
  @Column({ type: "jsonb", default: "{}" })
  document!: Record<string, any>;
}

@InputType()
export class CreateProfileInput {
  @Field(() => GraphQLJSONObject)
  @Column({ type: "jsonb", default: "{}" })
  document!: Record<string, any>;
}

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  username?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @IsOptional()
  @Column({ type: "jsonb", default: "{}" })
  document?: Record<string, any>;
}

@ObjectType()
export class ProfileResponse {
  @Field(() => Status)
  status!: Status;

  @Field(() => Profile, { nullable: true })
  output?: Profile;
}

@ObjectType()
export class ProfilesResponse {
  @Field(() => Status)
  status!: Status;

  @Field(() => [Profile], { nullable: true })
  output?: Profile[];
}
