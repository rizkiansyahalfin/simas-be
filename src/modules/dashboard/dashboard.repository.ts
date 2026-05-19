// dashboard.repository.ts

import prisma from '../../database';
import {
  DonationStatus,
  EventStatus,
  LoanStatus,
} from '../../generated/client';

export const findCashTransactionsByRange = async (
  startDate: Date,
  endDate: Date
) => {
  return await prisma.cashTransaction.findMany({
    where: {
      deletedAt: null,
      transactionDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      type: true,
      amount: true,
      transactionDate: true,
    },
    orderBy: {
      transactionDate: 'asc',
    },
  });
};

export const countActiveCongregations = async () => {
  return await prisma.congregation.count({
    where: {
      deletedAt: null,
      isActive: true,
    },
  });
};

export const getCashBalanceSummary = async () => {
  const [income, expense] = await Promise.all([
    prisma.cashTransaction.aggregate({
      where: {
        deletedAt: null,
        type: 'income',
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.cashTransaction.aggregate({
      where: {
        deletedAt: null,
        type: 'expense',
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  return {
    income: income._sum.amount ?? 0,
    expense: expense._sum.amount ?? 0,
  };
};

export const getDonationsThisMonth = async (
  startDate: Date,
  endDate: Date
) => {
  const result = await prisma.donation.aggregate({
    where: {
      status: DonationStatus.verified,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      amount: true,
    },
  });

  return result._sum.amount ?? 0;
};

export const countUpcomingEvents = async () => {
  return await prisma.event.count({
    where: {
      status: EventStatus.upcoming,
      startTime: {
        gte: new Date(),
      },
    },
  });
};

export const countBorrowedInventories = async () => {
  return await prisma.inventoryLoan.count({
    where: {
      status: LoanStatus.borrowed,
    },
  });
};