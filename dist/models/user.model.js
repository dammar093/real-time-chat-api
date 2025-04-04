"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, min: 6 },
    name: { type: String, required: true },
    profilePic: {
        type: String, required: false, default: "https://www.gravatar.com/avatar/?d=identicon",
    },
});
exports.UserSchema.pre("save", hashPassword);
const User = (0, mongoose_1.model)("User", exports.UserSchema);
exports.default = User;
function hashPassword(next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = bcryptjs_1.default.hashSync(this.password, 10);
    next();
}
function comparePassword(password, hash) {
    return bcryptjs_1.default.compareSync(password, hash);
}
