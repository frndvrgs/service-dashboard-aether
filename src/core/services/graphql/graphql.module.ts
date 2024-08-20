import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { MercuriusDriver } from "@nestjs/mercurius";
import { join } from "path";

import type { MercuriusDriverConfig } from "@nestjs/mercurius";

@Module({
  imports: [
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: join(
        process.cwd(),
        "src/core/services/graphql/schema.gql",
      ),
      graphiql: false,
      sortSchema: true,
      path: "api/v1/graphql",
    }),
  ],
})
export class GraphqlModule {}
