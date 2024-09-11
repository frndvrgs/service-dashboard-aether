import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { WorkRepository } from "../../repositories/work.repository";
import { AccountRepository } from "../../../account/repositories/account.repository";

import type { ProductTypes } from "../../product.types";

@Injectable()
export class UpdateWorkService {
  constructor(
    private workRepository: WorkRepository,
    private accountRepository: AccountRepository,
  ) {}

  async execute(
    service: ProductTypes.Payload.Service.UpdateWork.Input,
  ): Promise<ProductTypes.Payload.Service.UpdateWork.Output> {
    const { account, work, input } = service;

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

    // create a shallow entity clone
    const updateData = { ...workResource };

    if (input.name) {
      updateData.name = input.name;
    }

    if (input.level) {
      updateData.level = input.level;
    }

    if (input.process_type) {
      updateData.process_type = input.process_type;
    }

    if (input.document) {
      updateData.document = {
        ...updateData.document,
        ...input.document,
      };
    }

    Object.assign(workResource, updateData);

    const updatedResource = await this.workRepository.save(workResource);

    return {
      status: {
        description: "WORK_UPDATED",
        code: 200,
        context: "APPLICATION",
      },
      output: updatedResource,
    };
  }
}
