import {
  Controller,
  Get,
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
import { CreateSessionInput } from "../interface/v1/session.dto";

import * as services from "../services/session";

import type { FastifyRequest, FastifyReply } from "fastify";

@Controller("session")
@UseFilters(AppExceptionFilter)
@UseFilters(InterfaceExceptionFilter)
export class SessionController {
  constructor(
    private createSessionService: services.CreateSessionService,
    private sessionService: SessionService,
    private statusService: StatusService,
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
    const session = await this.sessionService.create(reply, service.output);

    reply.status(session.status.code).send({
      status: this.statusService.createHttpStatus(session.status),
    });
  }

  @Post("remove")
  async removeSession(
    @Request() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    await this.sessionService.authorize(request);
    const session = this.sessionService.remove(reply);

    reply.code(session.status.code).send({
      status: this.statusService.createHttpStatus(session.status),
    });
  }

  @Get("verify")
  async verifySession(
    @Request() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    const identity = await this.sessionService.authorize(request);
    reply.code(200).send({
      scope: identity.scope,
    });
  }
}
