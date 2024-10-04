import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";

const UserSchema = new Schema<TUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin", "user"] },
    profilePicture: { type: String },
    bio: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }], 
  },
  { timestamps: true },
);

export const User = model<TUser>("User", UserSchema);
