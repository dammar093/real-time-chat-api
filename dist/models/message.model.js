"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSchem = void 0;
const mongoose_1 = require("mongoose");
exports.MessageSchem = new mongoose_1.Schema({
    message: {
        type: String,
    },
    file: {
        type: String
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});
const Message = (0, mongoose_1.model)("Message", exports.MessageSchem);
exports.default = Message;
