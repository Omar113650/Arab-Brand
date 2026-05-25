import session from "express-session";
import MongoStore from "connect-mongo";

export const sessionMiddleware = session({
  secret:            process.env.SESSION_SECRET!,
  resave:            false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl:    process.env.MONGO_URI!,
    collectionName: "sessions",
    ttl:         7 * 24 * 60 * 60, // 7 أيام
  }),
  cookie: {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge:   7 * 24 * 60 * 60 * 1000, // 7 أيام
  },
});
