/**
 * Locale Utilities - Dynamic Locale Management
 * 
 * Enterprise-grade locale utilities for consistent i18n
 * 
 * Features:
 * - Dynamic locale detection from i18n
 * - Fallback locale support
 * - Type-safe locale operations
 * - Zero hardcoded locales
 * 
 * @module agent/utils/locale
 */

/**
 * Supported locales in the application
 */
export type SupportedLocale = 'tr' | 'en';

/**
 * Browser-compatible locale strings
 */
export type BrowserLocale = 'tr-TR' | 'en-US';

/**
 * Locale mapping for browser APIs
 */
const LOCALE_MAP: Record<SupportedLocale, BrowserLocale> = {
  tr: 'tr-TR',
  en: 'en-US',
} as const;

/**
 * Get browser-compatible locale from i18n language
 * 
 * @param language - Current i18n language (from i18n.language)
 * @returns Browser-compatible locale string
 * 
 * @example
 * ```typescript
 * const { i18n } = useTranslation();
 * const locale = getBrowserLocale(i18n.language);
 * date.toLocaleDateString(locale);
 * ```
 */
export function getBrowserLocale(language: string): BrowserLocale {
  // Extract language code (e.g., 'tr-TR' -> 'tr', 'en' -> 'en')
  const langCode = language.split('-')[0].toLowerCase() as SupportedLocale;
  
  // Return mapped locale or default to en-US
  return LOCALE_MAP[langCode] || 'en-US';
}

/**
 * Format date with dynamic locale
 * 
 * @param date - Date to format
 * @param language - Current i18n language
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 * 
 * @example
 * ```typescript
 * const { i18n } = useTranslation();
 * const formatted = formatDate(new Date(), i18n.language, { 
 *   year: 'numeric', 
 *   month: 'long', 
 *   day: 'numeric' 
 * });
 * ```
 */
export function formatDate(
  date: Date,
  language: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const locale = getBrowserLocale(language);
  return date.toLocaleDateString(locale, options);
}

/**
 * Format time with dynamic locale
 * 
 * @param date - Date to format
 * @param language - Current i18n language
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted time string
 * 
 * @example
 * ```typescript
 * const { i18n } = useTranslation();
 * const formatted = formatTime(new Date(), i18n.language, { 
 *   hour: '2-digit', 
 *   minute: '2-digit' 
 * });
 * ```
 */
export function formatTime(
  date: Date,
  language: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const locale = getBrowserLocale(language);
  return date.toLocaleTimeString(locale, options);
}

/**
 * Format date and time with dynamic locale
 * 
 * @param date - Date to format
 * @param language - Current i18n language
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted datetime string
 * 
 * @example
 * ```typescript
 * const { i18n } = useTranslation();
 * const formatted = formatDateTime(new Date(), i18n.language);
 * ```
 */
export function formatDateTime(
  date: Date,
  language: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const locale = getBrowserLocale(language);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };
  return date.toLocaleString(locale, defaultOptions);
}

/**
 * Format number with dynamic locale
 * 
 * @param value - Number to format
 * @param language - Current i18n language
 * @param options - Intl.NumberFormat options
 * @returns Formatted number string
 * 
 * @example
 * ```typescript
 * const { i18n } = useTranslation();
 * const formatted = formatNumber(1234.56, i18n.language, { 
 *   style: 'currency', 
 *   currency: 'TRY' 
 * });
 * ```
 */
export function formatNumber(
  value: number,
  language: string,
  options?: Intl.NumberFormatOptions
): string {
  const locale = getBrowserLocale(language);
  return value.toLocaleString(locale, options);
}

/**
 * Format currency with dynamic locale
 * 
 * @param value - Amount to format
 * @param language - Current i18n language
 * @param currency - Currency code (e.g., 'TRY', 'USD')
 * @returns Formatted currency string
 * 
 * @example
 * ```typescript
 * const { i18n } = useTranslation();
 * const formatted = formatCurrency(1234.56, i18n.language, 'TRY');
 * // Output: "₺1.234,56" (tr) or "$1,234.56" (en)
 * ```
 */
export function formatCurrency(
  value: number,
  language: string,
  currency: string = 'TRY'
): string {
  const locale = getBrowserLocale(language);
  return value.toLocaleString(locale, {
    style: 'currency',
    currency,
  });
}

/**
 * Get relative time string (e.g., "2 hours ago")
 * Uses date-fns with dynamic locale
 * 
 * @param date - Date to format
 * @param language - Current i18n language
 * @returns Relative time string
 * 
 * @example
 * ```typescript
 * import { formatDistanceToNow } from 'date-fns';
 * import { tr, enUS } from 'date-fns/locale';
 * 
 * const { i18n } = useTranslation();
 * const locale = i18n.language === 'tr' ? tr : enUS;
 * const formatted = formatDistanceToNow(date, { addSuffix: true, locale });
 * ```
 */
export function getDateFnsLocale(language: string) {
  // This will be imported dynamically in components
  // import { tr, enUS } from 'date-fns/locale';
  // return language.startsWith('tr') ? tr : enUS;
  return language.startsWith('tr') ? 'tr' : 'en';
}

