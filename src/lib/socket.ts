import http from "http";
import express from "express";
import { Server } from "socket.io";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  }
});

// function to get receiver socket id 

// online users 
const userSocketMap: any = {}; // {userId:scoketId}
export function getReceiverSocketId(userId: string) {
  return userSocketMap[userId]
}

io.on("connection", socket => {
  console.log(`user connected: ${socket.id}`);
  const userId: any = socket.handshake.query.userId;
  console.log(`user : ${userId}`);

  if (userId) userSocketMap[userId] = socket.id
  //io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap))
  socket.emit("message", "Hello from server");
  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.id}`);
    delete userSocketMap[userId]
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
})

export { app, server, io };