/**
 * Team Chat Helper Utilities
 * 
 * Enterprise-grade utility functions for Team Chat feature
 * Re-exports shared formatters with team-chat-specific wrappers
 * 
 * Principles:
 * - DRY: Use shared formatters
 * - Type-safe implementations
 * - Comprehensive error handling
 * - Unit-testable
 */

import { 
  formatTime as sharedFormatTime, 
  formatDuration,
  formatFileSize as sharedFormatFileSize 
} from '@/shared/utils/formatters';
import { logger } from '@/shared/utils/logger';

/**
 * Format timestamp to human-readable time string
 * Wrapper around shared formatTime with team-chat-specific error handling
 * 
 * @param timestamp ISO 8601 timestamp string
 * @returns Formatted time string (HH:MM)
 * 
 * @example
 * formatTime('2024-01-15T14:30:00Z') // "14:30"
 */
export function formatTime(timestamp: string): string {
  try {
    return sharedFormatTime(timestamp);
  } catch (error) {
    logger.error('[TeamChat] Error formatting time', error as Error);
    return '--:--';
  }
}

/**
 * Format call duration from seconds to MM:SS format
 * Wrapper around shared formatDuration
 * 
 * @param seconds Total duration in seconds
 * @returns Formatted duration string (MM:SS)
 * 
 * @example
 * formatCallDuration(125) // "02:05"
 * formatCallDuration(3600) // "60:00"
 */
export function formatCallDuration(seconds: number): string {
  return formatDuration(seconds);
}

/**
 * Format date to human-readable string
 * 
 * @param dateString ISO 8601 date string
 * @param locale Optional locale (defaults to browser locale)
 * @returns Formatted date string (e.g., "15 Ocak 2024" for tr, "January 15, 2024" for en)
 * 
 * @example
 * formatDate('2024-01-15T00:00:00Z', 'tr-TR') // "15 Ocak 2024"
 * formatDate('2024-01-15T00:00:00Z', 'en-US') // "January 15, 2024"
 */
export function formatDate(dateString: string, locale?: string): string {
  try {
    const date = new Date(dateString);
    
    // Validate date
    if (isNaN(date.getTime())) {
      logger.warn('[TeamChat] Invalid date', new Error(`Invalid date: ${dateString}`));
      return 'Invalid Date'; // Keep English for error messages (enterprise standard)
    }
    
    // Use provided locale or browser default
    const effectiveLocale = locale || navigator.language || 'en-US';
    
    return date.toLocaleDateString(effectiveLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    logger.error('[TeamChat] Error formatting date', error as Error);
    return 'Invalid Date'; // Keep English for error messages (enterprise standard)
  }
}

/**
 * Generate avatar URL for a user
 * 
 * Uses DiceBear Avataaars API for consistent avatar generation
 * 
 * @param seed Unique identifier for consistent avatar generation
 * @returns Avatar URL
 * 
 * @example
 * getAvatarUrl('user123') // "https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
 * 
 * @see https://www.dicebear.com/
 */
export function getAvatarUrl(seed: string): string {
  // Validate input
  if (!seed || typeof seed !== 'string') {
    logger.warn('[TeamChat] Invalid avatar seed', new Error(`Invalid seed: ${seed}`));
    return 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
  }
  
  // Encode seed to handle special characters
  const encodedSeed = encodeURIComponent(seed);
  
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodedSeed}`;
}

/**
 * Truncate text to specified length with ellipsis
 * 
 * @param text Text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 * 
 * @example
 * truncateText('Hello World', 8) // "Hello..."
 * truncateText('Short', 10) // "Short"
 */
export function truncateText(text: string, maxLength: number): string {
  // Validate inputs
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  if (typeof maxLength !== 'number' || maxLength <= 0) {
    logger.warn('[TeamChat] Invalid maxLength', new Error(`Invalid maxLength: ${maxLength}`));
    return text;
  }
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return `${text.substring(0, maxLength - 3)}...`;
}

/**
 * Check if a file type is an image
 * 
 * @param fileType MIME type string
 * @returns true if image, false otherwise
 * 
 * @example
 * isImageFile('image/png') // true
 * isImageFile('application/pdf') // false
 */
export function isImageFile(fileType: string): boolean {
  if (!fileType || typeof fileType !== 'string') {
    return false;
  }
  
  return fileType.startsWith('image/');
}

/**
 * Check if a file type is a video
 * 
 * @param fileType MIME type string
 * @returns true if video, false otherwise
 * 
 * @example
 * isVideoFile('video/mp4') // true
 * isVideoFile('image/png') // false
 */
export function isVideoFile(fileType: string): boolean {
  if (!fileType || typeof fileType !== 'string') {
    return false;
  }
  
  return fileType.startsWith('video/');
}

/**
 * Validate file size
 * 
 * @param fileSize File size in bytes
 * @param maxSizeMB Maximum allowed size in megabytes
 * @returns true if valid, false if too large
 * 
 * @example
 * isValidFileSize(5242880, 10) // true (5MB < 10MB)
 * isValidFileSize(15728640, 10) // false (15MB > 10MB)
 */
export function isValidFileSize(fileSize: number, maxSizeMB: number): boolean {
  if (typeof fileSize !== 'number' || fileSize < 0) {
    return false;
  }
  
  if (typeof maxSizeMB !== 'number' || maxSizeMB <= 0) {
    logger.warn('[TeamChat] Invalid maxSizeMB', new Error(`Invalid maxSizeMB: ${maxSizeMB}`));
    return false;
  }
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return fileSize <= maxSizeBytes;
}

/**
 * Format file size to human-readable string
 * Wrapper around shared formatFileSize
 * 
 * @param bytes File size in bytes
 * @returns Formatted size string (e.g., "1.5 MB")
 * 
 * @example
 * formatFileSize(1536) // "1.50 KB"
 * formatFileSize(1048576) // "1.00 MB"
 */
export function formatFileSize(bytes: number): string {
  return sharedFormatFileSize(bytes);
}

