import { errorTools } from "../helpers/error-tools";

import type { DescriptionCodes, StatusCodes } from "../constants";
import type { StatusModel } from "../interface/common.model";

export abstract class BaseException extends Error {
  public status: StatusModel;
  constructor(
    name: string,
    description: keyof typeof DescriptionCodes,
    code: StatusCodes,
    message: string,
    detail: string,
    context: string,
    scope: string,
    error?: Error | AggregateError | unknown | null,
  ) {
    super(message);
    this.name = name;
    this.status = {
      description,
      code,
      message,
      detail,
      context,
      scope,
    };

    // check for Error object and log it on the console

    if (error) {
      errorTools.log({
        ...this.status,
        name: this.name,
        error,
      });
    }
  }
}
