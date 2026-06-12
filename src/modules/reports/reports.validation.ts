import { z } from "zod"

export const monthlyFinanceQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000)
})

export const weeklyFinanceQuerySchema = z.object({
  startDate: z.coerce.date().refine(
    (value) => !Number.isNaN(value.getTime()),
    "Invalid startDate"
  ),
  endDate: z.coerce.date().refine(
    (value) => !Number.isNaN(value.getTime()),
    "Invalid endDate"
  )
})

export const monthlyZisQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000),
  format: z.enum(["pdf"]).default("pdf"),
})

export type MonthlyFinanceQuery = z.infer<typeof monthlyFinanceQuerySchema>
export type WeeklyFinanceQuery = z.infer<typeof weeklyFinanceQuerySchema>
export type MonthlyZisQuery = z.infer<typeof monthlyZisQuerySchema>
