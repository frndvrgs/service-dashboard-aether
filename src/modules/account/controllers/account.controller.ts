import {
  Controller,
  Post,
  Body,
  Request,
  Res,
  UseFilters,
} from "@nestjs/common";
import { StatusHandler } from "../../../common/handlers/status.handler";
import { SessionHandler } from "../../../common/handlers/session.handler";
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
    private session: SessionHandler,
    private status: StatusHandler,
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
    await this.session.verifyOAuth(request);
    const service = await this.upsertAccountService.execute(serviceInput);
    const session = await this.session.create(reply, service.output);

    reply.status(session.status.code).send({
      status: this.status.createHttpStatus(session.status),
    });
  }
}
