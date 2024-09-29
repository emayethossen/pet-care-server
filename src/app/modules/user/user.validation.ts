import { z } from "zod";

const userValidationSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .max(20, { message: "Password can not be more than 20 characters" })
    .min(6, { message: "Password must be at least 6 characters long" }),
  phone: z.string({ required_error: "Phone no is required" }),
  role: z.enum(["admin", "user"], {
    message: "Role must be either admin or user",
  }),
});

const passwordResetValidationSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(20, { message: "Password can not be more than 20 characters" }),
});

export const userValidation = {
  userValidationSchema,
  passwordResetValidationSchema
};
