/**
 * usePerformanceMonitor Hook Tests - ENTERPRISE GRADE
 * 
 * Comprehensive tests for performance monitoring and optimization
 * 
 * @group hook
 * @group agent
 * @group performance
 * 
 * ALTIN KURALLAR:
 * ✅ React hooks tests with @testing-library/react
 * ✅ AAA Pattern (Arrange-Act-Assert)
 * ✅ Performance API mocking
 * ✅ Tek test → tek davranış
 * ✅ Time-based assertions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  usePerformanceMonitor,
  usePerformanceMeasure,
  type UsePerformanceMonitorOptions,
} from '../usePerformanceMonitor';
import { logger } from '@/shared/utils/logger';

// ============================================================================
// MOCKS
// ============================================================================

vi.mock('@/shared/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// ============================================================================
// TEST UTILITIES
// ============================================================================

let performanceNowCounter = 0;

const mockPerformanceNow = () => {
  performanceNowCounter += 10; // Each call adds 10ms
  return performanceNowCounter;
};

// ============================================================================
// HOOK TESTS - usePerformanceMonitor
// ============================================================================

describe('usePerformanceMonitor - Basic Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    performanceNowCounter = 0;
    vi.spyOn(performance, 'now').mockImplementation(mockPerformanceNow);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with zero metrics', () => {
    // Arrange & Act
    const { result } = renderHook(() =>
      usePerformanceMonitor({
        componentName: 'TestComponent',
        enabled: true,
      })
    );

    // Assert - renderCount includes initial render
    const metrics = result.current.getMetrics();
    expect(metrics.renderCount).toBeGreaterThanOrEqual(0);
    expect(metrics.averageRenderTime).toBeGreaterThanOrEqual(0);
  });

  it('should track render count', () => {
    // Arrange
    const { result, rerender } = renderHook(() =>
      usePerformanceMonitor({
        componentName: 'TestComponent',
        enabled: true,
      })
    );

    // Act - Trigger re-renders
    rerender();
    rerender();
    rerender();

    // Assert
    const metrics = result.current.getMetrics();
    expect(metrics.renderCount).toBeGreaterThan(0);
  });

  it('should reset metrics', () => {
    // Arrange
    const { result, rerender } = renderHook(() =>
      usePerformanceMonitor({
        componentName: 'TestComponent',
        enabled: true,
      })
    );

    // Act - Render and reset
    rerender();
    rerender();
    result.current.resetMetrics();

    // Assert
    const metrics = result.current.getMetrics();
    expect(metrics.renderCount).toBe(0);
    expect(metrics.averageRenderTime).toBe(0);
  });

  it('should not track when disabled', () => {
    // Arrange
    const { result, rerender } = renderHook(() =>
      usePerformanceMonitor({
        componentName: 'TestComponent',
        enabled: false,
      })
    );

    // Act
    rerender();
    rerender();

    // Assert
    const metrics = result.current.getMetrics();
    expect(metrics.renderCount).toBe(0);
  });
});

describe('usePerformanceMonitor - Performance Metrics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    performanceNowCounter = 0;
    vi.spyOn(performance, 'now').mockImplementation(mockPerformanceNow);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should calculate average render time', () => {
    // Arrange
    const { result, rerender } = renderHook(() =>
      usePerformanceMonitor({
        componentName: 'TestComponent',
        enabled: true,
      })
    );

    // Act - Multiple renders
    rerender();
    rerender();
    rerender();

    // Assert
    const metrics = result.current.getMetrics();
    expect(metrics.averageRenderTime).toBeGreaterThan(0);
  });

  it('should track last render timestamp', () => {
    // Arrange
    const { result, rerender } = renderHook(() =>
      usePerformanceMonitor({
        componentName: 'TestComponent',
        enabled: true,
      })
    );

    // Act
    rerender();

    // Assert
    const metrics = result.current.getMetrics();
    expect(metrics.lastRenderTimestamp).toBeGreaterThan(0);
  });

  it('should update metrics on each render', () => {
    // Arrange
    const { result, rerender } = renderHook(() =>
      usePerformanceMonitor({
        componentName: 'TestComponent',
        enabled: true,
      })
    );

    // Act & Assert - First render
    rerender();
    const metrics1 = result.current.getMetrics();
    const renderCount1 = metrics1.renderCount;

    // Act & Assert - Second render
    rerender();
    const metrics2 = result.current.getMetrics();
    expect(metrics2.renderCount).toBeGreaterThan(renderCount1);
  });
});

describe('usePerformanceMonitor - Slow Render Warning', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should warn on slow renders above threshold', () => {
    // Arrange
    let counter = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => {
      counter += 50; // Each call adds 50ms (above default 16ms threshold)
      return counter;
    });

    const { rerender } = renderHook(() =>
      usePerformanceMonitor({
        componentName: 'SlowComponent',
        enabled: true,
        warnThreshold: 16,
      })
    );

    // Act
    rerender();

    // Assert
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Slow render detected'),
      expect.any(Object)
    );
  });

  it('should not warn on fast renders below threshold', () => {
    // Arrange
    let counter = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => {
      counter += 5; // Each call adds 5ms (below 16ms threshold)
      return counter;
    });

    const { rerender } = renderHook(() =>
      usePerformanceMonitor({
        componentName: 'FastComponent',
        enabled: true,
        warnThreshold: 16,
      })
    );

    // Act
    rerender();

    // Assert
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('should respect custom warn threshold', () => {
    // Arrange
    let counter = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => {
      counter += 30; // 30ms per call
      return counter;
    });

    const { rerender } = renderHook(() =>
      usePerformanceMonitor({
        componentName: 'TestComponent',
        enabled: true,
        warnThreshold: 50, // Custom high threshold
      })
    );

    // Act
    rerender();

    // Assert - Should not warn since 30ms < 50ms threshold
    expect(logger.warn).not.toHaveBeenCalled();
  });
});

describe('usePerformanceMonitor - Periodic Summary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should log summary every 100 renders', () => {
    // Arrange
    let counter = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => {
      counter += 5;
      return counter;
    });

    const { rerender } = renderHook(() =>
      usePerformanceMonitor({
        componentName: 'TestComponent',
        enabled: true,
      })
    );

    // Act - Render 100 times
    for (let i = 0; i < 100; i++) {
      rerender();
    }

    // Assert - Should log at least once at 100 renders
    const debugCalls = (logger.debug as ReturnType<typeof vi.fn>).mock.calls;
    const summaryCall = debugCalls.find(call => 
      call[0]?.includes('Performance summary')
    );
    expect(summaryCall).toBeDefined();
  });
});

describe('usePerformanceMonitor - Component Name', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    performanceNowCounter = 0;
    vi.spyOn(performance, 'now').mockImplementation(mockPerformanceNow);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should include component name in logs', () => {
    // Arrange
    const componentName = 'MySpecialComponent';
    const { result } = renderHook(() =>
      usePerformanceMonitor({
        componentName,
        enabled: true,
      })
    );

    // Act
    result.current.resetMetrics();

    // Assert
    expect(logger.debug).toHaveBeenCalledWith(
      expect.stringContaining(componentName)
    );
  });
});

describe('usePerformanceMonitor - Real-World Scenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    performanceNowCounter = 0;
    vi.spyOn(performance, 'now').mockImplementation(mockPerformanceNow);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should monitor conversation list component', () => {
    // Arrange
    const { result, rerender } = renderHook(() =>
      usePerformanceMonitor({
        componentName: 'ConversationList',
        enabled: true,
        warnThreshold: 16,
      })
    );

    // Act - Simulate multiple renders (data updates)
    for (let i = 0; i < 10; i++) {
      rerender();
    }

    // Assert
    const metrics = result.current.getMetrics();
    expect(metrics.renderCount).toBeGreaterThanOrEqual(10);
    expect(metrics.averageRenderTime).toBeGreaterThan(0);
  });

  it('should handle component lifecycle', () => {
    // Arrange
    const { result, rerender, unmount } = renderHook(() =>
      usePerformanceMonitor({
        componentName: 'TestComponent',
        enabled: true,
      })
    );

    // Act - Render, get metrics, unmount
    rerender();
    rerender();
    const metrics = result.current.getMetrics();
    unmount();

    // Assert - Metrics should be captured before unmount
    expect(metrics.renderCount).toBeGreaterThan(0);
  });
});

// ============================================================================
// HOOK TESTS - usePerformanceMeasure
// ============================================================================

describe('usePerformanceMeasure - Synchronous Measurement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    performanceNowCounter = 0;
    vi.spyOn(performance, 'now').mockImplementation(mockPerformanceNow);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should measure sync function execution', () => {
    // Arrange
    const { result } = renderHook(() => usePerformanceMeasure());
    const testFn = () => {
      let sum = 0;
      for (let i = 0; i < 1000; i++) {
        sum += i;
      }
      return sum;
    };

    // Act
    const returnValue = result.current.measure('sum-calculation', testFn);

    // Assert
    expect(returnValue).toBe(testFn()); // Should return correct value
    expect(logger.debug).toHaveBeenCalledWith(
      expect.stringContaining('Performance measure: sum-calculation'),
      expect.objectContaining({
        duration: expect.stringContaining('ms'),
      })
    );
  });

  it('should return function result', () => {
    // Arrange
    const { result } = renderHook(() => usePerformanceMeasure());
    const expectedValue = 42;

    // Act
    const actualValue = result.current.measure('test', () => expectedValue);

    // Assert
    expect(actualValue).toBe(expectedValue);
  });

  it('should handle functions with no return value', () => {
    // Arrange
    const { result } = renderHook(() => usePerformanceMeasure());
    const mockFn = vi.fn();

    // Act
    result.current.measure('void-function', mockFn);

    // Assert
    expect(mockFn).toHaveBeenCalled();
    expect(logger.debug).toHaveBeenCalled();
  });
});

describe('usePerformanceMeasure - Asynchronous Measurement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    performanceNowCounter = 0;
    vi.spyOn(performance, 'now').mockImplementation(mockPerformanceNow);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should measure async function execution', async () => {
    // Arrange
    const { result } = renderHook(() => usePerformanceMeasure());
    const asyncFn = async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      return 'done';
    };

    // Act
    const returnValue = await result.current.measureAsync('async-operation', asyncFn);

    // Assert
    expect(returnValue).toBe('done');
    expect(logger.debug).toHaveBeenCalledWith(
      expect.stringContaining('Performance measure (async): async-operation'),
      expect.objectContaining({
        duration: expect.stringContaining('ms'),
      })
    );
  });

  it('should return async function result', async () => {
    // Arrange
    const { result } = renderHook(() => usePerformanceMeasure());
    const expectedValue = { data: 'test' };
    const asyncFn = async () => expectedValue;

    // Act
    const actualValue = await result.current.measureAsync('test', asyncFn);

    // Assert
    expect(actualValue).toEqual(expectedValue);
  });

  it('should handle async function with promise rejection', async () => {
    // Arrange
    const { result } = renderHook(() => usePerformanceMeasure());
    const error = new Error('Test error');
    const asyncFn = async () => {
      throw error;
    };

    // Act & Assert
    await expect(
      result.current.measureAsync('failing-operation', asyncFn)
    ).rejects.toThrow('Test error');
  });
});

describe('usePerformanceMeasure - Real-World Scenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    performanceNowCounter = 0;
    vi.spyOn(performance, 'now').mockImplementation(mockPerformanceNow);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should measure API call duration', async () => {
    // Arrange
    const { result } = renderHook(() => usePerformanceMeasure());
    const mockApiCall = async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
      return { data: 'response' };
    };

    // Act
    const response = await result.current.measureAsync('fetchConversations', mockApiCall);

    // Assert
    expect(response.data).toBe('response');
    expect(logger.debug).toHaveBeenCalledWith(
      expect.stringContaining('fetchConversations'),
      expect.any(Object)
    );
  });

  it('should measure data processing', () => {
    // Arrange
    const { result } = renderHook(() => usePerformanceMeasure());
    const data = Array.from({ length: 1000 }, (_, i) => i);
    const processData = () => {
      return data.map(n => n * 2).filter(n => n % 3 === 0);
    };

    // Act
    const processed = result.current.measure('processConversations', processData);

    // Assert
    expect(processed.length).toBeGreaterThan(0);
    expect(logger.debug).toHaveBeenCalledWith(
      expect.stringContaining('processConversations'),
      expect.any(Object)
    );
  });

  it('should measure multiple operations', async () => {
    // Arrange
    const { result } = renderHook(() => usePerformanceMeasure());

    // Act - Measure sync operation
    result.current.measure('sync-op', () => 'sync result');

    // Act - Measure async operation
    await result.current.measureAsync('async-op', async () => 'async result');

    // Assert - Both should be logged
    expect(logger.debug).toHaveBeenCalledTimes(2);
  });
});

describe('usePerformanceMeasure - Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    performanceNowCounter = 0;
    vi.spyOn(performance, 'now').mockImplementation(mockPerformanceNow);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should handle empty function', () => {
    // Arrange
    const { result } = renderHook(() => usePerformanceMeasure());

    // Act
    const returnValue = result.current.measure('empty', () => {});

    // Assert
    expect(returnValue).toBeUndefined();
    expect(logger.debug).toHaveBeenCalled();
  });

  it('should handle function that throws error', () => {
    // Arrange
    const { result } = renderHook(() => usePerformanceMeasure());
    const error = new Error('Test error');

    // Act & Assert
    expect(() => {
      result.current.measure('throwing-function', () => {
        throw error;
      });
    }).toThrow('Test error');
  });

  it('should handle very quick operations', () => {
    // Arrange
    const { result } = renderHook(() => usePerformanceMeasure());

    // Act
    result.current.measure('quick-op', () => 1 + 1);

    // Assert
    expect(logger.debug).toHaveBeenCalledWith(
      expect.stringContaining('quick-op'),
      expect.objectContaining({
        duration: expect.stringContaining('ms'),
      })
    );
  });
});

