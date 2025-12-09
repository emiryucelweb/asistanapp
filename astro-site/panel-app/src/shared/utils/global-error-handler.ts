/**
 * Global Error Handler
 * Catches unhandled errors and promise rejections
 * 
 * @module shared/utils/global-error-handler
 */

import { logger } from './logger';
import { showError } from './toast';

/**
 * Error types for categorization
 */
export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  AUTH = 'AUTH_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  RUNTIME = 'RUNTIME_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR',
}

/**
 * Categorize error by type
 */
export function categorizeError(error: Error): ErrorType {
  const message = error.message.toLowerCase();
  
  if (message.includes('network') || message.includes('fetch')) {
    return ErrorType.NETWORK;
  }
  
  if (message.includes('unauthorized') || message.includes('401') || message.includes('403')) {
    return ErrorType.AUTH;
  }
  
  if (message.includes('validation') || message.includes('invalid')) {
    return ErrorType.VALIDATION;
  }
  
  return ErrorType.RUNTIME;
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: Error, errorType: ErrorType): string {
  switch (errorType) {
    case ErrorType.NETWORK:
      return 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.';
    
    case ErrorType.AUTH:
      return 'Oturumunuzun süresi dolmuş olabilir. Lütfen tekrar giriş yapın.';
    
    case ErrorType.VALIDATION:
      return 'Lütfen girdiğiniz bilgileri kontrol edin.';
    
    case ErrorType.RUNTIME:
      return 'Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin.';
    
    default:
      return 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
  }
}

/**
 * Handle unhandled error
 */
export function handleUnhandledError(error: Error, context?: string): void {
  const errorType = categorizeError(error);
  const userMessage = getUserFriendlyMessage(error, errorType);
  
  // Log error
  logger.error('Unhandled error', error, {
    errorType,
    context,
    userAgent: navigator.userAgent,
    url: window.location.href,
  });
  
  // Show user-friendly toast
  showError(userMessage);
  
  // ✅ Send to error monitoring service
  // When ready: Sentry.captureException(error, { tags: { errorType, context } });
}

/**
 * Handle unhandled promise rejection
 */
export function handleUnhandledRejection(event: PromiseRejectionEvent): void {
  const error = event.reason instanceof Error 
    ? event.reason 
    : new Error(String(event.reason));
  
  handleUnhandledError(error, 'Promise Rejection');
  
  // Prevent default console error
  event.preventDefault();
}

/**
 * Setup global error handlers
 */
export function setupGlobalErrorHandlers(): void {
  // Handle unhandled errors
  window.addEventListener('error', (event) => {
    handleUnhandledError(event.error, 'Global Error');
    event.preventDefault();
  });
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
  
  logger.info('Global error handlers initialized');
}

/**
 * Cleanup global error handlers
 */
export function cleanupGlobalErrorHandlers(): void {
  window.removeEventListener('error', (event) => {
    handleUnhandledError(event.error, 'Global Error');
  });
  
  window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  
  logger.info('Global error handlers cleaned up');
}

/**
 * Error recovery strategies
 */
export const errorRecovery = {
  /**
   * Retry with exponential backoff
   */
  async retry<T>(
    fn: () => Promise<T>,
    options: {
      maxAttempts?: number;
      initialDelay?: number;
      maxDelay?: number;
      onRetry?: (attempt: number, error: Error) => void;
    } = {}
  ): Promise<T> {
    const {
      maxAttempts = 3,
      initialDelay = 1000,
      maxDelay = 10000,
      onRetry,
    } = options;
    
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt === maxAttempts) {
          break;
        }
        
        const delay = Math.min(initialDelay * Math.pow(2, attempt - 1), maxDelay);
        
        if (onRetry) {
          onRetry(attempt, lastError);
        }
        
        logger.warn(`Retry attempt ${attempt}/${maxAttempts} after ${delay}ms`, lastError);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  },
  
  /**
   * Fallback to default value on error
   */
  async withFallback<T>(
    fn: () => Promise<T>,
    fallback: T
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      logger.warn('Error occurred, using fallback', error as Error);
      return fallback;
    }
  },
  
  /**
   * Circuit breaker pattern
   */
  createCircuitBreaker<T>(
    fn: () => Promise<T>,
    options: {
      failureThreshold?: number;
      resetTimeout?: number;
    } = {}
  ) {
    const { failureThreshold = 5, resetTimeout = 60000 } = options;
    
    let failures = 0;
    let lastFailureTime: number | null = null;
    let isOpen = false;
    
    return async (): Promise<T> => {
      // Reset if timeout passed
      if (isOpen && lastFailureTime && Date.now() - lastFailureTime > resetTimeout) {
        isOpen = false;
        failures = 0;
        logger.info('Circuit breaker reset');
      }
      
      // Circuit is open, fail fast
      if (isOpen) {
        throw new Error('Circuit breaker is open');
      }
      
      try {
        const result = await fn();
        // Success, reset failures
        failures = 0;
        return result;
      } catch (error) {
        failures++;
        lastFailureTime = Date.now();
        
        if (failures >= failureThreshold) {
          isOpen = true;
          logger.error('Circuit breaker opened', error as Error, { failures });
        }
        
        throw error;
      }
    };
  },
};

