"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = exports.app = void 0;
exports.getReceiverSocketId = getReceiverSocketId;
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        credentials: true,
    }
});
exports.io = io;
// function to get receiver socket id 
// online users 
const userSocketMap = {}; // {userId:scoketId}
function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}
io.on("connection", socket => {
    console.log(`user connected: ${socket.id}`);
    const userId = socket.handshake.query.userId;
    console.log(`user : ${userId}`);
    if (userId)
        userSocketMap[userId] = socket.id;
    //io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.emit("message", "Hello from server");
    socket.on("disconnect", () => {
        console.log(`user disconnected: ${socket.id}`);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});
