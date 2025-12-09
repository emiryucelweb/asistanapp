/**
 * Tracing Utility (Simplified)
 * 
 * Simple trace ID generation for log correlation
 * Full OpenTelemetry instrumentation can be added later when package versions are compatible
 * 
 * NOTE: This file MUST NOT import logger.ts to avoid circular dependency
 * logger.ts imports this file for trace ID generation
 * 
 * @module shared/utils/tracing
 */

/**
 * Environment configuration
 */
const TRACING_CONFIG = {
  serviceName: import.meta.env.VITE_SERVICE_NAME || 'asistan-panel',
  serviceVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  environment: import.meta.env.VITE_ENV || 'development',
  enabled: import.meta.env.VITE_OTEL_ENABLED === 'true',
} as const;

/**
 * Current trace ID (stored in session)
 */
let currentTraceId: string | null = null;

/**
 * Initialize tracing
 * Currently just enables trace ID generation
 */
export function initializeTracing(): boolean {
  if (!TRACING_CONFIG.enabled) {
    if (import.meta.env.DEV) {
      console.log('[Tracing] Trace ID generation disabled');
    }
    return false;
  }

  if (import.meta.env.DEV) {
    console.log('[Tracing] Trace ID generation enabled', {
      serviceName: TRACING_CONFIG.serviceName,
      environment: TRACING_CONFIG.environment,
    });
  }

  return true;
}

/**
 * Alias for backwards compatibility
 */
export function initTracing(): void {
  initializeTracing();
}

/**
 * Generate a new trace ID
 * Format: trace-{timestamp}-{random}
 */
export function generateTraceId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return `trace-${timestamp}-${random}`;
}

/**
 * Get or create trace ID for current session
 */
export function getOrCreateTraceId(): string {
  if (!currentTraceId) {
    currentTraceId = generateTraceId();
  }
  return currentTraceId;
}

/**
 * Set current trace ID (useful for continuing traces)
 */
export function setTraceId(traceId: string): void {
  currentTraceId = traceId;
}

/**
 * Clear current trace ID
 */
export function clearTraceId(): void {
  currentTraceId = null;
}

/**
 * Get current trace ID without creating a new one
 */
export function getCurrentTraceId(): string | null {
  return currentTraceId;
}

/**
 * Start a span (simplified - just for timing)
 * Returns a function to end the span
 */
export function startSpan(name: string): () => void {
  const startTime = performance.now();
  const traceId = getOrCreateTraceId();

  if (TRACING_CONFIG.enabled && import.meta.env.DEV) {
    console.log(`[Trace ${traceId}] Span started: ${name}`);
  }

  return () => {
    const duration = performance.now() - startTime;
    if (TRACING_CONFIG.enabled && import.meta.env.DEV) {
      console.log(`[Trace ${traceId}] Span ended: ${name} (${duration.toFixed(2)}ms)`);
    }
  };
}

/**
 * End span (for backwards compatibility)
 */
export function endSpan(_spanId: string): void {
  // No-op in simplified version
}

/**
 * Trace a function execution
 */
export async function traceFunction<T>(
  name: string,
  fn: () => Promise<T> | T
): Promise<T> {
  const endSpan = startSpan(name);
  try {
    const result = await fn();
    endSpan();
    return result;
  } catch (error) {
    endSpan();
    throw error;
  }
}

/**
 * Get trace context for HTTP headers
 */
export function getTraceHeaders(): Record<string, string> {
  const traceId = getCurrentTraceId();
  if (!traceId) {
    return {};
  }

  return {
    'X-Trace-Id': traceId,
    'X-Request-Id': `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
  };
}

// Auto-initialize on import
initializeTracing();
