import { z } from "zod"

const parseOptionalDate = z.preprocess((value) => {
  if (typeof value === "string" || value instanceof Date) {
    const date = new Date(value)
    return isNaN(date.getTime()) ? value : date
  }
  return value
}, z.date().optional())

const parseOptionalBoolean = z.preprocess((value) => {
  if (typeof value === "string") {
    const lower = value.toLowerCase()
    if (lower === "true") return true
    if (lower === "false") return false
  }
  return value
}, z.boolean().optional())

export const createCongregationSchema = z.object({
  fullName: z.string().trim().min(3).max(255),
  nik: z.string().trim().max(50).optional(),
  address: z.string().trim().optional(),
  phone: z.string().trim().max(20).optional(),
  gender: z.enum(["male", "female"]).optional(),
  birthDate: parseOptionalDate,
  isMustahik: z.boolean().optional()
})

export const updateCongregationSchema = createCongregationSchema.partial()

export const congregationQuerySchema = z.object({
  search: z.string().trim().optional(),
  gender: z.enum(["male", "female"]).optional(),
  isMustahik: parseOptionalBoolean,
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10)
})

export type CreateCongregationInput = z.infer<typeof createCongregationSchema>
export type UpdateCongregationInput = z.infer<typeof updateCongregationSchema>
export type CongregationQueryInput = z.infer<typeof congregationQuerySchema>