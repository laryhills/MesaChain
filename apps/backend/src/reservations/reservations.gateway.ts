import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ReservationsService } from "./reservations.service";
// Try importing ReservationStatus from generated Prisma client, fallback to string union if not available
let ReservationStatus: any;
type ReservationStatusType =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PREPARATION"
  | "READY"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ReservationStatus = require("@prisma/client").ReservationStatus;
} catch {
  ReservationStatus = {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    IN_PREPARATION: "IN_PREPARATION",
    READY: "READY",
    DELIVERED: "DELIVERED",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
  };
}
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

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
  handleJoinReservation(
    @MessageBody() data: { reservationId: string },
    @ConnectedSocket() client: Socket
  ) {
    client.join(`reservation_${data.reservationId}`);
  }

  // Staff can join a room for all active orders
  @SubscribeMessage("joinStaff")
  handleJoinStaff(@ConnectedSocket() client: Socket) {
    client.join("staff");
  }

  // Broadcast to staff
  broadcastToStaff(event: string, payload: any) {
    this.server.to("staff").emit(event, payload);
  }
}
