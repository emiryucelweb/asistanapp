export interface DailyMetric {
  date: string;
  conversationsHandled: number;
  avgResponseTime: number;
  avgHandleTime: number;
  resolutionRate: number;
  customerSatisfaction: number;
  aiHandoffs: number;
}

export interface AgentPerformance {
  agentId: string;
  agentName: string;
  period: 'today' | 'week' | 'month';
  summary: {
    totalConversations: number;
    resolvedConversations: number;
    activeConversations: number;
    avgFirstResponseTime: number;
    avgResponseTime: number;
    avgHandleTime: number;
    resolutionRate: number;
    customerSatisfactionAvg: number;
    aiHandoffCount: number;
    aiHandoffRate: number;
  };
  dailyMetrics: DailyMetric[];
}

export const mockTodayPerformance: AgentPerformance = {
  agentId: 'agent-current',
  agentName: 'Zeynep Kaya',
  period: 'today',
  summary: {
    totalConversations: 12,
    resolvedConversations: 8,
    activeConversations: 2,
    avgFirstResponseTime: 48,
    avgResponseTime: 108,
    avgHandleTime: 750,
    resolutionRate: 89.4,
    customerSatisfactionAvg: 4.7,
    aiHandoffCount: 4,
    aiHandoffRate: 33.3
  },
  dailyMetrics: [
    {
      date: '2025-12-10',
      conversationsHandled: 12,
      avgResponseTime: 108,
      avgHandleTime: 750,
      resolutionRate: 89.4,
      customerSatisfaction: 4.7,
      aiHandoffs: 4
    }
  ]
};

export const mockWeeklyPerformance: AgentPerformance = {
  agentId: 'agent-current',
  agentName: 'Zeynep Kaya',
  period: 'week',
  summary: {
    totalConversations: 87,
    resolvedConversations: 74,
    activeConversations: 2,
    avgFirstResponseTime: 52,
    avgResponseTime: 125,
    avgHandleTime: 680,
    resolutionRate: 85.1,
    customerSatisfactionAvg: 4.6,
    aiHandoffCount: 28,
    aiHandoffRate: 32.2
  },
  dailyMetrics: []
};

export const mockMonthlyPerformance: AgentPerformance = {
  agentId: 'agent-current',
  agentName: 'Zeynep Kaya',
  period: 'month',
  summary: {
    totalConversations: 342,
    resolvedConversations: 287,
    activeConversations: 2,
    avgFirstResponseTime: 58,
    avgResponseTime: 135,
    avgHandleTime: 695,
    resolutionRate: 83.9,
    customerSatisfactionAvg: 4.5,
    aiHandoffCount: 112,
    aiHandoffRate: 32.7
  },
  dailyMetrics: []
};

export const mockTeamComparison = {
  myPerformance: {
    resolutionRate: 89.4,
    avgResponseTime: 108,
    customerSatisfaction: 4.7,
    aiHandoffRate: 33.3
  },
  teamAverage: {
    resolutionRate: 82.1,
    avgResponseTime: 145,
    customerSatisfaction: 4.3,
    aiHandoffRate: 28.5
  }
};

export const mockPerformanceGoals = {
  monthly: {
    conversationsTarget: 350,
    currentProgress: 342,
    completionRate: 97.7
  },
  resolutionRateTarget: 85,
  currentResolutionRate: 89.4,
  satisfactionTarget: 4.5,
  currentSatisfaction: 4.7
};
