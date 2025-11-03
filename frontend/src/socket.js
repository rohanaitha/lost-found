// src/socket.js
import { io } from "socket.io-client";
import BACKEND_URL from "./config";

const socket = io(BACKEND_URL, {
  transports: ["polling"], // Start with just polling
  path: "/socket.io/",
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
  timeout: 20000,
  forceNew: true,
  autoConnect: true,
});

socket.on("connect_error", (err) => {
  console.log(`Connection error: ${err.message}`);
});

socket.on("connect", () => {
  console.log("Connected to socket server");
});

export default socket;
