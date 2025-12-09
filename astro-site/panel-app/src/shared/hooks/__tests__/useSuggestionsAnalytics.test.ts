/**
 * @vitest-environment jsdom
 */
import { renderHook, act, waitFor, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useSuggestionsAnalytics } from '../useSuggestionsAnalytics';
import { apiService } from '@/services/api-service';
import { logger } from '@/shared/utils/logger';

// Mock logger
vi.mock('@/shared/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn()
  }
}));

// Mock API service
vi.mock('@/services/api-service', () => ({
  apiService: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

// Mock Business Context
vi.mock('@/providers/business-context', () => ({
  useBusiness: vi.fn(() => ({
    config: {
      type: 'ecommerce',
      id: 'business-123'
    }
  }))
}));

describe('useSuggestionsAnalytics', () => {
  const mockPerformanceMetrics = {
    tenantId: 'tenant-1',
    businessType: 'ecommerce',
    period: 'day' as const,
    timestamp: Date.now(),
    totalSuggestions: 100,
    acceptedCount: 70,
    modifiedCount: 20,
    rejectedCount: 5,
    ignoredCount: 5,
    acceptanceRate: 70,
    modificationRate: 20,
    avgResponseTime: 250,
    avgModificationRatio: 0.15,
    topSuggestions: [
      { suggestionId: 'sug-1', text: 'How can I help you?', usageCount: 30, successRate: 0.9 }
    ]
  };

  const mockRealtimeMetrics = {
    totalSuggestions: 150,
    acceptedCount: 100,
    modifiedCount: 30,
    rejectedCount: 10,
    ignoredCount: 10,
    lastResponseTime: 200,
    lastModificationRatio: 0.12
  };

  const mockLearningInsights = {
    tenantId: 'tenant-1',
    businessType: 'ecommerce',
    agentId: 'agent-1',
    patterns: {
      preferredCategories: ['greeting', 'support'],
      commonModifications: [
        { pattern: 'formal_to_casual', frequency: 15, suggestion: 'Use casual tone' }
      ],
      timeBasedPreferences: {},
      contextualPreferences: {}
    },
    recommendations: [
      {
        type: 'new_suggestion' as const,
        category: 'greeting',
        suggestion: 'Add greeting variant',
        confidence: 0.85,
        reasoning: 'High acceptance rate'
      }
    ],
    lastUpdated: Date.now()
  };

  const mockABTests = [
    {
      id: 'test-1',
      name: 'Greeting Variants',
      description: 'Test different greeting styles',
      status: 'running' as const,
      variants: [
        { id: 'var-1', name: 'Formal', weight: 50, config: {} },
        { id: 'var-2', name: 'Casual', weight: 50, config: {} }
      ],
      metrics: {
        participantCount: 100,
        conversionRate: 0.75,
        avgResponseTime: 220,
        acceptanceRate: 0.8
      },
      startDate: Date.now() - 86400000,
      endDate: Date.now() + 86400000
    }
  ];

  // Helper to setup default API mocks for all endpoints
  const setupDefaultMocks = () => {
    vi.mocked(apiService.get).mockImplementation((url: string) => {
      if (url.includes('realtime')) {
        return Promise.resolve({
          data: { success: true, data: mockRealtimeMetrics }
        } as any);
      }
      if (url.includes('metrics')) {
        return Promise.resolve({
          data: { success: true, data: mockPerformanceMetrics }
        } as any);
      }
      if (url.includes('insights')) {
        return Promise.resolve({
          data: { success: true, data: mockLearningInsights }
        } as any);
      }
      if (url.includes('ab-tests')) {
        return Promise.resolve({
          data: { success: true, data: mockABTests }
        } as any);
      }
      return Promise.resolve({ data: { success: true, data: null } } as any);
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setupDefaultMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  // Test 1: AAA Pattern - Initial data fetching
  it('should fetch initial metrics on mount', async () => {
    // Act
    const { result } = renderHook(() => useSuggestionsAnalytics());
    
    // Assert - Loaded state
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.performanceMetrics).toEqual(mockPerformanceMetrics);
    }, { timeout: 3000 });
  });

  // Test 2: Track suggestion usage
  it('should track suggestion usage successfully', async () => {
    // Arrange
    vi.mocked(apiService.post).mockResolvedValue({
      data: { success: true, data: { trackingId: 'track-123' } }
    } as any);

    const { result } = renderHook(() => useSuggestionsAnalytics());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 3000 });
    
    const usage = {
      suggestionId: 'sug-1',
      businessType: 'ecommerce',
      category: 'greeting' as const,
      context: ['new_customer'],
      originalText: '',
      suggestedText: 'Hello!',
      finalText: 'Hello!',
      usageType: 'accepted' as const,
      modificationRatio: 0,
      responseTime: 150,
      conversationId: 'conv-1',
      sessionId: 'sess-1'
    };
    
    // Act
    let trackingId: string | null = null;
    await act(async () => {
      trackingId = await result.current.trackSuggestionUsage(usage);
    });
    
    // Assert
    expect(trackingId).toBe('track-123');
    expect(apiService.post).toHaveBeenCalledWith('/suggestions/track', usage);
  });

  // Test 3: Fetch performance metrics with different periods
  it('should fetch performance metrics for different periods', async () => {
    // Arrange
    const { result } = renderHook(() => useSuggestionsAnalytics());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 3000 });
    
    // Act - Fetch week metrics
    await act(async () => {
      await result.current.fetchPerformanceMetrics('week');
    });
    
    // Assert
    expect(apiService.get).toHaveBeenCalledWith(
      expect.stringContaining('period=week')
    );
  });

  // Test 4: Error Handling - Failed API call
  it('should handle API errors gracefully', async () => {
    // Arrange
    vi.mocked(apiService.get).mockRejectedValue(new Error('Network error'));
    
    // Act
    const { result } = renderHook(() => useSuggestionsAnalytics());
    
    // Assert
    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
      expect(logger.error).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  // Test 5: Real-time metrics are fetched on mount
  it('should fetch real-time metrics on mount', async () => {
    // Arrange & Act
    const { result } = renderHook(() => useSuggestionsAnalytics());
    
    // Assert - Wait for initial fetch
    await waitFor(() => {
      expect(result.current.realtimeMetrics).not.toBeNull();
    }, { timeout: 3000 });
    
    // Verify realtime endpoint was called
    expect(apiService.get).toHaveBeenCalledWith(
      expect.stringContaining('realtime')
    );
  });

  // Test 6: A/B Testing - Create and fetch tests
  it('should create A/B test and fetch tests list', async () => {
    // Arrange
    vi.mocked(apiService.post).mockResolvedValue({
      data: { success: true, data: { testId: 'test-2' } }
    } as any);

    const { result } = renderHook(() => useSuggestionsAnalytics());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 3000 });
    
    const testConfig = {
      name: 'New Test',
      description: 'Test description',
      variants: [
        { id: 'v1', name: 'Variant 1', weight: 50, config: {} },
        { id: 'v2', name: 'Variant 2', weight: 50, config: {} }
      ]
    };
    
    // Act
    let testId: string | null = null;
    await act(async () => {
      testId = await result.current.createABTest(testConfig);
    });
    
    // Assert
    expect(testId).toBe('test-2');
    expect(apiService.post).toHaveBeenCalledWith(
      '/suggestions/ab-tests',
      expect.objectContaining({ name: 'New Test' })
    );
  });

  // Test 7: Get A/B test variant
  it('should get A/B test variant for user', async () => {
    // Arrange
    const { result } = renderHook(() => useSuggestionsAnalytics());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 3000 });

    // Override mock for the variant endpoint
    vi.mocked(apiService.get).mockImplementation((url: string) => {
      if (url.includes('variant')) {
        return Promise.resolve({
          data: { success: true, data: { variantId: 'var-1' } }
        } as any);
      }
      return Promise.resolve({ data: { success: true, data: mockRealtimeMetrics } } as any);
    });
    
    // Act
    let variantId: string | null = null;
    await act(async () => {
      variantId = await result.current.getABTestVariant('test-1');
    });
    
    // Assert
    expect(variantId).toBe('var-1');
    expect(apiService.get).toHaveBeenCalledWith('/suggestions/ab-tests/test-1/variant');
  });

  // Test 8: Export analytics data
  it('should export analytics data in different formats', async () => {
    // Arrange
    const mockExportData = {
      format: 'csv',
      data: 'suggestion_id,usage_type,timestamp\nsug-1,accepted,1234567890'
    };

    const { result } = renderHook(() => useSuggestionsAnalytics());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 3000 });

    // Override mock for export endpoint
    vi.mocked(apiService.get).mockImplementation((url: string) => {
      if (url.includes('export')) {
        return Promise.resolve({
          data: { success: true, data: mockExportData }
        } as any);
      }
      return Promise.resolve({ data: { success: true, data: mockRealtimeMetrics } } as any);
    });
    
    // Act
    let exportedData: any = null;
    await act(async () => {
      exportedData = await result.current.exportData({
        startDate: Date.now() - 86400000,
        endDate: Date.now(),
        format: 'csv'
      });
    });
    
    // Assert
    expect(exportedData).toEqual(mockExportData);
    expect(apiService.get).toHaveBeenCalledWith(
      expect.stringContaining('format=csv')
    );
  });

  // Test 9: Computed values - Acceptance/modification/rejection rates
  it('should calculate correct acceptance and rejection rates', async () => {
    // Arrange
    const { result } = renderHook(() => useSuggestionsAnalytics());
    
    // Assert - Rates calculated correctly after data loads
    await waitFor(() => {
      expect(result.current.realtimeMetrics).not.toBeNull();
      expect(result.current.acceptanceRate).toBeCloseTo(66.67, 1); // 100/150 * 100
      expect(result.current.modificationRate).toBe(20); // 30/150 * 100
      expect(result.current.rejectionRate).toBeCloseTo(6.67, 1); // 10/150 * 100
      expect(result.current.hasData).toBe(true);
    }, { timeout: 3000 });
  });

  // Test 10: Refresh all data
  it('should refresh all analytics data', async () => {
    // Arrange
    const { result } = renderHook(() => useSuggestionsAnalytics());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 3000 });
    
    vi.clearAllMocks();
    setupDefaultMocks();
    
    // Act
    act(() => {
      result.current.refresh();
    });
    
    // Assert - Should call all fetch methods
    await waitFor(() => {
      const apiCalls = vi.mocked(apiService.get).mock.calls.map(call => call[0] as string);
      expect(apiCalls.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });
});

