import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

// Adjust this URL if your backend runs elsewhere
const SOCKET_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_SOCKET_URL ||
      `${window.location.protocol}//${window.location.hostname}:3000`
    : "";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PREPARATION"
  | "READY"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

interface StatusUpdate {
  reservationId: string;
  status: OrderStatus;
}

export function useOrderStatusSocket(
  reservationId?: string,
  isStaff?: boolean
) {
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      setError(null);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connect_error", (err: Error) => {
      setError(err.message);
      setIsConnected(false);
    });

    if (reservationId) {
      socket.emit("joinReservation", { reservationId });
    } else if (isStaff) {
      socket.emit("joinStaff");
    }

    socket.on("statusUpdate", (data: StatusUpdate) => {
      setStatus(data.status);
    });

    return () => {
      socket.disconnect();
    };
  }, [reservationId, isStaff]);

  // Optionally allow joining a room later
  const joinReservation = useCallback((id: string) => {
    socketRef.current?.emit("joinReservation", { reservationId: id });
  }, []);

  const joinStaff = useCallback(() => {
    socketRef.current?.emit("joinStaff");
  }, []);

  return { status, isConnected, error, joinReservation, joinStaff };
}
