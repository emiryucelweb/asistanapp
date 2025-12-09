/**
 * Real-time Monitoring Utilities
 * System health, API monitoring, and resource tracking
 * 
 * @module shared/utils/monitoring
 */

import { advancedLogger } from './advanced-logger';
import { analyticsTracker } from './analytics-tracker';

export interface SystemHealth {
  memory: MemoryInfo;
  network: NetworkInfo;
  performance: PerformanceInfo;
  errors: ErrorInfo;
  timestamp: string;
}

export interface MemoryInfo {
  used: number; // MB
  total?: number; // MB
  percentage?: number;
}

export interface NetworkInfo {
  type: string;
  effectiveType?: string;
  downlink?: number; // Mbps
  rtt?: number; // ms
  saveData?: boolean;
}

export interface PerformanceInfo {
  fps: number;
  memory: number; // MB
  loadTime: number; // ms
  domContentLoaded: number; // ms
  ttfb: number; // ms
}

export interface ErrorInfo {
  total: number;
  last24h: number;
  lastError?: {
    message: string;
    timestamp: string;
  };
}

export interface APICallMetric {
  endpoint: string;
  method: string;
  duration: number;
  status: number;
  success: boolean;
  timestamp: string;
  userId?: string;
}

/**
 * Real-time Monitoring Class
 */
class Monitoring {
  private errorCount = 0;
  private errors24h: Array<{ message: string; timestamp: Date }> = [];
  private apiCalls: APICallMetric[] = [];
  private maxAPICallsHistory = 100;
  private fps = 0;
  private fpsFrames = 0;
  private fpsLastTime = performance.now();

  constructor() {
    this.setupMonitoring();
  }

  /**
   * Setup monitoring
   */
  private setupMonitoring(): void {
    // Monitor FPS
    this.startFPSMonitoring();

    // Clean up old errors every hour
    setInterval(() => {
      this.cleanupOldErrors();
    }, 3600000); // 1 hour
  }

  /**
   * Start FPS monitoring
   */
  private startFPSMonitoring(): void {
    const measureFPS = () => {
      this.fpsFrames++;
      const now = performance.now();
      const elapsed = now - this.fpsLastTime;

      if (elapsed >= 1000) {
        this.fps = Math.round((this.fpsFrames * 1000) / elapsed);
        this.fpsFrames = 0;
        this.fpsLastTime = now;
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  /**
   * Clean up errors older than 24 hours
   */
  private cleanupOldErrors(): void {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.errors24h = this.errors24h.filter((error) => error.timestamp > oneDayAgo);
  }

  /**
   * Track error
   */
  trackError(message: string): void {
    this.errorCount++;
    this.errors24h.push({
      message,
      timestamp: new Date(),
    });

    advancedLogger.warn('Error tracked', new Error(message));
  }

  /**
   * Get memory info
   */
  getMemoryInfo(): MemoryInfo {
    // @ts-expect-error - performance.memory is non-standard
    const memory = performance.memory;

    if (memory) {
      const used = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const total = Math.round(memory.totalJSHeapSize / 1024 / 1024);
      const percentage = Math.round((used / total) * 100);

      return { used, total, percentage };
    }

    return { used: 0 };
  }

  /**
   * Get network info
   */
  getNetworkInfo(): NetworkInfo {
    // @ts-expect-error - navigator.connection is experimental
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (connection) {
      return {
        type: connection.type || 'unknown',
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      };
    }

    return { type: 'unknown' };
  }

  /**
   * Get performance info
   */
  getPerformanceInfo(): PerformanceInfo {
    const timing = performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    const domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
    const ttfb = timing.responseStart - timing.navigationStart;
    const memory = this.getMemoryInfo().used;

    return {
      fps: this.fps,
      memory,
      loadTime: Math.round(loadTime),
      domContentLoaded: Math.round(domContentLoaded),
      ttfb: Math.round(ttfb),
    };
  }

  /**
   * Get error info
   */
  getErrorInfo(): ErrorInfo {
    const lastError = this.errors24h[this.errors24h.length - 1];

    return {
      total: this.errorCount,
      last24h: this.errors24h.length,
      lastError: lastError
        ? {
            message: lastError.message,
            timestamp: lastError.timestamp.toISOString(),
          }
        : undefined,
    };
  }

  /**
   * Get system health
   */
  getSystemHealth(): SystemHealth {
    return {
      memory: this.getMemoryInfo(),
      network: this.getNetworkInfo(),
      performance: this.getPerformanceInfo(),
      errors: this.getErrorInfo(),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Track API call
   */
  trackAPICall(metric: Omit<APICallMetric, 'timestamp'>): void {
    const fullMetric: APICallMetric = {
      ...metric,
      timestamp: new Date().toISOString(),
    };

    this.apiCalls.push(fullMetric);

    // Keep history size manageable
    if (this.apiCalls.length > this.maxAPICallsHistory) {
      this.apiCalls.shift();
    }

    // Log slow API calls (> 3 seconds)
    if (metric.duration > 3000) {
      advancedLogger.warn('Slow API call detected', undefined, {
        endpoint: metric.endpoint,
        duration: metric.duration,
        status: metric.status,
      });
    }

    // Track in analytics
    analyticsTracker.trackPerformance('api_call', metric.duration, {
      endpoint: metric.endpoint,
      method: metric.method,
      status: metric.status,
      success: metric.success,
    });

    // ✅ Performance Monitoring Integration
    // When ready: import { reportAPICall } from '@/lib/integrations/monitoring';
    // reportAPICall(fullMetric);
  }


  /**
   * Clear metrics (for testing)
   */
  clearMetrics(): void {
    this.apiCalls = [];
    this.errorCount = 0;
    this.errors24h = [];
  }

  /**
   * Get API call metrics
   */
  getAPIMetrics(): {
    total: number;
    averageDuration: number;
    successRate: number;
    slowCalls: number;
    recentCalls: APICallMetric[];
  } {
    if (this.apiCalls.length === 0) {
      return {
        total: 0,
        averageDuration: 0,
        successRate: 100,
        slowCalls: 0,
        recentCalls: [],
      };
    }

    const total = this.apiCalls.length;
    const averageDuration =
      this.apiCalls.reduce((sum, call) => sum + call.duration, 0) / total;
    const successCount = this.apiCalls.filter((call) => call.success).length;
    const successRate = (successCount / total) * 100;
    const slowCalls = this.apiCalls.filter((call) => call.duration > 3000).length;
    const recentCalls = this.apiCalls.slice(-10);

    return {
      total,
      averageDuration: Math.round(averageDuration),
      successRate: Math.round(successRate * 100) / 100,
      slowCalls,
      recentCalls,
    };
  }

  /**
   * Check if system is healthy
   */
  isHealthy(): boolean {
    const health = this.getSystemHealth();

    // Check memory usage
    if (health.memory.percentage && health.memory.percentage > 90) {
      return false;
    }

    // Check FPS
    if (health.performance.fps < 30) {
      return false;
    }

    // Check error rate
    if (health.errors.last24h > 100) {
      return false;
    }

    return true;
  }

  /**
   * Get health report
   */
  getHealthReport(): {
    healthy: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const health = this.getSystemHealth();
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Memory issues
    if (health.memory.percentage && health.memory.percentage > 90) {
      issues.push('High memory usage detected');
      recommendations.push('Close unused tabs or refresh the page');
    }

    // Performance issues
    if (health.performance.fps < 30) {
      issues.push('Low FPS detected');
      recommendations.push('Reduce browser workload or upgrade hardware');
    }

    // Error issues
    if (health.errors.last24h > 100) {
      issues.push('High error rate detected');
      recommendations.push('Check console for errors or contact support');
    }

    // Network issues
    if (health.network.effectiveType === '2g' || health.network.effectiveType === 'slow-2g') {
      issues.push('Slow network connection detected');
      recommendations.push('Connect to a faster network for better experience');
    }

    return {
      healthy: issues.length === 0,
      issues,
      recommendations,
    };
  }

  /**
   * Export monitoring data
   */
  exportData(): string {
    return JSON.stringify(
      {
        health: this.getSystemHealth(),
        apiMetrics: this.getAPIMetrics(),
        healthReport: this.getHealthReport(),
      },
      null,
      2
    );
  }
}

// Export singleton instance
export const monitoring = new Monitoring();

// Export for easy usage
export default monitoring;

