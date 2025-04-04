import { Request, Response } from "express";
import User from "../models/user.model";
import asyncHandler from "../utils/asyncHandler";

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({ message: "Users fetched successfully", success: true, data: users });
  } catch (error: any) {
    return res.status(500).json({ message: error.message, success: false, data: null });
  }
});