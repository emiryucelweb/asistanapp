/**
 * @vitest-environment jsdom
 * 
 * useMockData Hook Tests
 * Enterprise-grade tests for mock data generation
 * 
 * @group hooks
 * @group mock-data
 */
import { renderHook, act, waitFor, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useMockData } from '../useMockData';
import { logger } from '@/shared/utils/logger';
import * as mockDataGenerator from '@/data/mock-data-generator';

// Mock logger
vi.mock('@/shared/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
    warn: vi.fn()
  }
}));

// Mock Business Context
vi.mock('@/contexts/BusinessContext', () => ({
  useBusiness: vi.fn(() => ({
    businessType: 'ecommerce',
    isLoading: false
  }))
}));

// Mock mock-data-generator
vi.mock('@/data/mock-data-generator', () => ({
  generateMockData: vi.fn(() => []),
  calculateDashboardStats: vi.fn(() => ({
    activeConversations: 0,
    totalMessages: 0,
    totalRevenue: 0,
    vipCustomers: 0,
    channelStats: { whatsapp: 0, instagram: 0, web: 0, phone: 0 },
    todayCount: 0,
    weekCount: 0,
    monthCount: 0,
    totalCustomers: 0
  })),
  saveMockDataToStorage: vi.fn(),
  loadMockDataFromStorage: vi.fn(() => null)
}));

describe('useMockData - Enterprise Grade Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  // Test 1: Hook initialization
  it('should initialize and complete loading', async () => {
    // Arrange & Act
    const { result } = renderHook(() => useMockData());
    
    // Wait for initialization to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });
    
    // Assert - Loading completed
    expect(result.current.isLoading).toBe(false);
  });

  // Test 2: Returns expected structure
  it('should return expected hook structure', async () => {
    // Arrange & Act
    const { result } = renderHook(() => useMockData());
    
    // Wait for initialization
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });
    
    // Assert - All properties exist
    expect(Array.isArray(result.current.sectorCustomers)).toBe(true);
    expect(result.current.dashboardStats).toBeDefined();
    expect(result.current.allMockData).toBeDefined();
    expect(typeof result.current.isLoading).toBe('boolean');
  });

  // Test 3: Functions are defined
  it('should expose all required functions', async () => {
    // Arrange & Act
    const { result } = renderHook(() => useMockData());
    
    // Wait for initialization
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });
    
    // Assert
    expect(typeof result.current.regenerateMockData).toBe('function');
    expect(typeof result.current.updateCustomer).toBe('function');
    expect(typeof result.current.addCustomer).toBe('function');
    expect(typeof result.current.getCustomersByTimeCategory).toBe('function');
    expect(typeof result.current.getTopCustomers).toBe('function');
  });

  // Test 4: Dashboard stats structure
  it('should have correct dashboard stats structure', async () => {
    // Arrange & Act
    const { result } = renderHook(() => useMockData());
    
    // Wait for initialization
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });
    
    // Assert
    const stats = result.current.dashboardStats;
    expect(stats).toHaveProperty('activeConversations');
    expect(stats).toHaveProperty('totalMessages');
    expect(stats).toHaveProperty('totalRevenue');
    expect(stats).toHaveProperty('vipCustomers');
    expect(stats).toHaveProperty('channelStats');
    expect(stats).toHaveProperty('todayCount');
    expect(stats).toHaveProperty('weekCount');
    expect(stats).toHaveProperty('monthCount');
    expect(stats).toHaveProperty('totalCustomers');
  });

  // Test 5: Channel stats structure
  it('should have correct channel stats structure', async () => {
    // Arrange & Act
    const { result } = renderHook(() => useMockData());
    
    // Wait for initialization
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });
    
    // Assert
    const channelStats = result.current.dashboardStats.channelStats;
    expect(channelStats).toHaveProperty('whatsapp');
    expect(channelStats).toHaveProperty('instagram');
    expect(channelStats).toHaveProperty('web');
    expect(channelStats).toHaveProperty('phone');
  });

  // Test 6: Cleanup on unmount
  it('should cleanup properly on unmount', async () => {
    // Arrange
    const { result, unmount } = renderHook(() => useMockData());
    
    // Wait for initialization
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });
    
    // Act & Assert - Should not throw
    expect(() => unmount()).not.toThrow();
  });

  // Test 7: Sector customers is an array
  it('should have sector customers as an array', async () => {
    // Arrange & Act
    const { result } = renderHook(() => useMockData());
    
    // Wait for initialization
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });
    
    // Assert
    expect(Array.isArray(result.current.sectorCustomers)).toBe(true);
  });
});
