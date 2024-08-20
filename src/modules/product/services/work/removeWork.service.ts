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
    const { work } = service;

    const result = await this.repository.remove(work);
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
