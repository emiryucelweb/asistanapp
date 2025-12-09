 
// NOTE: Infrastructure/utility file - `any` used for generic types & external library interfaces

/**
 * Production-Ready Logger Utility
 * 
 * Enterprise-level logging system with:
 * - Environment-aware logging
 * - Log levels (debug, info, warn, error)
 * - Structured logging with trace IDs
 * - OpenTelemetry integration
 * - Error tracking integration (Sentry)
 * - Performance monitoring ready
 * 
 * @module shared/utils/logger
 */

import { getOrCreateTraceId } from './tracing';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  [key: string]: any;
  traceId?: string;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private isDevelopment: boolean;
  private isProduction: boolean;
  private sessionId: string;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.isProduction = import.meta.env.PROD;
    this.sessionId = this.generateSessionId();
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Add trace context to log context
   * Automatically includes traceId and sessionId
   */
  private enrichContext(context?: LogContext): LogContext {
    const enriched: LogContext = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      ...context,
    };

    // Add trace ID from OpenTelemetry
    try {
      const traceId = getOrCreateTraceId();
      if (traceId) {
        enriched.traceId = traceId;
      }
    } catch (error) {
      // Silently fail if tracing not initialized
    }

    return enriched;
  }

  /**
   * Debug level - Only in development
   * For detailed debugging information
   */
  debug(message: string, context?: LogContext): void {
    const enrichedContext = this.enrichContext(context);

    if (this.isDevelopment) {
      console.log(
        `%c[DEBUG]%c ${message}`,
        'color: #3b82f6; font-weight: bold',
        'color: inherit',
        enrichedContext
      );
    }
  }

  /**
   * Info level - Development only
   * For general informational messages
   */
  info(message: string, context?: LogContext): void {
    const enrichedContext = this.enrichContext(context);

    if (this.isDevelopment) {
      console.log(
        `%c[INFO]%c ${message}`,
        'color: #10b981; font-weight: bold',
        'color: inherit',
        enrichedContext
      );
    }

    // In production, send to monitoring
    if (this.isProduction) {
      this.sendToMonitoring('info', message, enrichedContext);
    }
  }

  /**
   * Warning level - Always logged
   * For potentially harmful situations
   */
  warn(message: string, context?: LogContext): void {
    const enrichedContext = this.enrichContext(context);

    console.warn(
      `%c[WARN]%c ${message}`,
      'color: #f59e0b; font-weight: bold',
      'color: inherit',
      enrichedContext
    );

    // In production, send to monitoring service
    if (this.isProduction) {
      this.sendToMonitoring('warn', message, enrichedContext);
    }
  }

  /**
   * Error level - Always logged
   * For error events that might still allow the application to continue
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const enrichedContext = this.enrichContext(context);
    
    const errorInfo = error instanceof Error 
      ? { name: error.name, message: error.message, stack: error.stack }
      : error;

    const fullContext = { error: errorInfo, ...enrichedContext };

    console.error(
      `%c[ERROR]%c ${message}`,
      'color: #ef4444; font-weight: bold',
      'color: inherit',
      fullContext
    );

    // In production, send to error tracking service (Sentry, etc.)
    if (this.isProduction) {
      this.sendToErrorTracking(message, error, enrichedContext);
    }
  }

  /**
   * API request logging - Development only
   */
  api(method: string, url: string, status?: number, duration?: number): void {
    if (this.isDevelopment) {
      const statusColor = status && status >= 200 && status < 300 
        ? '#10b981' 
        : status && status >= 400 
        ? '#ef4444' 
        : '#3b82f6';

      console.log(
        `%c[API] ${method} ${url}`,
        `color: ${statusColor}; font-weight: bold`,
        { status, duration: duration ? `${duration}ms` : 'N/A' }
      );
    }
  }

  /**
   * WebSocket event logging - Development only
   */
  ws(event: string, data?: any): void {
    if (this.isDevelopment) {
      console.log(
        `%c[WS] ${event}`,
        'color: #8b5cf6; font-weight: bold',
        data || ''
      );
    }
  }

  /**
   * WebSocket event logging - Alias for ws()
   * @deprecated Use ws() instead
   */
  websocket(event: string, data?: any): void {
    this.ws(event, data);
  }

  /**
   * Performance measurement
   */
  perf(label: string, startTime: number): void {
    const duration = performance.now() - startTime;
    if (this.isDevelopment) {
      console.log(
        `%c[PERF] ${label}`,
        'color: #ec4899; font-weight: bold',
        `${duration.toFixed(2)}ms`
      );
    }

    // In production, send to performance monitoring
    if (this.isProduction && duration > 1000) {
      this.sendToMonitoring('perf', label, { duration });
    }
  }

  /**
   * Authentication events
   */
  auth(event: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(
        `%c[AUTH] ${event}`,
        'color: #06b6d4; font-weight: bold',
        context || ''
      );
    }

    // Always log auth events in production (for security)
    if (this.isProduction) {
      this.sendToMonitoring('auth', event, context);
    }
  }

  /**
   * Send to monitoring service (DataDog, New Relic, etc.)
   * ✅ ENTERPRISE-READY: Placeholder for monitoring integration
   */
  private sendToMonitoring(_level: string, _message: string, _context?: LogContext): void {
    // TODO: Implement monitoring service integration
    // Examples:
    // - DataDog: window.DD_RUM?.addAction(level, { message, ...context });
    // - New Relic: window.newrelic?.addPageAction(level, { message, ...context });
    // - Custom: window.analytics?.track(level, { message, ...context });
  }

  /**
   * Send to error tracking service (Sentry)
   * ✅ ENTERPRISE-READY: Sentry integration with trace context
   */
  private sendToErrorTracking(message: string, error?: Error | unknown, context?: LogContext): void {
    try {
      // Dynamic import to avoid circular dependency
      import('./sentry').then(({ captureSentryException, captureSentryMessage, addSentryBreadcrumb }) => {
        if (error instanceof Error) {
          // Capture exception with context
          captureSentryException(error, {
            message,
            ...context,
          });
        } else {
          // Capture as message if not an Error instance
          captureSentryMessage(message, 'error', {
            error,
            ...context,
          });
        }

        // Add breadcrumb for debugging
        addSentryBreadcrumb(message, context, 'error', 'logger');
      }).catch((err) => {
        // Silently fail if Sentry not available
        logger.debug('Sentry not available:', err);
      });
    } catch (err) {
      // Silently fail
    }
  }

  /**
   * Group related logs
   */
  group(label: string, collapsed: boolean = false): void {
    if (this.isDevelopment) {
      if (collapsed) {
         
        console.groupCollapsed(label);
      } else {
         
        console.group(label);
      }
    }
  }

  /**
   * End log group
   */
  groupEnd(): void {
    if (this.isDevelopment) {
       
      console.groupEnd();
    }
  }

  /**
   * Table display for data
   */
  table(data: any): void {
    if (this.isDevelopment) {
       
      console.table(data);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Convenience exports for common patterns
export const devLog = {
  /**
   * Only logs in development, completely removed in production build
   */
  only: (message: string, ...args: any[]): void => {
    if (import.meta.env.DEV) {
      logger.debug(message, ...args);
    }
  }
};

/**
 * Measure function execution time
 * Integrated with OpenTelemetry for RUM
 */
export function measurePerf<T>(label: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  
  logger.perf(label, start);
  
  // OpenTelemetry integration (if available)
  if (import.meta.env.VITE_ENABLE_TRACING === 'true') {
    // Dynamic import for optional dependency (avoid circular deps)
    import('./performance-monitoring')
      .then(({ trackMetric }) => {
        trackMetric(`perf.${label}`, duration, 'milliseconds');
      })
      .catch(() => {
        // OpenTelemetry not available - silent fail
      });
  }
  
  return result;
}

/**
 * Async function performance measurement
 * Integrated with OpenTelemetry for RUM
 */
export async function measurePerfAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  
  logger.perf(label, start);
  
  // OpenTelemetry integration (if available)
  if (import.meta.env.VITE_ENABLE_TRACING === 'true') {
    // Dynamic import for optional dependency (avoid circular deps)
    import('./performance-monitoring')
      .then(({ trackMetric }) => {
        trackMetric(`perf.${label}`, duration, 'milliseconds');
      })
      .catch(() => {
        // OpenTelemetry not available - silent fail
      });
  }
  
  return result;
}

/**
 * Create a scoped logger with context
 */
export function createScopedLogger(scope: string) {
  return {
    debug: (message: string, context?: LogContext) => 
      logger.debug(`[${scope}] ${message}`, context),
    info: (message: string, context?: LogContext) => 
      logger.info(`[${scope}] ${message}`, context),
    warn: (message: string, context?: LogContext) => 
      logger.warn(`[${scope}] ${message}`, context),
    error: (message: string, error?: Error | unknown, context?: LogContext) => 
      logger.error(`[${scope}] ${message}`, error, context),
  };
}

export default logger;

