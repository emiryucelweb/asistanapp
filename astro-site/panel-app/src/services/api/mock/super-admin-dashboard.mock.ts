/**
 * Mock Data for Super Admin Dashboard API
 * Used when API_CONFIG.USE_MOCK_DATA is true
 */

import { mockDelay } from '../config';
import { mockSuperAdminStats, mockTenants, mockSystemMetrics, mockIndustryBreakdown } from '@/data/mocks';

export const mockDashboardData = {
  stats: {
    totalTenants: mockSuperAdminStats.totalTenants,
    activeTenants: mockSuperAdminStats.activeTenants,
    trialTenants: mockSuperAdminStats.trialTenants,
    pastDueTenants: 2,
    totalMonthlyRevenue: mockSuperAdminStats.totalRevenue.monthly,
    totalMonthlyCosts: 95820,
    totalProfit: mockSuperAdminStats.totalRevenue.monthly - 95820,
    profitMargin: ((mockSuperAdminStats.totalRevenue.monthly - 95820) / mockSuperAdminStats.totalRevenue.monthly * 100),
    growthRate: mockSuperAdminStats.totalRevenue.growth,
    churnRate: 2.5,
  },

  recentActivity: [
    { id: 1, type: 'new', tenant: 'Modern Kafe', tenantId: 'tenant-005', action: 'Yeni firma kaydı', time: '5 dakika önce', color: 'green' },
    { id: 2, type: 'payment', tenant: 'Smile Dental Klinik', tenantId: 'tenant-001', action: 'Ödeme alındı (8.500 TRY)', time: '1 saat önce', color: 'blue' },
    { id: 3, type: 'upgrade', tenant: 'TechHub Yazılım', tenantId: 'tenant-002', action: 'Enterprise plana yükseltildi', time: '3 saat önce', color: 'purple' },
    { id: 4, type: 'warning', tenant: 'Güzellik Salonu Luna', tenantId: 'tenant-003', action: 'API kullanım limiti aşıldı', time: '5 saat önce', color: 'red' },
    { id: 5, type: 'api', tenant: 'E-Ticaret Mağazası', tenantId: 'tenant-004', action: 'Günlük mesaj limiti %85', time: '1 gün önce', color: 'yellow' },
  ],

  topTenants: mockTenants.slice(0, 5).map(tenant => ({
    name: tenant.businessName,
    revenue: tenant.stats.monthlyRevenue,
    growth: tenant.stats.growth,
    plan: tenant.plan
  })),

  systemHealth: [
    { name: 'API Server', status: 'operational', uptime: '99.97%' },
    { name: 'Database', status: 'operational', uptime: '99.99%' },
    { name: 'Cache', status: 'operational', uptime: '99.8%' },
    { name: 'Storage', status: 'operational', uptime: '98.5%' },
  ],

  industries: mockIndustryBreakdown,
};

/**
 * Mock API implementations
 */
export const mockSuperAdminDashboardApi = {
  async getStats() {
    await mockDelay();
    return mockDashboardData.stats;
  },

  async getRecentActivity() {
    await mockDelay();
    return mockDashboardData.recentActivity;
  },

  async getTopTenants(limit: number = 5) {
    await mockDelay();
    return mockDashboardData.topTenants.slice(0, limit);
  },

  async getSystemHealth() {
    await mockDelay();
    return mockDashboardData.systemHealth;
  },

  async globalSearch(query: string) {
    await mockDelay();
    
    // Simple mock search
    const results = [
      { id: '1', type: 'tenant', title: 'Acme E-commerce', subtitle: 'Enterprise Plan' },
      { id: '2', type: 'tenant', title: 'TechStart SaaS', subtitle: 'Professional Plan' },
      { id: '3', type: 'user', title: 'John Doe', subtitle: 'Admin @ Acme' },
    ].filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase())
    );

    return results;
  },

  async markNotificationRead(notificationId: string) {
    await mockDelay();
    return { success: true };
  },
};

