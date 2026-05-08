import { z } from 'zod'

export const CreateDonationSchema = z.object({
  donorName: z.string().min(1, 'Nama donatur wajib diisi'),
  donorEmail: z.string().email('Format email tidak valid').optional(),
  phone: z.string().optional(),
  amount: z.number().positive('Jumlah donasi harus lebih dari 0'),
  category: z.string().min(1, 'Kategori wajib diisi'),
  proofImageUrl: z.string().url().optional(),
})

export const VerifyDonationSchema = z.object({
  status: z.enum(['verified', 'rejected']),
  donorEmail: z.string().email().optional(),
  rejectionNote: z.string().optional(),
}).refine(
  (data) => data.status !== 'rejected' || !!data.rejectionNote,
  { message: 'Alasan penolakan wajib diisi', path: ['rejectionNote'] }
)

export type CreateDonationInput = z.infer<typeof CreateDonationSchema>
export type VerifyDonationInput = z.infer<typeof VerifyDonationSchema>