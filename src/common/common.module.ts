import { Module } from "@nestjs/common";
import { StatusHandler } from "./handlers/status.handler";
import { SessionHandler } from "./handlers/session.handler";

@Module({
  providers: [StatusHandler, SessionHandler],
  exports: [StatusHandler, SessionHandler],
})
export class CommonModule {}
