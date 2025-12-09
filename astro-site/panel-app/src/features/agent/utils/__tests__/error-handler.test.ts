/**
 * Error Handler Tests - ENTERPRISE GRADE
 * 
 * Comprehensive tests for error handling, parsing, recovery, and monitoring
 * 
 * @group utils
 * @group agent
 * @group error-handling
 * 
 * ALTIN KURALLAR:
 * ✅ AAA Pattern (Arrange-Act-Assert)
 * ✅ Tek test → tek davranış
 * ✅ Deterministik testler
 * ✅ Mock disiplini (minimal, realistic)
 * ✅ State izolasyonu
 * ✅ Minimal test data
 * ✅ Positive + Negative tests
 * ✅ Factory pattern
 * ✅ Critical infrastructure testing
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AxiosError } from 'axios';
import {
  // Error Classes
  AppError,
  NetworkError,
  ApiError,
  ValidationError,
  AuthorizationError,
  ForbiddenError,
  NotFoundError,
  TimeoutError,
  ServerError,
  // Parsing
  parseAxiosError,
  parseError,
  // Handling
  handleError,
  handleErrorSilently,
  handleCriticalError,
  // Retry
  retryWithBackoff,
  // Wrappers
  withErrorHandling,
  createSafeAsync,
  // Recovery
  attemptErrorRecovery,
  unauthorizedRecovery,
  networkErrorRecovery,
  setupGlobalErrorHandler,
} from '../error-handler';

// ============================================================================
// MOCKS
// ============================================================================

// Mock logger
vi.mock('@/shared/utils/logger', () => {
  const mockLogger = {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };
  
  return {
    logger: mockLogger,
  };
});

// Mock toast
vi.mock('@/shared/utils/toast', () => ({
  showError: vi.fn(),
  showSuccess: vi.fn(),
}));

// Mock i18next
vi.mock('i18next', () => ({
  default: {
    t: vi.fn((key: string) => {
      const translations: Record<string, string> = {
        'errors.networkError': 'Network error',
        'errors.validationError': 'Validation error',
        'errors.unauthorized': 'Unauthorized',
        'errors.forbidden': 'Forbidden',
        'errors.notFound': 'Not found',
        'errors.timeoutError': 'Timeout error',
        'errors.serverError': 'Server error',
        'errors.unknownError': 'Unknown error',
      };
      return translations[key] || key;
    }),
  },
}));

// Get mocked modules for assertions
import { logger } from '@/shared/utils/logger';
import { showError } from '@/shared/utils/toast';
import i18next from 'i18next';

// ============================================================================
// TEST FACTORIES
// ============================================================================

/**
 * Factory: Create mock Axios error
 */
const createAxiosError = (
  status: number,
  data?: any,
  message = 'Request failed'
): AxiosError => {
  const error = new Error(message) as AxiosError;
  error.isAxiosError = true;
  error.response = {
    status,
    data: data || {},
    statusText: 'Error',
    headers: {},
    config: {} as any,
  };
  return error;
};

/**
 * Factory: Create mock network error (no response)
 */
const createNetworkAxiosError = (): AxiosError => {
  const error = new Error('Network Error') as AxiosError;
  error.isAxiosError = true;
  error.response = undefined;
  return error;
};

// ============================================================================
// ERROR CLASSES TESTS
// ============================================================================

describe('ErrorHandler - Error Classes', () => {
  it('should create AppError with all properties', () => {
    // Arrange & Act
    const error = new AppError('Test error', 'TEST_ERROR', 500, { detail: 'test' });

    // Assert
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('AppError');
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_ERROR');
    expect(error.statusCode).toBe(500);
    expect(error.details).toEqual({ detail: 'test' });
  });

  it('should create NetworkError with default message', () => {
    // Arrange & Act
    const error = new NetworkError();

    // Assert
    expect(error).toBeInstanceOf(AppError);
    expect(error.name).toBe('NetworkError');
    expect(error.message).toBe('Network error');
    expect(error.code).toBe('NETWORK_ERROR');
  });

  it('should create NetworkError with custom message', () => {
    // Arrange & Act
    const error = new NetworkError('Custom network error');

    // Assert
    expect(error.message).toBe('Custom network error');
  });

  it('should create ValidationError with status 400', () => {
    // Arrange & Act
    const error = new ValidationError();

    // Assert
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('VALIDATION_ERROR');
  });

  it('should create AuthorizationError with status 401', () => {
    // Arrange & Act
    const error = new AuthorizationError();

    // Assert
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe('UNAUTHORIZED');
  });

  it('should create ForbiddenError with status 403', () => {
    // Arrange & Act
    const error = new ForbiddenError();

    // Assert
    expect(error.statusCode).toBe(403);
    expect(error.code).toBe('FORBIDDEN');
  });

  it('should create NotFoundError with status 404', () => {
    // Arrange & Act
    const error = new NotFoundError();

    // Assert
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
  });

  it('should create TimeoutError with status 408', () => {
    // Arrange & Act
    const error = new TimeoutError();

    // Assert
    expect(error.statusCode).toBe(408);
    expect(error.code).toBe('TIMEOUT_ERROR');
  });

  it('should create ServerError with status 500', () => {
    // Arrange & Act
    const error = new ServerError();

    // Assert
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe('SERVER_ERROR');
  });
});

// ============================================================================
// ERROR PARSING TESTS
// ============================================================================

describe('ErrorHandler - Error Parsing', () => {
  describe('parseAxiosError', () => {
    it('should parse network error (no response)', () => {
      // Arrange
      const axiosError = createNetworkAxiosError();

      // Act
      const result = parseAxiosError(axiosError);

      // Assert
      expect(result.name).toBe('NetworkError');
      expect(result.code).toBe('NETWORK_ERROR');
      expect(result.message).toBe('Network error');
    });

    it('should parse 400 as ValidationError', () => {
      // Arrange
      const axiosError = createAxiosError(400, { message: 'Invalid data' });

      // Act
      const result = parseAxiosError(axiosError);

      // Assert
      expect(result.name).toBe('ValidationError');
      expect(result.code).toBe('VALIDATION_ERROR');
      expect(result.statusCode).toBe(400);
      expect(result.message).toBe('Invalid data');
    });

    it('should parse 401 as AuthorizationError', () => {
      // Arrange
      const axiosError = createAxiosError(401, { message: 'Unauthorized' });

      // Act
      const result = parseAxiosError(axiosError);

      // Assert
      expect(result.name).toBe('AuthorizationError');
      expect(result.code).toBe('UNAUTHORIZED');
      expect(result.statusCode).toBe(401);
    });

    it('should parse 403 as ForbiddenError', () => {
      // Arrange
      const axiosError = createAxiosError(403);

      // Act
      const result = parseAxiosError(axiosError);

      // Assert
      expect(result.name).toBe('ForbiddenError');
      expect(result.code).toBe('FORBIDDEN');
      expect(result.statusCode).toBe(403);
    });

    it('should parse 404 as NotFoundError', () => {
      // Arrange
      const axiosError = createAxiosError(404);

      // Act
      const result = parseAxiosError(axiosError);

      // Assert
      expect(result.name).toBe('NotFoundError');
      expect(result.code).toBe('NOT_FOUND');
      expect(result.statusCode).toBe(404);
    });

    it('should parse 408 as TimeoutError', () => {
      // Arrange
      const axiosError = createAxiosError(408);

      // Act
      const result = parseAxiosError(axiosError);

      // Assert
      expect(result.name).toBe('TimeoutError');
      expect(result.code).toBe('TIMEOUT_ERROR');
      expect(result.statusCode).toBe(408);
    });

    it('should parse 500 as ServerError', () => {
      // Arrange
      const axiosError = createAxiosError(500);

      // Act
      const result = parseAxiosError(axiosError);

      // Assert
      expect(result.name).toBe('ServerError');
      expect(result.code).toBe('SERVER_ERROR');
      expect(result.statusCode).toBe(500);
    });

    it('should parse 502 as ServerError', () => {
      // Arrange
      const axiosError = createAxiosError(502);

      // Act
      const result = parseAxiosError(axiosError);

      // Assert
      expect(result.name).toBe('ServerError');
      expect(result.code).toBe('SERVER_ERROR');
      // ServerError constructor sets statusCode to 500 by default
      expect(result.statusCode).toBe(500);
    });

    it('should parse unknown status as ApiError', () => {
      // Arrange
      const axiosError = createAxiosError(418, { message: 'I am a teapot', code: 'TEAPOT' });

      // Act
      const result = parseAxiosError(axiosError);

      // Assert
      expect(result.name).toBe('ApiError');
      expect(result.code).toBe('TEAPOT');
      expect(result.statusCode).toBe(418);
    });
  });

  describe('parseError', () => {
    it('should return AppError as-is', () => {
      // Arrange
      const appError = new AppError('Test', 'TEST', 500);

      // Act
      const result = parseError(appError);

      // Assert
      expect(result).toBe(appError);
    });

    it('should parse Axios error', () => {
      // Arrange
      const axiosError = createAxiosError(400);

      // Act
      const result = parseError(axiosError);

      // Assert
      expect(result.name).toBe('ValidationError');
      expect(result.code).toBe('VALIDATION_ERROR');
    });

    it('should parse standard Error', () => {
      // Arrange
      const error = new Error('Standard error');

      // Act
      const result = parseError(error);

      // Assert
      expect(result).toBeInstanceOf(AppError);
      expect(result.message).toBe('Standard error');
      expect(result.code).toBe('UNKNOWN_ERROR');
    });

    it('should parse string error', () => {
      // Arrange
      const error = 'String error';

      // Act
      const result = parseError(error);

      // Assert
      expect(result).toBeInstanceOf(AppError);
      expect(result.code).toBe('UNKNOWN_ERROR');
    });

    it('should parse null/undefined error', () => {
      // Arrange & Act
      const result = parseError(null);

      // Assert
      expect(result).toBeInstanceOf(AppError);
      expect(result.message).toBe('Unknown error');
    });
  });
});

// ============================================================================
// ERROR HANDLING TESTS
// ============================================================================

describe('ErrorHandler - Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleError', () => {
    it('should log error and show toast', () => {
      // Arrange
      const error = new AppError('Test error', 'TEST', 500);

      // Act
      const result = handleError(error, 'Test context');

      // Assert
      expect(logger.error).toHaveBeenCalledWith(
        'Test context',
        error,
        expect.objectContaining({
          code: 'TEST',
          statusCode: 500,
        })
      );
      expect(showError).toHaveBeenCalledWith('Test error');
      expect(result).toBe(error);
    });

    it('should use default context if not provided', () => {
      // Arrange
      const error = new NetworkError();

      // Act
      handleError(error);

      // Assert
      expect(logger.error).toHaveBeenCalledWith(
        'Error occurred',
        expect.objectContaining({
          name: 'NetworkError',
          code: 'NETWORK_ERROR',
        }),
        expect.any(Object)
      );
    });
  });

  describe('handleErrorSilently', () => {
    it('should log error without showing toast', () => {
      // Arrange
      const error = new ValidationError('Silent error');

      // Act
      const result = handleErrorSilently(error, 'Silent context');

      // Assert
      expect(logger.error).toHaveBeenCalledWith(
        'Silent context',
        error,
        expect.any(Object)
      );
      expect(showError).not.toHaveBeenCalled();
      expect(result).toBe(error);
    });
  });

  describe('handleCriticalError', () => {
    it('should log as critical, show toast, and prepare for monitoring', () => {
      // Arrange
      const error = new ServerError('Critical failure');

      // Act
      const result = handleCriticalError(error, 'Critical context');

      // Assert
      expect(logger.error).toHaveBeenCalledWith(
        '[CRITICAL] Critical context',
        error,
        expect.objectContaining({
          isCritical: true,
        })
      );
      expect(showError).toHaveBeenCalledWith('Critical failure');
      expect(result).toBe(error);
    });
  });
});

// ============================================================================
// RETRY LOGIC TESTS
// ============================================================================

describe('ErrorHandler - Retry Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should succeed on first attempt', async () => {
    // Arrange
    const mockFn = vi.fn().mockResolvedValue('success');

    // Act
    const result = await retryWithBackoff(mockFn);

    // Assert
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure and eventually succeed', async () => {
    // Arrange
    const mockFn = vi.fn()
      .mockRejectedValueOnce(new Error('Attempt 1'))
      .mockRejectedValueOnce(new Error('Attempt 2'))
      .mockResolvedValue('success');

    // Act
    const promise = retryWithBackoff(mockFn, { maxRetries: 3, initialDelay: 100 });
    
    // Advance timers for each retry
    await vi.advanceTimersByTimeAsync(100); // First retry delay
    await vi.advanceTimersByTimeAsync(200); // Second retry delay (exponential)

    const result = await promise;

    // Assert
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  it('should throw after max retries', async () => {
    // Arrange
    const mockFn = vi.fn().mockRejectedValue(new Error('Always fails'));

    // Act
    const promise = retryWithBackoff(mockFn, { maxRetries: 2, initialDelay: 100 });
    
    // Advance timers and wait for all promises to settle
    const advancePromise = (async () => {
      await vi.advanceTimersByTimeAsync(100);
      await vi.advanceTimersByTimeAsync(200);
    })();

    // Assert
    await expect(promise).rejects.toThrow('Always fails');
    await advancePromise; // Ensure all timers are processed
    expect(mockFn).toHaveBeenCalledTimes(3); // Initial + 2 retries
  });

  it('should call onRetry callback', async () => {
    // Arrange
    const mockFn = vi.fn()
      .mockRejectedValueOnce(new Error('Fail'))
      .mockResolvedValue('success');
    const onRetry = vi.fn();

    // Act
    const promise = retryWithBackoff(mockFn, { onRetry, initialDelay: 100 });
    await vi.advanceTimersByTimeAsync(100);
    await promise;

    // Assert
    expect(onRetry).toHaveBeenCalledWith(1, expect.any(Error));
  });

  it('should respect maxDelay', async () => {
    // Arrange
    const mockFn = vi.fn()
      .mockRejectedValueOnce(new Error('Fail'))
      .mockResolvedValue('success');

    // Act
    const promise = retryWithBackoff(mockFn, {
      initialDelay: 1000,
      maxDelay: 500,
      backoffFactor: 10,
    });

    await vi.advanceTimersByTimeAsync(500); // Should be capped at maxDelay
    await promise;

    // Assert
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});

// ============================================================================
// ERROR WRAPPERS TESTS
// ============================================================================

describe('ErrorHandler - Error Wrappers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('withErrorHandling', () => {
    it('should return result on success', async () => {
      // Arrange
      const mockFn = vi.fn().mockResolvedValue('success');
      const wrapped = withErrorHandling(mockFn, 'Test context');

      // Act
      const result = await wrapped();

      // Assert
      expect(result).toBe('success');
    });

    it('should handle and throw error', async () => {
      // Arrange
      const mockFn = vi.fn().mockRejectedValue(new Error('Test error'));
      const wrapped = withErrorHandling(mockFn, 'Test context');

      // Act & Assert
      await expect(wrapped()).rejects.toThrow(AppError);
      expect(logger.error).toHaveBeenCalled();
      expect(showError).toHaveBeenCalled();
    });
  });

  describe('createSafeAsync', () => {
    it('should return success result', async () => {
      // Arrange
      const mockFn = vi.fn().mockResolvedValue('data');
      const safeFn = createSafeAsync(mockFn);

      // Act
      const result = await safeFn();

      // Assert
      expect(result).toEqual({ success: true, data: 'data' });
    });

    it('should return error result without throwing', async () => {
      // Arrange
      const mockFn = vi.fn().mockRejectedValue(new Error('Test error'));
      const safeFn = createSafeAsync(mockFn, 'Safe context');

      // Act
      const result = await safeFn();

      // Assert
      expect(result).toEqual({
        success: false,
        error: expect.any(AppError),
      });
      expect(logger.error).toHaveBeenCalled();
    });

    it('should pass arguments correctly', async () => {
      // Arrange
      const mockFn = vi.fn().mockResolvedValue('result');
      const safeFn = createSafeAsync(mockFn);

      // Act
      await safeFn('arg1', 'arg2');

      // Assert
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });
});

// ============================================================================
// ERROR RECOVERY TESTS
// ============================================================================

describe('ErrorHandler - Error Recovery', () => {
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0,
    key: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock localStorage with all required methods
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    });

    // Mock window.location
    delete (window as any).location;
    window.location = { href: '' } as any;
  });

  describe('unauthorizedRecovery', () => {
    it('should have recovery strategy defined', () => {
      // Assert
      expect(unauthorizedRecovery).toBeDefined();
      expect(unauthorizedRecovery.canRecover).toBeInstanceOf(Function);
      expect(unauthorizedRecovery.recover).toBeInstanceOf(Function);
    });

    it('should clear token and redirect to login', () => {
      // Arrange & Act
      unauthorizedRecovery.recover();

      // Assert
      expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(window.location.href).toBe('/login');
    });
  });

  describe('networkErrorRecovery', () => {
    it('should have recovery strategy defined', () => {
      // Assert
      expect(networkErrorRecovery).toBeDefined();
      expect(networkErrorRecovery.canRecover).toBeInstanceOf(Function);
      expect(networkErrorRecovery.recover).toBeInstanceOf(Function);
    });
  });

  describe('attemptErrorRecovery', () => {
    it('should recover using matching strategy', async () => {
      // Arrange
      const error = new AuthorizationError();
      const mockStrategy = {
        canRecover: vi.fn().mockReturnValue(true),
        recover: vi.fn().mockResolvedValue(undefined),
      };

      // Act
      const recovered = await attemptErrorRecovery(error, [mockStrategy]);

      // Assert
      expect(recovered).toBe(true);
      expect(mockStrategy.canRecover).toHaveBeenCalledWith(error);
      expect(mockStrategy.recover).toHaveBeenCalled();
    });

    it('should return false if no strategy matches', async () => {
      // Arrange
      const error = new ServerError();
      const mockStrategy = {
        canRecover: vi.fn().mockReturnValue(false),
        recover: vi.fn(),
      };

      // Act
      const recovered = await attemptErrorRecovery(error, [mockStrategy]);

      // Assert
      expect(recovered).toBe(false);
      expect(mockStrategy.recover).not.toHaveBeenCalled();
    });

    it('should handle recovery failure gracefully', async () => {
      // Arrange
      const error = new NetworkError();
      const mockStrategy = {
        canRecover: vi.fn().mockReturnValue(true),
        recover: vi.fn().mockRejectedValue(new Error('Recovery failed')),
      };

      // Act
      const recovered = await attemptErrorRecovery(error, [mockStrategy]);

      // Assert
      expect(recovered).toBe(false);
      expect(logger.error).toHaveBeenCalledWith('Error recovery failed', expect.any(Error));
    });
  });
});

// ============================================================================
// GLOBAL ERROR HANDLER TESTS
// ============================================================================

describe('ErrorHandler - Global Error Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should setup unhandledrejection listener', () => {
    // Arrange
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

    // Act
    setupGlobalErrorHandler();

    // Assert
    expect(addEventListenerSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function));
  });
});

// ============================================================================
// EDGE CASES & INTEGRATION TESTS
// ============================================================================

describe('ErrorHandler - Edge Cases & Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle circular references in error details', () => {
    // Arrange
    const circular: any = { a: 1 };
    circular.self = circular;
    const error = new AppError('Test', 'TEST', 500, circular);

    // Act
    const result = handleError(error);

    // Assert
    expect(result.name).toBe('AppError');
    expect(result.code).toBe('TEST');
  });

  it('should handle errors with very long messages', () => {
    // Arrange
    const longMessage = 'a'.repeat(10000);
    const error = new AppError(longMessage, 'TEST', 500);

    // Act
    const result = handleError(error);

    // Assert
    expect(result.message).toHaveLength(10000);
  });

  it('should handle errors with special characters', () => {
    // Arrange
    const specialMessage = '<script>alert("xss")</script> 你好 🌍';
    const error = new AppError(specialMessage, 'TEST', 500);

    // Act
    const result = handleError(error);

    // Assert
    expect(result.message).toBe(specialMessage);
  });

  it('should handle multiple concurrent errors', () => {
    // Arrange
    const errors = Array.from({ length: 10 }, (_, i) => new AppError(`Error ${i}`, 'TEST', 500));

    // Act
    errors.forEach(error => handleError(error));

    // Assert
    expect(logger.error).toHaveBeenCalledTimes(10);
    expect(showError).toHaveBeenCalledTimes(10);
  });
});

// ============================================================================
// REAL-WORLD SCENARIO TESTS
// ============================================================================

describe('ErrorHandler - Real-World Scenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should handle API timeout with retry', async () => {
    // Arrange
    const mockApiFn = vi.fn()
      .mockRejectedValueOnce(createAxiosError(408))
      .mockResolvedValue({ data: 'success' });

    // Act
    const promise = retryWithBackoff(mockApiFn, { maxRetries: 1, initialDelay: 100 });
    await vi.advanceTimersByTimeAsync(100);
    const result = await promise;

    // Assert
    expect(result).toEqual({ data: 'success' });
    expect(mockApiFn).toHaveBeenCalledTimes(2);
  });

  it('should handle network error with recovery using mock strategy', async () => {
    // Arrange
    const error = new NetworkError();
    const mockStrategy = {
      canRecover: (err: AppError) => err.code === 'NETWORK_ERROR',
      recover: vi.fn().mockResolvedValue(undefined),
    };

    // Act
    const recovered = await attemptErrorRecovery(error, [mockStrategy]);

    // Assert
    expect(recovered).toBe(true);
    expect(mockStrategy.recover).toHaveBeenCalled();
  });

  it('should handle validation error flow', () => {
    // Arrange
    const axiosError = createAxiosError(400, {
      message: 'Invalid email format',
      details: { field: 'email' },
    });

    // Act
    const parsed = parseAxiosError(axiosError);
    const handled = handleError(parsed, 'User registration');

    // Assert
    expect(handled.name).toBe('ValidationError');
    expect(handled.code).toBe('VALIDATION_ERROR');
    expect(handled.message).toBe('Invalid email format');
    expect(showError).toHaveBeenCalledWith('Invalid email format');
  });
});

