import { Injectable, Inject, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { logger } from "../../common/helpers/logger";

import type { AuditClient } from "./audit.interface";
import type { ProductTypes } from "../product/product.types";

@Injectable()
export class AuditService implements OnModuleInit {
  private auditServiceClient!: AuditClient;

  constructor(
    @Inject("AUDIT_PACKAGE")
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.auditServiceClient =
      this.client.getService<AuditClient>("AuditService");
    if (!this.auditServiceClient) logger.error("grpc client not initialized.");
    logger.info(":: grpc client initialized.");
  }

  dumpSourceCode(
    request: ProductTypes.Payload.Service.Audit.DumpSourceCodeRequest,
  ): Observable<ProductTypes.Payload.Service.Audit.DumpSourceCodeResponse> {
    return this.auditServiceClient.dumpSourceCode(request);
  }

  analyzeSourceCode(
    request: ProductTypes.Payload.Service.Audit.AnalyzeSourceCodeRequest,
  ): Observable<ProductTypes.Payload.Service.Audit.AnalyzeSourceCodeResponse> {
    return this.auditServiceClient.analyzeSourceCode(request);
  }

  watchPullRequests(
    request: ProductTypes.Payload.Service.Audit.WatchPullRequestsRequest,
  ): Observable<ProductTypes.Payload.Service.Audit.WatchPullRequestsResponse> {
    return this.auditServiceClient.watchPullRequests(request);
  }

  interruptProcess(
    request: ProductTypes.Payload.Service.Audit.InterruptProcessRequest,
  ): Observable<ProductTypes.Payload.Service.Audit.InterruptProcessResponse> {
    return this.auditServiceClient.interruptProcess(request);
  }
}
