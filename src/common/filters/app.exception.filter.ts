import { Catch } from "@nestjs/common";
import { AppException } from "../exceptions/app.exception";
import { StatusService } from "../services/status.service";
import { BaseExceptionFilter } from "../abstracts/exception.filter.base";

@Catch(AppException)
export class AppExceptionFilter extends BaseExceptionFilter {
  constructor(status: StatusService) {
    super(status);
  }
}
