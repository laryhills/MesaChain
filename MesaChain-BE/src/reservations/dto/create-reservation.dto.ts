import { z } from "zod";

export const createReservationSchema = z.object({
  userId: z.string().uuid(),
  tableId: z.string().uuid(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  partySize: z.number().int().positive(),
  status: z
    .enum([
      "PENDING",
      "CONFIRMED",
      "IN_PREPARATION",
      "READY",
      "DELIVERED",
      "COMPLETED",
      "CANCELLED",
    ])
    .optional(),
  priority: z.number().int().optional(),
  queuePosition: z.number().int().optional(),
});

export type CreateReservationDto = z.infer<typeof createReservationSchema>;
