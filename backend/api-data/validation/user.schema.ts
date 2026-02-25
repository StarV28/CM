import { z } from "zod";

export const userSignUpSchema = z.object({
  name: z.string().min(3).max(20).trim(),
  email: z.string().trim().min(3).max(254).email(),
  password: z.string().min(6).max(2048),
  locale: z.string().optional(),
});

export const userLogInSchema = z.object({
  email: z.string().trim().min(3).max(254).email(),
  password: z.string().min(6).max(2048),
});

export const changePassSchema = z.object({
  email: z.string().trim().min(3).max(254).email(),
});

export const updateUserSchema = z.object({
  name: z.string().min(3).max(20).trim(),
  email: z.string().trim().min(3).max(254).email(),
});
