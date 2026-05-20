import { z } from "zod"

export const updateMosqueProfileSchema = z.object({
  name: z.string().max(255),

  address: z.string().optional(),
  description: z.string().optional(),
  history: z.string().optional(),

  vision: z.string().optional(),
  mission: z.string().optional(),

  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),

  instagramUrl: z.string().url().optional(),
  youtubeUrl: z.string().url().optional(),
  facebookUrl: z.string().url().optional(),

  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  bankHolder: z.string().optional(),
})

export type UpdateMosqueProfileInput = z.infer<typeof updateMosqueProfileSchema>
