import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function connectDB() {
  // connect to database
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}/chat-app`);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

export default connectDB;