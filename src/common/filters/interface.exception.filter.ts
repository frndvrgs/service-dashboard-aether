import { Catch } from "@nestjs/common";
import { InterfaceException } from "../exceptions/interface.exception";
import { StatusHandler } from "../handlers/status.handler";
import { BaseExceptionFilter } from "../abstracts/exception.filter.base";

@Catch(InterfaceException)
export class InterfaceExceptionFilter extends BaseExceptionFilter {
  constructor(status: StatusHandler) {
    super(status);
  }
}
