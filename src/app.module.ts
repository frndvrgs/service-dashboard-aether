import { Module } from "@nestjs/common";
import { SettingsModule } from "./core/settings.module";
import { DatabaseModule } from "./core/services/database/database.module";
import { GraphqlModule } from "./core/services/graphql/graphql.module";
import { AccountModule } from "./modules/account/account.module";

@Module({
  imports: [SettingsModule, GraphqlModule, DatabaseModule, AccountModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
