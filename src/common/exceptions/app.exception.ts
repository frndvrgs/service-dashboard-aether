import { errorTools } from "../helpers/error-tools";
import { BaseException } from "../abstracts/exception.base";

import type { DescriptionCodes, StatusCodes } from "../constants";

export class AppException extends BaseException {
  constructor(
    description: keyof typeof DescriptionCodes,
    code: StatusCodes,
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
