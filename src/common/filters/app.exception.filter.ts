import { Catch } from "@nestjs/common";
import { AppException } from "../exceptions/app.exception";
import { StatusHandler } from "../handlers/status.handler";
import { BaseExceptionFilter } from "../abstracts/exception.filter.base";

@Catch(AppException)
export class AppExceptionFilter extends BaseExceptionFilter {
  constructor(status: StatusHandler) {
    super(status);
  }
}
