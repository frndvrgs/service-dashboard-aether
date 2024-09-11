import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { SettingsModule } from "./core/services/settings/settings.module";
import { DatabaseModule } from "./core/services/database/database.module";
import { GraphqlModule } from "./core/services/graphql/graphql.module";
import { CommonModule } from "./common/common.module";
import { AccountModule } from "./modules/account/account.module";
import { AuditModule } from "./modules/audit/audit.module";
import { ProductModule } from "./modules/product/product.module";
import { ContentModule } from "./modules/content/content.module";

@Module({
  imports: [
    SettingsModule,
    DatabaseModule,
    GraphqlModule,
    CommonModule,
    AuditModule,
    AccountModule,
    ContentModule,
    ProductModule,
    RouterModule.register([
      {
        path: "api",
        children: [
          {
            path: "v1",
            module: AccountModule,
          },
          {
            path: "v1",
            module: ContentModule,
          },
          {
            path: "v1",
            module: ProductModule,
          },
        ],
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
