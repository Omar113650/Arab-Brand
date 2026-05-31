


import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { sessionMiddleware } from "./config/Session";
import passport from "./modules/auth/strategies/google.strategy";
import authRoutes from "./Routes/auth.route";
import projectRoutes from "./modules/generations/project.route";

const app = express();


app.set("trust proxy", 1);


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-gemini-api-key",
    ],
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message:
      "Too many requests from this IP, please try again later.",
  })
);


app.use(express.json());
app.use(cookieParser());


app.use(sessionMiddleware);


app.use(passport.initialize());
app.use(passport.session());


app.get("/", (req, res) => {
  res.send("Welcome to ArabBrand Studio API!");
});


app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "المسار غير موجود",
  });
});


app.use((err: any, req: any, res: any, next: any) => {
  console.error("Unhandled Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      err.message || "حدث خطأ غير متوقع في الخادم",
  });
});

export default app;