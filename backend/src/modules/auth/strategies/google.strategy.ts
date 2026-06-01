import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import User from "../../../models/user.model";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },

    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        const avatar = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error("Google account has no email"), false);
        }

        let user = await User.findOne({ email });

        if (user) {
          // لو الحساب معمول بإيميل/باسورد عادي
          if (user.provider === "local") {
            user.provider = "google";

            if (!user.avatar && avatar) {
              user.avatar = avatar;
            }

            user.isVerified = true;

            await user.save();
          }

          return done(null, user);
        }

        user = await User.create({
          fullName: profile.displayName,

          email: email.toLowerCase(),

          password: "GOOGLE_OAUTH",

          provider: "google",

          avatar: avatar || "",

          isVerified: true,

          role: "user",

          credits: 5,

          plan: "free",
        });

        return done(null, user);
      } catch (error) {
        console.error("Google Strategy Error:", error);

        return done(error as Error, false);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id).select("-password");

    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
