import { loadSettings } from "./core/services/settings/settings.loader";
import { logger } from "./common/helpers/logger";

import { webServer } from "./core/services/web-server/web-server.service";

/**
 * service-dashboard-aether
 * @author frndvrgs <contact@frndvrgs.com>
 *
 */

class Application {
  async start() {
    try {
      const settings = loadSettings();
      logger.info(`:: ${settings.app.name}`);
      await webServer.start();
    } catch (err) {
      logger.error(`:: error starting the application.`);
      process.exit(1);
    }
  }

  async stop() {
    try {
      await webServer.stop();
      process.exit(0);
    } catch (err) {
      logger.error(`:: error stopping the application.`);
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
