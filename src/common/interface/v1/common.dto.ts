import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class WhereInput {
  @Field(() => String, { nullable: true })
  field?: string;

  @Field(() => String, { nullable: true })
  operator?: string;

  @Field(() => String, { nullable: true })
  value?: string;

  @Field(() => [WhereInput], { nullable: true })
  conditions?: WhereInput[];
}

@InputType()
export class OrderInput {
  @Field(() => String)
  field!: string;

  @Field(() => String)
  direction!: "ASC" | "DESC";

  @Field(() => String, { nullable: true })
  nulls?: "NULLS FIRST" | "NULLS LAST";
}

@InputType()
export class OptionsInput {
  @Field(() => [WhereInput], { nullable: true })
  where?: WhereInput[];

  @Field(() => [OrderInput], { nullable: true })
  order?: OrderInput[];

  @Field(() => [String], { nullable: true })
  relations?: string[];

  @Field(() => [String], { nullable: true })
  select?: string[];

  @Field(() => Int, { nullable: true })
  skip?: number;

  @Field(() => Int, { nullable: true })
  take?: number;

  @Field(() => Boolean, { nullable: true })
  withDeleted?: boolean;

  @Field(() => Boolean, { nullable: true })
  cache?: boolean;
}
