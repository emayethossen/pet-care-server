import express from "express";
import { userController } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";

const router = express.Router();

// signUp
router.post("/auth/signup", userController.signUp);

// Login
router.post("/auth/login", userController.login);

// Get Profile
router.get("/users/me", authMiddleware, userController.getProfile);

// Backend route in user.controller.js
router.get('/users/:id', userController.getUserById);


// Update Profile (with optional profile picture upload)
// router.put("/users/me", authMiddleware, upload.single("profilePicture"), userController.updateProfile);

router.put("/users/me", authMiddleware, userController.updateProfile);


// Forgot Password
router.post("/auth/forgot-password", userController.forgotPassword);

// Reset Password
router.post("/auth/reset-password/:token", userController.resetPassword);

// Follow User
router.post("/users/follow", authMiddleware, userController.follow);

router.get("/users/:userId/followers", authMiddleware, userController.getFollowers);
router.get("/users/:userId/following", authMiddleware, userController.getFollowing);


// Unfollow User
router.post("/users/unfollow", authMiddleware, userController.unfollow);

// Get posts from followed users
router.get("/users/following-posts", authMiddleware, userController.getFollowingPosts);

router.get('/check-premium-access', authMiddleware, userController.checkPremiumAccess);

router.get(
    "/admin/users",
    authMiddleware,
    adminMiddleware,
    userController.getAllUsers,
  );
  
  // Promote a user to admin (Admin only)
  router.post(
    "/admin/users/:id/promote",
    authMiddleware,
    adminMiddleware,
    userController.promoteUserToAdmin,
  );
  
  // Delete a user (Admin only)
  router.delete(
    "/admin/users/:id",
    authMiddleware,
    adminMiddleware,
    userController.deleteUser,
  );

export const UserRoutes = router;
