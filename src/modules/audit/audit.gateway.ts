import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Injectable } from "@nestjs/common";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: "/audit",
})
@Injectable()
export class AuditGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private workSockets: Map<string, Set<Socket>> = new Map();

  handleConnection(client: Socket) {
    const id_work = client.handshake.query["id_work"] as string;
    if (id_work) {
      if (!this.workSockets.has(id_work)) {
        this.workSockets.set(id_work, new Set());
      }
      this.workSockets.get(id_work)?.add(client);
      console.log(`client connected to work ${id_work} socket`);
    }
  }

  handleDisconnect(client: Socket) {
    const id_work = client.handshake.query["id_work"] as string;
    if (id_work) {
      this.workSockets.get(id_work)?.delete(client);
      if (this.workSockets.get(id_work)?.size === 0) {
        this.workSockets.delete(id_work);
      }
      console.log(`client disconnected from work ${id_work} socket`);
    }
  }

  notifyUpdate(id_work: string, command: string, status: string): void {
    this.emit(id_work, "update", { command, status });
  }

  notifyError(
    id_work: string,
    command: string,
    status: string,
    error: Record<string, any> | null = null,
  ): void {
    this.emit(id_work, "error", { command, status, error });
  }

  notifyInterruption(id_work: string, command: string, status: string): void {
    this.emit(id_work, "interruption", { command, status });
  }

  notifySuccess(
    id_work: string,
    command: string,
    status: string,
    data: Record<string, any>,
  ): void {
    this.emit(id_work, "success", { command, status, data });
  }

  private emit(
    id_work: string,
    event: string,
    payload: Record<string, any>,
  ): void {
    const clients = this.workSockets.get(id_work);
    if (clients) {
      clients.forEach((client) => client.emit(event, payload));
    }
  }
}
