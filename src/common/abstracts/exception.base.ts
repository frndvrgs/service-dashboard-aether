import { errorTools } from "../helpers/error-tools";

import type { StatusModel } from "../interface/common.model";

import type { CommonTypes } from "@types";

export abstract class BaseException extends Error {
  public status: StatusModel;
  constructor(
    name: string,
    description: CommonTypes.DescriptionCodes,
    code: CommonTypes.StatusCodes,
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
