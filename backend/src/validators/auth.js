import { z } from "zod";

const nameRule = z.string().min(20, "Name must be at least 20 chars").max(60, "Name max 60 chars");
const addressRule = z.string().max(400, "Address max 400 chars");
const emailRule = z.string().email("Invalid email");
const passwordRule = z
  .string()
  .min(8, "Password min 8 chars")
  .max(16, "Password max 16 chars")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[^A-Za-z0-9]/, "Password must include a special character");

export const registerSchema = z.object({
  name: nameRule,
  email: emailRule,
  address: addressRule,
  password: passwordRule
});

export const loginSchema = z.object({
  email: emailRule,
  password: z.string().min(1)
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordRule
});
