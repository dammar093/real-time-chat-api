import { Request, Response } from "express";
import User, { comparePassword } from "../models/user.model";
import generateJwtToken from "../utils/generateJwtToken";
import asyncHandler from "../utils/asyncHandler";


export const userSignup = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  console.log(email, password, name)

  if (!email?.trim() || !password?.trim() || !name?.trim()) {
    return res.status(400).json({ message: "All fields are required.", success: false, data: null });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long.", success: false, data: null });
  }
  try {
    const exitinhUser = await User.find({ email });
    if (exitinhUser.length > 0) {
      return res.status(400).json({ message: "User already exists.", success: false, data: null });
    }
    const user = await User.create({ email, password, name: name });
    const token = generateJwtToken(user._id);
    return res.cookie("token", token).status(201).json({
      message: "User created successfully.", success: true, data: {
        token
      }
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message, success: false, data: null });
  }
})

export const userLogin = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Inavlid crendtials.", success: false, data: null });
    }

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "Invalid credentials.", success: false, data: null });
      }
      const token = generateJwtToken(user._id);
      const isPasswordValid = comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials.", success: false, data: null });
      }
      return res.cookie("token", token).status(200).json({
        message: "User logged in successfully.", success: true, data: {
          token
        }
      });
    } catch (err: any) {
      return res.status(500).json({ message: err.message, success: false, data: null });
    }
  }
)

export const userMe = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      // @ts-ignore
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found.", success: false, data: null });
      }
      return res.status(200).json({ message: "User fetched successfully.", success: true, data: user });
    } catch (error: any) {
      return res.status(500).json({ message: error.message, success: false, data: null });
    }
  });

export const userLogout = asyncHandler(
  async (req: Request, res: Response) => {
    return res.clearCookie("token").status(200).json({ message: "User logged out successfully.", success: true, data: null });
  });
