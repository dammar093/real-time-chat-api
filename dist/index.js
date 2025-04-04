"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_1 = require("./lib/socket");
//import all router
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const message_route_1 = __importDefault(require("./routes/message.route"));
const db_1 = __importDefault(require("./lib/db"));
// connect to database
(0, db_1.default)();
// configuration
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
// middleware
socket_1.app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
socket_1.app.use(express_1.default.json());
socket_1.app.use(express_1.default.urlencoded({ extended: true }));
socket_1.app.use((0, cookie_parser_1.default)());
// routes middleware
socket_1.app.use("/api/v1/auth", auth_route_1.default);
socket_1.app.use("/api/v1/users", user_route_1.default);
socket_1.app.use("/api/v1/messages", message_route_1.default);
socket_1.app.get("/", (req, res) => {
    res.send("Hello World");
});
socket_1.server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
