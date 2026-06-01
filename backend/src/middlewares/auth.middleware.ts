import { Request, Response, NextFunction } from "express";

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.session || !req.session.userId) {
    res
      .status(401)
      .json({ message: "غير مصرح بالدخول، يرجى تسجيل الدخول أولاً" });
    return;
  }
  next();
};
