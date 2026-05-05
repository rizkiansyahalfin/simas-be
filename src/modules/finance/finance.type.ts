import { z } from 'zod';
import { createCashSchema } from './finance.validation';

// 1. Ambil tipe data dari schema Zod otomatis
// Ini memastikan input di Service sama persis dengan yang divalidasi di Controller
export type CreateCashInput = z.infer<typeof createCashSchema>;

// 2. Enum untuk Transaction Type (Sesuai dengan schema.prisma)
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

// 3. Interface untuk Response (Opsional, tapi sangat membantu)
export interface CashTransactionResponse {
  id: number;
  type: TransactionType;
  amount: number;
  category: string;
  description?: string | null;
  transactionDate: Date;
  createdBy: number;
  createdAt: Date;
  deletedAt?: Date | null;
}