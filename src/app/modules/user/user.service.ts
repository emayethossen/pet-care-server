import config from "../../config";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";

const createUser = async (userData: TUser) => {
  const hashedPassword = await bcrypt.hash(
    userData.password,
    Number(config.bcrypt_salt_rounds),
  );
  userData.password = hashedPassword;
  const user = await User.create(userData);
  return user.save();
};

const authenticateUser = async (
  email: string,
  password: string,
): Promise<TUser | null> => {
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  return user;
};

const getUserById = async (userId: string): Promise<TUser | null> => {
  return User.findById(userId);
};

const updateUser = async (
  userId: string,
  updateData: Partial<TUser>,
): Promise<TUser | null> => {
  return User.findByIdAndUpdate(userId, updateData, { new: true });
};

const requestPasswordReset = async (email: string): Promise<void> => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  // Generate reset token
  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1-hour expiration
  // 1-hour expiration
  await user.save();

  // Send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    to: user.email,
    from: process.env.EMAIL_USER,
    subject: "Password Reset",
    text: `You are receiving this because you have requested a password reset. Please click the link below to reset your password:
    http://localhost:3000/reset-password/${token}
    If you did not request this, please ignore this email.`,
  };

  await transporter.sendMail(mailOptions);
};

const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("Invalid or expired token");

  const hashedPassword = await bcrypt.hash(newPassword, Number(config.bcrypt_salt_rounds));
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
};

const followUser = async (currentUserId: string, followUserId: string): Promise<TUser | null> => {
  const user = await User.findById(currentUserId);
  const userToFollow = await User.findById(followUserId);

  if (!user || !userToFollow) throw new Error("User not found");

  // Add to 'following' list if not already present
  if (!user.following?.includes(followUserId)) {
    user.following?.push(followUserId);
  }

  // Add to 'followers' list if not already present
  if (!userToFollow.followers?.includes(currentUserId)) {
    userToFollow.followers?.push(currentUserId);
  }

  await user.save();
  await userToFollow.save();

  return userToFollow;
};

const unfollowUser = async (userId: string, unfollowUserId: string): Promise<string | null> => {
  const user = await User.findById(userId);
  const unfollowUser = await User.findById(unfollowUserId);

  if (!user || !unfollowUser) {
    throw new Error("User not found");
  }

  // Check if user is already following the unfollowUser
  if (!user?.following?.includes(unfollowUserId)) {
    throw new Error("You are not following this user");
  }

  // Remove unfollowUserId from the user's following list
  await User.findByIdAndUpdate(userId, {
    $pull: { following: unfollowUserId }
  });

  // Remove userId from the unfollowUser's followers list
  await User.findByIdAndUpdate(unfollowUserId, {
    $pull: { followers: userId }
  });

  return unfollowUser.name;
};

const getAllUsers = async (): Promise<TUser[]> => {
  return User.find();
};

const promoteUserToAdmin = async (userId: string): Promise<TUser | null> => {
  const user = await User.findById(userId);
  if (!user) {
    return null;
  }
  user.role = "admin";
  return user.save();
};

const deleteUserById = async (userId: string): Promise<TUser | null> => {
  const result = await User.findByIdAndDelete(userId);
  return result;
};

export const UserServices = {
  createUser,
  authenticateUser,
  getUserById,
  updateUser,
  requestPasswordReset,
  resetPassword,
  followUser,
  unfollowUser,
  getAllUsers,
  promoteUserToAdmin,
  deleteUserById
};
