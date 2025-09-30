const ENABLE_SOCKET = true; // Set to true when you want to enable it again
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

let initialSocket: Socket | null = null;

export const connectSocket = (): Socket | null => {
  if (!ENABLE_SOCKET) return null;

  if (!initialSocket) {
    initialSocket = io(process.env.NEXT_PUBLIC_SERVER_URL, {
      withCredentials: true,
    });
  }

  return initialSocket;
};

export const socket = connectSocket();

export const registerSocket = (userId: string) => {
  if (socket) {
    socket.emit("register", userId);
  }
};