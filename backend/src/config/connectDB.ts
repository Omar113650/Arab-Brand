import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
    });

    isConnected = conn.connections[0].readyState === 1;

    console.log("MongoDB connected");
  } catch (err: any) {
    console.error("MongoDB connection failed:");

    // 👇 أهم خطوة: طباعة error بشكل مفصل
    console.error({
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack,
    });

    // ❌ متكسرش السيرفر فورًا في dev
    throw new Error("Database connection failed");
  }
};