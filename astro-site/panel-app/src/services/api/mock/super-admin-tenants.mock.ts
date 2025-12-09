/**
 * Mock Data for Super Admin Tenants API
 * Used when API_CONFIG.USE_MOCK_DATA is true
 */

import { mockDelay } from '../config';
import type { TenantBilling, TenantUsageMetrics } from '@/types';

export const mockTenantsData: TenantBilling[] = [
  {
    tenantId: '1',
    tenantName: 'Acme E-commerce',
    subscription: {
      plan: 'enterprise',
      status: 'active',
      currentPeriodStart: '2025-10-01',
      currentPeriodEnd: '2025-11-01',
      limits: { conversations: 10000, users: 50, storage: 500, apiCalls: 1000000 },
      usage: { conversations: 7500, users: 35, storage: 320, apiCalls: 750000 },
    },
    monthlyRevenue: 2500,
    totalRevenue: 25000,
    apiCosts: {
      llm: {
        provider: 'openai',
        totalCalls: 150000,
        totalTokens: 45000000,
        totalCost: 450,
        breakdown: {
          gpt4: { calls: 50000, tokens: 25000000, cost: 300 },
          gpt35: { calls: 80000, tokens: 15000000, cost: 120 },
          embedding: { calls: 20000, tokens: 5000000, cost: 30 },
        },
      },
      voice: { provider: 'elevenlabs', totalMinutes: 500, totalCost: 150 },
      whatsapp: { totalMessages: 25000, totalCost: 250 },
      storage: { totalGB: 320, totalCost: 32 },
      other: [],
      totalMonthlyCost: 882,
    },
    profitMargin: 64.7,
    paymentStatus: 'paid',
    lastPaymentDate: '2025-10-01',
    nextBillingDate: '2025-11-01',
    billingEmail: 'billing@acme.com',
  },
  {
    tenantId: '2',
    tenantName: 'TechStart SaaS',
    subscription: {
      plan: 'professional',
      status: 'active',
      currentPeriodStart: '2025-10-05',
      currentPeriodEnd: '2025-11-05',
      limits: { conversations: 5000, users: 20, storage: 200, apiCalls: 500000 },
      usage: { conversations: 3200, users: 15, storage: 120, apiCalls: 320000 },
    },
    monthlyRevenue: 999,
    totalRevenue: 5994,
    apiCosts: {
      llm: {
        provider: 'openai',
        totalCalls: 80000,
        totalTokens: 20000000,
        totalCost: 200,
        breakdown: {
          gpt4: { calls: 20000, tokens: 10000000, cost: 120 },
          gpt35: { calls: 50000, tokens: 8000000, cost: 64 },
          embedding: { calls: 10000, tokens: 2000000, cost: 16 },
        },
      },
      voice: { provider: 'azure', totalMinutes: 200, totalCost: 40 },
      whatsapp: { totalMessages: 10000, totalCost: 100 },
      storage: { totalGB: 120, totalCost: 12 },
      other: [],
      totalMonthlyCost: 352,
    },
    profitMargin: 64.8,
    paymentStatus: 'paid',
    lastPaymentDate: '2025-10-05',
    nextBillingDate: '2025-11-05',
    billingEmail: 'finance@techstart.io',
  },
  {
    tenantId: '3',
    tenantName: 'Fashion Boutique',
    subscription: {
      plan: 'starter',
      status: 'trial',
      currentPeriodStart: '2025-10-08',
      currentPeriodEnd: '2025-10-22',
      limits: { conversations: 1000, users: 5, storage: 50, apiCalls: 100000 },
      usage: { conversations: 450, users: 3, storage: 15, apiCalls: 45000 },
    },
    monthlyRevenue: 0,
    totalRevenue: 0,
    apiCosts: {
      llm: {
        provider: 'openai',
        totalCalls: 12000,
        totalTokens: 3000000,
        totalCost: 30,
        breakdown: {
          gpt4: { calls: 2000, tokens: 1000000, cost: 12 },
          gpt35: { calls: 8000, tokens: 1500000, cost: 12 },
          embedding: { calls: 2000, tokens: 500000, cost: 6 },
        },
      },
      voice: { provider: 'elevenlabs', totalMinutes: 50, totalCost: 15 },
      whatsapp: { totalMessages: 2000, totalCost: 20 },
      storage: { totalGB: 15, totalCost: 1.5 },
      other: [],
      totalMonthlyCost: 66.5,
    },
    profitMargin: -100,
    paymentStatus: 'pending',
    nextBillingDate: '2025-10-22',
    billingEmail: 'owner@fashionboutique.com',
  },
  {
    tenantId: '4',
    tenantName: 'HealthCare Plus',
    subscription: {
      plan: 'professional',
      status: 'past_due',
      currentPeriodStart: '2025-09-15',
      currentPeriodEnd: '2025-10-15',
      limits: { conversations: 5000, users: 20, storage: 200, apiCalls: 500000 },
      usage: { conversations: 4800, users: 18, storage: 180, apiCalls: 480000 },
    },
    monthlyRevenue: 999,
    totalRevenue: 8991,
    apiCosts: {
      llm: {
        provider: 'anthropic',
        totalCalls: 95000,
        totalTokens: 28000000,
        totalCost: 280,
        breakdown: {
          gpt4: { calls: 30000, tokens: 15000000, cost: 180 },
          gpt35: { calls: 55000, tokens: 10000000, cost: 80 },
          embedding: { calls: 10000, tokens: 3000000, cost: 20 },
        },
      },
      voice: { provider: 'google', totalMinutes: 300, totalCost: 60 },
      whatsapp: { totalMessages: 15000, totalCost: 150 },
      storage: { totalGB: 180, totalCost: 18 },
      other: [],
      totalMonthlyCost: 508,
    },
    profitMargin: 49.1,
    paymentStatus: 'overdue',
    lastPaymentDate: '2025-09-15',
    nextBillingDate: '2025-10-15',
    billingEmail: 'billing@healthcareplus.com',
  },
];

/**
 * Mock usage metrics data
 */
export const mockUsageMetricsData: Record<string, TenantUsageMetrics> = {
  '1': {
    tenantId: '1',
    period: {
      start: '2025-10-01',
      end: '2025-10-11',
    },
    conversations: {
      total: 7500,
      byChannel: {
        whatsapp: 3500,
        instagram: 2000,
        facebook: 1200,
        twitter: 300,
        web: 400,
        voice: 100,
      },
      avgDuration: 450,
    },
    messages: {
      total: 45000,
      aiGenerated: 38000,
      agentHandled: 7000,
    },
    apiCalls: {
      total: 750000,
      byEndpoint: {
        '/ai-chatbot/chat': 150000,
        '/conversations': 200000,
        '/products': 100000,
        '/orders': 150000,
        '/analytics': 150000,
      },
    },
    storage: {
      totalGB: 320,
      files: 15000,
      media: 8500,
    },
    activeUsers: 35,
  },
  '2': {
    tenantId: '2',
    period: {
      start: '2025-10-05',
      end: '2025-10-15',
    },
    conversations: {
      total: 3200,
      byChannel: {
        whatsapp: 1500,
        instagram: 800,
        facebook: 500,
        twitter: 150,
        web: 200,
        voice: 50,
      },
      avgDuration: 380,
    },
    messages: {
      total: 20000,
      aiGenerated: 16000,
      agentHandled: 4000,
    },
    apiCalls: {
      total: 320000,
      byEndpoint: {
        '/ai-chatbot/chat': 80000,
        '/conversations': 100000,
        '/products': 50000,
        '/orders': 50000,
        '/analytics': 40000,
      },
    },
    storage: {
      totalGB: 120,
      files: 8000,
      media: 4500,
    },
    activeUsers: 15,
  },
  '3': {
    tenantId: '3',
    period: {
      start: '2025-10-08',
      end: '2025-10-18',
    },
    conversations: {
      total: 450,
      byChannel: {
        whatsapp: 200,
        instagram: 100,
        facebook: 80,
        twitter: 30,
        web: 30,
        voice: 10,
      },
      avgDuration: 320,
    },
    messages: {
      total: 3000,
      aiGenerated: 2500,
      agentHandled: 500,
    },
    apiCalls: {
      total: 45000,
      byEndpoint: {
        '/ai-chatbot/chat': 12000,
        '/conversations': 15000,
        '/products': 8000,
        '/orders': 5000,
        '/analytics': 5000,
      },
    },
    storage: {
      totalGB: 15,
      files: 1200,
      media: 800,
    },
    activeUsers: 3,
  },
  '4': {
    tenantId: '4',
    period: {
      start: '2025-09-15',
      end: '2025-09-25',
    },
    conversations: {
      total: 4800,
      byChannel: {
        whatsapp: 2000,
        instagram: 1200,
        facebook: 800,
        twitter: 350,
        web: 400,
        voice: 50,
      },
      avgDuration: 420,
    },
    messages: {
      total: 28000,
      aiGenerated: 22000,
      agentHandled: 6000,
    },
    apiCalls: {
      total: 480000,
      byEndpoint: {
        '/ai-chatbot/chat': 120000,
        '/conversations': 150000,
        '/products': 80000,
        '/orders': 70000,
        '/analytics': 60000,
      },
    },
    storage: {
      totalGB: 180,
      files: 10000,
      media: 6000,
    },
    activeUsers: 18,
  },
};

/**
 * Mock API implementations
 */
export const mockSuperAdminTenantsApi = {
  async getTenants(filters?: {
    search?: string;
    status?: string;
    plan?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: TenantBilling[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    await mockDelay();
    
    let filtered = [...mockTenantsData];

    // Apply filters
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.tenantName.toLowerCase().includes(search) ||
        t.tenantId.includes(search)
      );
    }

    if (filters?.status && filters.status !== 'all') {
      filtered = filtered.filter(t => t.subscription.status === filters.status);
    }

    if (filters?.plan && filters.plan !== 'all') {
      filtered = filtered.filter(t => t.subscription.plan === filters.plan);
    }

    // Pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 100;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: filtered.slice(start, end),
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  },

  async getTenant(tenantId: string): Promise<TenantBilling> {
    await mockDelay();
    const tenant = mockTenantsData.find(t => t.tenantId === tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }
    return tenant;
  },

  async suspendTenant(tenantId: string, reason: string) {
    await mockDelay();
    return { success: true, message: 'Tenant suspended', reason };
  },

  async activateTenant(tenantId: string) {
    await mockDelay();
    return { success: true, message: 'Tenant activated' };
  },

  async deleteTenant(tenantId: string) {
    await mockDelay();
    return { success: true, message: 'Tenant deleted' };
  },

  async getTenantUsage(tenantId: string, dateRange: string = '30d'): Promise<TenantUsageMetrics> {
    await mockDelay();
    const metrics = mockUsageMetricsData[tenantId];
    if (!metrics) {
      throw new Error('Usage metrics not found');
    }
    return metrics;
  },
};

