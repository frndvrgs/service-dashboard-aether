import { Injectable } from "@nestjs/common";
import {
  catchError,
  tap,
  finalize,
  throwError,
  firstValueFrom,
  Subscription,
} from "rxjs";
import { AuditService } from "../../../audit/audit.service";
import { AuditGateway } from "../../../audit/audit.gateway";
import { WorkRepository } from "../../repositories/work.repository";
import { SourceRepository } from "../../repositories/source.repository";
import { AppException } from "../../../../common/exceptions/app.exception";

import type { ProductTypes } from "../../product.types";

@Injectable()
export class ProcessWorkService {
  constructor(
    private workRepository: WorkRepository,
    private sourceRepository: SourceRepository,
    private auditService: AuditService,
    private auditGateway: AuditGateway,
  ) {}

  private handleError(id_work: string, error: unknown, command: string) {
    if (error instanceof Error) {
      this.auditGateway.notifyError(
        id_work,
        command,
        "grpc subscription error",
        { message: error.message },
      );
      throw new AppException(
        "INTERNAL_SERVER_ERROR",
        500,
        `${id_work} ${command} error.`,
        error.message,
      );
    }
    throw new AppException(
      "INTERNAL_SERVER_ERROR",
      500,
      `${id_work} ${command} unknown error.`,
      "unknown",
    );
  }

  private async saveSourceCodeDump(
    id_work: string,
    id_repository: string,
    code_dump: string,
    command: string,
  ): Promise<void> {
    try {
      const sourceResource = await this.sourceRepository.read({
        where: {
          id_repository,
        },
      });
      if (!sourceResource) {
        throw new AppException(
          "NOT_FOUND",
          404,
          "source resource not found.",
          id_repository,
        );
      }
      const workResource = await this.workRepository.read({
        where: {
          id_work,
        },
      });
      if (!workResource) {
        throw new AppException(
          "NOT_FOUND",
          404,
          "work resource not found.",
          id_repository,
        );
      }

      sourceResource.code_dump = code_dump;
      workResource.document = {
        ...workResource.document,
        has_code_dump: true,
      };

      await this.sourceRepository.save(sourceResource);
      await this.workRepository.save(workResource);
    } catch (error) {
      this.handleError(id_work, error, command);
    }
  }

  private async formatAndSaveResult(
    id_work: string,
    id_repository: string,
    result: string,
    command: string,
  ): Promise<{ date: string; content: string } | void> {
    try {
      const workResource = await this.workRepository.read({
        where: {
          id_work,
        },
      });
      if (!workResource) {
        throw new AppException(
          "NOT_FOUND",
          404,
          "work resource not found.",
          id_repository,
        );
      }

      const newResult = {
        date: new Date().toISOString(),
        content: result,
      };

      if (!workResource.document) {
        workResource.document = {};
      }

      if (!workResource.document["sourceAnalysis"]) {
        workResource.document["sourceAnalysis"] = [];
      }

      workResource.document["sourceAnalysis"].push(newResult);

      await this.workRepository.save(workResource);
      return newResult;
    } catch (error) {
      this.handleError(id_work, error, command);
    }
  }

  async dumpSourceCode(
    input: ProductTypes.Payload.Service.Audit.DumpSourceCodeRequest,
  ): Promise<Subscription> {
    let subscription: Subscription;
    const command = "dump_source_code";

    subscription = this.auditService
      .dumpSourceCode(input)
      .pipe(
        tap(async (response) => {
          if (response.process_status === "error") {
            this.auditGateway.notifyError(
              response.id_work,
              command,
              response.process_status,
              { content: response.error_message },
            );
            subscription.unsubscribe();
          }

          if (response.process_status === "interrupted") {
            this.auditGateway.notifyInterruption(
              response.id_work,
              command,
              response.process_status,
            );
            subscription.unsubscribe();
          }

          if (response.process_status === "completed") {
            if (response.code_dump) {
              await this.saveSourceCodeDump(
                response.id_work,
                response.id_repository,
                response.code_dump,
                command,
              );
              this.auditGateway.notifySuccess(
                response.id_work,
                command,
                response.process_status,
                { content: "source code dumped" },
              );
              subscription.unsubscribe();
            } else {
              const message =
                "code dump not received from audit server after completed.";
              this.auditGateway.notifyError(
                response.id_work,
                command,
                response.process_status,
                { message },
              );

              throw new AppException(
                "INTERNAL_SERVER_ERROR",
                500,
                message,
                input.id_work,
              );
            }
          } else {
            this.auditGateway.notifyUpdate(
              response.id_work,
              command,
              response.process_status,
            );
          }
        }),
        catchError((error) => {
          subscription.unsubscribe();

          return throwError(() => error);
        }),
      )
      .subscribe({
        error: (error) => this.handleError(input.id_work, error, command),
      });

    return subscription;
  }

  analyzeSourceCode(
    input: ProductTypes.Payload.Service.Audit.AnalyzeSourceCodeRequest,
  ): Subscription {
    let subscription: Subscription;
    const command = "analyze_source_code";

    subscription = this.auditService
      .analyzeSourceCode(input)
      .pipe(
        tap(async (response) => {
          if (response.process_status === "error") {
            this.auditGateway.notifyError(
              response.id_work,
              command,
              response.process_status,
              { content: response.error_message },
            );
            subscription.unsubscribe();
          }

          if (response.process_status === "interrupted") {
            this.auditGateway.notifyInterruption(
              response.id_work,
              command,
              response.process_status,
            );
            subscription.unsubscribe();
          }

          if (response.process_status === "completed") {
            if (response.result) {
              const result = await this.formatAndSaveResult(
                response.id_work,
                response.id_repository,
                response.result,
                command,
              );
              this.auditGateway.notifySuccess(
                response.id_work,
                command,
                response.process_status,
                { content: result },
              );
              subscription.unsubscribe();
            } else {
              throw new AppException(
                "INTERNAL_SERVER_ERROR",
                500,
                "analysis result not received from audit server after completed.",
                input.id_work,
              );
            }
          } else {
            this.auditGateway.notifyUpdate(
              response.id_work,
              command,
              response.process_status,
            );
          }
        }),
        catchError((error) => {
          subscription.unsubscribe();

          return throwError(() => error);
        }),
      )
      .subscribe({
        error: (error) => this.handleError(input.id_work, error, command),
      });

    return subscription;
  }

  analyzePullRequest(
    input: ProductTypes.Payload.Service.Audit.AnalyzePullRequestRequest,
  ): Subscription {
    let subscription: Subscription;
    const command = "analyze_pull_request";

    subscription = this.auditService
      .analyzeSourceCode(input)
      .pipe(
        tap(async (response) => {
          if (response.process_status === "error") {
            this.auditGateway.notifyError(
              response.id_work,
              command,
              response.process_status,
              { content: response.error_message },
            );
            subscription.unsubscribe();
          }

          if (response.process_status === "interrupted") {
            this.auditGateway.notifyInterruption(
              response.id_work,
              command,
              response.process_status,
            );
            subscription.unsubscribe();
          }

          if (response.process_status === "completed") {
            if (response.result) {
              const result = await this.formatAndSaveResult(
                response.id_work,
                response.id_repository,
                response.result,
                command,
              );
              this.auditGateway.notifySuccess(
                response.id_work,
                command,
                response.process_status,
                { content: result },
              );
              subscription.unsubscribe();
            } else {
              throw new AppException(
                "INTERNAL_SERVER_ERROR",
                500,
                "analysis result not received from audit server after completed.",
                input.id_work,
              );
            }
          } else {
            this.auditGateway.notifyUpdate(
              response.id_work,
              command,
              response.process_status,
            );
          }
        }),
        catchError((error) => {
          subscription.unsubscribe();

          return throwError(() => error);
        }),
      )
      .subscribe({
        error: (error) => this.handleError(input.id_work, error, command),
      });

    return subscription;
  }

  watchPullRequests(
    input: ProductTypes.Payload.Service.Audit.WatchPullRequestsRequest,
  ): Subscription {
    let subscription: Subscription;
    const command = "watch_pull_requests";

    subscription = this.auditService
      .watchPullRequests(input)
      .pipe(
        tap(async (response) => {
          if (response.process_status === "error") {
            this.auditGateway.notifyError(
              response.id_work,
              command,
              response.process_status,
              { content: response.error_message },
            );
            subscription.unsubscribe();
          }

          if (response.process_status === "interrupted") {
            this.auditGateway.notifyInterruption(
              response.id_work,
              command,
              response.process_status,
            );
            subscription.unsubscribe();
          }

          if (response.process_status === "completed") {
            this.auditGateway.notifySuccess(
              response.id_work,
              command,
              response.process_status,
              { content: response.result },
            );
            subscription.unsubscribe();
          } else {
            this.auditGateway.notifyUpdate(
              response.id_work,
              command,
              response.process_status,
            );
          }
        }),
        catchError((error) => {
          subscription.unsubscribe();

          return throwError(() => error);
        }),
      )
      .subscribe({
        error: (error) => this.handleError(input.id_work, error, command),
      });

    return subscription;
  }

  async interruptProcess(
    input: ProductTypes.Payload.Service.Audit.InterruptProcessRequest,
  ): Promise<void> {
    const command = "interrupt_process";

    try {
      await firstValueFrom(
        this.auditService.interruptProcess(input).pipe(
          tap((response) => {
            if (response.error_message) {
              this.auditGateway.notifyError(
                response.id_work,
                command,
                "interrupt_process_failed",
                { content: response.error_message },
              );
            }
            const message = `${response.success ? "interrupted_process_completed" : "interrupted_process_failed"}`;
            const details = `${response.success ? `${response.id_work} processes interrupted.` : "processes not interrupted."}`;
            this.auditGateway.notifySuccess(
              response.id_work,
              command,
              message,
              { content: details },
            );
          }),
          catchError((error) => {
            throw error;
          }),
        ),
      );
    } catch (error) {
      this.handleError(input.id_work, error, command);
    }
  }
}
