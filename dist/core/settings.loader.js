"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSettings = void 0;
const config_1 = require("@nestjs/config");
const settings_service_1 = require("./settings.service");
const loadSettings = () => {
    const configService = new config_1.ConfigService();
    return new settings_service_1.SettingsService(configService);
};
exports.loadSettings = loadSettings;
