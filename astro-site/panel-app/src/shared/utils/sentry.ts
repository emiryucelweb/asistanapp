 
// NOTE: Infrastructure/utility file - `any` used for generic types & external library interfaces

/**
 * Sentry Error Tracking (Simplified)
 * 
 * Basic Sentry setup for error tracking
 * Advanced features can be added when needed
 * 
 * @module shared/utils/sentry
 */

import * as Sentry from '@sentry/react';
import { logger } from '@/shared/utils/logger';

/**
 * Sentry configuration
 */
const SENTRY_CONFIG = {
  dsn: import.meta.env.VITE_SENTRY_DSN || '',
  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.VITE_ENV || 'development',
  release: import.meta.env.VITE_APP_VERSION || '1.0.0',
  tracesSampleRate: parseFloat(import.meta.env.VITE_SENTRY_TRACE_SAMPLE_RATE || '0.1'),
  replaySampleRate: 0.1, // 10% of sessions
  enabled: !!import.meta.env.VITE_SENTRY_DSN && import.meta.env.VITE_ENV !== 'development',
} as const;

/**
 * Initialize Sentry
 */
export function initializeSentry(): void {
  if (!SENTRY_CONFIG.enabled) {
    logger.debug('[Sentry] Error tracking disabled (no DSN or development mode)');
    return;
  }

  try {
    Sentry.init({
      dsn: SENTRY_CONFIG.dsn,
      environment: SENTRY_CONFIG.environment,
      release: SENTRY_CONFIG.release,
      tracesSampleRate: SENTRY_CONFIG.tracesSampleRate,
      
      // Session Replay
      replaysSessionSampleRate: SENTRY_CONFIG.replaySampleRate,
      replaysOnErrorSampleRate: 1.0, // 100% of errors

      // Integrations
      integrations: [
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],

      // Ignore common errors
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
        'Network request failed',
        'Failed to fetch',
      ],

      // Before send hook
      beforeSend(event, _hint) {
        // Filter out errors in development
        if (SENTRY_CONFIG.environment === 'development') {
          logger.debug('[Sentry] Would send error:', event);
          return null;
        }

        // Log error for debugging
        logger.error('[Sentry] Sending error:', event);
        return event;
      },
    });

    logger.debug('[Sentry] Error tracking initialized', {
      environment: SENTRY_CONFIG.environment,
      release: SENTRY_CONFIG.release,
    });
  } catch (error) {
    logger.error('[Sentry] Failed to initialize:', error);
  }
}

/**
 * Capture exception
 */
export function captureSentryException(
  error: Error,
  context?: Record<string, any>
): string | undefined {
  if (!SENTRY_CONFIG.enabled) {
    return undefined;
  }

  return Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Capture message
 */
export function captureSentryMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  context?: Record<string, any>
): string | undefined {
  if (!SENTRY_CONFIG.enabled) {
    return undefined;
  }

  return Sentry.captureMessage(message, {
    level,
    extra: context,
  });
}

/**
 * Add breadcrumb
 */
export function addSentryBreadcrumb(
  message: string,
  data?: Record<string, any>,
  level?: Sentry.SeverityLevel,
  category?: string
): void {
  if (!SENTRY_CONFIG.enabled) {
    return;
  }

  Sentry.addBreadcrumb({
    message,
    data,
    level: level || 'info',
    category: category || 'custom',
  });
}

/**
 * Set user context
 */
export function setSentryUser(user: {
  id?: string;
  email?: string;
  username?: string;
  [key: string]: any;
}): void {
  if (!SENTRY_CONFIG.enabled) {
    return;
  }

  Sentry.setUser(user);
}

/**
 * Clear user context
 */
export function clearSentryUser(): void {
  if (!SENTRY_CONFIG.enabled) {
    return;
  }

  Sentry.setUser(null);
}

/**
 * Set tag
 */
export function setSentryTag(key: string, value: string): void {
  if (!SENTRY_CONFIG.enabled) {
    return;
  }

  Sentry.setTag(key, value);
}

/**
 * Set context
 */
export function setSentryContext(
  name: string,
  context: Record<string, any>
): void {
  if (!SENTRY_CONFIG.enabled) {
    return;
  }

  Sentry.setContext(name, context);
}

/**
 * Wrap component with Sentry error boundary
 */
export function withSentryErrorBoundary<P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: React.ReactElement;
    showDialog?: boolean;
  }
): React.ComponentType<P> {
  if (!SENTRY_CONFIG.enabled) {
    return Component;
  }

  const config: any = {
    showDialog: options?.showDialog || false,
  };

  if (options?.fallback) {
    config.fallback = options.fallback;
  }

  return Sentry.withErrorBoundary(Component, config);
}

// Auto-initialize on import
initializeSentry();
