export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  services: {
    api: 'up' | 'down' | 'degraded';
    database: 'up' | 'down' | 'degraded';
    messageQueue: 'up' | 'down' | 'degraded';
    storage: 'up' | 'down' | 'degraded';
    cdn: 'up' | 'down' | 'degraded';
  };
}

export interface PlatformMetrics {
  period: string;
  totalConversations: number;
  totalMessages: number;
  totalAgents: number;
  totalCustomers: number;
  avgResponseTime: number;
  aiHandoffRate: number;
  customerSatisfaction: number;
}

export const mockSystemHealth: SystemHealth = {
  status: 'healthy',
  uptime: 99.97,
  services: {
    api: 'up',
    database: 'up',
    messageQueue: 'up',
    storage: 'up',
    cdn: 'up'
  }
};

export const mockDailyPlatformMetrics: PlatformMetrics[] = [
  {
    period: '2025-12-09',
    totalConversations: 38567,
    totalMessages: 501567,
    totalAgents: 1964,
    totalCustomers: 262567,
    avgResponseTime: 133,
    aiHandoffRate: 33.2,
    customerSatisfaction: 4.5
  },
  {
    period: '2025-12-10',
    totalConversations: 39345,
    totalMessages: 510678,
    totalAgents: 1970,
    totalCustomers: 263890,
    avgResponseTime: 136,
    aiHandoffRate: 34.1,
    customerSatisfaction: 4.4
  }
];

export const mockInfrastructureUsage = {
  cpu: { current: 67.3, average: 62.8, peak: 89.4 },
  memory: { used: 187.6, total: 512, percentage: 36.6 },
  storage: { used: 4.8, total: 20, percentage: 24.0 }
};

export const mockApiUsage = {
  totalCalls: 8765432,
  successRate: 99.87,
  avgResponseTime: 145,
  errorRate: 0.13
};

export const mockGrowthStats = {
  tenantsGrowth: { thisMonth: 12, lastMonth: 8, growthRate: 50.0 },
  conversationsGrowth: { thisMonth: 1123456, lastMonth: 998765, growthRate: 12.5 },
  revenueGrowth: { thisMonth: 1359290, lastMonth: 1344830, growthRate: 1.1 }
};
