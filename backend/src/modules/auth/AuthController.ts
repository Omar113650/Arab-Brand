import bcrypt from "bcrypt";
import crypto from "crypto";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../../models/user.model";
import "express-session";
import EmailService from "../email/email.service";

declare module "express-session" {
  interface SessionData {
    userId: string;
    userRole: string;
  }
}

const logger = {
  info: (msg: string, data?: any) => {
    console.log(`\n[INFO] ${msg}`);
    if (data) console.log(data);
  },
  success: (msg: string, data?: any) => {
    console.log(`\n[SUCCESS] ${msg}`);
    if (data) console.log(data);
  },
  warn: (msg: string, data?: any) => {
    console.log(`\n[WARN] ${msg}`);
    if (data) console.log(data);
  },
  error: (msg: string, err?: any) => {
    console.log(`\n[ERROR] ${msg}`);
    if (err) console.error(err);
  },
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;
  logger.info("REGISTER REQUEST", { fullName, email });

  if (!fullName || !email || !password) {
    res.status(400).json({ message: "fullName, email, password required" });
    return;
  }

  const exists = await User.findOne({ email });
  if (exists) {
    logger.warn("EMAIL EXISTS", { email });
    res.status(409).json({ message: "Email already exists" });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const otp = crypto.randomInt(100000, 999999).toString();
  const otpHash = await bcrypt.hash(otp, 5);
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  const user = await User.create({
    fullName,
    email,
    password: hashed,
    role: "user",
    isVerified: false,
    credits: 5,
    plan: "free",
    otp: otpHash,
    otpExpiresAt,
  });
  try {
    await EmailService.sendOtpEmail({
      to: email,
      otp,
      subject: "Your OTP Verification Code",
    });
    console.log("✅ OTP email sent to:", email);
  } catch (emailErr) {
    console.error("❌ Email error:", emailErr);
  }
  // logger.success("USER CREATED", { userId: user._id });
  // req.session.userId = user._id.toString();
  // req.session.userRole = user.role;

  res.status(201).json({ message: "User registered", user });
});

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    console.log("🔥 VERIFY OTP CALLED");
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    if (user.isVerified) {
      res.status(200).json({ message: "Already verified" });
      return;
    }
    if (!otp) {
      res.status(400).json({ message: "OTP is required" });
      return;
    }
    if (!user.otp) {
      res.status(400).json({ message: "OTP not set for user" });
      return;
    }

    const match = await bcrypt.compare(otp, user.otp);
    if (!match) {
      res.status(400).json({ message: "Invalid OTP" });
      return;
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    try {
      await EmailService.sendOtpSuccessEmail({
        to: email,
        subject: "Verification successful",
      });
    } catch (e) {
      console.error("❌ Email error:", e);
    }

    res.status(200).json({ message: "Verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  logger.info("RESEND OTP", { email });

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  user.otp = await bcrypt.hash(otp, 5);
  user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await user.save(); // ✅ إصلاح: حذف الكود الخطأ (this.userRepository + قوس ناقص)

  logger.success("NEW OTP GENERATED", { otp });

  await EmailService.sendOtpEmail({
    // ✅ إصلاح: كان this.EmailService
    to: email,
    otp,
    subject: "New OTP to Verification Code",
  });

  res.json({ message: "OTP sent" });
});

export const forgetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    logger.info("FORGET PASSWORD", { email });

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    await user.save();

    const link = `${process.env.FRONTEND_URL}/reset-password/${user._id}/${token}`;
    logger.info("RESET LINK", { link });

    await EmailService.sendResetPasswordEmail(email, link); // ✅ إصلاح: كان ناقص

    res.json({ message: "Email sent" });
  },
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, resetPasswordToken, newPassword } = req.body;
    logger.info("RESET PASSWORD", { userId });

    const user = await User.findById(userId);
    if (!user || user.resetPasswordToken !== resetPasswordToken) {
      res.status(400).json({ message: "Invalid token" });
      return;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    await user.save();

    logger.success("PASSWORD RESET DONE", { userId });
    res.json({ message: "Password updated" });
  },
);

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  logger.info("LOGIN REQUEST", { email });

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }
  if (!user.isVerified) {
    res.status(403).json({ message: "Verify email first" });
    return;
  }

  req.session.userId = user._id.toString();
  req.session.userRole = user.role;

  logger.success("LOGIN SUCCESS", { userId: user._id });
  res.json({ message: "Logged in", user });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  logger.info("LOGOUT", { userId: req.session.userId });
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    logger.success("LOGOUT DONE");
    res.json({ message: "Logged out" });
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  logger.info("GET ME", { userId: req.session.userId });
  const user = await User.findById(req.session.userId).select("-password");
  if (!user) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.json({ user });
});
