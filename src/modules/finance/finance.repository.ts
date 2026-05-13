import prisma from '../../database';
import { CreateCashInput, CreateZisInput, UpdateCashInput, UpdateZisInput } from './finance.type';

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

const buildCashWhere = (filters: CashFilters = {}) => {
  const where: any = { deletedAt: null };

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.category) {
    where.category = { contains: filters.category, mode: 'insensitive' };
  }

  if (filters.startDate || filters.endDate) {
    where.transactionDate = {};
    if (filters.startDate) {
      where.transactionDate.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.transactionDate.lte = filters.endDate;
    }
  }

  if (filters.search) {
    where.OR = [
      { category: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return where;
};

const buildZisWhere = (filters: ZisFilters = {}) => {
  const where: any = { deletedAt: null };

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.zisCategory) {
    where.zisCategory = filters.zisCategory;
  }

  if (filters.startDate || filters.endDate) {
    where.transactionDate = {};
    if (filters.startDate) {
      where.transactionDate.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.transactionDate.lte = filters.endDate;
    }
  }

  if (filters.search) {
    where.OR = [
      { muzakkiName: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return where;
};

export const findCashTransactions = async ({
  page = 1,
  limit = 10,
  filters = {},
}: {
  page?: number;
  limit?: number;
  filters?: CashFilters;
}) => {
  const skip = (page - 1) * limit;

  return await prisma.cashTransaction.findMany({
    where: buildCashWhere(filters),
    orderBy: { transactionDate: 'desc' },
    skip,
    take: limit,
  });
};

export const countCashTransactions = async (filters: CashFilters = {}) => {
  return await prisma.cashTransaction.count({
    where: buildCashWhere(filters),
  });
};

export const findCashTransactionById = async (id: number) => {
  return await prisma.cashTransaction.findFirst({
    where: { id, deletedAt: null },
  });
};

export const createCashTransaction = async (data: CreateCashInput & { createdBy: number }) => {
  return await prisma.cashTransaction.create({
    data,
  });
};

export const updateCashTransaction = async (id: number, data: UpdateCashInput) => {
  return await prisma.cashTransaction.update({
    where: { id },
    data,
  });
};

export const softDeleteCashTransaction = async (id: number) => {
  return await prisma.cashTransaction.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const findZisTransactions = async ({
  page = 1,
  limit = 10,
  filters = {},
}: {
  page?: number;
  limit?: number;
  filters?: ZisFilters;
}) => {
  const skip = (page - 1) * limit;

  return await prisma.zisTransaction.findMany({
    where: buildZisWhere(filters),
    orderBy: { transactionDate: 'desc' },
    skip,
    take: limit,
  });
};

export const countZisTransactions = async (filters: ZisFilters = {}) => {
  return await prisma.zisTransaction.count({
    where: buildZisWhere(filters),
  });
};

export const findZisTransactionById = async (id: number) => {
  return await prisma.zisTransaction.findFirst({
    where: { id, deletedAt: null },
  });
};

export const createZisTransaction = async (data: CreateZisInput & { createdBy: number }) => {
  return await prisma.zisTransaction.create({
    data,
  });
};

export const updateZisTransaction = async (id: number, data: UpdateZisInput) => {
  return await prisma.zisTransaction.update({
    where: { id },
    data,
  });
};

export const softDeleteZisTransaction = async (id: number) => {
  return await prisma.zisTransaction.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const findSummaryData = async (start: Date, end: Date) => {
  const baseWhere = {
    deletedAt: null,
    transactionDate: {
      gte: start,
      lte: end,
    },
  };

  const [cashSummary, zisSummary] = await Promise.all([
    prisma.cashTransaction.groupBy({
      by: ['type'],
      where: baseWhere,
      _sum: { amount: true },
    }),
    prisma.zisTransaction.groupBy({
      by: ['type'],
      where: baseWhere,
      _sum: { amount: true },
    }),
  ]);

  return { cashSummary, zisSummary };
};