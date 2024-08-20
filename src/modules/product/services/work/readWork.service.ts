import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { WorkRepository } from "../../repositories/work.repository";

import type { ProductTypes } from "../../product.types";

@Injectable()
export class ReadWorkService {
  constructor(private repository: WorkRepository) {}

  async execute(
    service: ProductTypes.Payload.Service.ReadWork.Input,
  ): Promise<ProductTypes.Payload.Service.ReadWork.Output> {
    const { options } = service;
    if (!options) {
      throw new AppException(
        "MISSING_PAYLOAD",
        400,
        "missing payload.",
        "service.payload.select is null or undefined.",
      );
    }

    const resource = await this.repository.read(options);
    if (resource == null) {
      throw new AppException(
        "NOT_FOUND",
        404,
        "resource not found.",
        "service.payload.select invalid field or value.",
      );
    }

    return {
      status: {
        description: "RESOURCE_READ",
        code: 200,
        context: "APPLICATION",
      },
      output: resource,
    };
  }
}
