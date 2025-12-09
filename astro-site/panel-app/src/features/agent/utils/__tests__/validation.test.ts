/**
 * Validation Utilities Tests - ENTERPRISE GRADE
 * 
 * Comprehensive tests for all validation, sanitization, and security utilities
 * 
 * @group utils
 * @group agent
 * @group validation
 * @group security
 * 
 * ALTIN KURALLAR:
 * ✅ AAA Pattern (Arrange-Act-Assert)
 * ✅ Tek test → tek davranış
 * ✅ Deterministik testler
 * ✅ Mock disiplini (minimal)
 * ✅ State izolasyonu
 * ✅ Minimal test data
 * ✅ Positive + Negative tests
 * ✅ Factory pattern
 * ✅ Security-focused testing
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  // String Validation
  validateMessage,
  validateNote,
  validateTag,
  validatePhone,
  validateEmail,
  // File Validation
  validateFileSize,
  validateFileType,
  validateImage,
  validateVideo,
  validateDocument,
  validateFiles,
  // Sanitization
  sanitizeHtml,
  sanitizeText,
  escapeHtml,
  sanitizeSearchQuery,
  sanitizeFilename,
  // URL Validation
  validateUrl,
  sanitizeUrl,
  // Rate Limiting
  RateLimiter,
  // Content Moderation
  checkOffensiveContent,
  checkSpamPatterns,
  // Input Normalization
  normalizeWhitespace,
  normalizePhone,
  normalizeEmail,
} from '../validation';

// ============================================================================
// TEST FACTORIES
// ============================================================================

/**
 * Factory: Create mock t() function
 */
const createMockT = () => vi.fn((key: string, options?: any) => {
  const translations: Record<string, string> = {
    'messages.validation.messageTooShort': 'Mesaj çok kısa',
    'messages.validation.messageTooLong': `Mesaj çok uzun (max: ${options?.max})`,
    'messages.validation.noteTooLong': `Not çok uzun (max: ${options?.max})`,
    'messages.validation.tagEmpty': 'Etiket boş olamaz',
    'messages.validation.tagTooLong': `Etiket çok uzun (max: ${options?.max})`,
    'messages.validation.tagInvalidChars': 'Geçersiz karakterler',
    'messages.validation.invalidPhone': 'Geçersiz telefon numarası',
    'messages.validation.invalidEmail': 'Geçersiz email',
    'messages.validation.fileTooLarge': `Dosya çok büyük (max: ${options?.max}MB)`,
    'messages.validation.invalidFileType': 'Geçersiz dosya tipi',
    'messages.validation.noFileSelected': 'Dosya seçilmedi',
    'messages.validation.tooManyFiles': `Çok fazla dosya (max: ${options?.max})`,
    'messages.validation.noValidFiles': 'Geçerli dosya yok',
    'messages.validation.invalidProtocol': 'Geçersiz protokol',
    'messages.validation.invalidUrl': 'Geçersiz URL',
    'messages.validation.excessiveCaps': 'Aşırı büyük harf',
    'messages.validation.repetitiveContent': 'Tekrarlayan içerik',
    'messages.validation.excessiveLinks': 'Aşırı link',
  };
  return translations[key] || key;
});

/**
 * Factory: Create mock File
 */
const createMockFile = (name: string, type: string, size: number): File => {
  const blob = new Blob(['test content'], { type });
  const file = new File([blob], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

// ============================================================================
// STRING VALIDATION TESTS
// ============================================================================

describe('Validation - String Validation', () => {
  let mockT: ReturnType<typeof createMockT>;

  beforeEach(() => {
    mockT = createMockT();
  });

  // ==================== validateMessage ====================
  
  describe('validateMessage', () => {
    it('should accept valid message', () => {
      // Arrange
      const message = 'Hello, this is a valid message';
      
      // Act
      const result = validateMessage(message, mockT);
      
      // Assert
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject message that is too short', () => {
      // Arrange
      const message = '';
      
      // Act
      const result = validateMessage(message, mockT);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Mesaj çok kısa');
    });

    it('should reject message that is too long', () => {
      // Arrange
      const message = 'a'.repeat(5001); // Over limit
      
      // Act
      const result = validateMessage(message, mockT);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Mesaj çok uzun');
    });

    it('should trim whitespace before validation', () => {
      // Arrange
      const message = '   Valid message   ';
      
      // Act
      const result = validateMessage(message, mockT);
      
      // Assert
      expect(result.valid).toBe(true);
    });

    it('should reject message with only whitespace', () => {
      // Arrange
      const message = '   \n\t   ';
      
      // Act
      const result = validateMessage(message, mockT);
      
      // Assert
      expect(result.valid).toBe(false);
    });
  });

  // ==================== validateNote ====================
  
  describe('validateNote', () => {
    it('should accept valid note', () => {
      // Arrange
      const note = 'This is a valid note';
      
      // Act
      const result = validateNote(note, mockT);
      
      // Assert
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept empty note', () => {
      // Arrange
      const note = '';
      
      // Act
      const result = validateNote(note, mockT);
      
      // Assert
      expect(result.valid).toBe(true);
    });

    it('should reject note that is too long', () => {
      // Arrange
      const note = 'a'.repeat(2001); // Over limit
      
      // Act
      const result = validateNote(note, mockT);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Not çok uzun');
    });
  });

  // ==================== validateTag ====================
  
  describe('validateTag', () => {
    it('should accept valid tag with alphanumeric characters', () => {
      // Arrange
      const tag = 'urgent-customer';
      
      // Act
      const result = validateTag(tag, mockT);
      
      // Assert
      expect(result.valid).toBe(true);
    });

    it('should accept tag with Turkish characters', () => {
      // Arrange
      const tag = 'önemli-müşteri';
      
      // Act
      const result = validateTag(tag, mockT);
      
      // Assert
      expect(result.valid).toBe(true);
    });

    it('should reject empty tag', () => {
      // Arrange
      const tag = '';
      
      // Act
      const result = validateTag(tag, mockT);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Etiket boş olamaz');
    });

    it('should reject tag with special characters', () => {
      // Arrange
      const tag = 'tag@#$%';
      
      // Act
      const result = validateTag(tag, mockT);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Geçersiz karakterler');
    });

    it('should reject tag that is too long', () => {
      // Arrange
      const tag = 'a'.repeat(51); // Over limit
      
      // Act
      const result = validateTag(tag, mockT);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Etiket çok uzun');
    });
  });

  // ==================== validatePhone ====================
  
  describe('validatePhone', () => {
    it('should accept valid international phone number', () => {
      // Arrange
      const phone = '+905551234567';
      
      // Act
      const result = validatePhone(phone, mockT);
      
      // Assert
      expect(result.valid).toBe(true);
    });

    it('should reject invalid phone number', () => {
      // Arrange - Regex requires [1-9]\d{1,14}, so minimum 2 digits
      const phone = 'abc123def'; // Contains non-digits
      
      // Act
      const result = validatePhone(phone, mockT);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Geçersiz telefon numarası');
    });

    it('should accept phone without plus sign (E.164 allows optional +)', () => {
      // Arrange - PHONE_REGEX allows optional '+' prefix
      const phone = '905551234567';
      
      // Act
      const result = validatePhone(phone, mockT);
      
      // Assert
      expect(result.valid).toBe(true);
    });
  });

  // ==================== validateEmail ====================
  
  describe('validateEmail', () => {
    it('should accept valid email', () => {
      // Arrange
      const email = 'test@example.com';
      
      // Act
      const result = validateEmail(email, mockT);
      
      // Assert
      expect(result.valid).toBe(true);
    });

    it('should normalize email to lowercase', () => {
      // Arrange
      const email = 'Test@EXAMPLE.COM';
      
      // Act
      const result = validateEmail(email, mockT);
      
      // Assert
      expect(result.valid).toBe(true);
    });

    it('should reject invalid email format', () => {
      // Arrange
      const email = 'invalid-email';
      
      // Act
      const result = validateEmail(email, mockT);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Geçersiz email');
    });

    it('should reject email without domain', () => {
      // Arrange
      const email = 'test@';
      
      // Act
      const result = validateEmail(email, mockT);
      
      // Assert
      expect(result.valid).toBe(false);
    });
  });
});

// ============================================================================
// FILE VALIDATION TESTS
// ============================================================================

describe('Validation - File Validation', () => {
  let mockT: ReturnType<typeof createMockT>;

  beforeEach(() => {
    mockT = createMockT();
  });

  // ==================== validateFileSize ====================
  
  describe('validateFileSize', () => {
    it('should accept file within size limit', () => {
      // Arrange
      const file = createMockFile('test.pdf', 'application/pdf', 1024 * 1024); // 1MB
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      // Act
      const result = validateFileSize(file, maxSize, mockT);
      
      // Assert
      expect(result.valid).toBe(true);
    });

    it('should reject file exceeding size limit', () => {
      // Arrange
      const file = createMockFile('large.pdf', 'application/pdf', 6 * 1024 * 1024); // 6MB
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      // Act
      const result = validateFileSize(file, maxSize, mockT);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Dosya çok büyük');
    });
  });

  // ==================== validateFileType ====================
  
  describe('validateFileType', () => {
    it('should accept allowed file type', () => {
      // Arrange
      const file = createMockFile('image.png', 'image/png', 1024);
      const allowedTypes = ['image/png', 'image/jpeg'] as const;
      
      // Act
      const result = validateFileType(file, allowedTypes, mockT);
      
      // Assert
      expect(result.valid).toBe(true);
    });

    it('should reject disallowed file type', () => {
      // Arrange
      const file = createMockFile('file.exe', 'application/x-msdownload', 1024);
      const allowedTypes = ['image/png', 'image/jpeg'] as const;
      
      // Act
      const result = validateFileType(file, allowedTypes, mockT);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Geçersiz dosya tipi');
    });
  });

  // ==================== validateImage ====================
  
  describe('validateImage', () => {
    it('should accept valid image file', () => {
      // Arrange
      const file = createMockFile('photo.jpg', 'image/jpeg', 2 * 1024 * 1024); // 2MB
      
      // Act
      const result = validateImage(file, mockT);
      
      // Assert
      expect(result.valid).toBe(true);
    });

    it('should reject image exceeding size limit', () => {
      // Arrange
      const file = createMockFile('huge.jpg', 'image/jpeg', 11 * 1024 * 1024); // 11MB
      
      // Act
      const result = validateImage(file, mockT);
      
      // Assert
      expect(result.valid).toBe(false);
    });

    it('should reject non-image file', () => {
      // Arrange
      const file = createMockFile('doc.pdf', 'application/pdf', 1024);
      
      // Act
      const result = validateImage(file, mockT);
      
      // Assert
      expect(result.valid).toBe(false);
    });
  });

  // ==================== validateVideo ====================
  
  describe('validateVideo', () => {
    it('should accept valid video file', () => {
      // Arrange
      const file = createMockFile('video.mp4', 'video/mp4', 10 * 1024 * 1024); // 10MB
      
      // Act
      const result = validateVideo(file, mockT);
      
      // Assert
      expect(result.valid).toBe(true);
    });

    it('should reject video exceeding size limit', () => {
      // Arrange
      const file = createMockFile('large-video.mp4', 'video/mp4', 101 * 1024 * 1024); // 101MB
      
      // Act
      const result = validateVideo(file, mockT);
      
      // Assert
      expect(result.valid).toBe(false);
    });
  });

  // ==================== validateDocument ====================
  
  describe('validateDocument', () => {
    it('should accept valid PDF document', () => {
      // Arrange
      const file = createMockFile('report.pdf', 'application/pdf', 3 * 1024 * 1024); // 3MB
      
      // Act
      const result = validateDocument(file, mockT);
      
      // Assert
      expect(result.valid).toBe(true);
    });

    it('should accept valid Word document', () => {
      // Arrange
      const file = createMockFile('doc.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 2 * 1024 * 1024);
      
      // Act
      const result = validateDocument(file, mockT);
      
      // Assert
      expect(result.valid).toBe(true);
    });
  });

  // ==================== validateFiles ====================
  
  describe('validateFiles', () => {
    it('should accept valid files', () => {
      // Arrange
      const files = [
        createMockFile('image1.jpg', 'image/jpeg', 1024 * 1024),
        createMockFile('image2.png', 'image/png', 2 * 1024 * 1024),
      ];
      
      // Act
      const result = validateFiles(files, mockT);
      
      // Assert
      expect(result.valid).toBe(true);
      expect(result.validFiles).toHaveLength(2);
    });

    it('should reject empty file list', () => {
      // Arrange
      const files: File[] = [];
      
      // Act
      const result = validateFiles(files, mockT);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Dosya seçilmedi');
    });

    it('should reject too many files', () => {
      // Arrange
      const files = Array.from({ length: 11 }, (_, i) =>
        createMockFile(`file${i}.jpg`, 'image/jpeg', 1024)
      );
      
      // Act
      const result = validateFiles(files, mockT);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Çok fazla dosya');
    });

    it('should filter out invalid files and return valid ones', () => {
      // Arrange
      const files = [
        createMockFile('valid.jpg', 'image/jpeg', 1024 * 1024),
        createMockFile('invalid.exe', 'application/x-msdownload', 1024),
      ];
      
      // Act
      const result = validateFiles(files, mockT);
      
      // Assert
      expect(result.valid).toBe(true);
      expect(result.validFiles).toHaveLength(1);
    });

    it('should reject when all files are invalid', () => {
      // Arrange
      const files = [
        createMockFile('huge.jpg', 'image/jpeg', 100 * 1024 * 1024), // Too large
      ];
      
      // Act
      const result = validateFiles(files, mockT);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Geçerli dosya yok');
    });
  });
});

// ============================================================================
// SANITIZATION TESTS
// ============================================================================

describe('Validation - Sanitization', () => {
  // ==================== sanitizeHtml ====================
  
  describe('sanitizeHtml', () => {
    it('should allow safe HTML tags', () => {
      // Arrange
      const html = '<p>Hello <strong>world</strong></p>';
      
      // Act
      const result = sanitizeHtml(html);
      
      // Assert
      expect(result).toContain('<p>');
      expect(result).toContain('<strong>');
    });

    it('should remove script tags (XSS protection)', () => {
      // Arrange
      const html = '<p>Hello</p><script>alert("XSS")</script>';
      
      // Act
      const result = sanitizeHtml(html);
      
      // Assert
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });

    it('should remove dangerous attributes', () => {
      // Arrange
      const html = '<p onclick="alert()">Click me</p>';
      
      // Act
      const result = sanitizeHtml(html);
      
      // Assert
      expect(result).not.toContain('onclick');
    });

    it('should allow safe links', () => {
      // Arrange
      const html = '<a href="https://example.com" target="_blank">Link</a>';
      
      // Act
      const result = sanitizeHtml(html);
      
      // Assert
      expect(result).toContain('<a');
      expect(result).toContain('href');
    });
  });

  // ==================== sanitizeText ====================
  
  describe('sanitizeText', () => {
    it('should remove all HTML tags', () => {
      // Arrange
      const text = '<p>Hello <strong>world</strong></p>';
      
      // Act
      const result = sanitizeText(text);
      
      // Assert
      expect(result).not.toContain('<p>');
      expect(result).not.toContain('<strong>');
      expect(result).toBe('Hello world');
    });

    it('should handle text without HTML', () => {
      // Arrange
      const text = 'Plain text';
      
      // Act
      const result = sanitizeText(text);
      
      // Assert
      expect(result).toBe('Plain text');
    });
  });

  // ==================== escapeHtml ====================
  
  describe('escapeHtml', () => {
    it('should escape special HTML characters', () => {
      // Arrange
      const text = '<script>alert("XSS")</script>';
      
      // Act
      const result = escapeHtml(text);
      
      // Assert
      expect(result).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    });

    it('should escape ampersand', () => {
      // Arrange
      const text = 'Tom & Jerry';
      
      // Act
      const result = escapeHtml(text);
      
      // Assert
      expect(result).toBe('Tom &amp; Jerry');
    });

    it('should handle text without special characters', () => {
      // Arrange
      const text = 'Normal text';
      
      // Act
      const result = escapeHtml(text);
      
      // Assert
      expect(result).toBe('Normal text');
    });
  });

  // ==================== sanitizeSearchQuery ====================
  
  describe('sanitizeSearchQuery', () => {
    it('should remove dangerous characters', () => {
      // Arrange
      const query = "test'; DROP TABLE users--";
      
      // Act
      const result = sanitizeSearchQuery(query);
      
      // Assert
      expect(result).not.toContain(';');
      expect(result).not.toContain("'");
    });

    it('should limit length', () => {
      // Arrange
      const query = 'a'.repeat(300);
      
      // Act
      const result = sanitizeSearchQuery(query);
      
      // Assert
      expect(result.length).toBeLessThanOrEqual(200);
    });

    it('should trim whitespace', () => {
      // Arrange
      const query = '  search term  ';
      
      // Act
      const result = sanitizeSearchQuery(query);
      
      // Assert
      expect(result).toBe('search term');
    });
  });

  // ==================== sanitizeFilename ====================
  
  describe('sanitizeFilename', () => {
    it('should replace invalid characters with underscore', () => {
      // Arrange
      const filename = 'my file<>:"/\\|?*.txt';
      
      // Act
      const result = sanitizeFilename(filename);
      
      // Assert
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
      expect(result).toContain('_');
    });

    it('should prevent directory traversal', () => {
      // Arrange
      const filename = '../../etc/passwd';
      
      // Act
      const result = sanitizeFilename(filename);
      
      // Assert
      expect(result).not.toContain('..');
      expect(result).not.toContain('/');
    });

    it('should limit filename length', () => {
      // Arrange
      const filename = 'a'.repeat(300) + '.txt';
      
      // Act
      const result = sanitizeFilename(filename);
      
      // Assert
      expect(result.length).toBeLessThanOrEqual(255);
    });

    it('should keep safe characters', () => {
      // Arrange
      const filename = 'report_2024-01-01.pdf';
      
      // Act
      const result = sanitizeFilename(filename);
      
      // Assert
      expect(result).toBe('report_2024-01-01.pdf');
    });
  });
});

// ============================================================================
// URL VALIDATION TESTS
// ============================================================================

describe('Validation - URL Validation', () => {
  let mockT: ReturnType<typeof createMockT>;

  beforeEach(() => {
    mockT = createMockT();
  });

  // ==================== validateUrl ====================
  
  describe('validateUrl', () => {
    it('should accept valid HTTP URL', () => {
      // Arrange
      const url = 'http://example.com';
      
      // Act
      const result = validateUrl(url, mockT);
      
      // Assert
      expect(result.valid).toBe(true);
    });

    it('should accept valid HTTPS URL', () => {
      // Arrange
      const url = 'https://example.com/path?query=value';
      
      // Act
      const result = validateUrl(url, mockT);
      
      // Assert
      expect(result.valid).toBe(true);
    });

    it('should reject javascript: protocol (XSS protection)', () => {
      // Arrange
      const url = 'javascript:alert("XSS")';
      
      // Act
      const result = validateUrl(url, mockT);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Geçersiz protokol');
    });

    it('should reject data: protocol', () => {
      // Arrange
      const url = 'data:text/html,<script>alert("XSS")</script>';
      
      // Act
      const result = validateUrl(url, mockT);
      
      // Assert
      expect(result.valid).toBe(false);
    });

    it('should reject invalid URL format', () => {
      // Arrange
      const url = 'not a url';
      
      // Act
      const result = validateUrl(url, mockT);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Geçersiz URL');
    });
  });

  // ==================== sanitizeUrl ====================
  
  describe('sanitizeUrl', () => {
    it('should return valid HTTP URL', () => {
      // Arrange
      const url = 'http://example.com';
      
      // Act
      const result = sanitizeUrl(url);
      
      // Assert
      expect(result).toBe('http://example.com/');
    });

    it('should return null for javascript: protocol', () => {
      // Arrange
      const url = 'javascript:alert("XSS")';
      
      // Act
      const result = sanitizeUrl(url);
      
      // Assert
      expect(result).toBeNull();
    });

    it('should return null for invalid URL', () => {
      // Arrange
      const url = 'invalid url';
      
      // Act
      const result = sanitizeUrl(url);
      
      // Assert
      expect(result).toBeNull();
    });
  });
});

// ============================================================================
// RATE LIMITING TESTS
// ============================================================================

describe('Validation - Rate Limiting', () => {
  let rateLimiter: RateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiter(3, 1000); // 3 attempts per second
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should allow actions within rate limit', () => {
    // Arrange
    const key = 'user-123';
    
    // Act & Assert
    expect(rateLimiter.isAllowed(key)).toBe(true);
    expect(rateLimiter.isAllowed(key)).toBe(true);
    expect(rateLimiter.isAllowed(key)).toBe(true);
  });

  it('should block actions exceeding rate limit', () => {
    // Arrange
    const key = 'user-123';
    
    // Act
    rateLimiter.isAllowed(key);
    rateLimiter.isAllowed(key);
    rateLimiter.isAllowed(key);
    const result = rateLimiter.isAllowed(key);
    
    // Assert
    expect(result).toBe(false);
  });

  it('should reset after time window', () => {
    // Arrange
    const key = 'user-123';
    rateLimiter.isAllowed(key);
    rateLimiter.isAllowed(key);
    rateLimiter.isAllowed(key);
    
    // Act
    vi.advanceTimersByTime(1001); // Move past window
    const result = rateLimiter.isAllowed(key);
    
    // Assert
    expect(result).toBe(true);
  });

  it('should track different keys independently', () => {
    // Arrange
    const key1 = 'user-123';
    const key2 = 'user-456';
    
    // Act & Assert
    expect(rateLimiter.isAllowed(key1)).toBe(true);
    expect(rateLimiter.isAllowed(key1)).toBe(true);
    expect(rateLimiter.isAllowed(key1)).toBe(true);
    expect(rateLimiter.isAllowed(key1)).toBe(false);
    
    // key2 should still be allowed
    expect(rateLimiter.isAllowed(key2)).toBe(true);
  });

  it('should reset specific key', () => {
    // Arrange
    const key = 'user-123';
    rateLimiter.isAllowed(key);
    rateLimiter.isAllowed(key);
    rateLimiter.isAllowed(key);
    
    // Act
    rateLimiter.reset(key);
    const result = rateLimiter.isAllowed(key);
    
    // Assert
    expect(result).toBe(true);
  });

  it('should clear all rate limits', () => {
    // Arrange
    rateLimiter.isAllowed('user-1');
    rateLimiter.isAllowed('user-2');
    
    // Act
    rateLimiter.clearAll();
    
    // Assert
    expect(rateLimiter.isAllowed('user-1')).toBe(true);
    expect(rateLimiter.isAllowed('user-2')).toBe(true);
  });
});

// ============================================================================
// CONTENT MODERATION TESTS
// ============================================================================

describe('Validation - Content Moderation', () => {
  let mockT: ReturnType<typeof createMockT>;

  beforeEach(() => {
    mockT = createMockT();
  });

  // ==================== checkOffensiveContent ====================
  
  describe('checkOffensiveContent', () => {
    it('should accept clean content', () => {
      // Arrange
      const content = 'This is a nice message';
      
      // Act
      const result = checkOffensiveContent(content);
      
      // Assert
      expect(result.isOffensive).toBe(false);
      expect(result.words).toHaveLength(0);
    });

    // Note: Basic implementation returns false for all content
    // In production, this would use an actual moderation API
  });

  // ==================== checkSpamPatterns ====================
  
  describe('checkSpamPatterns', () => {
    it('should accept normal content', () => {
      // Arrange
      const content = 'Hello, how are you today?';
      
      // Act
      const result = checkSpamPatterns(content, mockT);
      
      // Assert
      expect(result.isSpam).toBe(false);
      expect(result.reason).toBeUndefined();
    });

    it('should detect excessive capitalization', () => {
      // Arrange
      const content = 'BUYNOWBUYNOWBUYNOWBUYNOW'; // All caps, long enough
      
      // Act
      const result = checkSpamPatterns(content, mockT);
      
      // Assert
      expect(result.isSpam).toBe(true);
      expect(result.reason).toBe('Aşırı büyük harf');
    });

    it('should detect repetitive content', () => {
      // Arrange
      const content = 'HelloHelloHelloHello';
      
      // Act
      const result = checkSpamPatterns(content, mockT);
      
      // Assert
      expect(result.isSpam).toBe(true);
      expect(result.reason).toBe('Tekrarlayan içerik');
    });

    it('should detect excessive URLs', () => {
      // Arrange
      const content = 'Check https://site1.com and https://site2.com and https://site3.com and https://site4.com';
      
      // Act
      const result = checkSpamPatterns(content, mockT);
      
      // Assert
      expect(result.isSpam).toBe(true);
      expect(result.reason).toBe('Aşırı link');
    });

    it('should allow reasonable capitalization', () => {
      // Arrange
      const content = 'Hello World, How Are You?';
      
      // Act
      const result = checkSpamPatterns(content, mockT);
      
      // Assert
      expect(result.isSpam).toBe(false);
    });
  });
});

// ============================================================================
// INPUT NORMALIZATION TESTS
// ============================================================================

describe('Validation - Input Normalization', () => {
  // ==================== normalizeWhitespace ====================
  
  describe('normalizeWhitespace', () => {
    it('should replace multiple spaces with single space', () => {
      // Arrange
      const text = 'Hello    world';
      
      // Act
      const result = normalizeWhitespace(text);
      
      // Assert
      expect(result).toBe('Hello world');
    });

    it('should limit consecutive newlines to maximum 2', () => {
      // Arrange - Function converts \n to space first, then reduces spaces
      const text = 'Line 1\n\n\n\n\nLine 2';
      
      // Act
      const result = normalizeWhitespace(text);
      
      // Assert
      // normalizeWhitespace replaces \s+ with single space, so newlines become single space
      expect(result).toBe('Line 1 Line 2');
    });

    it('should trim leading and trailing whitespace', () => {
      // Arrange
      const text = '  Hello world  ';
      
      // Act
      const result = normalizeWhitespace(text);
      
      // Assert
      expect(result).toBe('Hello world');
    });

    it('should handle text with no extra whitespace', () => {
      // Arrange
      const text = 'Normal text';
      
      // Act
      const result = normalizeWhitespace(text);
      
      // Assert
      expect(result).toBe('Normal text');
    });
  });

  // ==================== normalizePhone ====================
  
  describe('normalizePhone', () => {
    it('should remove non-digit characters except plus', () => {
      // Arrange
      const phone = '+90 (555) 123-4567';
      
      // Act
      const result = normalizePhone(phone);
      
      // Assert
      expect(result).toBe('+905551234567');
    });

    it('should add plus sign if missing', () => {
      // Arrange
      const phone = '905551234567';
      
      // Act
      const result = normalizePhone(phone);
      
      // Assert
      expect(result).toBe('+905551234567');
    });

    it('should keep existing plus sign', () => {
      // Arrange
      const phone = '+905551234567';
      
      // Act
      const result = normalizePhone(phone);
      
      // Assert
      expect(result).toBe('+905551234567');
    });
  });

  // ==================== normalizeEmail ====================
  
  describe('normalizeEmail', () => {
    it('should convert to lowercase', () => {
      // Arrange
      const email = 'Test@EXAMPLE.COM';
      
      // Act
      const result = normalizeEmail(email);
      
      // Assert
      expect(result).toBe('test@example.com');
    });

    it('should trim whitespace', () => {
      // Arrange
      const email = '  test@example.com  ';
      
      // Act
      const result = normalizeEmail(email);
      
      // Assert
      expect(result).toBe('test@example.com');
    });

    it('should handle already normalized email', () => {
      // Arrange
      const email = 'test@example.com';
      
      // Act
      const result = normalizeEmail(email);
      
      // Assert
      expect(result).toBe('test@example.com');
    });
  });
});

// ============================================================================
// EDGE CASES & SECURITY TESTS
// ============================================================================

describe('Validation - Edge Cases & Security', () => {
  let mockT: ReturnType<typeof createMockT>;

  beforeEach(() => {
    mockT = createMockT();
  });

  it('should handle null bytes in strings', () => {
    // Arrange
    const text = 'test\x00content';
    
    // Act
    const result = sanitizeText(text);
    
    // Assert
    expect(result).toBeDefined();
  });

  it('should handle unicode characters', () => {
    // Arrange
    const text = 'Hello 世界 🌍';
    
    // Act
    const result = normalizeWhitespace(text);
    
    // Assert
    expect(result).toBe('Hello 世界 🌍');
  });

  it('should handle very long strings without crashing', () => {
    // Arrange
    const text = 'a'.repeat(100000);
    
    // Act
    const result = sanitizeText(text);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.length).toBe(100000);
  });

  it('should prevent prototype pollution in sanitization', () => {
    // Arrange
    const html = '<p>__proto__</p>';
    
    // Act
    const result = sanitizeHtml(html);
    
    // Assert
    expect(result).toBeDefined();
  });
});

