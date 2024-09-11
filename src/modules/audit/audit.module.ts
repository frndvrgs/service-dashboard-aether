import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { CommonModule } from "../../common/common.module";
import { AuditService } from "./audit.service";
import { AuditGateway } from "./audit.gateway";
import { join } from "node:path";

@Module({
  imports: [
    CommonModule,
    ClientsModule.registerAsync([
      {
        name: "AUDIT_PACKAGE",
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: "audit",
            protoPath: join(process.cwd(), "proto", "audit.proto"),
            url: `${configService.get("AUDIT_SERVICE_HOST")}:${configService.get("AUDIT_SERVICE_PORT")}`,
            loader: {
              keepCase: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [AuditGateway, AuditService],
  exports: [AuditService, AuditGateway],
})
export class AuditModule {}
