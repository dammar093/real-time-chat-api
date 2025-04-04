"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const verifyJwtToken_1 = __importDefault(require("../middlewares/verifyJwtToken"));
const authRouter = (0, express_1.Router)();
authRouter.post("/signup", auth_controller_1.userSignup);
authRouter.post("/login", auth_controller_1.userLogin);
authRouter.get("/me", verifyJwtToken_1.default, auth_controller_1.userMe);
authRouter.get("/logout", verifyJwtToken_1.default, auth_controller_1.userLogout);
exports.default = authRouter;
