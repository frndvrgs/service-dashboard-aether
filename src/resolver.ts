import { Resolver, Query } from "@nestjs/graphql";

@Resolver()
export class ExampleResolver {
  @Query(() => String)
  hello(): string {
    return "Hello World!";
  }
}
