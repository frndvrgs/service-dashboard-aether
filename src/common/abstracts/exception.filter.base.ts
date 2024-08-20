import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { BaseException } from "./exception.base";
import { StatusHandler } from "../handlers/status.handler";

export abstract class BaseExceptionFilter implements ExceptionFilter {
  constructor(protected status: StatusHandler) {}

  catch(exception: BaseException, host: ArgumentsHost) {
    if (host.getType() === "http") {
      return this.handleRest(exception, host);
    } else if (host.getType<"graphql">() === "graphql") {
      return this.handleGraphQL(exception);
    }

    return this.createErrorResponse(exception);
  }

  protected handleRest(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse();

    reply
      .status(exception.status.code)
      .send(this.createErrorResponse(exception));
  }

  protected handleGraphQL(exception: BaseException) {
    return this.createErrorResponse(exception);
  }

  protected createErrorResponse(exception: BaseException) {
    return {
      status: this.status.createHttpStatus(exception.status),
      output: null,
    };
  }
}
