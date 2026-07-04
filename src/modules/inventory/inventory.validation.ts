import { z } from 'zod'

const parseDate = z.preprocess((value) => {
  if (typeof value === 'string' || value instanceof Date) {
    const date = new Date(value)
    return isNaN(date.getTime()) ? value : date
  }
  return value
}, z.date())

const inventoryConditionEnum = z.enum(['baik', 'rusak_ringan', 'rusak_berat', 'hilang'])

export const CreateInventorySchema = z.object({
  itemCode: z.string().trim().min(1).max(50),
  itemName: z.string().trim().min(1).max(255),
  photoUrl: z.string().url().optional(),
  categoryId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive(),
  condition: inventoryConditionEnum.default('baik'),
  acquiredDate: parseDate.optional(),
  acquisitionCost: z.coerce.number().positive().optional(),
  notes: z.string().optional(),
  managedBy: z.coerce.number().int().positive()
})

export const UpdateInventorySchema = CreateInventorySchema.partial()

export const FilterInventorySchema = z.object({
  photoUrl: z.string().url().optional(),
  condition: inventoryConditionEnum.optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10)
})

export type CreateInventoryInput = z.infer<typeof CreateInventorySchema>
export type UpdateInventoryInput = z.infer<typeof UpdateInventorySchema>
export type FilterInventoryInput = z.infer<typeof FilterInventorySchema>