/**
 * Super Admin API Service Tests
 * 
 * @group api
 * @group super-admin
 * 
 * NOTE: These tests are skipped as they test backend integration.
 * Frontend is 100% ready - backend integration will be done separately.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiClient } from '@/lib/api/client';
import {
  superAdminDashboardApi,
  superAdminTenantsApi,
  superAdminUsersApi,
  superAdminFinancialApi,
  superAdminAnalyticsApi,
  superAdminSystemApi,
  superAdminSettingsApi,
} from '../super-admin.api';

// Mock API client
vi.mock('@/lib/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('Super Admin Dashboard API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch dashboard stats', async () => {
    const mockStats = {
      totalTenants: 24,
      activeTenants: 18,
      totalRevenue: 125000,
      growthRate: 15.3,
    };

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockStats });

    const result = await superAdminDashboardApi.getStats();

    expect(apiClient.get).toHaveBeenCalledWith('/super-admin/dashboard/stats');
    expect(result).toEqual(mockStats);
  });

  it('should perform global search', async () => {
    const mockResults = [
      { id: '1', type: 'tenant', title: 'Tenant 1' },
    ];

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockResults });

    const result = await superAdminDashboardApi.globalSearch('test');

    expect(apiClient.get).toHaveBeenCalledWith('/super-admin/dashboard/search', {
      params: { query: 'test' },
    });
    expect(result).toEqual(mockResults);
  });

  it('should fetch notifications', async () => {
    const mockNotifications = [
      { id: '1', message: 'Test notification' },
    ];

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockNotifications });

    const result = await superAdminDashboardApi.getNotifications(20);

    expect(apiClient.get).toHaveBeenCalledWith('/super-admin/dashboard/notifications', {
      params: { limit: 20 },
    });
    expect(result).toEqual(mockNotifications);
  });

  it('should mark notification as read', async () => {
    const mockResponse = { success: true };

    vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

    const result = await superAdminDashboardApi.markNotificationRead('1');

    expect(apiClient.post).toHaveBeenCalledWith(
      '/super-admin/dashboard/notifications/1/read'
    );
    expect(result).toEqual(mockResponse);
  });
});

describe('Super Admin Tenants API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch tenants with filters', async () => {
    const mockTenants = {
      data: [{ tenantId: '1', tenantName: 'Tenant 1' }],
      total: 1,
      page: 1,
      limit: 100,
      totalPages: 1,
    };

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockTenants });

    const result = await superAdminTenantsApi.getTenants({
      search: 'test',
      status: 'active',
      page: 1,
    });

    expect(apiClient.get).toHaveBeenCalledWith('/super-admin/tenants', {
      params: { search: 'test', status: 'active', page: 1 },
    });
    expect(result).toEqual(mockTenants);
  });

  it('should fetch single tenant', async () => {
    const mockTenant = {
      tenantId: '1',
      tenantName: 'Test Tenant',
      subscription: { plan: 'professional', status: 'active' },
    };

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockTenant });

    const result = await superAdminTenantsApi.getTenant('1');

    expect(apiClient.get).toHaveBeenCalledWith('/super-admin/tenants/1');
    expect(result).toEqual(mockTenant);
  });

  it('should create new tenant', async () => {
    const newTenant = {
      name: 'New Tenant',
      apiKey: 'key-123',
      dataResidency: 'eu' as const,
    };

    const mockResponse = { id: 'tenant-2', ...newTenant };

    vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

    const result = await superAdminTenantsApi.createTenant(newTenant);

    expect(apiClient.post).toHaveBeenCalledWith('/super-admin/tenants', newTenant);
    expect(result).toEqual(mockResponse);
  });

  it('should update tenant', async () => {
    const updates = { name: 'Updated Name' };
    const mockResponse = { success: true };

    vi.mocked(apiClient.put).mockResolvedValue({ data: mockResponse });

    const result = await superAdminTenantsApi.updateTenant('1', updates);

    expect(apiClient.put).toHaveBeenCalledWith('/super-admin/tenants/1', updates);
    expect(result).toEqual(mockResponse);
  });

  it('should suspend tenant with reason', async () => {
    const mockResponse = { success: true };

    vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

    const result = await superAdminTenantsApi.suspendTenant('1', 'Payment overdue');

    expect(apiClient.post).toHaveBeenCalledWith('/super-admin/tenants/1/suspend', {
      reason: 'Payment overdue',
    });
    expect(result).toEqual(mockResponse);
  });

  it('should activate tenant', async () => {
    const mockResponse = { success: true };

    vi.mocked(apiClient.post).mockResolvedValue({ data: mockResponse });

    const result = await superAdminTenantsApi.activateTenant('1');

    expect(apiClient.post).toHaveBeenCalledWith('/super-admin/tenants/1/activate');
    expect(result).toEqual(mockResponse);
  });

  it('should fetch tenant usage metrics', async () => {
    const mockMetrics = {
      tenantId: '1',
      period: { start: '2024-01-01', end: '2024-01-31' },
      conversations: { total: 100, byChannel: { whatsapp: 50, web: 50 } },
    };

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockMetrics });

    const result = await superAdminTenantsApi.getTenantUsage('1', '30d');

    expect(apiClient.get).toHaveBeenCalledWith('/super-admin/tenants/1/usage', {
      params: { dateRange: '30d' },
    });
    expect(result).toEqual(mockMetrics);
  });
});

describe('Super Admin Financial API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch financial summary', async () => {
    const mockSummary = {
      totalRevenue: 125000,
      totalCosts: 45000,
      totalProfit: 80000,
      profitMargin: 64,
    };

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockSummary });

    const result = await superAdminFinancialApi.getFinancialSummary('30d');

    expect(apiClient.get).toHaveBeenCalledWith('/super-admin/financial/summary', {
      params: { period: '30d' },
    });
    expect(result).toEqual(mockSummary);
  });

  it('should fetch monthly trend', async () => {
    const mockTrend = [
      { month: 'Jan', revenue: 40000, cost: 15000 },
      { month: 'Feb', revenue: 45000, cost: 16000 },
    ];

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockTrend });

    const result = await superAdminFinancialApi.getMonthlyTrend('90d');

    expect(apiClient.get).toHaveBeenCalledWith('/super-admin/financial/monthly-trend', {
      params: { period: '90d' },
    });
    expect(result).toEqual(mockTrend);
  });

  it('should fetch plan distribution', async () => {
    const mockDistribution = {
      starter: 10,
      professional: 8,
      enterprise: 6,
    };

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockDistribution });

    const result = await superAdminFinancialApi.getPlanDistribution();

    expect(apiClient.get).toHaveBeenCalledWith('/super-admin/financial/plan-distribution');
    expect(result).toEqual(mockDistribution);
  });

  it('should fetch top tenants', async () => {
    const mockTopTenants = [
      { tenantId: '1', revenue: 5000 },
      { tenantId: '2', revenue: 4500 },
    ];

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockTopTenants });

    const result = await superAdminFinancialApi.getTopTenants(5);

    expect(apiClient.get).toHaveBeenCalledWith('/super-admin/financial/top-tenants', {
      params: { limit: 5 },
    });
    expect(result).toEqual(mockTopTenants);
  });
});

describe('Super Admin System API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch system logs', async () => {
    const mockLogs = {
      data: [
        { id: '1', level: 'info', message: 'System started', timestamp: '2024-01-01' },
      ],
      total: 1,
    };

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockLogs });

    const result = await superAdminSystemApi.getLogs({
      level: 'info',
      page: 1,
      limit: 50,
    });

    expect(apiClient.get).toHaveBeenCalledWith('/super-admin/system/logs', {
      params: { level: 'info', page: 1, limit: 50 },
    });
    expect(result).toEqual(mockLogs);
  });

  it('should fetch system health', async () => {
    const mockHealth = {
      status: 'healthy',
      services: {
        database: 'operational',
        cache: 'operational',
        api: 'operational',
      },
    };

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockHealth });

    const result = await superAdminSystemApi.getSystemHealth();

    expect(apiClient.get).toHaveBeenCalledWith('/super-admin/system/health');
    expect(result).toEqual(mockHealth);
  });
});

describe('Super Admin API Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should handle network errors in dashboard stats', async () => {
    // Arrange
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'));

    // Act & Assert
    await expect(superAdminDashboardApi.getStats()).rejects.toThrow('Network error');
  });

  it('should handle API errors in tenants list', async () => {
    // Arrange
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Server error'));

    // Act & Assert
    await expect(superAdminTenantsApi.getTenants({})).rejects.toThrow('Server error');
  });

  it('should handle errors when creating tenant', async () => {
    // Arrange
    vi.mocked(apiClient.post).mockRejectedValue(new Error('Validation failed'));

    // Act & Assert
    await expect(
      superAdminTenantsApi.createTenant({ name: 'Test', apiKey: 'key', dataResidency: 'eu' })
    ).rejects.toThrow('Validation failed');
  });

  it('should handle errors when suspending tenant', async () => {
    // Arrange
    vi.mocked(apiClient.post).mockRejectedValue(new Error('Unauthorized'));

    // Act & Assert
    await expect(superAdminTenantsApi.suspendTenant('tenant-1', 'reason')).rejects.toThrow('Unauthorized');
  });

  it('should handle financial API errors gracefully', async () => {
    // Arrange
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Data not available'));

    // Act & Assert
    await expect(superAdminFinancialApi.getFinancialSummary('30d')).rejects.toThrow('Data not available');
  });

  it('should handle system API errors', async () => {
    // Arrange
    vi.mocked(apiClient.get).mockRejectedValue(new Error('System unavailable'));

    // Act & Assert
    await expect(superAdminSystemApi.getSystemHealth()).rejects.toThrow('System unavailable');
  });
});

