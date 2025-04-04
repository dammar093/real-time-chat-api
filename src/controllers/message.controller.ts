import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import Message from "../models/message.model";
import { getReceiverSocketId, io } from "../lib/socket";

export const insertMessage = asyncHandler(async (req: Request, res: Response) => {
  const { message, file } = req.body;
  const receiver = req.params?.id
  const sender = req.user?.id
  if (!message.trim() || !receiver && !file) {
    return res.status(400).json({
      message: "Something is missing",
      success: false,
      data: null
    })
  }

  try {
    const data = await Message.create({
      message: message ?? "",
      file: file ?? "",
      sender,
      receiver
    })
    // realtime message send and receive
    const receiverSocketId = getReceiverSocketId(receiver);
    console.log("receiver", receiverSocketId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", data)
    }
    return res.status(201).json({
      message: "Message Sent",
      success: true,
      data
    })
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
      success: false,
      data: null
    })
  }
})

export const getMessage = asyncHandler(async (req: Request, res: Response) => {
  const receiver = req.params?.id;
  //@ts-ignore
  const sender = req.user?.id;
  try {
    const messages = await Message.find({
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
    })
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
      success: false,
      data: null
    })
  }
})