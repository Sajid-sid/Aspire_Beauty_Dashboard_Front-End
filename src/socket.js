import { io } from "socket.io-client";

console.log("Connecting to:", import.meta.env.VITE_API_URL);

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5001", {
  autoConnect: true,
});

socket.on("connect", () => console.log("Socket connected (client):", socket.id));
console.log("Dashboard trying socket");
socket.on("connect", () => console.log("Dashboard connected"));
socket.on("connect_error", err => console.log(err.message));

socket.on("disconnect", () => console.log("Socket disconnected (client)"));

export default socket;
