import { Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { WorkRepository } from "../../repositories/work.repository";

import type { ProductTypes } from "../../product.types";

@Injectable()
export class UpdateWorkService {
  constructor(private repository: WorkRepository) {}

  async execute(
    service: ProductTypes.Payload.Service.UpdateWork.Input,
  ): Promise<ProductTypes.Payload.Service.UpdateWork.Output> {
    const { work, input } = service;

    const resource = await this.repository.read({
      where: { idWork: work },
    });
    if (!resource) {
      throw new AppException("NOT_FOUND", 404, "resource not found.", work);
    }

    Object.assign(resource, input);

    const updatedResource = await this.repository.save(resource);

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
