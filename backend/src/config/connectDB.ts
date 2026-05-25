import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);

    isConnected = conn.connections[0].readyState === 1;

    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
};