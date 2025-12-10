export interface RevenueMetrics {
  period: string;
  newRevenue: number;
  recurringRevenue: number;
  expansionRevenue: number;
  churnRevenue: number;
  netRevenue: number;
  refunds: number;
  totalRevenue: number;
}

export interface FinancialOverview {
  currentMonth: {
    date: string;
    mrr: number;
    arr: number;
    newMrr: number;
    churnedMrr: number;
    netNewMrr: number;
    totalRevenue: number;
    grossProfit: number;
    grossMargin: number;
  };
  yearToDate: {
    totalRevenue: number;
    totalCosts: number;
    grossProfit: number;
    netProfit: number;
    profitMargin: number;
  };
}

export const mockFinancialOverview: FinancialOverview = {
  currentMonth: {
    date: '2025-12',
    mrr: 1247890,
    arr: 14974680,
    newMrr: 87650,
    churnedMrr: 23450,
    netNewMrr: 64200,
    totalRevenue: 1345670,
    grossProfit: 1078536,
    grossMargin: 80.2
  },
  yearToDate: {
    totalRevenue: 14567890,
    totalCosts: 3456789,
    grossProfit: 11111101,
    netProfit: 6789012,
    profitMargin: 46.6
  }
};

export const mockMonthlyRevenue: RevenueMetrics[] = [
  {
    period: '2025-11',
    newRevenue: 83400,
    recurringRevenue: 1241230,
    expansionRevenue: 49300,
    churnRevenue: 22700,
    netRevenue: 1351230,
    refunds: 6400,
    totalRevenue: 1344830
  },
  {
    period: '2025-12',
    newRevenue: 87650,
    recurringRevenue: 1247890,
    expansionRevenue: 52800,
    churnRevenue: 23450,
    netRevenue: 1364890,
    refunds: 5600,
    totalRevenue: 1359290
  }
];

export const mockPlanRevenue = [
  { plan: 'starter', subscribers: 87, mrr: 173913, arr: 2086956 },
  { plan: 'professional', subscribers: 124, mrr: 516653, arr: 6199836 },
  { plan: 'enterprise', subscribers: 21, mrr: 157481, arr: 1889772 },
  { plan: 'custom', subscribers: 15, mrr: 399843, arr: 4798116 }
];

export const mockChurnAnalysis = {
  currentMonth: {
    totalChurned: 5,
    churnRate: 2.0,
    churnedMrr: 23450
  }
};
