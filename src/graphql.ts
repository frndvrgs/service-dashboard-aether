import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class Query {
  @Field(() => String)
  hello!: string;
}
