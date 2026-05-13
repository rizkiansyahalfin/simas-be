import { z } from 'zod'

export const CreateInventorySchema = z.object({
  itemCode: z.string().min(1, 'Kode item wajib diisi'),
  itemName: z.string().min(1, 'Nama item wajib diisi'),
  category: z.string().min(1, 'Kategori wajib diisi'),
  quantity: z.number().int().positive('Jumlah harus lebih dari 0'),
  condition: z.enum(['baik', 'rusak_ringan', 'rusak_berat', 'hilang']).default('baik'),
  acquiredDate: z.coerce.date().optional(),
  acquisitionCost: z.number().positive().optional(),
  notes: z.string().optional(),
  managedBy: z.number().int().positive(),
})

export const UpdateInventorySchema = CreateInventorySchema.partial()

export const FilterInventorySchema = z.object({
  condition: z.enum(['baik', 'rusak_ringan', 'rusak_berat', 'hilang']).optional(),
  category: z.string().optional(),
  search: z.string().optional(),
})

export type CreateInventoryInput = z.infer<typeof CreateInventorySchema>
export type UpdateInventoryInput = z.infer<typeof UpdateInventorySchema>
export type FilterInventoryInput = z.infer<typeof FilterInventorySchema>