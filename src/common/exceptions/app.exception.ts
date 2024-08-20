import { errorTools } from "../helpers/error-tools";
import { BaseException } from "../abstracts/exception.base";

import type { CommonTypes } from "@types";

export class AppException extends BaseException {
  constructor(
    description: CommonTypes.DescriptionCodes,
    code: CommonTypes.StatusCodes,
    message: string,
    detail: string,
    error?: Error | AggregateError | unknown,
  ) {
    super(
      "Application Exception",
      description,
      code,
      message,
      detail,
      "APPLICATION",
      errorTools.getScope(),
      error,
    );
  }
}
