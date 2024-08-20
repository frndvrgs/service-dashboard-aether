import { ObjectType, Field, Int } from "@nestjs/graphql";

import type { CommonTypes } from "@types";

@ObjectType()
export class StatusModel {
  @Field(() => String, { nullable: true })
  description?: CommonTypes.DescriptionCodes;

  @Field(() => String, { nullable: true })
  code!: CommonTypes.StatusCodes;

  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => String, { nullable: true })
  detail?: string;

  @Field(() => String, { nullable: true })
  context?: string;

  @Field(() => String, { nullable: true })
  scope?: string;
}

@ObjectType()
export class HttpStatusModel {
  @Field(() => String, { nullable: true })
  type?: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Int, { nullable: true })
  code?: number;

  @Field(() => String, { nullable: true })
  context?: string | null;

  @Field(() => String, { nullable: true })
  scope?: string | null;

  @Field(() => String, { nullable: true })
  message?: string | null;

  @Field(() => String, { nullable: true })
  detail?: string | null;
}
