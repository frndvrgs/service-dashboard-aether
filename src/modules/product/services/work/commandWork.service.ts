import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { WorkRepository } from "../../repositories/work.repository";
import { EncryptionService } from "../../../../common/services/encryption.service";
import { AccountRepository } from "../../../account/repositories/account.repository";
import { SourceRepository } from "../../repositories/source.repository";
import { ProcessWorkService } from "./processWork.service";

import type { ProductTypes } from "../../product.types";

@Injectable()
export class CommandWorkService {
  constructor(
    private accountRepository: AccountRepository,
    private workRepository: WorkRepository,
    private sourceRepository: SourceRepository,
    private processWorkService: ProcessWorkService,
    private encryptionService: EncryptionService,
  ) {}

  async execute(
    service: ProductTypes.Payload.Service.CommandWork.Input,
  ): Promise<ProductTypes.Payload.Service.CommandWork.Output> {
    const { account, work, command } = service;

    const workResource = await this.workRepository.read({
      where: {
        id_account: account,
        id_work: work,
      },
    });
    if (!workResource) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "work resource not found.",
        work,
      );
    }

    const accountResource = await this.accountRepository.read({
      where: {
        id_account: account,
      },
    });
    if (!accountResource) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "account resource not found.",
        account,
      );
    }

    const sourceResource = await this.sourceRepository.read({
      where: {
        id_repository: workResource.id_repository,
      },
    });
    if (!sourceResource) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "source resource not found.",
        workResource.id_repository,
      );
    }

    switch (command) {
      case "dump_source_code":
        if (!accountResource.github_token) {
          throw new AppException(
            "NOT_FOUND",
            404,
            "github_token not found for this account.",
            account,
          );
        }

        this.processWorkService.dumpSourceCode({
          id_work: workResource.id_work,
          id_repository: workResource.id_repository,
          github_token: this.encryptionService.decrypt(
            accountResource.github_token,
          ),
        });

        break;

      case "analyze_source_code":
        if (!sourceResource?.code_dump) {
          throw new AppException(
            "NOT_FOUND",
            404,
            "code_dump not found for this repository.",
            workResource.id_repository,
          );
        }

        this.processWorkService.analyzeSourceCode({
          id_work: workResource.id_work,
          id_repository: workResource.id_repository,
          code_dump: sourceResource.code_dump,
        });

        break;

      case "watch_pull_requests":
        if (!sourceResource?.code_dump) {
          throw new AppException(
            "NOT_FOUND",
            404,
            "code_dump not found for this repository.",
            workResource.id_repository,
          );
        }

        if (!accountResource.github_token) {
          throw new AppException(
            "NOT_FOUND",
            404,
            "github_token not found for this account.",
            account,
          );
        }

        this.processWorkService.watchPullRequests({
          id_work: workResource.id_work,
          id_repository: workResource.id_repository,
          code_dump: sourceResource.code_dump,
          github_token: this.encryptionService.decrypt(
            accountResource.github_token,
          ),
        });

        break;

      case "interrupt_process":
        this.processWorkService.interruptProcess({
          id_work: work,
        });
        break;
      default:
        break;
    }

    return {
      status: {
        description: "WORK_COMMAND_PROCESSED",
        code: 200,
        context: "APPLICATION",
      },
    };
  }
}
