"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.userLogout = exports.userMe = exports.userLogin = exports.userSignup = void 0;
const user_model_1 = __importStar(require("../models/user.model"));
const generateJwtToken_1 = __importDefault(require("../utils/generateJwtToken"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
exports.userSignup = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    console.log(email, password, name);
    if (!(email === null || email === void 0 ? void 0 : email.trim()) || !(password === null || password === void 0 ? void 0 : password.trim()) || !(name === null || name === void 0 ? void 0 : name.trim())) {
        return res.status(400).json({ message: "All fields are required.", success: false, data: null });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long.", success: false, data: null });
    }
    try {
        const exitinhUser = yield user_model_1.default.find({ email });
        if (exitinhUser.length > 0) {
            return res.status(400).json({ message: "User already exists.", success: false, data: null });
        }
        const user = yield user_model_1.default.create({ email, password, name: name });
        const token = (0, generateJwtToken_1.default)(user._id);
        return res.cookie("token", token).status(201).json({
            message: "User created successfully.", success: true, data: {
                token
            }
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message, success: false, data: null });
    }
}));
exports.userLogin = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Inavlid crendtials.", success: false, data: null });
    }
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid credentials.", success: false, data: null });
        }
        const token = (0, generateJwtToken_1.default)(user._id);
        const isPasswordValid = (0, user_model_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials.", success: false, data: null });
        }
        return res.cookie("token", token).status(200).json({
            message: "User logged in successfully.", success: true, data: {
                token
            }
        });
    }
    catch (err) {
        return res.status(500).json({ message: err.message, success: false, data: null });
    }
}));
exports.userMe = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const user = yield user_model_1.default.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found.", success: false, data: null });
        }
        return res.status(200).json({ message: "User fetched successfully.", success: true, data: user });
    }
    catch (error) {
        return res.status(500).json({ message: error.message, success: false, data: null });
    }
}));
exports.userLogout = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.clearCookie("token").status(200).json({ message: "User logged out successfully.", success: true, data: null });
}));
