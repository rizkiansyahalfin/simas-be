import { z } from "zod";
export const createUserSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["superadmin", "bendahara", "admin_kegiatan", "admin_inventaris"])
});
export const updateUserSchema = z.object({
    username: z.string().min(3).optional(),
    email: z.string().email().optional(),
    role: z.enum(["superadmin", "bendahara", "admin_kegiatan", "admin_inventaris"]).optional()
});
