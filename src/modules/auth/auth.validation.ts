import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  otpCode: z.string().optional()
})

export const verifyLoginTwoFactorSchema = z.object({
  tempToken: z.string().min(10),
  token: z.string().min(6).max(6)
})

export const verifyTwoFactorSchema = z.object({
  otpCode: z
    .string()
    .min(6)
    .max(6)
})

export const disableTwoFactorSchema = z.object({
  otpCode: z
    .string()
    .min(6)
    .max(6)
})

export const forgotPasswordSchema = z.object({
  email: z.string().email()
})

export const resetPasswordSchema = z.object({
  token: z.string().min(10),

  password: z
    .string()
    .min(8)
    .max(100)
})