import * as repo from './finance.repository';
import {
  CreateCashInput,
  CreateZisInput,
  PaginatedResponse,
  UpdateCashInput,
  UpdateZisInput,
} from './finance.type';
import { startOfMonth, endOfMonth } from 'date-fns';
import { calculateSummary } from './finance.domain';

type CashFilters = {
  type?: string;
  category?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
};

type ZisFilters = {
  type?: string;
  zisCategory?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
};

export const getSummary = async () => {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  const { cashSummary, zisSummary } = await repo.findSummaryData(start, end);
  const summary = calculateSummary(cashSummary, zisSummary);

  return {
    ...summary,
    lastUpdated: new Date(),
  };
};

export const getCashTransactions = async ({
  page = 1,
  limit = 10,
  filters = {},
}: {
  page?: number;
  limit?: number;
  filters?: CashFilters;
} = {}): Promise<PaginatedResponse<any>> => {
  const [data, total] = await Promise.all([
    repo.findCashTransactions({ page, limit, filters }),
    repo.countCashTransactions(filters),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return { data, page, limit, total, totalPages };
};

export const getCashTransactionById = async (id: number) => {
  return await repo.findCashTransactionById(id);
};

export const addCashTransaction = async (data: CreateCashInput, userId: number) => {
  return await repo.createCashTransaction({
    ...data,
    createdBy: userId,
  });
};

export const updateCashTransaction = async (id: number, data: UpdateCashInput) => {
  return await repo.updateCashTransaction(id, data);
};

export const removeCashTransaction = async (id: number) => {
  return await repo.softDeleteCashTransaction(id);
};

export const getZisTransactions = async ({
  page = 1,
  limit = 10,
  filters = {},
}: {
  page?: number;
  limit?: number;
  filters?: ZisFilters;
} = {}): Promise<PaginatedResponse<any>> => {
  const [data, total] = await Promise.all([
    repo.findZisTransactions({ page, limit, filters }),
    repo.countZisTransactions(filters),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return { data, page, limit, total, totalPages };
};

export const getZisTransactionById = async (id: number) => {
  return await repo.findZisTransactionById(id);
};

export const addZisTransaction = async (data: CreateZisInput, userId: number) => {
  return await repo.createZisTransaction({
    ...data,
    createdBy: userId,
  });
};

export const updateZisTransaction = async (id: number, data: UpdateZisInput) => {
  return await repo.updateZisTransaction(id, data);
};

export const removeZisTransaction = async (id: number) => {
  return await repo.softDeleteZisTransaction(id);
};