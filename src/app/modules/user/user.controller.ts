import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userValidation } from "./user.validation";
import { UserServices } from "./user.service";
import { TUser } from "./user.interface";
import config from "../../config";

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
};
