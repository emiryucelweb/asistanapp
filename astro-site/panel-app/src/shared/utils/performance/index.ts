/**
 * Performance Utilities
 * 
 * Centralized exports for performance monitoring tools
 * 
 * @module shared/utils/performance
 */

// Web Vitals
export * from './webVitals';

// Performance Monitor Hook
export { usePerformanceMonitor, usePerformanceMeasure } from '@/features/agent/hooks/usePerformanceMonitor';
export type { PerformanceMetrics, UsePerformanceMonitorOptions } from '@/features/agent/hooks/usePerformanceMonitor';

