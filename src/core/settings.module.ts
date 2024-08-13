import { Module, Global } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SettingsService } from "./settings.service";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
  ],
  providers: [SettingsService],
  exports: [SettingsService, ConfigModule],
})
export class SettingsModule {}
