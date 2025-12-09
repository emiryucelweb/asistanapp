 

/**
 * Validation Utilities
 * Input validation and sanitization for security and data integrity
 * 
 * ⚠️  NOTE: This file contains hardcoded error messages for backwards compatibility.
 * In new code, use i18n validation helpers instead.
 * 
 * @module agent/utils/validation
 */

import { VALIDATION, FILE_UPLOAD } from '../constants';
import DOMPurify from 'isomorphic-dompurify';
import { logger } from '@/shared/utils/logger';
import type { i18n } from 'i18next';

/**
 * Type-safe translation function
 * Compatible with react-i18next's useTranslation hook
 */
export type TranslationFunction = (key: string, options?: Record<string, unknown>) => string;

// ============================================================================
// STRING VALIDATION
// ============================================================================

/**
 * Validate message content
 * Enterprise-grade validation with i18n support
 */
export function validateMessage(content: string, t: (key: string, options?: any) => string): { valid: boolean; error?: string } {
  const trimmed = content.trim();
  
  if (trimmed.length < VALIDATION.MESSAGE_MIN_LENGTH) {
    return { valid: false, error: t('messages.validation.messageTooShort') };
  }
  
  if (trimmed.length > VALIDATION.MESSAGE_MAX_LENGTH) {
    return { valid: false, error: t('messages.validation.messageTooLong', { max: VALIDATION.MESSAGE_MAX_LENGTH }) };
  }
  
  return { valid: true };
}

/**
 * Validate note content
 * Enterprise-grade validation with i18n support
 */
export function validateNote(content: string, t: TranslationFunction): { valid: boolean; error?: string } {
  const trimmed = content.trim();
  
  if (trimmed.length > VALIDATION.NOTE_MAX_LENGTH) {
    return { valid: false, error: t('messages.validation.noteTooLong', { max: VALIDATION.NOTE_MAX_LENGTH }) };
  }
  
  return { valid: true };
}

/**
 * Validate tag name
 * Enterprise-grade validation with i18n support
 */
export function validateTag(tag: string, t: TranslationFunction): { valid: boolean; error?: string } {
  const trimmed = tag.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: t('messages.validation.tagEmpty') };
  }
  
  if (trimmed.length > VALIDATION.TAG_MAX_LENGTH) {
    return { valid: false, error: t('messages.validation.tagTooLong', { max: VALIDATION.TAG_MAX_LENGTH }) };
  }
  
  // Check for invalid characters
  if (!/^[a-zA-Z0-9\u00C0-\u017F\s_-]+$/.test(trimmed)) {
    return { valid: false, error: t('messages.validation.tagInvalidChars') };
  }
  
  return { valid: true };
}

/**
 * Validate phone number
 * Enterprise-grade validation with i18n support
 */
export function validatePhone(phone: string, t: TranslationFunction): { valid: boolean; error?: string } {
  const trimmed = phone.trim();
  
  if (!VALIDATION.PHONE_REGEX.test(trimmed)) {
    return { valid: false, error: t('messages.validation.invalidPhone') };
  }
  
  return { valid: true };
}

/**
 * Validate email
 * Enterprise-grade validation with i18n support
 */
export function validateEmail(email: string, t: TranslationFunction): { valid: boolean; error?: string } {
  const trimmed = email.trim().toLowerCase();
  
  if (!VALIDATION.EMAIL_REGEX.test(trimmed)) {
    return { valid: false, error: t('messages.validation.invalidEmail') };
  }
  
  return { valid: true };
}

// ============================================================================
// FILE VALIDATION
// ============================================================================

/**
 * Validate file size
 * Enterprise-grade validation with i18n support
 */
export function validateFileSize(file: File, maxSize: number, t: TranslationFunction): { valid: boolean; error?: string } {
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return { valid: false, error: t('messages.validation.fileTooLarge', { max: maxSizeMB }) };
  }
  
  return { valid: true };
}

/**
 * Validate file type
 * Enterprise-grade validation with i18n support
 */
export function validateFileType(file: File, allowedTypes: readonly string[], t: TranslationFunction): { valid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: t('messages.validation.invalidFileType') };
  }
  
  return { valid: true };
}

/**
 * Validate image file
 * Enterprise-grade validation with i18n support
 */
export function validateImage(file: File, t: TranslationFunction): { valid: boolean; error?: string } {
  const sizeCheck = validateFileSize(file, FILE_UPLOAD.MAX_IMAGE_SIZE, t);
  if (!sizeCheck.valid) return sizeCheck;
  
  const typeCheck = validateFileType(file, FILE_UPLOAD.ALLOWED_IMAGE_TYPES, t);
  if (!typeCheck.valid) return typeCheck;
  
  return { valid: true };
}

/**
 * Validate video file
 * Enterprise-grade validation with i18n support
 */
export function validateVideo(file: File, t: TranslationFunction): { valid: boolean; error?: string } {
  const sizeCheck = validateFileSize(file, FILE_UPLOAD.MAX_VIDEO_SIZE, t);
  if (!sizeCheck.valid) return sizeCheck;
  
  const typeCheck = validateFileType(file, FILE_UPLOAD.ALLOWED_VIDEO_TYPES, t);
  if (!typeCheck.valid) return typeCheck;
  
  return { valid: true };
}

/**
 * Validate document file
 * Enterprise-grade validation with i18n support
 */
export function validateDocument(file: File, t: TranslationFunction): { valid: boolean; error?: string } {
  const sizeCheck = validateFileSize(file, FILE_UPLOAD.MAX_FILE_SIZE, t);
  if (!sizeCheck.valid) return sizeCheck;
  
  const typeCheck = validateFileType(file, FILE_UPLOAD.ALLOWED_DOCUMENT_TYPES, t);
  if (!typeCheck.valid) return typeCheck;
  
  return { valid: true };
}

/**
 * Validate multiple files
 * ⚠️  DEPRECATED: Use i18n validation helpers instead
 * @deprecated Use validation with i18n error messages
 */
export function validateFiles(
  files: File[],
  t: TranslationFunction
): { valid: boolean; error?: string; validFiles?: File[] } {
  if (files.length === 0) {
    return { valid: false, error: t('messages.validation.noFileSelected') };
  }
  
  if (files.length > FILE_UPLOAD.MAX_FILES_PER_MESSAGE) {
    return { valid: false, error: t('messages.validation.tooManyFiles', { max: FILE_UPLOAD.MAX_FILES_PER_MESSAGE }) };
  }
  
  const validFiles: File[] = [];
  const invalidFiles: string[] = [];
  
  for (const file of files) {
    let validation;
    
    // NOTE: Using 'as any' for file.type comparison is acceptable here as it's checking against readonly string arrays
    // from FILE_UPLOAD constants (infrastructure level)
    if (FILE_UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
      validation = validateImage(file, t);
    } else if (FILE_UPLOAD.ALLOWED_VIDEO_TYPES.includes(file.type as any)) {
      validation = validateVideo(file, t);
    } else if (FILE_UPLOAD.ALLOWED_DOCUMENT_TYPES.includes(file.type as any)) {
      validation = validateDocument(file, t);
    } else {
      validation = { valid: false, error: t('messages.validation.invalidFileType') };
    }
    
    if (validation.valid) {
      validFiles.push(file);
    } else {
      invalidFiles.push(`${file.name}: ${validation.error}`);
    }
  }
  
  if (validFiles.length === 0) {
    return { valid: false, error: t('messages.validation.noValidFiles') };
  }
  
  if (invalidFiles.length > 0) {
    logger.warn('Invalid files detected', { invalidFiles });
  }
  
  return { valid: true, validFiles };
}

// ============================================================================
// SANITIZATION
// ============================================================================

/**
 * Sanitize HTML content (XSS protection)
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
  });
}

/**
 * Sanitize text content (remove HTML)
 */
export function sanitizeText(text: string): string {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
}

/**
 * Escape special characters for safe display
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

/**
 * Sanitize search query (prevent injection)
 */
export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[<>'"%;()&+]/g, '') // Remove potentially dangerous characters
    .substring(0, 200); // Limit length
}

/**
 * Sanitize filename (prevent path traversal)
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace invalid chars with underscore
    .replace(/\.{2,}/g, '.') // Prevent directory traversal
    .substring(0, 255); // Limit length
}

// ============================================================================
// URL VALIDATION
// ============================================================================

/**
 * Validate URL
 * Enterprise-grade validation with i18n support
 */
export function validateUrl(url: string, t: TranslationFunction): { valid: boolean; error?: string } {
  try {
    const parsedUrl = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return { valid: false, error: t('messages.validation.invalidProtocol') };
    }
    
    return { valid: true };
  } catch {
    return { valid: false, error: t('messages.validation.invalidUrl') };
  }
}

/**
 * Sanitize URL for safe use
 * Note: This function is for backwards compatibility.
 * Prefer using validateUrl with t() in new code.
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return null;
    }
    
    return parsedUrl.toString();
  } catch {
    return null;
  }
}

// ============================================================================
// RATE LIMITING HELPERS
// ============================================================================

/**
 * Simple in-memory rate limiter
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(
    private readonly maxAttempts: number,
    private readonly windowMs: number
  ) {}
  
  /**
   * Check if action is allowed
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    // Record this attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return true;
  }
  
  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }
  
  /**
   * Clear all rate limits
   */
  clearAll(): void {
    this.attempts.clear();
  }
}

// ============================================================================
// CONTENT MODERATION
// ============================================================================

/**
 * Check for potentially offensive content (basic implementation)
 */
export function checkOffensiveContent(content: string): { isOffensive: boolean; words: string[] } {
  // This is a basic implementation. In production, use a proper moderation API
  const offensiveWords: string[] = [
    // Add offensive words here (this is just a placeholder)
    // In production, load from a secure configuration or API
  ];
  
  const lowerContent = content.toLowerCase();
  const foundWords: string[] = [];
  
  for (const word of offensiveWords) {
    if (lowerContent.includes(word.toLowerCase())) {
      foundWords.push(word);
    }
  }
  
  return {
    isOffensive: foundWords.length > 0,
    words: foundWords,
  };
}

/**
 * Check for spam patterns
 * Enterprise-grade validation with i18n support
 */
export function checkSpamPatterns(content: string, t: TranslationFunction): { isSpam: boolean; reason?: string } {
  // Check for excessive capitalization
  const capsCount = (content.match(/[A-Z]/g) || []).length;
  const capsRatio = capsCount / content.length;
  
  if (capsRatio > 0.7 && content.length > 10) {
    return { isSpam: true, reason: t('messages.validation.excessiveCaps') };
  }
  
  // Check for excessive repetition
  const repeatingPattern = /(.{3,})\1{3,}/;
  if (repeatingPattern.test(content)) {
    return { isSpam: true, reason: t('messages.validation.repetitiveContent') };
  }
  
  // Check for excessive URLs
  const urlCount = (content.match(/https?:\/\//g) || []).length;
  if (urlCount > 3) {
    return { isSpam: true, reason: t('messages.validation.excessiveLinks') };
  }
  
  return { isSpam: false };
}

// ============================================================================
// INPUT NORMALIZATION
// ============================================================================

/**
 * Normalize whitespace
 */
export function normalizeWhitespace(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .replace(/\n{3,}/g, '\n\n') // Multiple newlines to max 2
    .trim();
}

/**
 * Normalize phone number
 */
export function normalizePhone(phone: string): string {
  // Remove all non-digit characters except '+'
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Ensure it starts with '+'
  if (!cleaned.startsWith('+')) {
    return '+' + cleaned;
  }
  
  return cleaned;
}

/**
 * Normalize email
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

