import { Observable } from "rxjs";

import { ProductTypes } from "../product/product.types";

export interface AuditClient {
  dumpSourceCode(
    input: ProductTypes.Payload.Service.Audit.DumpSourceCodeRequest,
  ): Observable<ProductTypes.Payload.Service.Audit.DumpSourceCodeResponse>;
  analyzeSourceCode(
    input: ProductTypes.Payload.Service.Audit.AnalyzeSourceCodeRequest,
  ): Observable<ProductTypes.Payload.Service.Audit.AnalyzeSourceCodeResponse>;
  analyzePullRequest(
    input: ProductTypes.Payload.Service.Audit.AnalyzePullRequestRequest,
  ): Observable<ProductTypes.Payload.Service.Audit.AnalyzePullRequestResponse>;
  watchPullRequests(
    input: ProductTypes.Payload.Service.Audit.WatchPullRequestsRequest,
  ): Observable<ProductTypes.Payload.Service.Audit.WatchPullRequestsResponse>;
  interruptProcess(
    input: ProductTypes.Payload.Service.Audit.InterruptProcessRequest,
  ): Observable<ProductTypes.Payload.Service.Audit.InterruptProcessResponse>;
}
