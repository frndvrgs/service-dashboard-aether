import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { WorkRepository } from "../../repositories/work.repository";

import type { ProductTypes } from "../../product.types";

@Injectable()
export class RemoveWorkService {
  constructor(private repository: WorkRepository) {}

  async execute(
    service: ProductTypes.Payload.Service.RemoveWork.Input,
  ): Promise<ProductTypes.Payload.Service.RemoveWork.Output> {
    const { account, work } = service;

    const resource = await this.repository.read({
      where: {
        id_account: account,
        id_work: work,
      },
    });
    if (!resource) {
      throw new AppException("NOT_FOUND", 404, "resource not found.", work);
    }

    const result = await this.repository.remove("id_work", resource.id_work);
    if (result.affected === 0) {
      throw new AppException(
        "INTERNAL_SERVER_ERROR",
        500,
        "database error.",
        "repository.remove() returning null.",
      );
    }

    return {
      status: {
        description: "ACCOUNT_REMOVED",
        code: 204,
        context: "APPLICATION",
      },
    };
  }
}
