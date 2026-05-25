// أضف الكود ده في app.ts بتاعك قبل الـ routes

import express from "express";
import cookieParser from "cookie-parser";
import { sessionMiddleware } from "./config/Session";
import passport from "./modules/auth/strategies/google.strategy";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Session
app.use(sessionMiddleware);

// Passport
app.use(passport.initialize());
app.use(passport.session());   // مهم عشان Google OAuth يشتغل بـ session

export default app;
