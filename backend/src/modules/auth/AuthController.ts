import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../../models/user.model";

import "express-session";

declare module "express-session" {
  interface SessionData {
    userId: string;
    userRole: string;
  }
}

/* 
   @desc    Register
   @route   POST /api/auth/register
   @access  Public
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    res.status(400).json({ message: "fullName و email و password مطلوبين" });
    return;
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409).json({ message: "الإيميل مسجل بالفعل" });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    fullName,
    email,
    password: hashed,
    provider: "local",
    role: "user",
    isVerified: false,
    credits: 5,
    plan: "free",
  });

  // حفظ الـ session
  req.session.userId = user._id.toString();
  req.session.userRole = user.role;

  res.status(201).json({
    message: "تم التسجيل بنجاح",
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      plan: user.plan,
      credits: user.credits,
      isVerified: user.isVerified,
    },
  });
});

/* 
   @desc    Login
   @route   POST /api/auth/login
   @access  Public
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "email و password مطلوبين" });
    return;
  }

  const user = await User.findOne({ email });
  if (!user || user.provider !== "local") {
    res.status(401).json({ message: "بيانات غلط" });
    return;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(401).json({ message: "بيانات غلط" });
    return;
  }

  // حفظ الـ session
  req.session.userId = user._id.toString();
  req.session.userRole = user.role;

  res.status(200).json({
    message: "تم تسجيل الدخول",
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      plan: user.plan,
      credits: user.credits,
      isVerified: user.isVerified,
    },
  });
});

/* 
   @desc    Logout
   @route   POST /api/auth/logout
   @access  Private
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: "فشل تسجيل الخروج" });
      return;
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "تم تسجيل الخروج" });
  });
});

/* 
   @desc    Get current user
   @route   GET /api/auth/me
   @access  Private
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.session.userId).select("-password");
  if (!user) {
    res.status(404).json({ message: "مش موجود" });
    return;
  }
  res.status(200).json({ user });
});
