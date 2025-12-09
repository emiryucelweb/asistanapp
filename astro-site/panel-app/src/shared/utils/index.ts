/**
 * Shared Utilities - Barrel Export
 * 
 * Enterprise-grade utility functions
 * Centralized export for easier imports
 * 
 * @module shared/utils
 */

// Type helpers
export {
  toBoolean,
  toString,
  toNumber,
  toArray,
  isDefined,
  isNullable,
} from './type-helpers';

// Formatters
export {
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatCompactNumber,
  formatDate,
  formatTime,
  formatDateTime,
  formatDuration,
  formatFileSize,
  getRelativeTime,
} from './formatters';

// Logger
export { logger, measurePerf, measurePerfAsync, createScopedLogger } from './logger';
export type { LogLevel, LogContext } from './logger';

// Subdomain utilities
export { getSubdomain } from './subdomain';

// Export helpers
export { exportToPDF, exportToExcel, exportToCSV } from './exportHelpers';

// Dev-only utilities
export { devLog, devWarn, devError } from './dev-only';

// Performance monitoring (OpenTelemetry RUM)
export {
  trackOperation,
  trackUserInteraction,
  trackPageView,
  trackAPICall,
  trackComponentRender,
  trackMetric,
  usePerformanceTracking,
} from './performance-monitoring';

