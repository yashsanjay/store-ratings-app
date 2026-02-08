import { z } from "zod";

const nameRule = z.string().min(20).max(60);
const addressRule = z.string().max(400);
const emailRule = z.string().email();
const passwordRule = z
  .string()
  .min(8)
  .max(16)
  .regex(/[A-Z]/)
  .regex(/[^A-Za-z0-9]/);

export const createUserSchema = z.object({
  name: nameRule,
  email: emailRule,
  address: addressRule,
  password: passwordRule,
  role: z.enum(["SYSTEM_ADMIN", "NORMAL_USER", "STORE_OWNER"])
});

export const listFiltersSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(["SYSTEM_ADMIN", "NORMAL_USER", "STORE_OWNER"]).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional()
});

export const createStoreSchema = z.object({
  name: z.string().min(1).max(120),
  email: emailRule,
  address: addressRule,
  ownerId: z.string().optional()
});
