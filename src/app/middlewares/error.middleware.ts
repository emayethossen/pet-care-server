import { Request, Response } from "express";

interface CustomError extends Error {
  status?: number;
  errors?: { path: string; message: string }[];
}

// Middleware function to handle errors
export const errorHandler = (err: CustomError, req: Request, res: Response) => {
  const status = err.status || 500;

  const errorResponse = {
    success: false,
    message: err.message || "Internal Server Error",
    errorMessages: err.errors || [{ path: "", message: err.message }],
  };

  res.status(status).json(errorResponse);
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
    errorMessages: [{ path: req.originalUrl, message: "Resource not found" }],
  });
};
