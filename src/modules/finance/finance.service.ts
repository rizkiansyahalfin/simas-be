import * as repo from './finance.repository';
import type { CashFilters, ZisFilters } from './finance.repository';
import {
  CreateCashInput,
  CreateZisInput,
  PaginatedResponse,
  UpdateCashInput,
  UpdateZisInput,
} from './finance.type';
import { startOfMonth, endOfMonth } from 'date-fns';
import { calculateSummary } from './finance.domain';
import { clearDashboardCache } from '../dashboard/dashboard.cache';


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
} = {}): Promise<PaginatedResponse<unknown>> => {
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
  const result = await repo.createCashTransaction({
    ...data,
    createdBy: userId,
  });
  await clearDashboardCache();
  return result;
};

export const updateCashTransaction = async (
  id: number,
  data: UpdateCashInput
) => {
  const transaction =
    await repo.findCashTransactionById(id)

  if (!transaction) {
    throw new Error("CASH_TRANSACTION_NOT_FOUND")
  }

  const now = new Date()

  const startCurrentMonth =
    startOfMonth(now)

  const endCurrentMonth =
    endOfMonth(now)

  const transactionDate =
    transaction.transactionDate

  const isCurrentPeriod =
    transactionDate >= startCurrentMonth &&
    transactionDate <= endCurrentMonth

  if (!isCurrentPeriod) {
    throw new Error(
      "ONLY_CURRENT_PERIOD_CAN_BE_EDITED"
    )
  }

  const result = await repo.updateCashTransaction(
    id,
    data
  )
  await clearDashboardCache()
  return result
}

export const removeCashTransaction = async (id: number) => {
  const result = await repo.softDeleteCashTransaction(id);
  await clearDashboardCache()
  return result;
};

export const getZisTransactions = async ({
  page = 1,
  limit = 10,
  filters = {},
}: {
  page?: number;
  limit?: number;
  filters?: ZisFilters;
} = {}): Promise<PaginatedResponse<unknown>> => {
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
  const result = await repo.createZisTransaction({
    ...data,
    createdBy: userId,
  });
  await clearDashboardCache()
  return result;
};

export const updateZisTransaction = async (id: number, data: UpdateZisInput) => {
  const result = await repo.updateZisTransaction(id, data);
  await clearDashboardCache()
  return result;
};

export const removeZisTransaction = async (id: number) => {
  const result = await repo.softDeleteZisTransaction(id);
  await clearDashboardCache()
  return result;
};