"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyJwtToken_1 = __importDefault(require("../middlewares/verifyJwtToken"));
const message_controller_1 = require("../controllers/message.controller");
const messageRouter = (0, express_1.Router)();
messageRouter.post("/:id", verifyJwtToken_1.default, message_controller_1.insertMessage);
messageRouter.get("/:id", verifyJwtToken_1.default, message_controller_1.getMessage);
exports.default = messageRouter;
