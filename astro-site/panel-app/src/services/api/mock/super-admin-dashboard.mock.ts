/**
 * Mock Data for Super Admin Dashboard API
 * Used when API_CONFIG.USE_MOCK_DATA is true
 */

import { mockDelay } from '../config';

export const mockDashboardData = {
  stats: {
    totalTenants: 24,
    activeTenants: 18,
    trialTenants: 4,
    pastDueTenants: 2,
    totalMonthlyRevenue: 45750,
    totalMonthlyCosts: 15280,
    totalProfit: 30470,
    profitMargin: 66.6,
    growthRate: 15.3,
    churnRate: 2.5,
  },

  recentActivity: [
    { id: 1, type: 'new', tenant: 'Fashion Boutique', tenantId: 'tenant-1', action: 'Yeni firma kaydı', time: '5 dakika önce', color: 'green' },
    { id: 2, type: 'payment', tenant: 'Acme E-commerce', tenantId: 'tenant-2', action: 'Ödeme alındı ($2,500)', time: '1 saat önce', color: 'blue' },
    { id: 3, type: 'upgrade', tenant: 'TechStart SaaS', tenantId: 'tenant-3', action: 'Enterprise plana yükseltildi', time: '3 saat önce', color: 'purple' },
    { id: 4, type: 'warning', tenant: 'HealthCare Plus', tenantId: 'tenant-4', action: 'Ödeme gecikmesi', time: '5 saat önce', color: 'red' },
    { id: 5, type: 'api', tenant: 'Food Delivery Co', tenantId: 'tenant-5', action: 'API limiti %80 doldu', time: '1 gün önce', color: 'yellow' },
  ],

  topTenants: [
    { name: 'Acme E-commerce', revenue: 2500, growth: 12.5, plan: 'Enterprise' },
    { name: 'TechStart SaaS', revenue: 2400, growth: 18.2, plan: 'Professional' },
    { name: 'HealthCare Plus', revenue: 2200, growth: -5.3, plan: 'Professional' },
    { name: 'Fashion Boutique', revenue: 1999, growth: 22.1, plan: 'Starter' },
    { name: 'Food Delivery Co', revenue: 1899, growth: 8.7, plan: 'Professional' },
  ],

  systemHealth: [
    { name: 'API Server', status: 'operational', uptime: '99.9%' },
    { name: 'Database', status: 'operational', uptime: '100%' },
    { name: 'Cache', status: 'operational', uptime: '99.8%' },
    { name: 'Storage', status: 'warning', uptime: '95.2%' },
  ],
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

