import { errorTools } from "../helpers/error-tools";
import { ExceptionBase } from "../abstracts/exception.base";

import type { CommonModule } from "@types";

export class ServerException extends ExceptionBase {
  constructor(
    description: CommonModule.Payload.DescriptionCodes,
    code: CommonModule.Payload.StatusCodes,
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
