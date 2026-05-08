import { z } from 'zod';

export const createJumatScheduleSchema = z.object({
  jumatDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
  imam: z.string().max(100).optional(),
  khatib: z.string().max(100).optional(),
  muadzin: z.string().max(100).optional(),
  temaKhutbah: z.string().optional(),
});

export const updateJumatScheduleSchema = z.object({
  jumatDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD')
    .optional(),
  imam: z.string().max(100).optional(),
  khatib: z.string().max(100).optional(),
  muadzin: z.string().max(100).optional(),
  temaKhutbah: z.string().optional(),
});