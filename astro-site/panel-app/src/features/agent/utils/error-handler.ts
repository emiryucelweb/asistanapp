 
// NOTE: Infrastructure/utility file - `any` used for generic types & external library interfaces

/**
 * Error Handling Utilities
 * Comprehensive error handling and logging
 * 
 * @module agent/utils/error-handler
 */

import { AxiosError } from 'axios';
import i18next from 'i18next';
import { logger } from '@/shared/utils/logger';
import { showError } from '@/shared/utils/toast';

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * Base application error
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Network error
 */
export class NetworkError extends AppError {
  constructor(message?: string, details?: Record<string, unknown>) {
    super(message || i18next.t('errors.networkError'), 'NETWORK_ERROR', undefined, details);
    this.name = 'NetworkError';
  }
}

/**
 * API error
 */
export class ApiError extends AppError {
  constructor(
    message: string,
    code: string,
    statusCode: number,
    details?: Record<string, unknown>
  ) {
    super(message, code, statusCode, details);
    this.name = 'ApiError';
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  constructor(message?: string, details?: Record<string, unknown>) {
    super(message || i18next.t('errors.validationError'), 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

/**
 * Authorization error
 */
export class AuthorizationError extends AppError {
  constructor(message?: string, details?: Record<string, unknown>) {
    super(message || i18next.t('errors.unauthorized'), 'UNAUTHORIZED', 401, details);
    this.name = 'AuthorizationError';
  }
}

/**
 * Forbidden error
 */
export class ForbiddenError extends AppError {
  constructor(message?: string, details?: Record<string, unknown>) {
    super(message || i18next.t('errors.forbidden'), 'FORBIDDEN', 403, details);
    this.name = 'ForbiddenError';
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(message?: string, details?: Record<string, unknown>) {
    super(message || i18next.t('errors.notFound'), 'NOT_FOUND', 404, details);
    this.name = 'NotFoundError';
  }
}

/**
 * Timeout error
 */
export class TimeoutError extends AppError {
  constructor(message?: string, details?: Record<string, unknown>) {
    super(message || i18next.t('errors.timeoutError'), 'TIMEOUT_ERROR', 408, details);
    this.name = 'TimeoutError';
  }
}

/**
 * Server error
 */
export class ServerError extends AppError {
  constructor(message?: string, details?: Record<string, unknown>) {
    super(message || i18next.t('errors.serverError'), 'SERVER_ERROR', 500, details);
    this.name = 'ServerError';
  }
}

// ============================================================================
// ERROR PARSING
// ============================================================================

/**
 * Parse Axios error to AppError
 */
export function parseAxiosError(error: AxiosError): AppError {
  // Network error (no response)
  if (!error.response) {
    return new NetworkError(undefined, {
      originalError: error.message,
    });
  }
  
  const { status, data } = error.response;
  
  // Extract error message and code from response
  const message = (data as any)?.message || i18next.t('errors.unknownError');
  const code = (data as any)?.code || 'UNKNOWN_ERROR';
  const details = (data as any)?.details;
  
  // Map status codes to specific errors
  switch (status) {
    case 400:
      return new ValidationError(message, details);
    case 401:
      return new AuthorizationError(message, details);
    case 403:
      return new ForbiddenError(message, details);
    case 404:
      return new NotFoundError(message, details);
    case 408:
      return new TimeoutError(message, details);
    case 500:
    case 502:
    case 503:
    case 504:
      return new ServerError(message, details);
    default:
      return new ApiError(message, code, status, details);
  }
}

/**
 * Parse unknown error to AppError
 */
export function parseError(error: unknown): AppError {
  // Already an AppError
  if (error instanceof AppError) {
    return error;
  }
  
  // Axios error
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    return parseAxiosError(error as AxiosError);
  }
  
  // Standard Error
  if (error instanceof Error) {
    return new AppError(
      error.message || i18next.t('errors.unknownError'),
      'UNKNOWN_ERROR',
      undefined,
      { originalError: error.name, stack: error.stack }
    );
  }
  
  // Unknown error type
  return new AppError(
    i18next.t('errors.unknownError'),
    'UNKNOWN_ERROR',
    undefined,
    { originalError: String(error) }
  );
}

// ============================================================================
// ERROR HANDLING FUNCTIONS
// ============================================================================

/**
 * Handle error with logging and user notification
 */
export function handleError(error: unknown, context?: string): AppError {
  const appError = parseError(error);
  
  // Log error
  logger.error(context || 'Error occurred', appError, {
    code: appError.code,
    statusCode: appError.statusCode,
    details: appError.details,
  });
  
  // Show toast notification
  showError(appError.message);
  
  return appError;
}

/**
 * Handle error silently (log only, no toast)
 */
export function handleErrorSilently(error: unknown, context?: string): AppError {
  const appError = parseError(error);
  
  // Log error
  logger.error(context || 'Silent error', appError, {
    code: appError.code,
    statusCode: appError.statusCode,
    details: appError.details,
  });
  
  return appError;
}

/**
 * Handle critical error (log + notify + report to monitoring)
 */
export function handleCriticalError(error: unknown, context?: string): AppError {
  const appError = parseError(error);
  
  // Log as critical
  logger.error(`[CRITICAL] ${context || 'Critical error'}`, appError, {
    code: appError.code,
    statusCode: appError.statusCode,
    details: appError.details,
    isCritical: true,
  });
  
  // Show error toast
  showError(appError.message);
  
  // ✅ Error Monitoring Integration - Ready for Sentry/DataDog
  // When ready: import * as Sentry from '@sentry/react';
  // Sentry.captureException(error, { contexts, extra: logContext });
  // reportToSentry(appError);
  
  return appError;
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    onRetry,
  } = options;
  
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxRetries) {
        const delay = Math.min(initialDelay * Math.pow(backoffFactor, attempt), maxDelay);
        
        if (onRetry) {
          onRetry(attempt + 1, lastError);
        }
        
        logger.warn(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`, {
          error: lastError.message,
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}

/**
 * Wrap async function with error handling
 * 
 * Generic wrapper for adding automatic error handling to async functions
 */
export function withErrorHandling<
  TArgs extends unknown[],
  TReturn
>(
  fn: (...args: TArgs) => Promise<TReturn>,
  context?: string
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs): Promise<TReturn> => {
    try {
      return await fn(...args);
    } catch (error) {
      throw handleError(error, context);
    }
  };
}

/**
 * Create safe async function that returns Result type
 */
export function createSafeAsync<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  context?: string
): (...args: Args) => Promise<{ success: true; data: T } | { success: false; error: AppError }> {
  return async (...args: Args) => {
    try {
      const data = await fn(...args);
      return { success: true, data };
    } catch (error) {
      const appError = handleError(error, context);
      return { success: false, error: appError };
    }
  };
}

// ============================================================================
// ERROR RECOVERY
// ============================================================================

/**
 * Error recovery strategies
 */
export interface ErrorRecoveryStrategy {
  canRecover: (error: AppError) => boolean;
  recover: () => Promise<void> | void;
}

/**
 * Unauthorized error recovery (redirect to login)
 */
export const unauthorizedRecovery: ErrorRecoveryStrategy = {
  canRecover: (error) => error instanceof AuthorizationError,
  recover: () => {
    // Clear auth state
    localStorage.removeItem('auth_token');
    
    // Redirect to login
    window.location.href = '/login';
  },
};

/**
 * Network error recovery (retry)
 */
export const networkErrorRecovery: ErrorRecoveryStrategy = {
  canRecover: (error) => error instanceof NetworkError,
  recover: async () => {
    // Wait and retry
    await new Promise(resolve => setTimeout(resolve, 2000));
  },
};

/**
 * Attempt error recovery
 */
export async function attemptErrorRecovery(
  error: AppError,
  strategies: ErrorRecoveryStrategy[] = [unauthorizedRecovery, networkErrorRecovery]
): Promise<boolean> {
  for (const strategy of strategies) {
    if (strategy.canRecover(error)) {
      try {
        await strategy.recover();
        return true;
      } catch (recoveryError) {
        logger.error('Error recovery failed', recoveryError as Error);
      }
    }
  }
  
  return false;
}

// ============================================================================
// ERROR BOUNDARIES
// ============================================================================

/**
 * Global error handler for unhandled errors
 */
export function setupGlobalErrorHandler(): void {
  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    handleCriticalError(event.reason, 'Unhandled Promise Rejection');
  });
  
  // Global errors
  window.addEventListener('error', (event) => {
    event.preventDefault();
    handleCriticalError(event.error, 'Global Error');
  });
}

