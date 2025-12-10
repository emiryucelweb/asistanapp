// Admin Reports Mock Data

export const mockPerformanceReports = {
  weekly: {
    totalConversations: 1847,
    aiResolved: 1451,
    humanResolved: 396,
    avgResponseTime: '2.1 dk',
    satisfactionRate: 94.8,
    peakDay: 'Salı',
    growth: {
      conversations: 8.3,
      aiEfficiency: 4.2,
      satisfaction: 1.5
    }
  },
  monthly: {
    totalConversations: 7892,
    aiResolved: 6194,
    humanResolved: 1698,
    avgResponseTime: '2.3 dk',
    satisfactionRate: 93.7,
    peakWeek: '2. Hafta',
    growth: {
      conversations: 12.1,
      aiEfficiency: 6.8,
      satisfaction: 2.3
    }
  }
};

export const mockChannelPerformance = [
  {
    channel: 'WhatsApp',
    totalConversations: 3456,
    avgResponseTime: '1.9 dk',
    satisfactionRate: 95.3,
    aiResolutionRate: 81.2,
    growth: 14.5
  },
  {
    channel: 'Instagram',
    totalConversations: 2287,
    avgResponseTime: '2.3 dk',
    satisfactionRate: 93.8,
    aiResolutionRate: 76.4,
    growth: 9.8
  },
  {
    channel: 'Web Chat',
    totalConversations: 1423,
    avgResponseTime: '2.1 dk',
    satisfactionRate: 94.5,
    aiResolutionRate: 79.1,
    growth: 11.2
  },
  {
    channel: 'Facebook',
    totalConversations: 726,
    avgResponseTime: '2.7 dk',
    satisfactionRate: 92.1,
    aiResolutionRate: 72.8,
    growth: 5.3
  }
];

export const mockAgentPerformanceReports = [
  {
    agentId: 'agent-001',
    name: 'Ayşe Yılmaz',
    conversationsHandled: 387,
    avgResponseTime: '1.8 dk',
    satisfactionScore: 96.5,
    resolvedFirstContact: 84.2,
    activeHours: 168
  },
  {
    agentId: 'agent-002',
    name: 'Mehmet Kaya',
    conversationsHandled: 349,
    avgResponseTime: '2.1 dk',
    satisfactionScore: 94.2,
    resolvedFirstContact: 79.8,
    activeHours: 172
  },
  {
    agentId: 'agent-003',
    name: 'Zeynep Demir',
    conversationsHandled: 412,
    avgResponseTime: '1.5 dk',
    satisfactionScore: 97.8,
    resolvedFirstContact: 88.1,
    activeHours: 165
  },
  {
    agentId: 'agent-004',
    name: 'Can Öztürk',
    conversationsHandled: 298,
    avgResponseTime: '2.4 dk',
    satisfactionScore: 92.1,
    resolvedFirstContact: 76.5,
    activeHours: 154
  }
];

export const mockCategoryBreakdown = [
  {
    category: 'Ürün Bilgisi',
    count: 1847,
    avgResolutionTime: '1.8 dk',
    aiSuccessRate: 85.3,
    satisfactionRate: 95.2
  },
  {
    category: 'Fiyat Sorgusu',
    count: 1623,
    avgResolutionTime: '1.2 dk',
    aiSuccessRate: 92.1,
    satisfactionRate: 96.8
  },
  {
    category: 'Sipariş Takibi',
    count: 1489,
    avgResolutionTime: '2.1 dk',
    aiSuccessRate: 78.4,
    satisfactionRate: 93.7
  },
  {
    category: 'Randevu',
    count: 1312,
    avgResolutionTime: '1.5 dk',
    aiSuccessRate: 88.9,
    satisfactionRate: 97.1
  },
  {
    category: 'Teknik Destek',
    count: 987,
    avgResolutionTime: '3.4 dk',
    aiSuccessRate: 45.2,
    satisfactionRate: 89.3
  },
  {
    category: 'İptal/İade',
    count: 634,
    avgResolutionTime: '2.9 dk',
    aiSuccessRate: 52.8,
    satisfactionRate: 88.7
  }
];

export const mockCustomerSatisfactionTrend = [
  { date: '2025-11-10', score: 91.2, responses: 284 },
  { date: '2025-11-17', score: 92.5, responses: 312 },
  { date: '2025-11-24', score: 93.1, responses: 298 },
  { date: '2025-12-01', score: 93.8, responses: 327 },
  { date: '2025-12-08', score: 94.2, responses: 341 }
];

export const mockExportFormats = ['PDF', 'Excel', 'CSV'];
