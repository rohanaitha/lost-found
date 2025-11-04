import express, { json } from "express";
import dotenv from "dotenv";
import UserRoute from "./routes/UserRoute.js";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http"; // for socket.io
import { Server } from "socket.io"; // socket.io server

dotenv.config();
console.log("Cloudinary check:", process.env.CLOUD_NAME);

const app = express();

// CORS configuration
const corsOptions = {
  origin:"*",
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(json());

// Create HTTP server first
const server = createServer(app);

// Socket.io setup - MUST be before routes
const io = new Server(server, {
  cors: corsOptions,
  path: "/socket.io/",
  transports: ["polling", "websocket"],
  pingTimeout: 20000,
  pingInterval: 10000,
  cookie: false,
});

// MongoDB connection
const URI = process.env.MONGO_URI;
mongoose.connect(URI).then(() => {
  console.log("mongo connection success");
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // join a chat room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  // send message to a room
  socket.on("sendMessage", ({ roomId, message }) => {
    // Broadcast to all other sockets in the room (exclude sender)
    socket.to(roomId).emit("receiveMessage", message);
    console.log(
      `Message broadcast to room ${roomId}: ${JSON.stringify(message)}`
    );
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Add Socket.IO route to verify it's working


// Existing routes
app.use("/", UserRoute);

// Start the server (use server.listen, not app.listen)
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Socket.IO server is ready");
});

// Export server instead of app for proper Socket.IO handling
export default server;
