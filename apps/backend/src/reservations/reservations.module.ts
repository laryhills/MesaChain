import { Module } from "@nestjs/common";
import { ReservationsService } from "./reservations.service";
import { ReservationsController } from "./reservations.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { ReservationsGateway } from "./reservations.gateway";

@Module({
  imports: [PrismaModule],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsGateway],
  exports: [ReservationsService],
})
export class ReservationsModule {}
