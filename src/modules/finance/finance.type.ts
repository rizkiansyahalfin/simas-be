import { z } from 'zod';
import { createCashSchema, createZisSchema, updateCashSchema, updateZisSchema } from './finance.validation';

// 1. Ambil tipe data dari schema Zod otomatis
// Ini memastikan input di Service sama persis dengan yang divalidasi di Controller
export type CreateCashInput = z.infer<typeof createCashSchema>;
export type UpdateCashInput = z.infer<typeof updateCashSchema>;
export type CreateZisInput = z.infer<typeof createZisSchema>;
export type UpdateZisInput = z.infer<typeof updateZisSchema>;

// 2. Enum untuk Transaction Type (Sesuai dengan schema.prisma)
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum ZisCategory {
  ZAKAT = 'zakat',
  INFAQ = 'infaq',
  SHADAQAH = 'shadaqah',
}

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

export interface ZisTransactionResponse {
  id: number;
  type: TransactionType;
  zisCategory: ZisCategory;
  amount: number;
  muzakkiName?: string | null;
  description?: string | null;
  transactionDate: Date;
  createdBy: number;
  createdAt: Date;
  deletedAt?: Date | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}