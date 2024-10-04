import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userValidation } from "./user.validation";
import { UserServices } from "./user.service";
import { TUser } from "./user.interface";
import config from "../../config";
import { User } from "./user.model";
import PetStory from '../post/post.model';

export const userController = {
  signUp: async (req: Request, res: Response) => {
    try {
      const userData = userValidation.userValidationSchema.parse(req.body);
      const result = await UserServices.createUser(userData);

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: result,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errorMessages: [{ path: "", message: err.message }],
      });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await UserServices.authenticateUser(email, password);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Authentication failed",
        });
      }

      const token = jwt.sign(
        { _id: user._id, role: user.role },
        config.jwt_secret as string,
        { expiresIn: "1h" },
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        role: user.role,
        data: user,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errorMessages: [{ path: "", message: err.message }],
      });
    }
  },

  getProfile: async (req: Request, res: Response) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "User profile retrieved successfully",
        data: user,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errorMessages: [{ path: "", message: err.message }],
      });
    }
  },

  getUserById: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId); // MongoDB call to fetch user by ID
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },


  updateProfile: async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const updatedData = req.body as Partial<TUser>;

      // If a file is uploaded for profile picture
      if (req.file) {
        updatedData.profilePicture = `/uploads/${req.file.filename}`;
      }

      const user = await UserServices.updateUser(userId, updatedData);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "User profile updated successfully",
        data: user,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errorMessages: [{ path: "", message: err.message }],
      });
    }
  },

  forgotPassword: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      await UserServices.requestPasswordReset(email);

      res.status(200).json({
        success: true,
        message: "Password reset link sent to your email.",
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errorMessages: [{ path: "", message: err.message }],
      });
    }
  },

  resetPassword: async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      await UserServices.resetPassword(token, password);

      res.status(200).json({
        success: true,
        message: "Password reset successfully.",
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errorMessages: [{ path: "", message: err.message }],
      });
    }
  },

  follow: async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      const { followUserId } = req.body;

      if (!userId || !followUserId) {
        return res.status(400).json({
          success: false,
          message: "Missing user information",
        });
      }

      const result = await UserServices.followUser(userId, followUserId);

      res.status(200).json({
        success: true,
        message: `You are now following ${result?.name}`,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errorMessages: [{ path: "", message: err.message }],
      });
    }
  },


  getFollowers: async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    try {
      // Populate the 'followers' field
      const user = await User.findById(req.user._id).populate('followers', 'name profilePicture');

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // Return the populated followers
      res.status(200).json({ success: true, data: user.followers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Unable to fetch followers" });
    }
  },
  getFollowing: async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    try {
      // Populate the 'followers' field
      const user = await User.findById(req.user._id).populate('following', 'name profilePicture');

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // Return the populated followers
      res.status(200).json({ success: true, data: user.followers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Unable to fetch following" });
    }
  },


  unfollow: async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      const { unfollowUserId } = req.body;

      if (!userId || !unfollowUserId) {
        return res.status(400).json({
          success: false,
          message: "Missing user information",
        });
      }

      const result = await UserServices.unfollowUser(userId, unfollowUserId);
      console.log(result)
      res.status(200).json({
        success: true,
        message: `You have unfollowed ${result}`,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errorMessages: [{ path: "", message: err.message }],
      });
    }
  },

  // Get posts from users the logged-in user is following
  getFollowingPosts: async (req: Request, res: Response) => {
    try {
      const currentUser = await User.findById(req.user?._id).populate("following", "name");

      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const followingIds = currentUser.following?.map(user => user._id);
      const posts = await PetStory.find({ author: { $in: followingIds } }); // Assuming you have a 'Post' model

      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },


};
