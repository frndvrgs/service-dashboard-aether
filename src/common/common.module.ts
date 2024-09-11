import { Module } from "@nestjs/common";
import { EncryptionService } from "./services/encryption.service";
import { StatusService } from "./services/status.service";
import { SessionService } from "./services/session.service";

@Module({
  providers: [EncryptionService, StatusService, SessionService],
  exports: [StatusService, SessionService, EncryptionService],
})
export class CommonModule {}
