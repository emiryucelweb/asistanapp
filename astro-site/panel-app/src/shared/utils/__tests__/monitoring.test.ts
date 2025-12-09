/**
 * Monitoring Tests
 * 
 * @group utils
 * @group monitoring
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { monitoring } from '../monitoring';

describe('Monitoring', () => {
  // Store original performance
  const originalPerformance = global.performance;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Clear metrics before each test
    monitoring.clearMetrics();

    // Mocking browser API
    (global.performance as any) = {
      memory: {
        usedJSHeapSize: 50000000,
        totalJSHeapSize: 100000000,
        jsHeapSizeLimit: 200000000,
      },
      timing: {
        navigationStart: 0,
        loadEventEnd: 1000,
        domContentLoadedEventEnd: 500,
        connectEnd: 100,
        connectStart: 50,
        domComplete: 900,
        domContentLoadedEventStart: 400,
        domInteractive: 600,
        domLoading: 200,
        domainLookupEnd: 40,
        domainLookupStart: 30,
        fetchStart: 10,
        redirectEnd: 20,
        redirectStart: 15,
        requestStart: 60,
        responseEnd: 150,
        responseStart: 120,
        secureConnectionStart: 55,
        unloadEventEnd: 25,
        unloadEventStart: 22,
      },
      getEntriesByType: vi.fn(() => []),
      now: vi.fn(() => Date.now()),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Restore original performance
    global.performance = originalPerformance;
    monitoring.clearMetrics();
  });
  it('gets system health', () => {
    const health = monitoring.getSystemHealth();
    
    expect(health).toHaveProperty('memory');
    expect(health).toHaveProperty('network');
    expect(health).toHaveProperty('performance');
    expect(health).toHaveProperty('errors');
    expect(health).toHaveProperty('timestamp');
  });

  it('tracks API calls', () => {
    monitoring.trackAPICall({
      endpoint: '/api/test',
      method: 'GET',
      duration: 150,
      status: 200,
      success: true,
    });

    const metrics = monitoring.getAPIMetrics();
    expect(metrics.total).toBeGreaterThan(0);
  });

  it('calculates API metrics', () => {
    monitoring.trackAPICall({
      endpoint: '/api/test1',
      method: 'GET',
      duration: 100,
      status: 200,
      success: true,
    });
    
    monitoring.trackAPICall({
      endpoint: '/api/test2',
      method: 'POST',
      duration: 200,
      status: 200,
      success: true,
    });

    const metrics = monitoring.getAPIMetrics();
    expect(metrics.total).toBe(2);
    expect(metrics.averageDuration).toBe(150);
    expect(metrics.successRate).toBe(100);
  });

  it('detects slow API calls', () => {
    monitoring.trackAPICall({
      endpoint: '/api/slow',
      method: 'GET',
      duration: 5000,
      status: 200,
      success: true,
    });

    const metrics = monitoring.getAPIMetrics();
    expect(metrics.slowCalls).toBeGreaterThan(0);
  });

  it('performs health checks', () => {
    const isHealthy = monitoring.isHealthy();
    expect(typeof isHealthy).toBe('boolean');
  });

  it('generates health report', () => {
    const report = monitoring.getHealthReport();
    
    expect(report).toHaveProperty('healthy');
    expect(report).toHaveProperty('issues');
    expect(report).toHaveProperty('recommendations');
    expect(Array.isArray(report.issues)).toBe(true);
    expect(Array.isArray(report.recommendations)).toBe(true);
  });

  // Error Handling Tests
  describe('Error Handling', () => {
    it('should handle missing performance.memory gracefully', () => {
      // Arrange
      delete (global.performance as any).memory;
      
      // Act & Assert
      expect(() => monitoring.getSystemHealth()).not.toThrow();
    });

    it('should handle failed API calls gracefully', () => {
      // Arrange
      monitoring.trackAPICall({
        endpoint: '/api/test',
        method: 'GET',
        duration: 100,
        status: 500,
        success: false,
      });

      // Act
      const metrics = monitoring.getAPIMetrics();

      // Assert
      expect(metrics.successRate).toBeLessThan(100);
    });

    it('should handle empty metrics', () => {
      // Arrange
      monitoring.clearMetrics();
      
      // Act
      const metrics = monitoring.getAPIMetrics();
      
      // Assert
      expect(metrics.total).toBe(0);
      expect(metrics.averageDuration).toBe(0);
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('should handle very fast API calls', () => {
      // Arrange & Act
      monitoring.trackAPICall({
        endpoint: '/api/fast',
        method: 'GET',
        duration: 1, // 1ms
        status: 200,
        success: true,
      });

      // Assert
      const metrics = monitoring.getAPIMetrics();
      expect(metrics.slowCalls).toBe(0);
    });

    it('should handle concurrent API tracking', () => {
      // Arrange & Act
      for (let i = 0; i < 100; i++) {
        monitoring.trackAPICall({
          endpoint: `/api/test${i}`,
          method: 'GET',
          duration: 50,
          status: 200,
          success: true,
        });
      }

      // Assert
      const metrics = monitoring.getAPIMetrics();
      expect(metrics.total).toBe(100);
    });
  });
});

