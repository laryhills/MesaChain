// Shared enum for reservation status
export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  IN_PREPARATION = "IN_PREPARATION",
  READY = "READY",
  DELIVERED = "DELIVERED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export type ReservationStatusType = keyof typeof ReservationStatus;

// Helper function to validate status
export function isValidReservationStatus(status: string): status is ReservationStatusType {
  return Object.values(ReservationStatus).includes(status as ReservationStatus);
} 