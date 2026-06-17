import { z } from 'zod'

export const createDonationSchema = z.object({
  donorName: z.string().min(3, 'Donor name must be at least 3 characters'),
  phone: z.string().min(7).max(15, 'Invalid phone format').optional(),
  amount: z.number().positive('Amount must be greater than 0'),
  categoryId: z.number().int().positive('Category ID must be a positive integer'),
})

export const rejectDonationSchema = z.object({
  note: z.string().min(5, 'Rejection note must be at least 5 characters').max(500),
})

export const donationQuerySchema = z.object({
  status: z.enum(['pending', 'verified', 'rejected']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  categoryId: z.number().int().positive('Category ID must be a positive integer').optional(),
  search: z.string().optional()
})
