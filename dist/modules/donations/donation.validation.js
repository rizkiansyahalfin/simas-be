import { z } from 'zod';
export const createDonationSchema = z.object({
    donorName: z.string().min(3, 'Donor name must be at least 3 characters'),
    phone: z.string().min(7).max(15, 'Invalid phone format').optional(),
    amount: z.number().positive('Amount must be greater than 0'),
    category: z.string().min(1).max(100, 'Category must not exceed 100 characters'),
});
export const rejectDonationSchema = z.object({
    note: z.string().min(5, 'Rejection note must be at least 5 characters').max(500),
});
export const donationQuerySchema = z.object({
    status: z.enum(['pending', 'verified', 'rejected']).optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(10),
});
