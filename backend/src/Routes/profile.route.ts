// import { Router, Request, Response } from "express";
// import bcrypt from "bcrypt";
// import { asyncHandler } from "../middleware/asyncHandler";
// import { User } from "../models/User";
// import { requireAuth } from "../middleware/requireAuth";

// const router = Router();

// // ─── همة الـ session ───
// declare module "express-session" {
//   interface SessionData {
//     userId: string;
//     userRole: string;
//   }
// }

// // ─────────────────────────────────────────────
// // GET /api/auth/me
// // ─────────────────────────────────────────────
// router.get(
//   "/me",
//   requireAuth,
//   asyncHandler(async (req: Request, res: Response) => {
//     const user = await User.findById(req.session.userId).select(
//       "fullName email phone avatar provider role isVerified credits plan createdAt"
//     );

//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     res.json({ user });
//   })
// );

// // ─────────────────────────────────────────────
// // PATCH /api/auth/update-profile
// // بيعدل: fullName فقط (قابل للتوسعة)
// // ─────────────────────────────────────────────
// router.patch(
//   "/update-profile",
//   requireAuth,
//   asyncHandler(async (req: Request, res: Response) => {
//     const { fullName } = req.body as { fullName?: string };

//     if (!fullName || !fullName.trim()) {
//       res.status(400).json({ message: "الاسم مطلوب" });
//       return;
//     }

//     const user = await User.findByIdAndUpdate(
//       req.session.userId,
//       { fullName: fullName.trim() },
//       { new: true, runValidators: true }
//     ).select("fullName email phone avatar provider role isVerified credits plan createdAt");

//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     res.json({ message: "تم تحديث البيانات", user });
//   })
// );

// // ─────────────────────────────────────────────
// // POST /api/auth/change-password
// // شرط: المستخدم مسجل بـ provider = "local"
// // ─────────────────────────────────────────────
// router.post(
//   "/change-password",
//   requireAuth,
//   asyncHandler(async (req: Request, res: Response) => {
//     const { currentPassword, newPassword } = req.body as {
//       currentPassword?: string;
//       newPassword?: string;
//     };

//     if (!currentPassword || !newPassword) {
//       res.status(400).json({ message: "يرجى إدخال كلمة المرور الحالية والجديدة" });
//       return;
//     }

//     if (newPassword.length < 6) {
//       res.status(400).json({ message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });
//       return;
//     }

//     const user = await User.findById(req.session.userId);
//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     // المستخدم مسجل بـ Google أو Firebase ماعندوش password
//     if (user.provider !== "local" || !user.password) {
//       res.status(400).json({
//         message: "لا يمكن تغيير كلمة المرور لحسابات Google أو Firebase",
//       });
//       return;
//     }

//     const match = await bcrypt.compare(currentPassword, user.password);
//     if (!match) {
//       res.status(401).json({ message: "كلمة المرور الحالية غير صحيحة" });
//       return;
//     }

//     // منع تكرار نفس كلمة المرور
//     const sameAsOld = await bcrypt.compare(newPassword, user.password);
//     if (sameAsOld) {
//       res.status(400).json({ message: "كلمة المرور الجديدة مطابقة للقديمة" });
//       return;
//     }

//     user.password = await bcrypt.hash(newPassword, 12);
//     await user.save();

//     res.json({ message: "تم تغيير كلمة المرور بنجاح" });
//   })
// );

// export default router;