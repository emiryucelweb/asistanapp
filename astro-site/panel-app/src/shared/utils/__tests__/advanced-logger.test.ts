/**
 * Advanced Logger Tests
 * 
 * @group utils
 * @group logging
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { advancedLogger, LogLevel } from '../advanced-logger';

describe('AdvancedLogger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    advancedLogger.clearBuffer();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    advancedLogger.clearBuffer();
  });

  it('logs messages at different levels', () => {
    advancedLogger.debug('Debug message');
    advancedLogger.info('Info message');
    advancedLogger.warn('Warning message');

    const buffer = advancedLogger.getBuffer();
    expect(buffer.length).toBe(3);
  });

  it('includes context in log entries', () => {
    advancedLogger.info('Test message', {
      component: 'TestComponent',
      action: 'test',
    });

    const buffer = advancedLogger.getBuffer();
    expect(buffer[0].context.component).toBe('TestComponent');
    expect(buffer[0].context.action).toBe('test');
  });

  it('captures error details', () => {
    const error = new Error('Test error');
    advancedLogger.error('Error occurred', error);

    const buffer = advancedLogger.getBuffer();
    expect(buffer[0].context.error).toBeDefined();
    expect(buffer[0].context.error.message).toBe('Test error');
  });

  it('manages buffer size', () => {
    // Add more than max buffer size
    for (let i = 0; i < 150; i++) {
      advancedLogger.info(`Message ${i}`);
    }

    const buffer = advancedLogger.getBuffer();
    expect(buffer.length).toBeLessThanOrEqual(100);
  });

  it('exports logs as JSON', () => {
    advancedLogger.info('Test message');
    const exported = advancedLogger.exportLogs();
    expect(exported).toContain('Test message');
    expect(() => JSON.parse(exported)).not.toThrow();
  });

  it('generates unique session IDs', () => {
    const sessionId = advancedLogger.getSessionId();
    expect(sessionId).toMatch(/^session_/);
  });

  // Error Handling Tests
  describe('Error Handling', () => {
    it('should handle error with stack trace', () => {
      // Arrange
      const error = new Error('Test error');
      error.stack = 'Error: Test error\n    at test.ts:10';
      
      // Act
      advancedLogger.error('Error occurred', error);
      
      // Assert
      const buffer = advancedLogger.getBuffer();
      expect(buffer.length).toBe(1);
      expect(buffer[0].context.error.stack).toBeDefined();
    });

    it('should handle error without stack trace', () => {
      // Arrange
      const error = new Error('No stack');
      delete error.stack;
      
      // Act & Assert
      expect(() => advancedLogger.error('Error', error)).not.toThrow();
    });

    it('should handle null context gracefully', () => {
      // Arrange & Act & Assert
      expect(() => advancedLogger.info('Message', null as any)).not.toThrow();
    });

    it('should handle circular reference in context', () => {
      // Arrange
      const circular: any = { name: 'test' };
      circular.self = circular;
      
      // Act & Assert
      expect(() => advancedLogger.info('Circular', circular)).not.toThrow();
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('should handle empty message', () => {
      // Arrange & Act
      advancedLogger.info('');
      
      // Assert
      const buffer = advancedLogger.getBuffer();
      expect(buffer.length).toBe(1);
    });

    it('should handle very long messages', () => {
      // Arrange
      const longMessage = 'A'.repeat(10000);
      
      // Act
      advancedLogger.info(longMessage);
      
      // Assert
      const buffer = advancedLogger.getBuffer();
      expect(buffer[0].message).toBe(longMessage);
    });
  });
});

