import { Router } from "express";
import passport from "../modules/auth/strategies/google.strategy";
import {
  register,
  login,
  logout,
  getMe,
  resetPassword,
  forgetPassword,
  verifyOtp,
  resendOtp,
} from "../modules/auth/AuthController";

console.log("✅ AUTH ROUTER LOADED");

const router = Router();

router.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-otp", verifyOtp);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
router.post("/resend-otp", resendOtp);
router.get("/me", getMe);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: true,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: true,
  }),
  (req: any, res) => {
    console.log("✅ Google callback reached");

    req.session.userId = req.user._id.toString();
    req.session.userRole = req.user.role;

    req.session.save((err: any) => {
      if (err) {
        console.error(err);
        return res.redirect("http://localhost:5173/login");
      }

      return res.redirect("http://localhost:5173/dashboard");
    });
  }
);

export default router;