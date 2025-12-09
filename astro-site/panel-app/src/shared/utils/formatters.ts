/**
 * Number and date formatting utilities
 */

import { logger } from './logger';

/**
 * Format number with thousand separators (Turkish locale)
 * @param value - Number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string with thousand separators
 */
export const formatNumber = (value: number, decimals: number = 0): string => {
  return value.toLocaleString('tr-TR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Format currency (Turkish Lira)
 * @param value - Number to format as currency
 * @param showSymbol - Whether to show currency symbol (default: true)
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number, showSymbol: boolean = true): string => {
  const formatted = value.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return showSymbol ? `₺${formatted}` : formatted;
};

/**
 * Format percentage
 * @param value - Number to format as percentage
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toLocaleString('tr-TR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}%`;
};

/**
 * Format large numbers with K, M, B suffixes
 * @param value - Number to format
 * @returns Formatted string with suffix
 */
export const formatCompactNumber = (value: number): string => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

/**
 * Format date to Turkish locale
 * @param date - Date to format
 * @param format - Format type: 'short' | 'long' | 'full'
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string, format: 'short' | 'long' | 'full' = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('tr-TR');
    case 'long':
      return dateObj.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'full':
      return dateObj.toLocaleDateString('tr-TR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    default:
      return dateObj.toLocaleDateString('tr-TR');
  }
};

/**
 * Format time to Turkish locale
 * @param date - Date to format
 * @returns Formatted time string
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format date and time to Turkish locale
 * @param date - Date to format
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return `${formatDate(dateObj)} ${formatTime(dateObj)}`;
};

/**
 * Get relative time (e.g., "5 minutes ago")
 * @param date - Date to compare
 * @returns Relative time string in Turkish
 */
export const getRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'Az önce';
  if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`;
  if (diffInHours < 24) return `${diffInHours} saat önce`;
  if (diffInDays < 7) return `${diffInDays} gün önce`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} hafta önce`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} ay önce`;
  return `${Math.floor(diffInDays / 365)} yıl önce`;
};

/**
 * Format duration from seconds to MM:SS or HH:MM:SS format
 * Enterprise-grade with validation and error handling
 * 
 * @param seconds - Total duration in seconds
 * @param showHours - Whether to show hours even if less than 1 hour
 * @returns Formatted duration string
 * 
 * @example
 * ```ts
 * formatDuration(125)         // "02:05"
 * formatDuration(3600)        // "60:00"
 * formatDuration(3665, true)  // "01:01:05"
 * ```
 */
export const formatDuration = (seconds: number, showHours: boolean = false): string => {
  // Validate input
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
    logger.warn('[Formatters] Invalid duration seconds', new Error(`Invalid seconds: ${seconds}`));
    return showHours ? '00:00:00' : '00:00';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  // Format with leading zeros
  const pad = (num: number) => num.toString().padStart(2, '0');

  if (hours > 0 || showHours) {
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  }

  return `${pad(minutes)}:${pad(secs)}`;
};

/**
 * Format file size in human-readable format
 * 
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted size string
 * 
 * @example
 * ```ts
 * formatFileSize(1024)        // "1.00 KB"
 * formatFileSize(1536)        // "1.50 KB"
 * formatFileSize(1048576)     // "1.00 MB"
 * ```
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  if (bytes < 0) return 'Invalid';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

