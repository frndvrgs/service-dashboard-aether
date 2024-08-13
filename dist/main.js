"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_loader_1 = require("./core/settings.loader");
const logger_1 = require("./common/helpers/logger");
const web_server_service_1 = require("./core/services/web-server/web-server.service");
class Application {
    async start() {
        try {
            const settings = (0, settings_loader_1.loadSettings)();
            logger_1.logger.info(`:: ${settings.app.name}`);
            await web_server_service_1.webServer.start();
        }
        catch (err) {
            logger_1.logger.error(`:: error starting the application.`);
            process.exit(1);
        }
    }
    async stop() {
        try {
            await web_server_service_1.webServer.stop();
            process.exit(0);
        }
        catch (err) {
            logger_1.logger.error(`:: error stopping the application.`);
            process.exit(1);
        }
    }
}
const run = async () => {
    const application = new Application();
    await application.start();
    process.on("SIGTERM", async () => {
        await application.stop();
    });
    process.on("SIGINT", async () => {
        await application.stop();
    });
};
process.stdout.setEncoding("utf8");
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
});
run();
