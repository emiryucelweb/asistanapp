/**
 * Logger Utility Tests
 * Enterprise-grade tests for production-ready logger
 * 
 * @group utils
 * @group logging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { logger, measurePerf, measurePerfAsync, createScopedLogger, devLog } from '../logger';
import * as tracing from '../tracing';

// Mock console methods
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  group: console.group,
  groupCollapsed: console.groupCollapsed,
  groupEnd: console.groupEnd,
  table: console.table,
};

// Mock tracing module
vi.mock('../tracing', () => ({
  getOrCreateTraceId: vi.fn(() => 'trace-123'),
}));

describe('Logger - Enterprise Grade Tests', () => {
  beforeEach(() => {
    // Mock all console methods
    console.log = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();
    console.group = vi.fn();
    console.groupCollapsed = vi.fn();
    console.groupEnd = vi.fn();
    console.table = vi.fn();
    
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore console methods
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    console.group = originalConsole.group;
    console.groupCollapsed = originalConsole.groupCollapsed;
    console.groupEnd = originalConsole.groupEnd;
    console.table = originalConsole.table;
  });

  describe('Debug Logging', () => {
    it('should log debug message in development', () => {
      logger.debug('Debug message');
      
      expect(console.log).toHaveBeenCalled();
      const call = (console.log as any).mock.calls[0];
      expect(call[0]).toContain('[DEBUG]');
      expect(call[0]).toContain('Debug message'); // Format string contains message
    });

    it('should include context in debug logs', () => {
      logger.debug('Debug with context', { userId: 'user-123' });
      
      expect(console.log).toHaveBeenCalled();
      const call = (console.log as any).mock.calls[0];
      const context = call[3];
      expect(context).toHaveProperty('userId', 'user-123');
      expect(context).toHaveProperty('timestamp');
      expect(context).toHaveProperty('sessionId');
    });

    it('should include traceId from tracing module', () => {
      logger.debug('Debug with trace');
      
      const call = (console.log as any).mock.calls[0];
      const context = call[3];
      expect(context).toHaveProperty('traceId', 'trace-123');
    });
  });

  describe('Info Logging', () => {
    it('should log info message in development', () => {
      logger.info('Info message');
      
      expect(console.log).toHaveBeenCalled();
      const call = (console.log as any).mock.calls[0];
      expect(call[0]).toContain('[INFO]');
      expect(call[0]).toContain('Info message'); // Format string contains message
    });

    it('should include context in info logs', () => {
      logger.info('Info with context', { action: 'user_login' });
      
      const call = (console.log as any).mock.calls[0];
      const context = call[3];
      expect(context).toHaveProperty('action', 'user_login');
      expect(context).toHaveProperty('timestamp');
    });
  });

  describe('Warning Logging', () => {
    it('should log warning message', () => {
      logger.warn('Warning message');
      
      expect(console.warn).toHaveBeenCalled();
      const call = (console.warn as any).mock.calls[0];
      expect(call[0]).toContain('[WARN]');
      expect(call[0]).toContain('Warning message'); // Format string contains message
    });

    it('should include context in warning logs', () => {
      logger.warn('Warning with context', { reason: 'deprecated_api' });
      
      const call = (console.warn as any).mock.calls[0];
      const context = call[3];
      expect(context).toHaveProperty('reason', 'deprecated_api');
    });
  });

  describe('Error Logging', () => {
    it('should log error message', () => {
      logger.error('Error message');
      
      expect(console.error).toHaveBeenCalled();
      const call = (console.error as any).mock.calls[0];
      expect(call[0]).toContain('[ERROR]');
      expect(call[0]).toContain('Error message'); // Format string contains message
    });

    it('should log error with Error instance', () => {
      const error = new Error('Test error');
      logger.error('Error occurred', error);
      
      expect(console.error).toHaveBeenCalled();
      const call = (console.error as any).mock.calls[0];
      const context = call[3];
      expect(context.error).toHaveProperty('name', 'Error');
      expect(context.error).toHaveProperty('message', 'Test error');
      expect(context.error).toHaveProperty('stack');
    });

    it('should log error with non-Error value', () => {
      logger.error('Error occurred', 'string error');
      
      expect(console.error).toHaveBeenCalled();
      const call = (console.error as any).mock.calls[0];
      const context = call[3];
      expect(context.error).toBe('string error');
    });

    it('should include context in error logs', () => {
      const error = new Error('API error');
      logger.error('API request failed', error, { endpoint: '/api/users' });
      
      const call = (console.error as any).mock.calls[0];
      const context = call[3];
      expect(context).toHaveProperty('endpoint', '/api/users');
      expect(context).toHaveProperty('error');
    });
  });

  describe('API Logging', () => {
    it('should log API request with method and URL', () => {
      logger.api('GET', '/api/users');
      
      expect(console.log).toHaveBeenCalled();
      const call = (console.log as any).mock.calls[0];
      expect(call[0]).toContain('[API]');
      expect(call[0]).toContain('GET');
      expect(call[0]).toContain('/api/users');
    });

    it('should log API request with status and duration', () => {
      logger.api('POST', '/api/users', 201, 150);
      
      expect(console.log).toHaveBeenCalled();
      const call = (console.log as any).mock.calls[0];
      const details = call[2];
      expect(details).toHaveProperty('status', 201);
      expect(details).toHaveProperty('duration', '150ms');
    });

    it('should use different colors for different status codes', () => {
      logger.api('GET', '/success', 200);
      logger.api('GET', '/error', 500);
      
      expect(console.log).toHaveBeenCalledTimes(2);
      // Success: green, Error: red (in style parameter)
      const call1 = (console.log as any).mock.calls[0];
      const call2 = (console.log as any).mock.calls[1];
      expect(call1[1]).toContain('#10b981'); // Green for 2xx
      expect(call2[1]).toContain('#ef4444'); // Red for 4xx/5xx
    });
  });

  describe('WebSocket Logging', () => {
    it('should log websocket event', () => {
      logger.ws('connection_opened');
      
      expect(console.log).toHaveBeenCalled();
      const call = (console.log as any).mock.calls[0];
      expect(call[0]).toContain('[WS]');
      expect(call[0]).toContain('connection_opened');
    });

    it('should log websocket event with data', () => {
      logger.ws('message_received', { type: 'chat', id: '123' });
      
      expect(console.log).toHaveBeenCalled();
      const call = (console.log as any).mock.calls[0];
      const data = call[2];
      expect(data).toHaveProperty('type', 'chat');
      expect(data).toHaveProperty('id', '123');
    });

    it('should support deprecated websocket() method', () => {
      logger.websocket('deprecated_event');
      
      expect(console.log).toHaveBeenCalled();
      const call = (console.log as any).mock.calls[0];
      expect(call[0]).toContain('[WS]');
      expect(call[0]).toContain('deprecated_event');
    });
  });

  describe('Performance Logging', () => {
    it('should log performance measurement', () => {
      const startTime = performance.now() - 100; // Simulate 100ms ago
      logger.perf('database_query', startTime);
      
      expect(console.log).toHaveBeenCalled();
      const call = (console.log as any).mock.calls[0];
      expect(call[0]).toContain('[PERF]');
      expect(call[0]).toContain('database_query');
      expect(call[2]).toMatch(/ms$/);
    });
  });

  describe('Authentication Logging', () => {
    it('should log authentication event', () => {
      logger.auth('login_success');
      
      expect(console.log).toHaveBeenCalled();
      const call = (console.log as any).mock.calls[0];
      expect(call[0]).toContain('[AUTH]');
      expect(call[0]).toContain('login_success');
    });

    it('should log authentication event with context', () => {
      logger.auth('login_failed', { reason: 'invalid_password' });
      
      const call = (console.log as any).mock.calls[0];
      const context = call[2];
      expect(context).toHaveProperty('reason', 'invalid_password');
    });
  });

  describe('Log Grouping', () => {
    it('should create a log group', () => {
      logger.group('API Requests');
      
      expect(console.group).toHaveBeenCalledWith('API Requests');
    });

    it('should create a collapsed log group', () => {
      logger.group('Debug Info', true);
      
      expect(console.groupCollapsed).toHaveBeenCalledWith('Debug Info');
    });

    it('should end a log group', () => {
      logger.groupEnd();
      
      expect(console.groupEnd).toHaveBeenCalled();
    });
  });

  describe('Table Display', () => {
    it('should display data as table', () => {
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];
      
      logger.table(data);
      
      expect(console.table).toHaveBeenCalledWith(data);
    });
  });

  describe('Context Enrichment', () => {
    it('should enrich context with timestamp', () => {
      logger.debug('Test', { custom: 'value' });
      
      const call = (console.log as any).mock.calls[0];
      const context = call[3];
      expect(context).toHaveProperty('timestamp');
      expect(context.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should enrich context with sessionId', () => {
      logger.debug('Test');
      
      const call = (console.log as any).mock.calls[0];
      const context = call[3];
      expect(context).toHaveProperty('sessionId');
      expect(context.sessionId).toMatch(/^session-/);
    });

    it('should preserve custom context properties', () => {
      logger.debug('Test', { 
        userId: 'user-123', 
        action: 'click',
        custom: { nested: true }
      });
      
      const call = (console.log as any).mock.calls[0];
      const context = call[3];
      expect(context).toHaveProperty('userId', 'user-123');
      expect(context).toHaveProperty('action', 'click');
      expect(context.custom).toEqual({ nested: true });
    });

    it('should handle tracing error gracefully', () => {
      vi.mocked(tracing.getOrCreateTraceId).mockImplementation(() => {
        throw new Error('Tracing failed');
      });

      // Should not throw
      expect(() => logger.debug('Test')).not.toThrow();
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('Performance Measurement Helpers', () => {
    it('should measure synchronous function performance', () => {
      const result = measurePerf('test_operation', () => {
        return 42;
      });
      
      expect(result).toBe(42);
      expect(console.log).toHaveBeenCalled();
      const call = (console.log as any).mock.calls[0];
      expect(call[0]).toContain('[PERF]');
      expect(call[0]).toContain('test_operation');
    });

    it('should measure async function performance', async () => {
      const result = await measurePerfAsync('async_operation', async () => {
        return 'done';
      });
      
      expect(result).toBe('done');
      expect(console.log).toHaveBeenCalled();
      const call = (console.log as any).mock.calls[0];
      expect(call[0]).toContain('[PERF]');
      expect(call[0]).toContain('async_operation');
    });

    it('should preserve thrown errors in measurePerf', () => {
      expect(() => {
        measurePerf('failing_operation', () => {
          throw new Error('Operation failed');
        });
      }).toThrow('Operation failed');
    });

    it('should preserve thrown errors in measurePerfAsync', async () => {
      await expect(
        measurePerfAsync('failing_async', async () => {
          throw new Error('Async failed');
        })
      ).rejects.toThrow('Async failed');
    });
  });

  describe('Scoped Logger', () => {
    it('should create scoped logger with prefix', () => {
      const scopedLogger = createScopedLogger('API');
      
      scopedLogger.debug('Request sent');
      
      expect(console.log).toHaveBeenCalled();
      const call = (console.log as any).mock.calls[0];
      expect(call[0]).toContain('[API]');
      expect(call[0]).toContain('Request sent');
    });

    it('should support all log levels in scoped logger', () => {
      const scopedLogger = createScopedLogger('TEST');
      
      scopedLogger.debug('Debug');
      scopedLogger.info('Info');
      scopedLogger.warn('Warn');
      scopedLogger.error('Error');
      
      expect(console.log).toHaveBeenCalledTimes(2); // debug + info
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledTimes(1);
    });

    it('should pass context through scoped logger', () => {
      const scopedLogger = createScopedLogger('DB');
      
      scopedLogger.info('Query executed', { query: 'SELECT *' });
      
      const call = (console.log as any).mock.calls[0];
      const context = call[3];
      expect(context).toHaveProperty('query', 'SELECT *');
    });
  });

  describe('DevLog Utility', () => {
    it('should log only in development', () => {
      devLog.only('Development message');
      
      // In test environment (DEV), should log
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty message', () => {
      logger.debug('');
      
      expect(console.log).toHaveBeenCalled();
      const call = (console.log as any).mock.calls[0];
      expect(call[0]).toContain('[DEBUG]'); // Format contains DEBUG tag
    });

    it('should handle very long messages', () => {
      const longMessage = 'A'.repeat(10000);
      logger.debug(longMessage);
      
      expect(console.log).toHaveBeenCalled();
      const call = (console.log as any).mock.calls[0];
      expect(call[0]).toContain('A'); // Format contains part of message
    });

    it('should handle special characters in messages', () => {
      logger.debug('Special: <>&"\'');
      
      expect(console.log).toHaveBeenCalled();
      const call = (console.log as any).mock.calls[0];
      expect(call[0]).toContain('Special');
    });

    it('should handle null/undefined context', () => {
      logger.debug('Test', undefined);
      logger.debug('Test', null as any);
      
      expect(console.log).toHaveBeenCalledTimes(2);
    });

    it('should handle circular references in context', () => {
      const circular: any = { name: 'test' };
      circular.self = circular;
      
      // Should not throw
      expect(() => logger.debug('Circular', circular)).not.toThrow();
    });

    it('should handle error without stack', () => {
      const error = new Error('No stack');
      delete error.stack;
      
      logger.error('Error', error);
      
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle API call without status or duration', () => {
      logger.api('GET', '/api/test');
      
      expect(console.log).toHaveBeenCalled();
      const call = (console.log as any).mock.calls[0];
      const details = call[2];
      expect(details.duration).toBe('N/A');
    });
  });

  describe('Singleton Instance', () => {
    it('should maintain session ID across multiple calls', () => {
      logger.debug('First');
      logger.debug('Second');
      
      const call1 = (console.log as any).mock.calls[0];
      const call2 = (console.log as any).mock.calls[1];
      
      const sessionId1 = call1[3].sessionId;
      const sessionId2 = call2[3].sessionId;
      
      expect(sessionId1).toBe(sessionId2);
    });
  });
});

