import { io } from "socket.io-client";

const SOCKET_URL = "https://mediguard-vgkt.onrender.com";

console.log("Socket URL:", JSON.stringify(SOCKET_URL));

const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
});

export default socket;