import { ObjectType, Field, Int, registerEnumType } from "@nestjs/graphql";
import { DescriptionCodes, StatusCodes } from "../constants";

registerEnumType(DescriptionCodes, {
  name: "DescriptionCodes",
});

registerEnumType(StatusCodes, {
  name: "StatusCodes",
});

@ObjectType()
export class StatusModel {
  @Field(() => DescriptionCodes, { nullable: true })
  description?: keyof typeof DescriptionCodes;

  @Field(() => StatusCodes, { nullable: true })
  code!: StatusCodes;

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
export class Status {
  @Field(() => String, { nullable: true })
  type?: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => DescriptionCodes, { nullable: true })
  description?: DescriptionCodes;

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

  @Field({ defaultValue: false })
  isError?: boolean;
}
