// import mongoose, { Schema, Document } from "mongoose";

// export interface IUser extends Document {
//   fullName: string;

//   email: string;

//   password: string;

//   avatar?: string;

//   provider: "local" | "google";

//   role: "user" | "admin";

//   isVerified: boolean;

//   credits: number;

//   plan: "free" | "pro";

//   refreshToken?: string;

//   createdAt: Date;

//   updatedAt: Date;
// }

// const userSchema = new Schema<IUser>(
//   {
//     fullName: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       // unique: true,
//       lowercase: true,
//       trim: true,
//     },

//     password: {
//       type: String,
//       required: true,
//     },

//     avatar: {
//       type: String,
//       default: "",
//     },

//     provider: {
//       type: String,
//       enum: ["local", "google"],
//       default: "local",
//     },

//     role: {
//       type: String,
//       enum: ["user", "admin"],
//       default: "user",
//     },

//     isVerified: {
//       type: Boolean,
//       default: false,
//     },

//     credits: {
//       type: Number,
//       default: 5,
//     },

//     plan: {
//       type: String,
//       enum: ["free", "pro"],
//       default: "free",
//     },

//     refreshToken: {
//       type: String,
//       default: "",
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// userSchema.methods.toJSON = function () {
//   const userObject = this.toObject();

//   delete userObject.password;

//   delete userObject.refreshToken;

//   return userObject;
// };

// const User = mongoose.model<IUser>("User", userSchema);

// export default User;

import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  fullName?: string;
  email?: string;
  phone?: string;
  password: string;
  avatar?: string;
  provider: "local" | "google" | "firebase" | "phone";
  firebaseUid?: string;
  role: "user" | "admin";
  isVerified: boolean;
  credits: number;
  plan: "free" | "pro";
  refreshToken?: string;
  // ── جديد ──
  otp?: string;
  otpExpiresAt?: Date;
  resetPasswordToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, trim: true, default: "" },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      default: null,
    },
    phone: { type: String, trim: true, default: null, index: true },
    password: { type: String, default: "" },
    avatar: { type: String, default: "" },
    provider: {
      type: String,
      enum: ["local", "google", "firebase", "phone"],
      default: "local",
    },
    firebaseUid: { type: String, default: null, index: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    credits: { type: Number, default: 5 },
    plan: { type: String, enum: ["free", "pro"], default: "free" },
    refreshToken: { type: String, default: "" },

    // ── جديد ──
    otp: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    resetPasswordToken: { type: String, default: null },
  },
  { timestamps: true },
);

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.refreshToken;
  delete userObject.otp;
  delete userObject.otpExpiresAt;
  delete userObject.resetPasswordToken;
  return userObject;
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
