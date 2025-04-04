"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessage = exports.insertMessage = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const message_model_1 = __importDefault(require("../models/message.model"));
const socket_1 = require("../lib/socket");
exports.insertMessage = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { message, file } = req.body;
    const receiver = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
    const sender = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    if (!message.trim() || !receiver && !file) {
        return res.status(400).json({
            message: "Something is missing",
            success: false,
            data: null
        });
    }
    try {
        const data = yield message_model_1.default.create({
            message: message !== null && message !== void 0 ? message : "",
            file: file !== null && file !== void 0 ? file : "",
            sender,
            receiver
        });
        // realtime message send and receive
        const receiverSocketId = (0, socket_1.getReceiverSocketId)(receiver);
        console.log("receiver", receiverSocketId);
        if (receiverSocketId) {
            socket_1.io.to(receiverSocketId).emit("newMessage", data);
        }
        return res.status(201).json({
            message: "Message Sent",
            success: true,
            data
        });
    }
    catch (error) {
        return res.status(400).json({
            message: error.message,
            success: false,
            data: null
        });
    }
}));
exports.getMessage = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const receiver = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
    //@ts-ignore
    const sender = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
    try {
        const messages = yield message_model_1.default.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender }
            ]
        })
            .populate({ path: "sender", select: "-password" })
            .populate({ path: "receiver", select: "-password" });
        return res.status(200).json({
            message: "Successfully get messages",
            success: true,
            data: messages
        });
    }
    catch (error) {
        return res.status(400).json({
            message: error.message,
            success: false,
            data: null
        });
    }
}));
