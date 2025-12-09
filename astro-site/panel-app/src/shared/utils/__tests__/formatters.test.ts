/**
 * Formatters Utility Tests
 * 
 * @group utils
 * @group formatters
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  formatNumber,
  formatCurrency,
  formatDate,
  formatTime,
  formatDateTime,
  formatDuration,
  formatFileSize,
  getRelativeTime,
} from '../formatters';

describe('Formatters - Enterprise Grade Tests', () => {
  // Store original Intl
  const originalIntl = global.Intl;
  const originalDate = global.Date;
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Set a fixed date for deterministic tests
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

describe('formatNumber', () => {
  it('should format numbers with default locale', () => {
    expect(formatNumber(1000)).toBe('1.000');
    expect(formatNumber(1000000)).toBe('1.000.000');
  });

  it('should format decimals correctly', () => {
    expect(formatNumber(1234.56, 2)).toBe('1.234,56');
    expect(formatNumber(1234.5, 2)).toBe('1.234,50');
  });

  it('should handle zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('should handle negative numbers', () => {
    expect(formatNumber(-1000)).toBe('-1.000');
  });
});

describe('formatCurrency', () => {
  it('should format currency with symbol (default TRY)', () => {
    const result = formatCurrency(1000);
    expect(result).toContain('1.000');
    expect(result).toContain('₺');
  });

  it('should format currency without symbol', () => {
    const result = formatCurrency(1000, false);
    expect(result).toBe('1.000,00');
    expect(result).not.toContain('₺');
  });

  it('should handle zero amount', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });

  it('should handle decimals', () => {
    const result = formatCurrency(1234.56);
    expect(result).toMatch(/1\.234[,.]56/);
  });

  it('should always include 2 decimal places', () => {
    const result = formatCurrency(100);
    expect(result).toBe('₺100,00');
  });
});

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = '2024-01-15T10:30:00Z';
    const result = formatDate(date);
    expect(result).toMatch(/15|01|2024/); // Contains day, month, year
  });

  it('should handle Date object', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('should handle invalid date gracefully', () => {
    const result = formatDate('invalid-date');
    expect(result).toBe('Invalid Date');
  });
});

describe('formatTime', () => {
  it('should format time correctly', () => {
    const date = '2024-01-15T14:30:00Z';
    const result = formatTime(date);
    expect(result).toMatch(/\d{1,2}:\d{2}/); // HH:MM format
  });

  it('should handle Date object', () => {
    const date = new Date('2024-01-15T14:30:00');
    const result = formatTime(date);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});

describe('formatDateTime', () => {
  it('should format date and time together', () => {
    const date = '2024-01-15T14:30:00Z';
    const result = formatDateTime(date);
    expect(result).toBeTruthy();
    expect(result).toContain('2024');
    expect(result.length).toBeGreaterThan(10);
  });

  it('should handle Date object', () => {
    const date = new Date('2024-01-15T14:30:00');
    const result = formatDateTime(date);
    expect(result).toBeTruthy();
  });
});

describe('formatDuration', () => {
  it('should format seconds only (MM:SS)', () => {
    expect(formatDuration(45)).toBe('00:45');
    expect(formatDuration(59)).toBe('00:59');
  });

  it('should format minutes and seconds (MM:SS)', () => {
    expect(formatDuration(90)).toBe('01:30');
    expect(formatDuration(125)).toBe('02:05');
  });

  it('should format with hours when duration exceeds 60 minutes', () => {
    // When duration > 60 minutes, hours are automatically shown
    expect(formatDuration(3661)).toBe('01:01:01');
    expect(formatDuration(7200)).toBe('02:00:00');
  });

  it('should format with hours when showHours is true', () => {
    expect(formatDuration(3661, true)).toBe('01:01:01');
    expect(formatDuration(7200, true)).toBe('02:00:00');
  });

  it('should handle zero', () => {
    expect(formatDuration(0)).toBe('00:00');
  });

  it('should pad numbers with leading zeros', () => {
    expect(formatDuration(5)).toBe('00:05');
    expect(formatDuration(65)).toBe('01:05');
  });
});

describe('formatFileSize', () => {
  it('should format bytes', () => {
    expect(formatFileSize(500)).toBe('500 Bytes');
    expect(formatFileSize(1023)).toBe('1023 Bytes');
  });

  it('should format kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(2048)).toBe('2 KB');
  });

  it('should format megabytes', () => {
    expect(formatFileSize(1048576)).toBe('1 MB');
    expect(formatFileSize(5242880)).toBe('5 MB');
  });

  it('should format gigabytes', () => {
    expect(formatFileSize(1073741824)).toBe('1 GB');
    expect(formatFileSize(2147483648)).toBe('2 GB');
  });

  it('should format terabytes', () => {
    expect(formatFileSize(1099511627776)).toBe('1 TB');
  });

  it('should handle zero', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
  });

  it('should respect decimal places', () => {
    expect(formatFileSize(1536, 0)).toBe('2 KB');
    expect(formatFileSize(1536, 1)).toBe('1.5 KB');
  });

  it('should handle fractional sizes correctly', () => {
    // 1.5 KB
    expect(formatFileSize(1536)).toMatch(/1\.5/);
    // 2.5 MB
    expect(formatFileSize(2621440)).toMatch(/2\.5/);
  });
});

describe('getRelativeTime', () => {
  it('should return "şimdi" for recent times', () => {
    const now = new Date();
    const result = getRelativeTime(now.toISOString());
    expect(result).toMatch(/şimdi|now|az önce|just now/i);
  });

  it('should format minutes ago', () => {
    const past = new Date(Date.now() - 5 * 60 * 1000);
    const result = getRelativeTime(past.toISOString());
    expect(result).toMatch(/5|dakika|minute/i);
  });

  it('should format hours ago', () => {
    const past = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const result = getRelativeTime(past.toISOString());
    expect(result).toMatch(/2|saat|hour/i);
  });

  it('should format days ago', () => {
    const past = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const result = getRelativeTime(past.toISOString());
    expect(result).toMatch(/3|gün|day/i);
  });

  it('should handle Date object', () => {
    const past = new Date(Date.now() - 10 * 60 * 1000);
    const result = getRelativeTime(past);
    expect(result).toBeTruthy();
  });
});

  // Error Handling Tests
  describe('Error Handling', () => {
    it('should handle invalid date input gracefully', () => {
      // Arrange & Act
      const result = formatDate('invalid-date');
      
      // Assert
      expect(result).toBe('Invalid Date');
    });

    it('should handle null/undefined number input', () => {
      // Arrange & Act & Assert
      // formatNumber expects a number, null/undefined will throw TypeError
      expect(() => formatNumber(null as unknown as number)).toThrow();
      expect(() => formatNumber(undefined as unknown as number)).toThrow();
    });

    it('should handle negative file sizes', () => {
      // Arrange & Act
      const result = formatFileSize(-100);
      
      // Assert - Should handle gracefully
      expect(result).toBeDefined();
    });

    it('should handle negative durations', () => {
      // Arrange & Act
      const result = formatDuration(-60);
      
      // Assert - Should handle gracefully
      expect(result).toBeDefined();
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('should handle very large numbers', () => {
      // Arrange & Act
      const result = formatNumber(Number.MAX_SAFE_INTEGER);
      
      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle very small currency amounts', () => {
      // Arrange & Act
      const result = formatCurrency(0.01);
      
      // Assert
      expect(result).toContain('0,01');
    });

    it('should handle very large file sizes', () => {
      // Arrange - 1 TB (formatFileSize only supports up to TB)
      const terabyte = 1024 * 1024 * 1024 * 1024;
      
      // Act
      const result = formatFileSize(terabyte);
      
      // Assert
      expect(result).toContain('TB');
    });

    it('should handle future dates in relative time', () => {
      // Arrange
      const future = new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      // Act
      const result = getRelativeTime(future);
      
      // Assert
      expect(result).toBeDefined();
    });
  });
});

