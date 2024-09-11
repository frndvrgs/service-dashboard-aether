import {
  ObjectType,
  Field,
  InputType,
  Int,
  registerEnumType,
} from "@nestjs/graphql";
import { Status } from "../common.model";

// # GraphQL Schema Documentation

// ## Enums

// ### WhereOperator

// Enum representing various operators for where conditions:

// - `EQ`: Equal to. Matches values that are exactly equal to the specified value.
//   Example: `{ field: "age", operator: EQ, value: "30" }` matches records where age is exactly 30.

// - `LIKE`: Case-sensitive pattern matching. Uses SQL LIKE syntax with % as wildcard.
//   Example: `{ field: "name", operator: LIKE, value: "John%" }` matches records where name starts with "John".

// - `ILIKE`: Case-insensitive pattern matching. Similar to LIKE but ignores case.
//   Example: `{ field: "email", operator: ILIKE, value: "%@gmail.com" }` matches any email ending with "@gmail.com", regardless of case.

// - `LT`: Less than. Matches values that are less than the specified value.
//   Example: `{ field: "price", operator: LT, value: "100" }` matches records where price is less than 100.

// - `LTE`: Less than or equal to. Matches values that are less than or equal to the specified value.
//   Example: `{ field: "quantity", operator: LTE, value: "5" }` matches records where quantity is 5 or less.

// - `GT`: Greater than. Matches values that are greater than the specified value.
//   Example: `{ field: "age", operator: GT, value: "18" }` matches records where age is greater than 18.

// - `GTE`: Greater than or equal to. Matches values that are greater than or equal to the specified value.
//   Example: `{ field: "rating", operator: GTE, value: "4" }` matches records where rating is 4 or higher.

// - `IN`: Matches any of the values in a specified list.
//   Example: `{ field: "status", operator: IN, value: "['active', 'pending']" }` matches records where status is either 'active' or 'pending'.

// - `IS_NULL`: Checks if a field is null.
//   Example: `{ field: "deletedAt", operator: IS_NULL }` matches records where deletedAt is null.

// - `NOT`: Negates the condition that follows it.
//   Example: `{ field: "category", operator: NOT, value: "electronics" }` matches records where category is not 'electronics'.

// - `ARRAY_CONTAINS`: Checks if an array field contains the specified value.
//   Example: `{ field: "tags", operator: ARRAY_CONTAINS, value: "urgent" }` matches records where the tags array includes 'urgent'.

// - `ARRAY_CONTAINS_LIKE`: Checks if an array field contains a value matching the specified pattern (case-sensitive).
//   Example: `{ field: "keywords", operator: ARRAY_CONTAINS_LIKE, value: "%important%" }` matches records where any keyword contains 'important'.

// Note: The exact behavior of these operators may depend on the underlying database and ORM implementation. Always refer to your specific system's documentation for precise details.

// ## Input Types

// ### WhereInput

// Input type for specifying a single where condition.

// | Field | Type | Description |
// |-------|------|-------------|
// | `field` | `String` | The field to apply the condition to. |
// | `operator` | `WhereOperator` | The operator to use for the condition. |
// | `value` | `String` | The value to compare against. |
// | `conditions` | `[WhereInput]` | Nested conditions for complex queries. |

// ### OrderInput

// Input type for specifying ordering of results.

// | Field | Type | Description |
// |-------|------|-------------|
// | `field` | `String!` | The field to order by. |
// | `direction` | `String!` | The direction of the ordering (ASC or DESC). |
// | `nulls` | `String` | How to handle null values in ordering (NULLS FIRST or NULLS LAST). |

// ### OptionsInput

// Input type for specifying various query options.

// | Field | Type | Description |
// |-------|------|-------------|
// | `where` | `[WhereInput]` | An array of where conditions to filter the results. |
// | `order` | `[OrderInput]` | An array of order inputs to specify the ordering of results. |
// | `relations` | `[String]` | An array of relation names to include in the query. |
// | `select` | `[String]` | An array of field names to select in the query. |
// | `skip` | `Int` | Number of items to skip (for pagination). |
// | `take` | `Int` | Number of items to take (for pagination). |
// | `withDeleted` | `Boolean` | Whether to include soft-deleted items in the query. |
// | `cache` | `Boolean` | Whether to use query caching. |

// ## Examples

// ### listProfiles

// This query demonstrates how to use the OptionsInput to filter, sort, and paginate results.

// ```graphql
// listProfiles(options: OptionsInput): [Account!]!
// query {
//   listProfiles(options: {
//     where: [
//       { field: "name", operator: LIKE, value: "%John%" },
//       { field: "age", operator: GTE, value: "18" },
//       { field: "tags", operator: ARRAY_CONTAINS, value: "important" }
//     ],
//     order: [
//       { field: "created_at", direction: "DESC" }
//     ],
//     relations: ["profile"],
//     select: ["id", "name", "email", "tags"],
//     skip: 0,
//     take: 10,
//     withDeleted: false,
//     cache: true
//   }) {
//     id_account
//     name
//     email
//     tags
//     profile {
//       id
//       bio
//     }
//   }
// }

enum WhereOperator {
  EQ = "EQ",
  LIKE = "LIKE",
  ILIKE = "ILIKE",
  LT = "LT",
  LTE = "LTE",
  GT = "GT",
  GTE = "GTE",
  IN = "IN",
  IS_NULL = "IS_NULL",
  NOT = "NOT",
  ARRAY_CONTAINS = "ARRAY_CONTAINS",
  ARRAY_CONTAINS_LIKE = "ARRAY_CONTAINS_LIKE",
}

registerEnumType(WhereOperator, {
  name: "WhereOperator",
  description: "Operators for where conditions",
});

@InputType()
export class WhereInput {
  @Field(() => String, { nullable: true })
  field?: string;

  @Field(() => WhereOperator, { nullable: true })
  operator?: `${WhereOperator}`;

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

@ObjectType()
export class StatusResponse {
  @Field(() => Status)
  status!: Status;
}
