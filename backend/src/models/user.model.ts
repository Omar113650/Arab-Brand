import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;

  email: string;

  password: string;

  avatar?: string;

  provider: "local" | "google";

  role: "user" | "admin";

  isVerified: boolean;

  credits: number;

  plan: "free" | "pro";

  refreshToken?: string;

  createdAt: Date;

  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      // unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    credits: {
      type: Number,
      default: 5,
    },

    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },

    refreshToken: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  delete userObject.password;

  delete userObject.refreshToken;

  return userObject;
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
