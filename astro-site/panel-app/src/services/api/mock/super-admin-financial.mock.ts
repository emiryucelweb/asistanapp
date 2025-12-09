/**
 * Mock Data for Super Admin Financial API
 * Used when API_CONFIG.USE_MOCK_DATA is true
 */

import { mockDelay } from '../config';
import type { TenantFinancialSummary } from '@/types';

export const mockFinancialData = {
  summary: {
    '30d': {
      totalTenants: 24,
      activeTenants: 18,
      trialTenants: 4,
      totalMonthlyRevenue: 45750,
      totalMonthlyCosts: 15280,
      totalProfit: 30470,
      averageRevenuePerTenant: 2541,
      churnRate: 2.5,
      growthRate: 15.3,
    },
    '90d': {
      totalTenants: 24,
      activeTenants: 18,
      trialTenants: 4,
      totalMonthlyRevenue: 137250,
      totalMonthlyCosts: 45840,
      totalProfit: 91410,
      averageRevenuePerTenant: 2541,
      churnRate: 2.3,
      growthRate: 18.7,
    },
    '1y': {
      totalTenants: 24,
      activeTenants: 18,
      trialTenants: 4,
      totalMonthlyRevenue: 549000,
      totalMonthlyCosts: 183360,
      totalProfit: 365640,
      averageRevenuePerTenant: 2541,
      churnRate: 2.1,
      growthRate: 22.4,
    },
  } as Record<string, TenantFinancialSummary>,

  monthlyTrend: {
    '30d': [
      { month: 'Nis', revenue: 38500, costs: 13200, profit: 25300 },
      { month: 'May', revenue: 41200, costs: 14100, profit: 27100 },
      { month: 'Haz', revenue: 43800, costs: 14800, profit: 29000 },
      { month: 'Tem', revenue: 45750, costs: 15280, profit: 30470 },
    ],
    '90d': [
      { month: 'Oca', revenue: 32000, costs: 11500, profit: 20500 },
      { month: 'Şub', revenue: 35200, costs: 12200, profit: 23000 },
      { month: 'Mar', revenue: 36500, costs: 12800, profit: 23700 },
      { month: 'Nis', revenue: 38500, costs: 13200, profit: 25300 },
      { month: 'May', revenue: 41200, costs: 14100, profit: 27100 },
      { month: 'Haz', revenue: 43800, costs: 14800, profit: 29000 },
      { month: 'Tem', revenue: 45750, costs: 15280, profit: 30470 },
    ],
    '1y': [
      { month: 'Ağu 23', revenue: 28000, costs: 10200, profit: 17800 },
      { month: 'Eyl 23', revenue: 30500, costs: 10800, profit: 19700 },
      { month: 'Eki 23', revenue: 31200, costs: 11100, profit: 20100 },
      { month: 'Kas 23', revenue: 33500, costs: 11600, profit: 21900 },
      { month: 'Ara 23', revenue: 35000, costs: 12000, profit: 23000 },
      { month: 'Oca 24', revenue: 32000, costs: 11500, profit: 20500 },
      { month: 'Şub 24', revenue: 35200, costs: 12200, profit: 23000 },
      { month: 'Mar 24', revenue: 36500, costs: 12800, profit: 23700 },
      { month: 'Nis 24', revenue: 38500, costs: 13200, profit: 25300 },
      { month: 'May 24', revenue: 41200, costs: 14100, profit: 27100 },
      { month: 'Haz 24', revenue: 43800, costs: 14800, profit: 29000 },
      { month: 'Tem 24', revenue: 45750, costs: 15280, profit: 30470 },
    ],
  },

  planDistribution: [
    { plan: 'Enterprise', count: 6, revenue: 15000, percentage: 32.8 },
    { plan: 'Professional', count: 8, revenue: 19980, percentage: 43.7 },
    { plan: 'Starter', count: 4, revenue: 7980, percentage: 17.4 },
    { plan: 'Trial', count: 6, revenue: 2790, percentage: 6.1 },
  ],

  topTenants: [
    { name: 'Acme E-commerce', revenue: 2500, profit: 1618, growth: 12.5 },
    { name: 'TechStart SaaS', revenue: 2400, profit: 1547, growth: 18.2 },
    { name: 'HealthCare Plus', revenue: 2200, profit: 1091, growth: -5.3 },
    { name: 'Fashion Boutique', revenue: 1999, profit: 1299, growth: 22.1 },
    { name: 'Food Delivery Co', revenue: 1899, profit: 1234, growth: 8.7 },
  ],

  costBreakdown: {
    '30d': [
      { category: 'LLM API', amount: 8500, percentage: 55.6 },
      { category: 'Voice Services', amount: 3200, percentage: 20.9 },
      { category: 'WhatsApp', amount: 2100, percentage: 13.7 },
      { category: 'Storage', amount: 980, percentage: 6.4 },
      { category: 'Other', amount: 500, percentage: 3.3 },
    ],
    '90d': [
      { category: 'LLM API', amount: 25500, percentage: 55.6 },
      { category: 'Voice Services', amount: 9600, percentage: 20.9 },
      { category: 'WhatsApp', amount: 6300, percentage: 13.7 },
      { category: 'Storage', amount: 2940, percentage: 6.4 },
      { category: 'Other', amount: 1500, percentage: 3.3 },
    ],
    '1y': [
      { category: 'LLM API', amount: 102000, percentage: 55.6 },
      { category: 'Voice Services', amount: 38400, percentage: 20.9 },
      { category: 'WhatsApp', amount: 25200, percentage: 13.7 },
      { category: 'Storage', amount: 11760, percentage: 6.4 },
      { category: 'Other', amount: 6000, percentage: 3.3 },
    ],
  },
};

/**
 * Mock API implementations
 */
export const mockSuperAdminFinancialApi = {
  async getFinancialSummary(period: '30d' | '90d' | '1y' = '30d') {
    await mockDelay();
    return mockFinancialData.summary[period];
  },

  async getMonthlyTrend(period: '30d' | '90d' | '1y' = '30d') {
    await mockDelay();
    return mockFinancialData.monthlyTrend[period];
  },

  async getPlanDistribution() {
    await mockDelay();
    return mockFinancialData.planDistribution;
  },

  async getTopTenants(limit: number = 5) {
    await mockDelay();
    return mockFinancialData.topTenants.slice(0, limit);
  },

  async getCostBreakdown(period: '30d' | '90d' | '1y' = '30d') {
    await mockDelay();
    return mockFinancialData.costBreakdown[period];
  },
};

