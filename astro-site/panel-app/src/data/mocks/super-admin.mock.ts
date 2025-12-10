// Super Admin Mock Data - Multi-Tenant Management

export const mockTenants = [
  {
    id: 'tenant-001',
    businessName: 'Smile Dental Klinik',
    owner: {
      name: 'Dr. Ahmet Demir',
      email: 'ahmet@smileklinik.com',
      phone: '+90 532 123 4567'
    },
    industry: 'Dental',
    plan: 'Professional',
    status: 'active',
    stats: {
      totalConversations: 4523,
      activeAgents: 5,
      monthlyRevenue: 2499,
      growth: 14.2
    },
    integrations: ['whatsapp', 'instagram', 'web'],
    createdAt: '2024-01-15',
    lastActivity: '2025-12-10T10:15:00Z',
    billingCycle: 'monthly',
    nextBillingDate: '2025-12-15'
  },
  {
    id: 'tenant-002',
    businessName: 'Coffee Break Cafe',
    owner: {
      name: 'Elif Kara',
      email: 'elif@coffeebreak.com',
      phone: '+90 533 234 5678'
    },
    industry: 'Food & Beverage',
    plan: 'Starter',
    status: 'active',
    stats: {
      totalConversations: 2847,
      activeAgents: 3,
      monthlyRevenue: 999,
      growth: 8.7
    },
    integrations: ['whatsapp', 'instagram'],
    createdAt: '2024-03-20',
    lastActivity: '2025-12-10T09:42:00Z',
    billingCycle: 'monthly',
    nextBillingDate: '2025-12-20'
  },
  {
    id: 'tenant-003',
    businessName: 'TechFix Servis',
    owner: {
      name: 'Mehmet Yılmaz',
      email: 'mehmet@techfix.com',
      phone: '+90 534 345 6789'
    },
    industry: 'Technology Services',
    plan: 'Professional',
    status: 'trial',
    stats: {
      totalConversations: 1234,
      activeAgents: 2,
      monthlyRevenue: 0,
      growth: 0
    },
    integrations: ['whatsapp', 'web'],
    createdAt: '2025-11-25',
    lastActivity: '2025-12-10T08:30:00Z',
    billingCycle: 'trial',
    trialEndsAt: '2025-12-25'
  },
  {
    id: 'tenant-004',
    businessName: 'Beauty Salon Güzellik',
    owner: {
      name: 'Ayşe Şen',
      email: 'ayse@beautysalon.com',
      phone: '+90 535 456 7890'
    },
    industry: 'Beauty & Wellness',
    plan: 'Enterprise',
    status: 'active',
    stats: {
      totalConversations: 6789,
      activeAgents: 8,
      monthlyRevenue: 4999,
      growth: 22.3
    },
    integrations: ['whatsapp', 'instagram', 'facebook', 'web'],
    createdAt: '2023-11-10',
    lastActivity: '2025-12-10T10:25:00Z',
    billingCycle: 'annual',
    nextBillingDate: '2026-11-10'
  },
  {
    id: 'tenant-005',
    businessName: 'AutoCare Oto Servis',
    owner: {
      name: 'Can Özkan',
      email: 'can@autocare.com',
      phone: '+90 536 567 8901'
    },
    industry: 'Automotive',
    plan: 'Starter',
    status: 'suspended',
    stats: {
      totalConversations: 892,
      activeAgents: 1,
      monthlyRevenue: 999,
      growth: -5.2
    },
    integrations: ['whatsapp'],
    createdAt: '2024-06-12',
    lastActivity: '2025-11-28T14:20:00Z',
    billingCycle: 'monthly',
    suspendedAt: '2025-12-01',
    suspendedReason: 'Payment overdue'
  }
];

export const mockSuperAdminStats = {
  totalTenants: 127,
  activeTenants: 118,
  trialTenants: 7,
  suspendedTenants: 2,
  totalRevenue: {
    monthly: 287450,
    annual: 3449400,
    growth: 18.7
  },
  totalConversations: 342891,
  totalActiveAgents: 523,
  avgSatisfactionRate: 94.8,
  systemHealth: {
    uptime: 99.97,
    avgResponseTime: '120ms',
    errorRate: 0.03
  }
};

export const mockRevenueByPlan = [
  { plan: 'Starter', tenants: 45, revenue: 44955, percentage: 15.6 },
  { plan: 'Professional', tenants: 58, revenue: 144942, percentage: 50.4 },
  { plan: 'Enterprise', tenants: 17, revenue: 84983, percentage: 29.6 },
  { plan: 'Trial', tenants: 7, revenue: 0, percentage: 0 }
];

export const mockIndustryBreakdown = [
  { industry: 'Dental', count: 23, percentage: 18.1 },
  { industry: 'Food & Beverage', count: 31, percentage: 24.4 },
  { industry: 'Retail', count: 18, percentage: 14.2 },
  { industry: 'Beauty & Wellness', count: 15, percentage: 11.8 },
  { industry: 'Technology Services', count: 12, percentage: 9.4 },
  { industry: 'Healthcare', count: 10, percentage: 7.9 },
  { industry: 'Automotive', count: 8, percentage: 6.3 },
  { industry: 'Other', count: 10, percentage: 7.9 }
];

export const mockTenantGrowthTrend = [
  { date: '2025-06-01', newTenants: 8, churnedTenants: 2, netGrowth: 6 },
  { date: '2025-07-01', newTenants: 12, churnedTenants: 1, netGrowth: 11 },
  { date: '2025-08-01', newTenants: 15, churnedTenants: 3, netGrowth: 12 },
  { date: '2025-09-01', newTenants: 18, churnedTenants: 2, netGrowth: 16 },
  { date: '2025-10-01', newTenants: 14, churnedTenants: 4, netGrowth: 10 },
  { date: '2025-11-01', newTenants: 17, churnedTenants: 1, netGrowth: 16 },
  { date: '2025-12-01', newTenants: 9, churnedTenants: 2, netGrowth: 7 }
];

export const mockSystemMetrics = {
  apiRequests: {
    total: 2847234,
    successRate: 99.97,
    avgLatency: 120,
    peakRPS: 1247
  },
  database: {
    size: '187 GB',
    connections: 342,
    queryTime: '15ms'
  },
  storage: {
    used: '423 GB',
    total: '1 TB',
    percentage: 42.3
  },
  bandwidth: {
    inbound: '1.2 TB',
    outbound: '3.4 TB'
  }
};

export const mockPlanFeatures = {
  starter: {
    name: 'Starter',
    price: 999,
    features: [
      '3 Temsilci',
      '1000 Sohbet/Ay',
      '2 Kanal',
      'Temel Raporlar',
      'Email Destek'
    ]
  },
  professional: {
    name: 'Professional',
    price: 2499,
    features: [
      '10 Temsilci',
      'Sınırsız Sohbet',
      'Tüm Kanallar',
      'Gelişmiş Raporlar',
      'AI Asistan',
      'Öncelikli Destek'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 4999,
    features: [
      'Sınırsız Temsilci',
      'Sınırsız Sohbet',
      'Tüm Kanallar',
      'Özel Raporlar',
      'AI Asistan Pro',
      '7/24 Destek',
      'Özel Entegrasyonlar',
      'SLA Garantisi'
    ]
  }
};
