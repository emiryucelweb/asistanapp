/**
 * usePerformanceMonitor Hook
 * Monitor and optimize component performance
 * 
 * @module agent/hooks/usePerformanceMonitor
 */

import { useEffect, useRef, useCallback } from 'react';
import { logger } from '@/shared/utils/logger';

export interface PerformanceMetrics {
  renderCount: number;
  renderTime: number;
  lastRenderTimestamp: number;
  averageRenderTime: number;
}

export interface UsePerformanceMonitorOptions {
  componentName: string;
  enabled?: boolean;
  warnThreshold?: number; // ms
}

/**
 * Monitor component render performance
 */
export function usePerformanceMonitor(options: UsePerformanceMonitorOptions) {
  const {
    componentName,
    enabled = import.meta.env.DEV,
    warnThreshold = 16, // 60fps = 16.67ms per frame
  } = options;

  const metricsRef = useRef<PerformanceMetrics>({
    renderCount: 0,
    renderTime: 0,
    lastRenderTimestamp: 0,
    averageRenderTime: 0,
  });

  const renderStartRef = useRef<number>(0);

  // Start measuring render
  useEffect(() => {
    if (!enabled) return;
    
    renderStartRef.current = performance.now();
  });

  // Complete render measurement
  useEffect(() => {
    if (!enabled) return;

    const renderTime = performance.now() - renderStartRef.current;
    const metrics = metricsRef.current;

    metrics.renderCount++;
    metrics.renderTime = renderTime;
    metrics.lastRenderTimestamp = Date.now();
    metrics.averageRenderTime = 
      (metrics.averageRenderTime * (metrics.renderCount - 1) + renderTime) / metrics.renderCount;

    // Log slow renders
    if (renderTime > warnThreshold) {
      logger.warn(`Slow render detected in ${componentName}`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        renderCount: metrics.renderCount,
        averageRenderTime: `${metrics.averageRenderTime.toFixed(2)}ms`,
      });
    }

    // Log periodic performance summary (every 100 renders)
    if (metrics.renderCount % 100 === 0) {
      logger.debug(`Performance summary for ${componentName}`, {
        renderCount: metrics.renderCount,
        averageRenderTime: `${metrics.averageRenderTime.toFixed(2)}ms`,
        lastRenderTime: `${renderTime.toFixed(2)}ms`,
      });
    }
  });

  // Get current metrics
  const getMetrics = useCallback((): PerformanceMetrics => {
    return { ...metricsRef.current };
  }, []);

  // Reset metrics
  const resetMetrics = useCallback(() => {
    metricsRef.current = {
      renderCount: 0,
      renderTime: 0,
      lastRenderTimestamp: 0,
      averageRenderTime: 0,
    };
    logger.debug(`Performance metrics reset for ${componentName}`);
  }, [componentName]);

  return {
    getMetrics,
    resetMetrics,
  };
}

/**
 * Measure function execution time
 */
export function usePerformanceMeasure() {
  const measure = useCallback(<T>(
    name: string,
    fn: () => T
  ): T => {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;

    logger.debug(`Performance measure: ${name}`, {
      duration: `${duration.toFixed(2)}ms`,
    });

    return result;
  }, []);

  const measureAsync = useCallback(async <T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;

    logger.debug(`Performance measure (async): ${name}`, {
      duration: `${duration.toFixed(2)}ms`,
    });

    return result;
  }, []);

  return {
    measure,
    measureAsync,
  };
}

