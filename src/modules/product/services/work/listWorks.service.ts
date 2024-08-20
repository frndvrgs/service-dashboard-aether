import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { WorkRepository } from "../../repositories/work.repository";

import type { ProductTypes } from "../../product.types";

@Injectable()
export class ListWorksService {
  constructor(private repository: WorkRepository) {}

  async execute(
    service: ProductTypes.Payload.Service.ListWorks.Input,
  ): Promise<ProductTypes.Payload.Service.ListWorks.Output> {
    const { options } = service;

    const collection = await this.repository.list(options);
    if (!collection?.length) {
      throw new AppException(
        "NOTHING_FOUND",
        404,
        "collection not found.",
        "repository.list()",
      );
    }

    return {
      status: {
        description: "COLLECTION_LISTED",
        code: 200,
        context: "APPLICATION",
      },
      output: collection,
    };
  }
}
