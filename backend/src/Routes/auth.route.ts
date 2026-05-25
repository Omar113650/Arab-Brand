import { Router } from "express";
import passport from "../modules/auth/strategies/google.strategy";
import {
  register,
  login,
  logout,
  getMe,
} from "../modules/auth/AuthController";

const router = Router();

/* ───────────────── Local Auth ───────────────── */

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getMe);

/* ───────────────── Google Auth ───────────────── */

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: true,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: true,
  }),
  async (req, res) => {
    try {
      // المستخدم اتسجل دخوله
      return res.redirect("http://localhost:5173/dashboard");
    } catch (error) {
      console.error("Google Callback Error:", error);

      return res.redirect("http://localhost:5173/login");
    }
  }
);

export default router;