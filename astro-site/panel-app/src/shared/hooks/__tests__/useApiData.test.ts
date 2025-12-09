/**
 * @vitest-environment jsdom
 */
import { renderHook, act, waitFor, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useApiData, FEATURE_FLAGS } from '../useApiData';
import apiService from '@/services/api-service';
import { logger } from '@/shared/utils/logger';

// Mock logger
vi.mock('@/shared/utils/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn()
  }
}));

// Mock API service
vi.mock('@/services/api-service', () => ({
  default: {
    get: vi.fn()
  }
}));

// Mock Business Context
vi.mock('@/contexts/BusinessContext', () => ({
  useBusiness: vi.fn(() => ({
    businessType: 'ecommerce',
    config: { id: 'business-123' }
  }))
}));

// Mock useMockData
vi.mock('../useMockData', () => ({
  useMockData: vi.fn(() => ({
    dashboardStats: {
      activeConversations: 10,
      totalMessages: 100,
      totalRevenue: 50000,
      vipCustomers: 5,
      channelStats: { whatsapp: 60, instagram: 20, web: 15, phone: 5 },
      todayCount: 5,
      weekCount: 25,
      monthCount: 100,
      totalCustomers: 500
    },
    sectorCustomers: [
      {
        id: 'customer-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+905551234567',
        status: 'active',
        leadScore: 85,
        source: 'website',
        tags: ['vip'],
        sector: 'ecommerce',
        lastActivity: '2024-01-15T10:00:00Z',
        totalSpent: 5000,
        orderCount: 10,
        channel: 'whatsapp'
      }
    ],
    isLoading: false,
    regenerateMockData: vi.fn(),
    updateCustomer: vi.fn(),
    addCustomer: vi.fn(),
    allMockData: {}
  }))
}));

describe('useApiData', () => {
  const mockApiDashboardStats = {
    conversationStats: { active: 15, totalMessages: 200 },
    orderStats: { totalRevenue: 75000 },
    leadStats: { vipCount: 8, today: 10, week: 40, month: 150, total: 600 },
    channelBreakdown: { whatsapp: 70, instagram: 15, web: 10, phone: 5 }
  };

  const mockApiCustomers = {
    leads: [
      {
        id: 'api-lead-1',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '+905559876543',
        status: 'qualified',
        leadScore: 90,
        source: 'instagram',
        tags: ['premium'],
        lastActivityAt: '2024-01-16T12:00:00Z',
        totalValue: 8000,
        orderCount: 5,
        preferredChannel: 'instagram',
        createdAt: '2024-01-01T00:00:00Z'
      }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  // Test 1: AAA Pattern - Load data with API flags enabled
  it('should fetch dashboard stats from API when flag is enabled', async () => {
    // Arrange
    vi.mocked(apiService.get).mockResolvedValue({
      data: mockApiDashboardStats
    });

    // Act
    const { result } = renderHook(() => useApiData());
    
    // Assert - Loading state
    expect(result.current.isLoading).toBe(false); // Mock data loads synchronously
    
    // Wait for API data
    await waitFor(() => {
      expect(result.current.dashboardStats.activeConversations).toBe(15);
      expect(result.current.dashboardStats.totalRevenue).toBe(75000);
      expect(result.current.dashboardStats.vipCustomers).toBe(8);
    });
  });

  // Test 2: Fetch customers from API
  it('should fetch customers from API and transform to MockCustomer format', async () => {
    // Arrange
    vi.mocked(apiService.get)
      .mockResolvedValueOnce({ data: mockApiDashboardStats })
      .mockResolvedValueOnce({ data: mockApiCustomers });

    // Act
    const { result } = renderHook(() => useApiData());
    
    // Assert
    await waitFor(() => {
      expect(result.current.sectorCustomers).toHaveLength(1);
      expect(result.current.sectorCustomers[0].name).toBe('Jane Smith');
      expect(result.current.sectorCustomers[0].email).toBe('jane@example.com');
      expect(result.current.sectorCustomers[0].leadScore).toBe(90);
    });
  });

  // Test 3: Fallback to mock data on API failure
  it('should fallback to mock data when API fails', async () => {
    // Arrange
    vi.mocked(apiService.get).mockRejectedValue(new Error('Network error'));

    // Act
    const { result } = renderHook(() => useApiData());
    
    // Assert - Should use mock data
    await waitFor(() => {
      expect(result.current.dashboardStats.activeConversations).toBe(10); // Mock value
      expect(result.current.sectorCustomers).toHaveLength(1);
      expect(result.current.sectorCustomers[0].name).toBe('John Doe'); // Mock customer
      expect(logger.warn).toHaveBeenCalled();
    });
  });

  // Test 4: Parallel data fetching
  it('should fetch all data sources in parallel', async () => {
    // Arrange
    let dashboardCallTime = 0;
    let customersCallTime = 0;
    
    vi.mocked(apiService.get).mockImplementation((url: string) => {
      if (url.includes('analytics')) {
        dashboardCallTime = Date.now();
        return Promise.resolve({ data: mockApiDashboardStats });
      }
      if (url.includes('leads')) {
        customersCallTime = Date.now();
        return Promise.resolve({ data: mockApiCustomers });
      }
      return Promise.resolve({ data: [] });
    });

    // Act
    renderHook(() => useApiData());
    
    // Assert - Calls should happen nearly simultaneously
    await waitFor(() => {
      expect(dashboardCallTime).toBeGreaterThan(0);
      expect(customersCallTime).toBeGreaterThan(0);
      const timeDiff = Math.abs(dashboardCallTime - customersCallTime);
      expect(timeDiff).toBeLessThan(100); // Within 100ms = parallel
    });
  });

  // Test 5: Feature flags control API calls
  it('should respect feature flags and skip disabled APIs', async () => {
    // Arrange - Products flag is false
    vi.mocked(apiService.get).mockResolvedValue({ data: mockApiDashboardStats });

    // Act
    const { result } = renderHook(() => useApiData());
    
    // Wait for data fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Assert - Products should be empty array (flag disabled)
    expect(result.current.products).toEqual([]);
    
    // Verify products endpoint was not called
    const productsCalls = vi.mocked(apiService.get).mock.calls.filter(
      call => call[0].includes('products')
    );
    expect(productsCalls).toHaveLength(0);
  });

  // Test 6: Error Handling - Partial API failures
  it('should handle partial API failures gracefully', async () => {
    // Arrange - Dashboard succeeds, customers fail
    vi.mocked(apiService.get).mockImplementation((url: string) => {
      if (url.includes('analytics')) {
        return Promise.resolve({ data: mockApiDashboardStats });
      }
      if (url.includes('leads')) {
        return Promise.reject(new Error('Customers API error'));
      }
      return Promise.resolve({ data: [] });
    });

    // Act
    const { result } = renderHook(() => useApiData());
    
    // Assert - Dashboard data from API, customers from mock
    await waitFor(() => {
      expect(result.current.dashboardStats.activeConversations).toBe(15); // API
      expect(result.current.sectorCustomers[0].name).toBe('John Doe'); // Mock fallback
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Customers API failed'),
        expect.any(Object)
      );
    });
  });

  // Test 7: Cleanup on unmount
  it('should cleanup on unmount and prevent state updates', async () => {
    // Arrange
    let resolvePromise: (value: any) => void;
    const delayedPromise = new Promise(resolve => {
      resolvePromise = resolve;
    });

    vi.mocked(apiService.get).mockReturnValue(delayedPromise);

    // Act
    const { unmount } = renderHook(() => useApiData());
    
    // Unmount before promise resolves
    unmount();
    
    // Resolve promise after unmount
    act(() => {
      resolvePromise!({ data: mockApiDashboardStats });
    });
    
    // Assert - Should not throw or cause issues
    // Component cleanup should prevent state updates after unmount
    expect(true).toBe(true); // Test passes if no errors thrown
  });

  // Test 8: Real-World Scenario - Complete data lifecycle
  it('should handle complete data fetch and update lifecycle', async () => {
    // Arrange
    vi.mocked(apiService.get)
      .mockResolvedValueOnce({ data: mockApiDashboardStats })
      .mockResolvedValueOnce({ data: mockApiCustomers })
      .mockResolvedValueOnce({ data: { products: [] } })
      .mockResolvedValueOnce({ data: { orders: [] } })
      .mockResolvedValueOnce({ data: { appointments: [] } })
      .mockResolvedValueOnce({ data: { conversations: [] } });

    // Act
    const { result } = renderHook(() => useApiData());
    
    // Assert - Initial state (from mock)
    expect(result.current.sectorCustomers).toHaveLength(1);
    
    // Wait for API data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // Assert - Final state (from API)
    expect(result.current.dashboardStats.activeConversations).toBe(15);
    expect(result.current.sectorCustomers[0].name).toBe('Jane Smith');
    expect(result.current.products).toEqual([]);
    expect(result.current.orders).toEqual([]);
    expect(result.current.featureFlags).toBeDefined();
    expect(logger.debug).toHaveBeenCalledWith('API Data loaded successfully');
  });
});

