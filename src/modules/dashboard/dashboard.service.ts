// dashboard.service.ts

import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

import * as repo from './dashboard.repository';

import type {
  DashboardRange,
  DashboardStats,
  FinanceChartItem,
  FinanceChartResponse,
} from './dashboard.type';

const TIMEZONE = 'Asia/Jakarta';

/**
 * Safe converter for Prisma Decimal or number values to number.
 * Handles both Decimal objects and plain numbers.
 */
const toNumber = (value: unknown): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'object' && value !== null && 'toNumber' in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  if (typeof value === 'string') return Number(value) || 0;
  return 0;
};

const getRangeMonths = (range: DashboardRange): number => {
  switch (range) {
    case '1month':
      return 1;

    case '3months':
      return 3;

    case '6months':
      return 6;

    case '1year':
      return 12;

    default:
      return 6;
  }
};

export const getFinanceChart = async (
  range: DashboardRange = '6months'
): Promise<FinanceChartResponse> => {
  const monthsBack = getRangeMonths(range);
  const now = new Date();
  const startDate = startOfMonth(subMonths(now, monthsBack - 1));
  const endDate = endOfMonth(now);

  const transactions = await repo.findCashTransactionsByRange(
    startDate,
    endDate
  );

  // Initialize all months in the range
  const monthlyMap = new Map<string, FinanceChartItem>();
  for (let i = 0; i < monthsBack; i++) {
    const currentMonth = subMonths(now, i);
    const label = format(currentMonth, 'MMM yyyy');
    monthlyMap.set(label, {
      month: label,
      income: 0,
      expense: 0,
    });
  }

  // Aggregate transactions by month
  for (const transaction of transactions) {
    const zonedDate = toZonedTime(transaction.transactionDate, TIMEZONE);
    const monthLabel = format(zonedDate, 'MMM yyyy');
    const existing = monthlyMap.get(monthLabel);

    if (!existing) continue;

    const amount = toNumber(transaction.amount);

    if (transaction.type === 'income') {
      existing.income += amount;
    } else if (transaction.type === 'expense') {
      existing.expense += amount;
    }
  }

  const data = Array.from(monthlyMap.values()).reverse();

  return {
    range,
    data,
  };
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const now = new Date();
  const startDate = startOfMonth(now);
  const endDate = endOfMonth(now);

  const [
    totalCongregations,
    cashBalance,
    donationsThisMonth,
    upcomingEvents,
    borrowedInventories,
  ] = await Promise.all([
    repo.countActiveCongregations(),
    repo.getCashBalanceSummary(),
    repo.getDonationsThisMonth(startDate, endDate),
    repo.countUpcomingEvents(),
    repo.countBorrowedInventories(),
  ]);

  const incomeAmount = toNumber(cashBalance.income);
  const expenseAmount = toNumber(cashBalance.expense);
  const donationsAmount = toNumber(donationsThisMonth);

  return {
    totalCongregations,
    currentCashBalance: incomeAmount - expenseAmount,
    donationsThisMonth: donationsAmount,
    upcomingEvents,
    borrowedInventories,
  };
};