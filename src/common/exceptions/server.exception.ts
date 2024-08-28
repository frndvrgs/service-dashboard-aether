import { errorTools } from "../helpers/error-tools";
import { BaseException } from "../abstracts/exception.base";

import type { DescriptionCodes, StatusCodes } from "../constants";

export class ServerException extends BaseException {
  constructor(
    description: keyof typeof DescriptionCodes,
    code: StatusCodes,
    message: string,
    detail: string,
    error?: Error | AggregateError | unknown,
  ) {
    super(
      "Server Exception",
      description,
      code,
      message,
      detail,
      "SERVER",
      errorTools.getScope(),
      error,
    );
  }
}
