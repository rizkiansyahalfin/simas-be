// dashboard.type.ts

export type DashboardRange =
  | '1month'
  | '3months'
  | '6months'
  | '1year';

export type FinanceChartItem = {
  month: string;
  income: number;
  expense: number;
};

export type DashboardStats = {
  totalCongregations: number;
  currentCashBalance: number;
  donationsThisMonth: number;
  upcomingEvents: number;
  borrowedInventories: number;
};

export type FinanceChartResponse = {
  range: DashboardRange;
  data: FinanceChartItem[];
};