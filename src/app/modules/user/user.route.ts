import express from "express";
import { userController } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";

const router = express.Router();

// signUp
router.post("/auth/signup", userController.signUp);

// Login
router.post("/auth/login", userController.login);

// Get Profile
router.get("/users/me", authMiddleware, userController.getProfile);

// Update Profile
// router.put("/users/me", authMiddleware, userController.updateProfile);

// Update Profile (with optional profile picture upload)
router.put("/users/me", authMiddleware, upload.single("profilePicture"), userController.updateProfile);


// Forgot Password
router.post("/auth/forgot-password", userController.forgotPassword);

// Reset Password
router.post("/auth/reset-password/:token", userController.resetPassword);

// Follow User
router.post("/users/follow", authMiddleware, userController.follow);

// Unfollow User
router.post("/users/unfollow", authMiddleware, userController.unfollow);


export const UserRoutes = router;
