/**
 * Performance Monitoring with OpenTelemetry
 * Real User Monitoring (RUM) integration
 * 
 * Features:
 * - Custom span creation
 * - User interaction tracking
 * - Resource timing
 * - Error tracking
 * - Custom metrics
 */

import { trace, SpanStatusCode, context } from '@opentelemetry/api';
import { logger } from './logger';

const tracer = trace.getTracer('asistan-panel', '1.0.0');

/**
 * Track a custom operation with OpenTelemetry
 * 
 * @param name - Operation name
 * @param fn - Function to track
 * @param attributes - Custom attributes
 * @returns Function result
 * 
 * @example
 * ```ts
 * const result = await trackOperation('fetchUserData', async () => {
 *   return await api.getUser(userId);
 * }, { userId: '123' });
 * ```
 */
export async function trackOperation<T>(
  name: string,
  fn: () => Promise<T>,
  attributes: Record<string, string | number | boolean> = {}
): Promise<T> {
  const span = tracer.startSpan(name, {
    attributes: {
      ...attributes,
      'app.component': 'panel',
      'app.version': '1.0.0',
    },
  });

  try {
    const result = await context.with(trace.setSpan(context.active(), span), fn);
    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (error) {
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    span.recordException(error as Error);
    throw error;
  } finally {
    span.end();
  }
}

/**
 * Track user interaction (click, form submit, etc.)
 * 
 * @param action - Action name
 * @param target - Target element
 * @param metadata - Additional metadata
 * 
 * @example
 * ```ts
 * trackUserInteraction('button_click', 'send_message', { 
 *   conversationId: '123' 
 * });
 * ```
 */
export function trackUserInteraction(
  action: string,
  target: string,
  metadata: Record<string, any> = {}
): void {
  const span = tracer.startSpan('user.interaction', {
    attributes: {
      'user.action': action,
      'user.target': target,
      'interaction.timestamp': Date.now(),
      ...flattenObject(metadata),
    },
  });

  span.end();

  if (import.meta.env.DEV) {
    logger.debug('[Performance] User interaction tracked', {
      action,
      target,
      metadata,
    });
  }
}

/**
 * Track page view
 * 
 * @param page - Page name/route
 * @param metadata - Additional metadata
 * 
 * @example
 * ```ts
 * trackPageView('/agent/conversations', { userId: '123' });
 * ```
 */
export function trackPageView(
  page: string,
  metadata: Record<string, any> = {}
): void {
  const span = tracer.startSpan('page.view', {
    attributes: {
      'page.path': page,
      'page.timestamp': Date.now(),
      'page.referrer': document.referrer,
      ...flattenObject(metadata),
    },
  });

  // Track Web Vitals
  if ('web-vital' in window) {
    // Will be captured by web-vitals library
  }

  span.end();
}

/**
 * Track API call performance
 * 
 * @param endpoint - API endpoint
 * @param method - HTTP method
 * @param fn - API call function
 * @param metadata - Additional metadata
 * @returns API response
 * 
 * @example
 * ```ts
 * const data = await trackAPICall('/api/conversations', 'GET', async () => {
 *   return await fetch('/api/conversations');
 * });
 * ```
 */
export async function trackAPICall<T>(
  endpoint: string,
  method: string,
  fn: () => Promise<T>,
  metadata: Record<string, any> = {}
): Promise<T> {
  const startTime = performance.now();
  
  const span = tracer.startSpan('api.call', {
    attributes: {
      'http.endpoint': endpoint,
      'http.method': method,
      'http.start_time': startTime,
      ...flattenObject(metadata),
    },
  });

  try {
    const result = await fn();
    const duration = performance.now() - startTime;

    span.setAttributes({
      'http.duration_ms': duration,
      'http.status': 'success',
    });

    span.setStatus({ code: SpanStatusCode.OK });

    if (import.meta.env.DEV) {
      logger.debug('[Performance] API call tracked', {
        endpoint,
        method,
        duration: `${duration.toFixed(2)}ms`,
      });
    }

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;

    span.setAttributes({
      'http.duration_ms': duration,
      'http.status': 'error',
      'http.error': error instanceof Error ? error.message : 'Unknown error',
    });

    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error instanceof Error ? error.message : 'API call failed',
    });

    span.recordException(error as Error);
    throw error;
  } finally {
    span.end();
  }
}

/**
 * Track component render performance
 * 
 * @param componentName - Component name
 * @param renderType - 'mount' | 'update' | 'unmount'
 * @param duration - Render duration in ms
 * @param metadata - Additional metadata
 * 
 * @example
 * ```ts
 * trackComponentRender('ConversationList', 'mount', 45.2, { 
 *   conversationCount: 50 
 * });
 * ```
 */
export function trackComponentRender(
  componentName: string,
  renderType: 'mount' | 'update' | 'unmount',
  duration: number,
  metadata: Record<string, any> = {}
): void {
  const span = tracer.startSpan('component.render', {
    attributes: {
      'component.name': componentName,
      'component.render_type': renderType,
      'component.duration_ms': duration,
      ...flattenObject(metadata),
    },
  });

  span.end();

  // Log slow renders in development
  if (import.meta.env.DEV && duration > 16.67) { // 60fps threshold
    logger.warn('[Performance] Slow component render', {
      component: componentName,
      renderType,
      duration: `${duration.toFixed(2)}ms`,
      threshold: '16.67ms (60fps)',
    });
  }
}

/**
 * Track custom metric
 * 
 * @param metricName - Metric name
 * @param value - Metric value
 * @param unit - Metric unit
 * @param attributes - Custom attributes
 * 
 * @example
 * ```ts
 * trackMetric('conversation.message_count', 150, 'count', { 
 *   conversationId: '123' 
 * });
 * ```
 */
export function trackMetric(
  metricName: string,
  value: number,
  unit: string = 'count',
  attributes: Record<string, any> = {}
): void {
  const span = tracer.startSpan('custom.metric', {
    attributes: {
      'metric.name': metricName,
      'metric.value': value,
      'metric.unit': unit,
      'metric.timestamp': Date.now(),
      ...flattenObject(attributes),
    },
  });

  span.end();
}

/**
 * Flatten nested object for OpenTelemetry attributes
 * 
 * @param obj - Object to flatten
 * @param prefix - Key prefix
 * @returns Flattened object
 */
function flattenObject(
  obj: Record<string, any>,
  prefix: string = ''
): Record<string, string | number | boolean> {
  const result: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value === null || value === undefined) {
      continue;
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, newKey));
    } else if (Array.isArray(value)) {
      result[newKey] = JSON.stringify(value);
    } else if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      result[newKey] = value;
    } else {
      result[newKey] = String(value);
    }
  }

  return result;
}

/**
 * React hook for tracking component lifecycle
 * 
 * @param componentName - Component name
 * @returns Render tracker function
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const trackRender = usePerformanceTracking('MyComponent');
 *   
 *   useEffect(() => {
 *     trackRender('mount');
 *     return () => trackRender('unmount');
 *   }, []);
 *   
 *   return <div>...</div>;
 * }
 * ```
 */
export function usePerformanceTracking(componentName: string) {
  return (renderType: 'mount' | 'update' | 'unmount') => {
    const duration = performance.now();
    trackComponentRender(componentName, renderType, duration);
  };
}

