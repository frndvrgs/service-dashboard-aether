import { errorTools } from "../helpers/error-tools";
import { BaseException } from "../abstracts/exception.base";

import type { CommonTypes } from "@types";

export class ServerException extends BaseException {
  constructor(
    description: CommonTypes.DescriptionCodes,
    code: CommonTypes.StatusCodes,
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
