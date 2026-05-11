import { io } from "socket.io-client";
import { config } from "./config";

let socket = null;

export const connectSocket = () => {
  if (socket?.connected) return socket;

  socket = io(config.socketUrl, {
    withCredentials: true,   
    transports: ["websocket"],
    
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("[Socket] Connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket] Disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.log("[Socket Error]", err.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;