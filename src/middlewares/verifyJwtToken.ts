import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";

const verifyJwtToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized", success: false, data: null });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded as { id?: string; name?: string; email?: string; password?: string };
    next();
  } catch (err: any) {
    return res.status(401).json({ message: "Unauthorized", success: false, data: null });
  }
})
export default verifyJwtToken;