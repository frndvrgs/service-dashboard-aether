import {
  Controller,
  Post,
  Body,
  Request,
  Res,
  UseFilters,
} from "@nestjs/common";
import { StatusService } from "../../../common/services/status.service";
import { SessionService } from "../../../common/services/session.service";
import { AppExceptionFilter } from "../../../common/filters/app.exception.filter";
import { InterfaceExceptionFilter } from "../../../common/filters/interface.exception.filter";
import { UpsertAccountInput } from "../interface/v1/account.dto";

import * as services from "../services/account";

import type { FastifyRequest, FastifyReply } from "fastify";

@Controller("account")
@UseFilters(AppExceptionFilter)
@UseFilters(InterfaceExceptionFilter)
export class AccountController {
  constructor(
    private upsertAccountService: services.UpsertAccountService,
    private sessionService: SessionService,
    private statusService: StatusService,
  ) {}

  @Post("sync")
  async syncAccount(
    @Body() input: UpsertAccountInput,
    @Request() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    const serviceInput = {
      input,
    };
    await this.sessionService.verifyOAuth(request);
    const service = await this.upsertAccountService.execute(serviceInput);
    const session = await this.sessionService.create(reply, service.output);

    reply.status(session.status.code).send({
      status: this.statusService.createHttpStatus(session.status),
      output: service.output,
    });
  }
}
