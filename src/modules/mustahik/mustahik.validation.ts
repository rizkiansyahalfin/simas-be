import { z } from "zod"

export const createMustahikSchema = z.object({
  congregationId: z.number().int().positive(),
  category: z.enum([
    "fakir",
    "miskin",
    "amil",
    "muallaf",
    "riqab",
    "gharim",
    "fisabilillah",
    "ibnu_sabil"
  ]),
  notes: z.string().optional()
})

export const updateMustahikSchema = createMustahikSchema.partial()

export const mustahikQuerySchema = z.object({
  category: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10)
})

export type CreateMustahikInput = z.infer<typeof createMustahikSchema>
export type UpdateMustahikInput = z.infer<typeof updateMustahikSchema>
export type MustahikQueryInput = z.infer<typeof mustahikQuerySchema>