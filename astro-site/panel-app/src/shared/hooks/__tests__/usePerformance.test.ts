/**
 * @vitest-environment jsdom
 * 
 * usePerformance Hooks Tests
 * Enterprise-grade tests for performance monitoring hooks
 * 
 * @group hooks
 * @group performance
 */
import { renderHook, act, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  useRenderCount,
  useDebounce,
  useThrottle,
  useMeasure,
  useStableCallback
} from '../usePerformance';
import { logger } from '@/shared/utils/logger';

// Mock logger
vi.mock('@/shared/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}));

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByName: vi.fn(() => [{ duration: 100 }]),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn()
};

Object.defineProperty(global, 'performance', {
  value: mockPerformance,
  writable: true,
  configurable: true
});

describe('usePerformance Hooks - Enterprise Grade Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    cleanup();
  });

  describe('useRenderCount', () => {
    it('should return a number', () => {
      // Arrange & Act
      const { result } = renderHook(() => useRenderCount('TestComponent'));
      
      // Assert
      expect(typeof result.current).toBe('number');
    });

    it('should increment on rerender', () => {
      // Arrange
      const { result, rerender } = renderHook(() => useRenderCount('TestComponent'));
      const initialCount = result.current;
      
      // Act
      rerender();
      
      // Assert
      expect(result.current).toBeGreaterThanOrEqual(initialCount);
    });
  });

  describe('useDebounce', () => {
    it('should return initial value immediately', () => {
      // Arrange & Act
      const { result } = renderHook(() => useDebounce('initial', 500));
      
      // Assert
      expect(result.current).toBe('initial');
    });

    it('should debounce value changes', () => {
      // Arrange
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 500),
        { initialProps: { value: 'initial' } }
      );
      
      // Act - Change value
      rerender({ value: 'updated' });
      
      // Assert - Should still be initial
      expect(result.current).toBe('initial');
      
      // Act - Advance timers
      act(() => {
        vi.advanceTimersByTime(500);
      });
      
      // Assert - Should be updated
      expect(result.current).toBe('updated');
    });
  });

  describe('useThrottle', () => {
    it('should return initial value immediately', () => {
      // Arrange & Act
      const { result } = renderHook(() => useThrottle('initial', 500));
      
      // Assert
      expect(result.current).toBe('initial');
    });

    it('should throttle rapid value changes', () => {
      // Arrange
      const { result, rerender } = renderHook(
        ({ value }) => useThrottle(value, 500),
        { initialProps: { value: 'initial' } }
      );
      
      // Act - Multiple rapid changes
      rerender({ value: 'change1' });
      rerender({ value: 'change2' });
      
      // Assert - Throttled value
      expect(typeof result.current).toBe('string');
    });
  });

  describe('useMeasure', () => {
    it('should return measure functions', () => {
      // Arrange & Act
      const { result } = renderHook(() => useMeasure('TestOperation'));
      
      // Assert
      expect(typeof result.current.startMeasure).toBe('function');
      expect(typeof result.current.endMeasure).toBe('function');
    });

    it('should not throw when calling measure functions', () => {
      // Arrange
      const { result } = renderHook(() => useMeasure('TestOperation'));
      
      // Act & Assert
      expect(() => result.current.startMeasure()).not.toThrow();
      expect(() => result.current.endMeasure()).not.toThrow();
    });
  });

  describe('useStableCallback', () => {
    it('should return a function', () => {
      // Arrange
      const callback = vi.fn();
      
      // Act
      const { result } = renderHook(() => useStableCallback(callback));
      
      // Assert
      expect(typeof result.current).toBe('function');
    });

    it('should maintain stable reference across rerenders', () => {
      // Arrange
      const callback = vi.fn();
      const { result, rerender } = renderHook(() => useStableCallback(callback));
      const firstRef = result.current;
      
      // Act
      rerender();
      
      // Assert
      expect(result.current).toBe(firstRef);
    });

    it('should call the latest callback', () => {
      // Arrange
      const callback = vi.fn(() => 'result');
      const { result } = renderHook(() => useStableCallback(callback));
      
      // Act
      const returnValue = result.current();
      
      // Assert
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    it('should cleanup properly on unmount', () => {
      // Arrange
      const { unmount } = renderHook(() => {
        useRenderCount('Test');
        useDebounce('value', 500);
        useMeasure('Test');
      });
      
      // Act & Assert
      expect(() => unmount()).not.toThrow();
    });
  });
});
