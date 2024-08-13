import { errorTools } from "../helpers/error-tools";
import { ExceptionBase } from "../abstracts/exception.base";

import type { CommonModule } from "@types";

export class InterfaceException extends ExceptionBase {
  constructor(
    description: CommonModule.Payload.DescriptionCodes,
    code: CommonModule.Payload.StatusCodes,
    message: string,
    detail: string,
    error?: Error | AggregateError | unknown,
  ) {
    super(
      "Interface Exception",
      description,
      code,
      message,
      detail,
      "INTERFACE",
      errorTools.getScope(),
      error,
    );
  }
}
