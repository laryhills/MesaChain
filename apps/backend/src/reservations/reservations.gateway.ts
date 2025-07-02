import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ReservationsService } from "./reservations.service";
import { ReservationStatus } from "@prisma/client";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { WsException } from '@nestjs/websockets';

@WebSocketGateway({ cors: true })
export class ReservationsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly reservationsService: ReservationsService) {}

  // Called by service when status changes
  broadcastStatusUpdate(
    reservationId: string,
    status:
      | "PENDING"
      | "CONFIRMED"
      | "IN_PREPARATION"
      | "READY"
      | "DELIVERED"
      | "COMPLETED"
      | "CANCELLED"
  ) {
    this.server
      .to(`reservation_${reservationId}`)
      .emit("statusUpdate", { reservationId, status });
  }

  // Clients join a room for their reservation
  @SubscribeMessage("joinReservation")
  async handleJoinReservation(
    @MessageBody() data: { reservationId: string },
    @ConnectedSocket() client: Socket
  ) {
    // Extract and verify JWT from socket handshake
  const user = await this.validateSocketUser(client);
  
  // Verify user owns this reservation or is staff/admin
  const reservation = await this.reservationsService.findOne(data.reservationId);
  if (reservation.userId !== user.id && !['STAFF', 'ADMIN'].includes(user.role)) {
    throw new WsException('Unauthorized');
  }
  
    client.join(`reservation_${data.reservationId}`);
  }

  // Staff can join a room for all active orders
  @SubscribeMessage("joinStaff")
  async handleJoinStaff(@ConnectedSocket() client: Socket) {
      const user = await this.validateSocketUser(client);
      
      if (!['STAFF', 'ADMIN'].includes(user.role)) {
        throw new WsException('Unauthorized');
      }
    client.join("staff");
  }

  // Broadcast to staff
  broadcastToStaff(event: string, payload: any) {
    this.server.to("staff").emit(event, payload);
  }
}
