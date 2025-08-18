import { z } from "zod";

export const registerValidationSchema = z.object({
  name: z.string({
    error: "Name is required",
  }),
  email: z
    .string({
      error: "Email is required",
    })
    .email({ message: "Invalid email format" }),
  password: z
    .string({
      error: "Password is required",
    })
    .min(8, { message: "Password must be at least 8 characters" }),
  role: z.enum(["admin", "trainer", "trainee"]).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  picture: z.string().optional(),
});

export const loginValidationSchema = z.object({
  email: z
    .string({
      error: "Email is required",
    })
    .email({ message: "Invalid email format" }),
  password: z
    .string({
      error: "Password is required",
    })
    .min(1, { message: "Password is required" }),
});
