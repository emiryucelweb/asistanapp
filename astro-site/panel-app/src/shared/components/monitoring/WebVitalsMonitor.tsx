/**
 * Web Vitals Monitor Component
 * Monitors and reports Core Web Vitals metrics
 * 
 * @module shared/components/monitoring/WebVitalsMonitor
 */

import React, { useEffect } from 'react';
import { useWebVitals } from '@/shared/hooks/usePerformance';
import { logger } from '@/shared/utils/logger';

export interface WebVitalsMonitorProps {
  onMetric?: (metric: { name: string; value: number; rating: string }) => void;
  enabled?: boolean;
}

/**
 * Web Vitals Monitor
 * Tracks FCP, LCP, FID, CLS, TTFB
 * 
 * Ratings (based on Google's Core Web Vitals):
 * - FCP: Good < 1.8s, Needs Improvement < 3s, Poor >= 3s
 * - LCP: Good < 2.5s, Needs Improvement < 4s, Poor >= 4s
 * - FID: Good < 100ms, Needs Improvement < 300ms, Poor >= 300ms
 * - CLS: Good < 0.1, Needs Improvement < 0.25, Poor >= 0.25
 * - TTFB: Good < 800ms, Needs Improvement < 1800ms, Poor >= 1800ms
 * 
 * Usage:
 * ```tsx
 * <WebVitalsMonitor
 *   enabled={import.meta.env.PROD}
 *   onMetric={(metric) => {
 *     // Send to analytics
 *     gtag('event', metric.name, { value: metric.value });
 *   }}
 * />
 * ```
 */
export const WebVitalsMonitor: React.FC<WebVitalsMonitorProps> = ({
  onMetric,
  enabled = import.meta.env.PROD,
}) => {
  const vitals = useWebVitals();

  useEffect(() => {
    if (!enabled) return;

    const reportMetric = (name: string, value: number | undefined) => {
      if (value === undefined) return;

      let rating: 'good' | 'needs-improvement' | 'poor';
      let threshold: { good: number; poor: number };

      switch (name) {
        case 'FCP':
          threshold = { good: 1800, poor: 3000 };
          break;
        case 'LCP':
          threshold = { good: 2500, poor: 4000 };
          break;
        case 'FID':
          threshold = { good: 100, poor: 300 };
          break;
        case 'CLS':
          threshold = { good: 0.1, poor: 0.25 };
          break;
        case 'TTFB':
          threshold = { good: 800, poor: 1800 };
          break;
        default:
          return;
      }

      if (value <= threshold.good) {
        rating = 'good';
      } else if (value <= threshold.poor) {
        rating = 'needs-improvement';
      } else {
        rating = 'poor';
      }

      const metric = { name, value, rating };

      // Log metric
      logger.info(`Web Vital: ${name}`, new Error(JSON.stringify(metric)));

      // Call custom handler
      if (onMetric) {
        onMetric(metric);
      }

      // ✅ Analytics Integration
      // When ready: import { gtag } from '@/lib/integrations/analytics';
      // gtag('event', name, { value, rating });
    };

    // Report metrics
    reportMetric('FCP', vitals.fcp);
    reportMetric('LCP', vitals.lcp);
    reportMetric('FID', vitals.fid);
    reportMetric('CLS', vitals.cls);
    reportMetric('TTFB', vitals.ttfb);
  }, [vitals, enabled, onMetric]);

  // This is a monitoring component, it doesn't render anything
  return null;
};

export default WebVitalsMonitor;

