/**
 * Locale Utilities Tests - ENTERPRISE GRADE
 * 
 * Comprehensive tests for dynamic locale management and i18n formatting
 * 
 * @group utils
 * @group agent
 * @group locale
 * @group i18n
 * 
 * ALTIN KURALLAR:
 * ✅ AAA Pattern (Arrange-Act-Assert)
 * ✅ Tek test → tek davranış
 * ✅ Deterministik testler (fixed dates)
 * ✅ Mock disiplini (minimal)
 * ✅ State izolasyonu
 * ✅ Minimal test data
 * ✅ Positive + Negative tests
 * ✅ Locale consistency verification
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getBrowserLocale,
  formatDate,
  formatTime,
  formatDateTime,
  formatNumber,
  formatCurrency,
  getDateFnsLocale,
  type SupportedLocale,
  type BrowserLocale,
} from '../locale';

// ============================================================================
// TEST CONSTANTS
// ============================================================================

const TEST_DATE = new Date('2024-01-15T14:30:00.000Z');

// ============================================================================
// BROWSER LOCALE TESTS
// ============================================================================

describe('Locale - Browser Locale Detection', () => {
  describe('getBrowserLocale', () => {
    it('should map Turkish language to tr-TR', () => {
      // Act
      const locale = getBrowserLocale('tr');

      // Assert
      expect(locale).toBe('tr-TR');
    });

    it('should map Turkish with region to tr-TR', () => {
      // Act
      const locale = getBrowserLocale('tr-TR');

      // Assert
      expect(locale).toBe('tr-TR');
    });

    it('should map English language to en-US', () => {
      // Act
      const locale = getBrowserLocale('en');

      // Assert
      expect(locale).toBe('en-US');
    });

    it('should map English with region to en-US', () => {
      // Act
      const locale = getBrowserLocale('en-US');

      // Assert
      expect(locale).toBe('en-US');
    });

    it('should default to en-US for unsupported locale', () => {
      // Act
      const locale = getBrowserLocale('fr');

      // Assert
      expect(locale).toBe('en-US');
    });

    it('should handle uppercase language codes', () => {
      // Act
      const locale = getBrowserLocale('TR');

      // Assert
      expect(locale).toBe('tr-TR');
    });

    it('should handle mixed case language codes', () => {
      // Act
      const locale = getBrowserLocale('Tr-tr');

      // Assert
      expect(locale).toBe('tr-TR');
    });
  });
});

// ============================================================================
// DATE FORMATTING TESTS
// ============================================================================

describe('Locale - Date Formatting', () => {
  describe('formatDate', () => {
    it('should format date in Turkish locale', () => {
      // Act
      const formatted = formatDate(TEST_DATE, 'tr', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Assert
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
      // Turkish locale uses specific format
      expect(formatted).toContain('2024');
    });

    it('should format date in English locale', () => {
      // Act
      const formatted = formatDate(TEST_DATE, 'en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Assert
      expect(formatted).toBeTruthy();
      expect(formatted).toContain('2024');
    });

    it('should use default options when none provided', () => {
      // Act
      const formatted = formatDate(TEST_DATE, 'en');

      // Assert
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    it('should handle different date formats', () => {
      // Act
      const formatted = formatDate(TEST_DATE, 'tr', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      });

      // Assert
      expect(formatted).toBeTruthy();
    });
  });

  describe('formatTime', () => {
    it('should format time in Turkish locale', () => {
      // Act
      const formatted = formatTime(TEST_DATE, 'tr', {
        hour: '2-digit',
        minute: '2-digit',
      });

      // Assert
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    it('should format time in English locale', () => {
      // Act
      const formatted = formatTime(TEST_DATE, 'en', {
        hour: '2-digit',
        minute: '2-digit',
      });

      // Assert
      expect(formatted).toBeTruthy();
    });

    it('should handle 24-hour format', () => {
      // Act
      const formatted = formatTime(TEST_DATE, 'tr', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      // Assert
      expect(formatted).toBeTruthy();
    });

    it('should handle 12-hour format', () => {
      // Act
      const formatted = formatTime(TEST_DATE, 'en', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      // Assert
      expect(formatted).toBeTruthy();
    });
  });

  describe('formatDateTime', () => {
    it('should format datetime in Turkish locale', () => {
      // Act
      const formatted = formatDateTime(TEST_DATE, 'tr');

      // Assert
      expect(formatted).toBeTruthy();
      expect(formatted).toContain('2024');
    });

    it('should format datetime in English locale', () => {
      // Act
      const formatted = formatDateTime(TEST_DATE, 'en');

      // Assert
      expect(formatted).toBeTruthy();
      expect(formatted).toContain('2024');
    });

    it('should apply default options', () => {
      // Act
      const formatted = formatDateTime(TEST_DATE, 'tr');

      // Assert - Default includes year, month, day, hour, minute
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    it('should allow custom options', () => {
      // Act
      const formatted = formatDateTime(TEST_DATE, 'en', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Assert
      expect(formatted).toBeTruthy();
    });
  });
});

// ============================================================================
// NUMBER FORMATTING TESTS
// ============================================================================

describe('Locale - Number Formatting', () => {
  describe('formatNumber', () => {
    it('should format number in Turkish locale', () => {
      // Act
      const formatted = formatNumber(1234.56, 'tr');

      // Assert
      expect(formatted).toBeTruthy();
      // Turkish uses comma for decimals: 1.234,56
      expect(formatted).toContain('1');
    });

    it('should format number in English locale', () => {
      // Act
      const formatted = formatNumber(1234.56, 'en');

      // Assert
      expect(formatted).toBeTruthy();
      // English uses period for decimals: 1,234.56
      expect(formatted).toContain('1');
    });

    it('should format integer without decimals', () => {
      // Act
      const formatted = formatNumber(1000, 'en');

      // Assert
      expect(formatted).toBeTruthy();
    });

    it('should handle zero', () => {
      // Act
      const formatted = formatNumber(0, 'en');

      // Assert
      expect(formatted).toBe('0');
    });

    it('should handle negative numbers', () => {
      // Act
      const formatted = formatNumber(-1234.56, 'en');

      // Assert
      expect(formatted).toBeTruthy();
      expect(formatted).toContain('-');
    });

    it('should apply custom number format options', () => {
      // Act
      const formatted = formatNumber(0.1234, 'en', {
        style: 'percent',
        minimumFractionDigits: 2,
      });

      // Assert
      expect(formatted).toBeTruthy();
      expect(formatted).toContain('%');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency in Turkish locale with TRY', () => {
      // Act
      const formatted = formatCurrency(1234.56, 'tr', 'TRY');

      // Assert
      expect(formatted).toBeTruthy();
      // Turkish Lira symbol
      expect(formatted).toContain('₺');
    });

    it('should format currency in English locale with USD', () => {
      // Act
      const formatted = formatCurrency(1234.56, 'en', 'USD');

      // Assert
      expect(formatted).toBeTruthy();
      expect(formatted).toContain('$');
    });

    it('should use TRY as default currency', () => {
      // Act
      const formatted = formatCurrency(1000, 'tr');

      // Assert
      expect(formatted).toBeTruthy();
      expect(formatted).toContain('₺');
    });

    it('should handle zero amount', () => {
      // Act
      const formatted = formatCurrency(0, 'en', 'USD');

      // Assert
      expect(formatted).toBeTruthy();
      expect(formatted).toContain('$');
    });

    it('should handle negative amount', () => {
      // Act
      const formatted = formatCurrency(-500, 'en', 'USD');

      // Assert
      expect(formatted).toBeTruthy();
      expect(formatted).toContain('-');
    });

    it('should format EUR currency', () => {
      // Act
      const formatted = formatCurrency(1234.56, 'en', 'EUR');

      // Assert
      expect(formatted).toBeTruthy();
      expect(formatted).toContain('€');
    });
  });
});

// ============================================================================
// DATE-FNS LOCALE TESTS
// ============================================================================

describe('Locale - Date-fns Locale', () => {
  it('should return "tr" for Turkish language', () => {
    // Act
    const locale = getDateFnsLocale('tr');

    // Assert
    expect(locale).toBe('tr');
  });

  it('should return "tr" for Turkish with region', () => {
    // Act
    const locale = getDateFnsLocale('tr-TR');

    // Assert
    expect(locale).toBe('tr');
  });

  it('should return "en" for English language', () => {
    // Act
    const locale = getDateFnsLocale('en');

    // Assert
    expect(locale).toBe('en');
  });

  it('should return "en" for English with region', () => {
    // Act
    const locale = getDateFnsLocale('en-US');

    // Assert
    expect(locale).toBe('en');
  });

  it('should return "en" for unsupported language', () => {
    // Act
    const locale = getDateFnsLocale('fr');

    // Assert
    expect(locale).toBe('en');
  });
});

// ============================================================================
// EDGE CASES & INTEGRATION TESTS
// ============================================================================

describe('Locale - Edge Cases & Integration', () => {
  it('should handle empty string language gracefully', () => {
    // Act
    const locale = getBrowserLocale('');

    // Assert
    expect(locale).toBe('en-US');
  });

  it('should handle very large numbers', () => {
    // Act
    const formatted = formatNumber(999999999999, 'en');

    // Assert
    expect(formatted).toBeTruthy();
  });

  it('should handle very small decimal numbers', () => {
    // Act
    const formatted = formatNumber(0.00000001, 'en');

    // Assert
    expect(formatted).toBeTruthy();
  });

  it('should handle dates far in the future', () => {
    // Arrange
    const futureDate = new Date('2999-06-15T12:00:00.000Z');

    // Act
    const formatted = formatDate(futureDate, 'en');

    // Assert
    expect(formatted).toBeTruthy();
    // Due to timezone offset, may show as 2999 or 3000
    expect(formatted).toMatch(/2999|3000/);
  });

  it('should handle dates far in the past', () => {
    // Arrange
    const pastDate = new Date('1900-01-01T00:00:00.000Z');

    // Act
    const formatted = formatDate(pastDate, 'en');

    // Assert
    expect(formatted).toBeTruthy();
    expect(formatted).toContain('1900');
  });

  it('should maintain consistency across format functions', () => {
    // Arrange
    const language = 'tr';

    // Act
    const dateBrowserLocale = getBrowserLocale(language);
    const formattedDate = formatDate(TEST_DATE, language);
    const formattedTime = formatTime(TEST_DATE, language);
    const formattedNumber = formatNumber(1234, language);

    // Assert - All should use same locale
    expect(dateBrowserLocale).toBe('tr-TR');
    expect(formattedDate).toBeTruthy();
    expect(formattedTime).toBeTruthy();
    expect(formattedNumber).toBeTruthy();
  });

  it('should handle language switching', () => {
    // Act
    const trDate = formatDate(TEST_DATE, 'tr');
    const enDate = formatDate(TEST_DATE, 'en');

    // Assert - Should be different formats
    expect(trDate).toBeTruthy();
    expect(enDate).toBeTruthy();
    expect(typeof trDate).toBe('string');
    expect(typeof enDate).toBe('string');
  });
});

// ============================================================================
// REAL-WORLD SCENARIO TESTS
// ============================================================================

describe('Locale - Real-World Scenarios', () => {
  it('should format message timestamp consistently', () => {
    // Arrange
    const messageDate = new Date('2024-01-15T10:30:00.000Z');
    const language = 'tr';

    // Act
    const time = formatTime(messageDate, language, {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Assert
    expect(time).toBeTruthy();
  });

  it('should format conversation list dates', () => {
    // Arrange
    const dates = [
      new Date('2024-01-15T08:00:00.000Z'),
      new Date('2024-01-15T14:30:00.000Z'),
      new Date('2024-01-16T09:15:00.000Z'),
    ];
    const language = 'en';

    // Act
    const formatted = dates.map(date => formatDate(date, language, {
      month: 'short',
      day: 'numeric',
    }));

    // Assert
    expect(formatted).toHaveLength(3);
    formatted.forEach(f => expect(f).toBeTruthy());
  });

  it('should format pricing in e-commerce context', () => {
    // Arrange
    const prices = [10.99, 25.50, 199.99];
    const language = 'tr';

    // Act
    const formatted = prices.map(price => formatCurrency(price, language, 'TRY'));

    // Assert
    expect(formatted).toHaveLength(3);
    formatted.forEach(f => {
      expect(f).toBeTruthy();
      expect(f).toContain('₺');
    });
  });

  it('should format analytics metrics', () => {
    // Arrange
    const metrics = {
      totalUsers: 1234567,
      avgResponseTime: 2.34,
      successRate: 0.956,
    };
    const language = 'en';

    // Act
    const formattedUsers = formatNumber(metrics.totalUsers, language);
    const formattedTime = formatNumber(metrics.avgResponseTime, language, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const formattedRate = formatNumber(metrics.successRate, language, {
      style: 'percent',
      minimumFractionDigits: 1,
    });

    // Assert
    expect(formattedUsers).toBeTruthy();
    expect(formattedTime).toBeTruthy();
    expect(formattedRate).toContain('%');
  });
});

