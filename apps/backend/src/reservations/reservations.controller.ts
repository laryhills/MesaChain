import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  BadRequestException,
  Req,
  ForbiddenException,
} from "@nestjs/common";
import { ReservationsService } from "./reservations.service";
import {
  CreateReservationDto,
  createReservationSchema,
} from "./dto/create-reservation.dto";
import {
  UpdateReservationDto,
  updateReservationSchema,
} from "./dto/update-reservation.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

// Try importing ReservationStatus from generated Prisma client, fallback to string union if not available
let ReservationStatus: any;
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

@Controller("reservations")
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  async create(@Body() createReservationDto: CreateReservationDto) {
    const result = createReservationSchema.safeParse(createReservationDto);
    if (!result.success) {
      throw new BadRequestException(result.error.errors);
    }
    return this.reservationsService.create(result.data);
  }

  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get("availability")
  getAvailability(
    @Query("startTime") startTime: string,
    @Query("endTime") endTime: string,
    @Query("partySize") partySize: number
  ) {
    return this.reservationsService.getAvailability(
      new Date(startTime),
      new Date(endTime),
      partySize
    );
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateReservationDto: UpdateReservationDto
  ) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Patch(":id/cancel")
  cancel(@Param("id") id: string) {
    return this.reservationsService.cancel(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.reservationsService.remove(id);
  }

  @Patch(":id/status")
  async updateStatus(
    @Param("id") id: string,
    @Body("status")
    status:
      | "PENDING"
      | "CONFIRMED"
      | "IN_PREPARATION"
      | "READY"
      | "DELIVERED"
      | "COMPLETED"
      | "CANCELLED",
    @Req() req: any
  ) {
    // Only staff/admin can update status
    if (!["STAFF", "ADMIN"].includes(req.user?.role)) {
      throw new ForbiddenException("No autorizado");
    }
    return this.reservationsService.updateStatus(id, status, req.user.id);
  }

  @Get(":id/status-history")
  async getStatusHistory(@Param("id") id: string) {
    return this.reservationsService.getStatusHistory(id);
  }

  @Get("filter")
  async filterAndSearch(
    @Query("status")
    status?:
      | "PENDING"
      | "CONFIRMED"
      | "IN_PREPARATION"
      | "READY"
      | "DELIVERED"
      | "COMPLETED"
      | "CANCELLED",
    @Query("customer") customer?: string,
    @Query("orderId") orderId?: string
  ) {
    return this.reservationsService.filterAndSearch({
      status,
      customer,
      orderId,
    });
  }

  @Get(":id/status")
  async getReservationStatus(@Param("id") id: string, @Req() req: any) {
    const reservation = await this.reservationsService.findOne(id);
    // Only the owner or staff/admin can view
    if (
      reservation.userId !== req.user.id &&
      !["STAFF", "ADMIN"].includes(req.user?.role)
    ) {
      throw new ForbiddenException("No autorizado");
    }
    return { status: reservation.status };
  }
}
