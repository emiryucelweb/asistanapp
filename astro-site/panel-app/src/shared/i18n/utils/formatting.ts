/**
 * Formatting Utilities
 * 
 * Enterprise-grade date, number, and currency formatting
 * Uses Intl API for locale-aware formatting
 * 
 * @module shared/i18n/utils/formatting
 */

import { getCurrentLanguage, type SupportedLanguage } from '../config';
import { logger } from '@/shared/utils/logger';

/**
 * Format date with locale
 * 
 * @param date - Date to format
 * @param options - Intl.DateTimeFormat options
 * @param locale - Optional locale override
 * @returns Formatted date string
 * 
 * @example
 * ```ts
 * formatDate(new Date(), { dateStyle: 'full' }); // "25 Ekim 2025 Cumartesi" (TR)
 * formatDate(new Date(), { timeStyle: 'short' }); // "21:30"
 * ```
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {},
  locale?: SupportedLanguage
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const lang = locale || getCurrentLanguage();
  
  try {
    return new Intl.DateTimeFormat(lang, options).format(dateObj);
  } catch (error) {
    logger.error('Date formatting error:', error);
    return dateObj.toLocaleDateString();
  }
}

/**
 * Format number with locale
 * 
 * @param value - Number to format
 * @param options - Intl.NumberFormat options
 * @param locale - Optional locale override
 * @returns Formatted number string
 * 
 * @example
 * ```ts
 * formatNumber(1234.56); // "1.234,56" (TR) or "1,234.56" (EN)
 * formatNumber(0.85, { style: 'percent' }); // "%85"
 * ```
 */
export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
  locale?: SupportedLanguage
): string {
  const lang = locale || getCurrentLanguage();
  
  try {
    return new Intl.NumberFormat(lang, options).format(value);
  } catch (error) {
    logger.error('Number formatting error:', error);
    return value.toString();
  }
}

/**
 * Format currency with locale
 * 
 * @param value - Amount to format
 * @param currency - Currency code (ISO 4217)
 * @param options - Additional Intl.NumberFormat options
 * @param locale - Optional locale override
 * @returns Formatted currency string
 * 
 * @example
 * ```ts
 * formatCurrency(1234.56, 'TRY'); // "₺1.234,56" (TR)
 * formatCurrency(1234.56, 'USD'); // "$1,234.56" (EN)
 * formatCurrency(1234.56, 'EUR'); // "€1.234,56" (TR)
 * ```
 */
export function formatCurrency(
  value: number,
  currency: string = 'TRY',
  options: Intl.NumberFormatOptions = {},
  locale?: SupportedLanguage
): string {
  const lang = locale || getCurrentLanguage();
  
  try {
    return new Intl.NumberFormat(lang, {
      style: 'currency',
      currency,
      ...options,
    }).format(value);
  } catch (error) {
    logger.error('Currency formatting error:', error);
    return `${currency} ${value.toFixed(2)}`;
  }
}

/**
 * Format percentage
 * 
 * @param value - Value to format (0.85 for 85%)
 * @param decimals - Number of decimal places
 * @param locale - Optional locale override
 * @returns Formatted percentage string
 * 
 * @example
 * ```ts
 * formatPercent(0.8567); // "%86" (rounded)
 * formatPercent(0.8567, 2); // "%85,67"
 * ```
 */
export function formatPercent(
  value: number,
  decimals: number = 0,
  locale?: SupportedLanguage
): string {
  return formatNumber(value, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }, locale);
}

/**
 * Format relative time (e.g., "5 minutes ago")
 * 
 * @param date - Date to format
 * @param locale - Optional locale override
 * @returns Relative time string
 * 
 * @example
 * ```ts
 * formatRelativeTime(new Date(Date.now() - 5 * 60 * 1000)); // "5 dakika önce" (TR)
 * formatRelativeTime(new Date(Date.now() - 2 * 60 * 60 * 1000)); // "2 saat önce"
 * ```
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale?: SupportedLanguage
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const lang = locale || getCurrentLanguage();
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  // Define time units
  const units: Array<{ unit: Intl.RelativeTimeFormatUnit; seconds: number }> = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'week', seconds: 604800 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
  ];
  
  // Find appropriate unit
  for (const { unit, seconds } of units) {
    const value = Math.floor(diffInSeconds / seconds);
    if (value >= 1) {
      try {
        return new Intl.RelativeTimeFormat(lang, { numeric: 'auto' }).format(-value, unit);
      } catch (error) {
        logger.error('Relative time formatting error:', error);
        return formatDate(dateObj, { dateStyle: 'short', timeStyle: 'short' }, lang);
      }
    }
  }
  
  // Just now
  return lang === 'tr' ? 'Şimdi' : 'Now';
}

/**
 * Format file size
 * 
 * @param bytes - Size in bytes
 * @param decimals - Number of decimal places
 * @param locale - Optional locale override
 * @returns Formatted file size string
 * 
 * @example
 * ```ts
 * formatFileSize(1024); // "1 KB"
 * formatFileSize(1536000); // "1,5 MB"
 * formatFileSize(1536000000); // "1,5 GB"
 * ```
 */
export function formatFileSize(
  bytes: number,
  decimals: number = 1,
  locale?: SupportedLanguage
): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  
  return `${formatNumber(value, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }, locale)} ${sizes[i]}`;
}

/**
 * Format duration in milliseconds to human-readable string
 * 
 * @param ms - Duration in milliseconds
 * @param locale - Optional locale override
 * @returns Formatted duration string
 * 
 * @example
 * ```ts
 * formatDuration(5000); // "5s"
 * formatDuration(65000); // "1m 5s"
 * formatDuration(3665000); // "1h 1m 5s"
 * ```
 */
export function formatDuration(ms: number, locale?: SupportedLanguage): string {
  const lang = locale || getCurrentLanguage();
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  const parts: string[] = [];
  
  if (days > 0) parts.push(`${days}${lang === 'tr' ? 'g' : 'd'}`);
  if (hours % 24 > 0) parts.push(`${hours % 24}${lang === 'tr' ? 's' : 'h'}`);
  if (minutes % 60 > 0) parts.push(`${minutes % 60}${lang === 'tr' ? 'dk' : 'm'}`);
  if (seconds % 60 > 0 && parts.length < 2) parts.push(`${seconds % 60}${lang === 'tr' ? 'sn' : 's'}`);
  
  return parts.join(' ') || '0s';
}

/**
 * Format phone number
 * 
 * @param phone - Phone number string
 * @param locale - Optional locale override
 * @returns Formatted phone number
 * 
 * @example
 * ```ts
 * formatPhone('905551234567'); // "+90 555 123 45 67"
 * formatPhone('15551234567'); // "+1 555 123 4567"
 * ```
 */
export function formatPhone(phone: string, locale?: SupportedLanguage): string {
  const lang = locale || getCurrentLanguage();
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Turkish format
  if (lang === 'tr' && cleaned.startsWith('90')) {
    const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
    }
  }
  
  // US/International format
  const match = cleaned.match(/^(\d{1,3})(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
  }
  
  return phone;
}

