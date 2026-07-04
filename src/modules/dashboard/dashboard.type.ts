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

export type DonationTrendItem = {
  month: string;
  amount: number;
};

export type DonationCategoryBreakdownItem = {
  category: string;
  amount: number;
};

export type DonationChartResponse = {
  range: DashboardRange;
  trend: DonationTrendItem[];
  categories: DonationCategoryBreakdownItem[];
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
export interface CongregationChartItem {
  month: string;
  total: number;
}

export interface CongregationChartResponse {
  range: DashboardRange;
  data: CongregationChartItem[];
};

export type ZisChartItem = {
  month: string;
  received: number;
  distribution: number;
};

export type ZisChartResponse = {
  range: DashboardRange;
  data: ZisChartItem[];
}