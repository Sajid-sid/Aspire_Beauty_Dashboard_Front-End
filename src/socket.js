import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL;

console.log("Connecting socket to:", SOCKET_URL);

const socket = io(SOCKET_URL, {
  transports: ["websocket"], 
  withCredentials: true,
  autoConnect: true,
});

socket.on("connect", () =>
  console.log(" Socket connected:", socket.id)
);

socket.on("connect_error", (err) =>
  console.error("Socket error:", err.message)
);

socket.on("disconnect", () =>
  console.log(" Socket disconnected")
);

export default socket;
