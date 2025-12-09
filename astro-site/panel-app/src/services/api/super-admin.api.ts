/**
 * Super Admin Panel API Service
 * All backend API calls for super admin panel
 * 
 * @module services/api/super-admin
 */

import { apiClient } from '@/lib/api/client';
import type { Tenant, User, SystemLog, FinancialReport, TenantBilling, TenantUsageMetrics } from '@/types';

// ==================== DASHBOARD ====================

export const superAdminDashboardApi = {
  /**
   * Get dashboard statistics
   */
  async getStats() {
    const response = await apiClient.get('/super-admin/dashboard/stats');
    return response.data;
  },

  /**
   * Search across system (global search)
   */
  async globalSearch(query: string) {
    const response = await apiClient.get('/super-admin/dashboard/search', {
      params: { query },
    });
    return response.data;
  },

  /**
   * Get notifications
   */
  async getNotifications(limit: number = 20) {
    const response = await apiClient.get('/super-admin/dashboard/notifications', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Mark notification as read
   */
  async markNotificationRead(notificationId: string) {
    const response = await apiClient.post(
      `/super-admin/dashboard/notifications/${notificationId}/read`
    );
    return response.data;
  },

  /**
   * Get recent activity
   */
  async getRecentActivity() {
    const response = await apiClient.get('/super-admin/dashboard/activity');
    return response.data;
  },

  /**
   * Get top tenants
   */
  async getTopTenants(limit: number = 5) {
    const response = await apiClient.get('/super-admin/dashboard/top-tenants', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get system health
   */
  async getSystemHealth() {
    const response = await apiClient.get('/super-admin/dashboard/system-health');
    return response.data;
  },
};

// ==================== TENANTS ====================

export const superAdminTenantsApi = {
  /**
   * Get all tenants with filters
   */
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
    const response = await apiClient.get<{ 
      data: TenantBilling[]; 
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(
      '/super-admin/tenants',
      { params: filters }
    );
    return response.data;
  },

  /**
   * Get single tenant details
   */
  async getTenant(tenantId: string): Promise<TenantBilling> {
    const response = await apiClient.get<TenantBilling>(`/super-admin/tenants/${tenantId}`);
    return response.data;
  },

  /**
   * Create new tenant
   */
  async createTenant(data: Partial<Tenant>) {
    const response = await apiClient.post<Tenant>('/super-admin/tenants', data);
    return response.data;
  },

  /**
   * Update tenant
   */
  async updateTenant(tenantId: string, data: Partial<Tenant>) {
    const response = await apiClient.put<Tenant>(`/super-admin/tenants/${tenantId}`, data);
    return response.data;
  },

  /**
   * Delete tenant
   */
  async deleteTenant(tenantId: string) {
    const response = await apiClient.delete(`/super-admin/tenants/${tenantId}`);
    return response.data;
  },

  /**
   * Suspend tenant
   */
  async suspendTenant(tenantId: string, reason: string) {
    const response = await apiClient.post(`/super-admin/tenants/${tenantId}/suspend`, {
      reason,
    });
    return response.data;
  },

  /**
   * Activate tenant
   */
  async activateTenant(tenantId: string) {
    const response = await apiClient.post(`/super-admin/tenants/${tenantId}/activate`);
    return response.data;
  },

  /**
   * Export tenants to CSV
   */
  async exportTenants(format: 'csv' | 'excel' = 'csv') {
    const response = await apiClient.get(`/super-admin/tenants/export/${format}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get tenant usage metrics
   */
  async getTenantUsage(tenantId: string, dateRange: string = '30d'): Promise<TenantUsageMetrics> {
    const response = await apiClient.get<TenantUsageMetrics>(
      `/super-admin/tenants/${tenantId}/usage`,
      { params: { dateRange } }
    );
    return response.data;
  },

  /**
   * Get tenant statistics
   */
  async getTenantStats(tenantId: string) {
    const response = await apiClient.get(`/super-admin/tenants/${tenantId}/stats`);
    return response.data;
  },
};

// ==================== USERS ====================

export const superAdminUsersApi = {
  /**
   * Get all users across all tenants
   */
  async getUsers(filters?: {
    search?: string;
    role?: string;
    status?: string;
    tenantId?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await apiClient.get<{ data: User[]; total: number }>(
      '/super-admin/users',
      { params: filters }
    );
    return response.data;
  },

  /**
   * Get single user
   */
  async getUser(userId: string) {
    const response = await apiClient.get<User>(`/super-admin/users/${userId}`);
    return response.data;
  },

  /**
   * Create user
   */
  async createUser(data: Partial<User>) {
    const response = await apiClient.post<User>('/super-admin/users', data);
    return response.data;
  },

  /**
   * Update user
   */
  async updateUser(userId: string, data: Partial<User>) {
    const response = await apiClient.put<User>(`/super-admin/users/${userId}`, data);
    return response.data;
  },

  /**
   * Delete user
   */
  async deleteUser(userId: string) {
    const response = await apiClient.delete(`/super-admin/users/${userId}`);
    return response.data;
  },

  /**
   * Activate user
   */
  async activateUser(userId: string) {
    const response = await apiClient.post(`/super-admin/users/${userId}/activate`);
    return response.data;
  },

  /**
   * Deactivate user
   */
  async deactivateUser(userId: string, reason?: string) {
    const response = await apiClient.post(`/super-admin/users/${userId}/deactivate`, {
      reason,
    });
    return response.data;
  },

  /**
   * Reset user password
   */
  async resetPassword(userId: string) {
    const response = await apiClient.post(`/super-admin/users/${userId}/reset-password`);
    return response.data;
  },
};

// ==================== FINANCIAL REPORTS ====================

export const superAdminFinancialApi = {
  /**
   * Get financial summary (for FinancialReportsPage)
   */
  async getFinancialSummary(period: '30d' | '90d' | '1y' = '30d') {
    const response = await apiClient.get('/super-admin/financial/summary', {
      params: { period },
    });
    return response.data;
  },

  /**
   * Get monthly trend data
   */
  async getMonthlyTrend(period: '30d' | '90d' | '1y' = '30d') {
    const response = await apiClient.get('/super-admin/financial/monthly-trend', {
      params: { period },
    });
    return response.data;
  },

  /**
   * Get plan distribution
   */
  async getPlanDistribution() {
    const response = await apiClient.get('/super-admin/financial/plan-distribution');
    return response.data;
  },

  /**
   * Get top performing tenants
   */
  async getTopTenants(limit: number = 5) {
    const response = await apiClient.get('/super-admin/financial/top-tenants', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get cost breakdown
   */
  async getCostBreakdown(period: '30d' | '90d' | '1y' = '30d') {
    const response = await apiClient.get('/super-admin/financial/cost-breakdown', {
      params: { period },
    });
    return response.data;
  },

  /**
   * Get financial reports
   */
  async getReports(filters?: {
    startDate?: string;
    endDate?: string;
    tenantId?: string;
    type?: string;
  }) {
    const response = await apiClient.get<FinancialReport[]>(
      '/super-admin/financial/reports',
      { params: filters }
    );
    return response.data;
  },

  /**
   * Get revenue summary
   */
  async getRevenueSummary(dateRange: string = '30d') {
    const response = await apiClient.get('/super-admin/financial/revenue', {
      params: { dateRange },
    });
    return response.data;
  },

  /**
   * Export financial report
   */
  async exportReport(format: 'pdf' | 'excel' | 'csv', filters?: {
    startDate?: string;
    endDate?: string;
    tenantId?: string;
  }) {
    const response = await apiClient.get(`/super-admin/financial/export/${format}`, {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get payment history
   */
  async getPaymentHistory(filters?: {
    tenantId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await apiClient.get('/super-admin/financial/payments', {
      params: filters,
    });
    return response.data;
  },
};

// ==================== ANALYTICS ====================

export const superAdminAnalyticsApi = {
  /**
   * Get system analytics
   */
  async getAnalytics(dateRange: string = '30d') {
    const response = await apiClient.get('/super-admin/analytics', {
      params: { dateRange },
    });
    return response.data;
  },

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics() {
    const response = await apiClient.get('/super-admin/analytics/performance');
    return response.data;
  },

  /**
   * Get usage trends
   */
  async getUsageTrends(dateRange: string = '30d') {
    const response = await apiClient.get('/super-admin/analytics/trends', {
      params: { dateRange },
    });
    return response.data;
  },
};

// ==================== SYSTEM ====================

export const superAdminSystemApi = {
  /**
   * Get system health
   */
  async getSystemHealth() {
    const response = await apiClient.get('/super-admin/system/health');
    return response.data;
  },

  /**
   * Get system logs
   */
  async getLogs(filters?: {
    level?: string;
    service?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await apiClient.get<{ data: SystemLog[]; total: number }>(
      '/super-admin/system/logs',
      { params: filters }
    );
    return response.data;
  },

  /**
   * Export system logs
   */
  async exportLogs(filters?: {
    level?: string;
    service?: string;
    startDate?: string;
    endDate?: string;
    format?: 'csv' | 'json';
  }) {
    const response = await apiClient.get('/super-admin/system/logs/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get system configuration
   */
  async getConfig() {
    const response = await apiClient.get('/super-admin/system/config');
    return response.data;
  },

  /**
   * Update system configuration
   */
  async updateConfig(data: Record<string, any>) {
    const response = await apiClient.put('/super-admin/system/config', data);
    return response.data;
  },

  /**
   * Clear cache
   */
  async clearCache(type: string) {
    const response = await apiClient.post('/super-admin/system/cache/clear', { type });
    return response.data;
  },

  /**
   * Run database migration
   */
  async runMigration(migration: string) {
    const response = await apiClient.post('/super-admin/system/migrations/run', {
      migration,
    });
    return response.data;
  },
};

// ==================== SETTINGS ====================

export const superAdminSettingsApi = {
  /**
   * Get global settings
   */
  async getSettings() {
    const response = await apiClient.get('/super-admin/settings');
    return response.data;
  },

  /**
   * Update global settings
   */
  async updateSettings(section: string, data: Record<string, any>) {
    const response = await apiClient.put(`/super-admin/settings/${section}`, data);
    return response.data;
  },

  /**
   * Get feature flags
   */
  async getFeatureFlags() {
    const response = await apiClient.get('/super-admin/settings/feature-flags');
    return response.data;
  },

  /**
   * Toggle feature flag
   */
  async toggleFeatureFlag(flag: string, enabled: boolean) {
    const response = await apiClient.put('/super-admin/settings/feature-flags', {
      flag,
      enabled,
    });
    return response.data;
  },
};

