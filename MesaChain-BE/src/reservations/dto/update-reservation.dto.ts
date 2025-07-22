import { z } from "zod";
import { createReservationSchema } from "./create-reservation.dto";

export const updateReservationSchema = createReservationSchema.partial();
export type UpdateReservationDto = z.infer<typeof updateReservationSchema>;
