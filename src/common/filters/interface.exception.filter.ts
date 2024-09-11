import { Catch } from "@nestjs/common";
import { InterfaceException } from "../exceptions/interface.exception";
import { StatusService } from "../services/status.service";
import { BaseExceptionFilter } from "../abstracts/exception.filter.base";

@Catch(InterfaceException)
export class InterfaceExceptionFilter extends BaseExceptionFilter {
  constructor(status: StatusService) {
    super(status);
  }
}
