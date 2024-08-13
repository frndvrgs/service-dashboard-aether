// settings.loader.ts
import { ConfigService } from "@nestjs/config";
import { SettingsService } from "./settings.service";

export const loadSettings = (): SettingsService => {
  const configService = new ConfigService();
  return new SettingsService(configService);
};
