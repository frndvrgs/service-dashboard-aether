import { Field, ObjectType, InputType, ID } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";

@ObjectType()
export class AccountType {
  @Field(() => ID)
  idAccount!: string;

  @Field()
  email!: string;

  @Field()
  scope!: string;

  @Field(() => GraphQLJSONObject)
  document!: Record<string, any>;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@InputType()
export class CreateAccountInput {
  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field({ nullable: true })
  scope?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  document?: Record<string, any>;
}

@InputType()
export class UpdateAccountInput {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  document?: Record<string, any>;
}
