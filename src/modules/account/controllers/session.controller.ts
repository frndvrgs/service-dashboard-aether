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
import { CreateSessionInput } from "../interface/v1/session.dto";

import * as services from "../services/session";

import type { FastifyRequest, FastifyReply } from "fastify";

@Controller("session")
@UseFilters(AppExceptionFilter)
@UseFilters(InterfaceExceptionFilter)
export class SessionController {
  constructor(
    private createSessionService: services.CreateSessionService,
    private session: SessionHandler,
    private status: StatusHandler,
  ) {}

  @Post("create")
  async createSession(
    @Body() input: CreateSessionInput,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    const serviceInput = {
      input,
    };
    const service = await this.createSessionService.execute(serviceInput);
    const session = await this.session.create(reply, service.output);

    reply.status(session.status.code).send({
      status: this.status.createHttpStatus(session.status),
    });
  }

  @Post("remove")
  async removeSession(
    @Request() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    await this.session.authorize(request);
    const session = this.session.remove(reply);

    reply.code(session.status.code).send({
      status: this.status.createHttpStatus(session.status),
    });
  }
}
