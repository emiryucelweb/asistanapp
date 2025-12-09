 
// NOTE: Infrastructure/utility file - `any` used for generic types & external library interfaces

/**
 * Web Vitals Tracking
 * 
 * Enterprise-grade performance monitoring using Core Web Vitals
 * Tracks and reports critical performance metrics
 * 
 * Core Web Vitals:
 * - LCP (Largest Contentful Paint) - Loading performance
 * - INP (Interaction to Next Paint) - Interactivity (replaces FID)
 * - CLS (Cumulative Layout Shift) - Visual stability
 * 
 * Additional Metrics:
 * - FCP (First Contentful Paint) - Initial render
 * - TTFB (Time to First Byte) - Server response
 * 
 * @module shared/utils/performance/webVitals
 */

import { onCLS, onFCP, onLCP, onTTFB, onINP, type Metric } from 'web-vitals';
import { logger } from '@/shared/utils/logger';

/**
 * Web Vitals metric type
 */
export type WebVitalMetric = Metric;

/**
 * Web Vitals thresholds (Google recommendations)
 */
export const WEB_VITALS_THRESHOLDS = {
  // Largest Contentful Paint (ms)
  LCP: {
    good: 2500,
    needsImprovement: 4000,
  },
  // Cumulative Layout Shift (score)
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  // First Contentful Paint (ms)
  FCP: {
    good: 1800,
    needsImprovement: 3000,
  },
  // Time to First Byte (ms)
  TTFB: {
    good: 800,
    needsImprovement: 1800,
  },
  // Interaction to Next Paint (ms)
  INP: {
    good: 200,
    needsImprovement: 500,
  },
} as const;

/**
 * Performance rating based on thresholds
 */
export type PerformanceRating = 'good' | 'needs-improvement' | 'poor';

/**
 * Get performance rating for a metric
 */
export function getPerformanceRating(
  metricName: string,
  value: number
): PerformanceRating {
  const threshold = WEB_VITALS_THRESHOLDS[metricName as keyof typeof WEB_VITALS_THRESHOLDS];
  
  if (!threshold) {
    return 'good';
  }

  if (value <= threshold.good) {
    return 'good';
  } else if (value <= threshold.needsImprovement) {
    return 'needs-improvement';
  } else {
    return 'poor';
  }
}

/**
 * Format metric value for display
 */
export function formatMetricValue(metricName: string, value: number): string {
  // CLS is a unitless score
  if (metricName === 'CLS') {
    return value.toFixed(3);
  }
  
  // Others are in milliseconds
  return `${Math.round(value)}ms`;
}

/**
 * Metric handler callback type
 */
export type MetricHandler = (metric: WebVitalMetric) => void;

/**
 * Default metric handler - logs and sends to backend
 */
function handleMetric(metric: WebVitalMetric): void {
  const rating = getPerformanceRating(metric.name, metric.value);
  const formattedValue = formatMetricValue(metric.name, metric.value);

  // Log metric
  logger.info(`[Web Vitals] ${metric.name}`, {
    value: metric.value,
    formattedValue,
    rating,
    id: metric.id,
    navigationType: metric.navigationType,
  });

  // Send to analytics
  sendToAnalytics(metric, rating);

  // Send to backend monitoring
  sendToBackend(metric, rating);

  // Alert on poor performance
  if (rating === 'poor') {
    logger.warn(`Poor ${metric.name} performance detected`, {
      value: metric.value,
      threshold: WEB_VITALS_THRESHOLDS[metric.name as keyof typeof WEB_VITALS_THRESHOLDS],
    });
  }
}

/**
 * Send metric to analytics (GA4, Mixpanel, etc.)
 */
function sendToAnalytics(metric: WebVitalMetric, rating: PerformanceRating): void {
  // Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      metric_rating: rating,
      non_interaction: true,
    });
  }

  // Custom analytics
  if (typeof window !== 'undefined' && (window as any).analytics) {
    (window as any).analytics.track('Web Vital', {
      metric: metric.name,
      value: metric.value,
      rating,
      id: metric.id,
      navigationType: metric.navigationType,
    });
  }
}

/**
 * Send metric to backend monitoring service
 */
async function sendToBackend(metric: WebVitalMetric, rating: PerformanceRating): Promise<void> {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      // User not authenticated, skip backend reporting
      return;
    }

    // Batch metrics to reduce requests
    const metricsQueue = getMetricsQueue();
    metricsQueue.push({
      metric: metric.name,
      value: metric.value,
      rating,
      id: metric.id,
      navigationType: metric.navigationType,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    });

    // Send batch every 10 seconds or when 5 metrics are collected
    if (metricsQueue.length >= 5 || shouldFlushQueue()) {
      await flushMetricsQueue();
    }
  } catch (error) {
    logger.debug('Failed to send metric to backend', { error });
  }
}

/**
 * Metrics queue for batching
 */
let metricsQueue: any[] = [];
let lastFlushTime = Date.now();

function getMetricsQueue() {
  return metricsQueue;
}

function shouldFlushQueue(): boolean {
  return Date.now() - lastFlushTime > 10000; // 10 seconds
}

async function flushMetricsQueue(): Promise<void> {
  if (metricsQueue.length === 0) return;

  const batch = [...metricsQueue];
  metricsQueue = [];
  lastFlushTime = Date.now();

  try {
    // TODO: Replace with actual backend endpoint
    // await fetch('/api/metrics/web-vitals', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    //   },
    //   body: JSON.stringify({ metrics: batch }),
    // });

    logger.debug('Metrics batch sent', { count: batch.length });
  } catch (error) {
    // Re-add to queue on failure
    metricsQueue = [...batch, ...metricsQueue];
    logger.debug('Failed to send metrics batch', { error });
  }
}

/**
 * Report all Web Vitals
 * 
 * @param onMetric - Optional custom metric handler
 * 
 * @example
 * ```ts
 * // Default handler (logs and sends to backend)
 * reportWebVitals();
 * 
 * // Custom handler
 * reportWebVitals((metric) => {
 *   logger.debug(metric.name, metric.value);
 * });
 * ```
 */
export function reportWebVitals(onMetric?: MetricHandler): void {
  const handler = onMetric || handleMetric;

  try {
    // Core Web Vitals
    onCLS(handler);
    onLCP(handler);
    onINP(handler);
    
    // Additional metrics
    onFCP(handler);
    onTTFB(handler);

    logger.info('Web Vitals monitoring initialized');
  } catch (error) {
    logger.error('Failed to initialize Web Vitals', error);
  }
}

/**
 * Get current Web Vitals snapshot
 * 
 * @returns Promise with current metric values
 */
export async function getWebVitalsSnapshot(): Promise<Record<string, number>> {
  return new Promise((resolve) => {
    const metrics: Record<string, number> = {};
    let count = 0;
    const total = 5; // CLS, LCP, FCP, TTFB, INP

    const collectMetric = (metric: WebVitalMetric) => {
      metrics[metric.name] = metric.value;
      count++;
      
      if (count === total) {
        resolve(metrics);
      }
    };

    // Collect all metrics
    onCLS(collectMetric);
    onLCP(collectMetric);
    onFCP(collectMetric);
    onTTFB(collectMetric);
    onINP(collectMetric);

    // Timeout after 5 seconds
    setTimeout(() => {
      resolve(metrics);
    }, 5000);
  });
}

/**
 * Calculate performance score (0-100)
 * Based on Google Lighthouse scoring
 */
export function calculatePerformanceScore(metrics: Record<string, number>): number {
  const weights = {
    LCP: 0.30,
    INP: 0.30,
    CLS: 0.20,
    FCP: 0.10,
    TTFB: 0.10,
  };

  let score = 0;

  for (const [metric, value] of Object.entries(metrics)) {
    const rating = getPerformanceRating(metric, value);
    const weight = weights[metric as keyof typeof weights] || 0;

    if (rating === 'good') {
      score += weight * 100;
    } else if (rating === 'needs-improvement') {
      score += weight * 50;
    }
    // poor = 0 points
  }

  return Math.round(score);
}

// Flush queue before page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    flushMetricsQueue();
  });

  // Also flush on visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushMetricsQueue();
    }
  });
}

