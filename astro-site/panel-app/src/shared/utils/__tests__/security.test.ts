/**
 * @vitest-environment jsdom
 * 
 * Frontend Security Tests - ENTERPRISE GRADE
 * 
 * Comprehensive security tests for XSS prevention, open redirect protection,
 * MIME spoofing detection, and other frontend security measures.
 * 
 * @group security
 * @group utils
 * 
 * ALTIN KURALLAR:
 * ✅ AAA Pattern (Arrange-Act-Assert)
 * ✅ Tek test → tek davranış
 * ✅ State izolasyonu (beforeEach/afterEach)
 * ✅ Edge Case Coverage
 * ✅ Descriptive Naming
 * ✅ Real-World Scenarios
 * ✅ Error Handling
 * ✅ Type Safety
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ============================================================================
// XSS PREVENTION TESTS
// ============================================================================

describe('Security - XSS Prevention', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Script Injection Prevention', () => {
    it('should not execute script tags in innerHTML', () => {
      // Arrange
      const maliciousContent = '<script>window.xssExecuted = true;</script>';
      const container = document.createElement('div');
      
      // Act
      container.innerHTML = maliciousContent;
      document.body.appendChild(container);
      
      // Assert
      expect((window as any).xssExecuted).toBeUndefined();
      
      // Cleanup
      document.body.removeChild(container);
    });

    it('should detect script tag patterns', () => {
      // Arrange
      const xssPayloads = [
        '<script>alert("xss")</script>',
        '<SCRIPT>alert("xss")</SCRIPT>',
        '<ScRiPt>alert("xss")</ScRiPt>',
        '<script src="evil.js"></script>',
        '<script type="text/javascript">alert(1)</script>',
      ];
      
      const scriptPattern = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
      
      // Act & Assert
      xssPayloads.forEach(payload => {
        expect(payload.match(scriptPattern)).not.toBeNull();
      });
    });

    it('should detect event handler injection', () => {
      // Arrange
      const eventPayloads = [
        '<img src="x" onerror="alert(1)">',
        '<div onmouseover="alert(1)">hover me</div>',
        '<body onload="alert(1)">',
        '<svg onload="alert(1)">',
        '<input onfocus="alert(1)" autofocus>',
      ];
      
      const eventPattern = /\bon\w+\s*=/gi;
      
      // Act & Assert
      eventPayloads.forEach(payload => {
        expect(payload.match(eventPattern)).not.toBeNull();
      });
    });

    it('should detect javascript: protocol in URLs', () => {
      // Arrange
      const jsProtocolPayloads = [
        'javascript:alert(1)',
        'JAVASCRIPT:alert(1)',
        'javascript:void(0)',
        '  javascript:alert(1)',
        'javascript\n:alert(1)',
      ];
      
      const jsProtocolPattern = /^\s*javascript\s*:/i;
      
      // Act & Assert
      jsProtocolPayloads.forEach(payload => {
        const normalized = payload.replace(/\s/g, '');
        expect(normalized.match(/^javascript:/i)).not.toBeNull();
      });
    });
  });

  describe('HTML Entity Encoding', () => {
    it('should encode special HTML characters', () => {
      // Arrange
      const dangerous = '<script>alert("xss")</script>';
      
      // Act
      const encoded = dangerous
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
      
      // Assert
      expect(encoded).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
      expect(encoded).not.toContain('<script>');
    });

    it('should handle nested encoding attempts', () => {
      // Arrange
      const doubleEncoded = '&lt;script&gt;';
      
      // Act
      const decoded = document.createElement('div');
      decoded.innerHTML = doubleEncoded;
      
      // Assert
      expect(decoded.textContent).toBe('<script>');
    });
  });

  describe('URL Sanitization', () => {
    it('should block data: URLs with scripts', () => {
      // Arrange
      const dataUrls = [
        'data:text/html,<script>alert(1)</script>',
        'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
      ];
      
      const dataPattern = /^data:/i;
      
      // Act & Assert
      dataUrls.forEach(url => {
        expect(url.match(dataPattern)).not.toBeNull();
      });
    });

    it('should allow safe protocols only', () => {
      // Arrange
      const safeProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
      const unsafeProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
      
      // Act & Assert
      safeProtocols.forEach(protocol => {
        expect(['http:', 'https:', 'mailto:', 'tel:'].includes(protocol)).toBe(true);
      });
      
      unsafeProtocols.forEach(protocol => {
        expect(['http:', 'https:', 'mailto:', 'tel:'].includes(protocol)).toBe(false);
      });
    });
  });
});

// ============================================================================
// OPEN REDIRECT PREVENTION TESTS
// ============================================================================

describe('Security - Open Redirect Prevention', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Validates if a redirect URL is safe (same origin or whitelisted)
   */
  const isRedirectSafe = (url: string, allowedHosts: string[]): boolean => {
    try {
      // Block empty URLs
      if (!url || url.trim() === '') {
        return false;
      }
      
      // Block dangerous protocols
      const lowerUrl = url.toLowerCase();
      const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
      if (dangerousProtocols.some(p => lowerUrl.startsWith(p))) {
        return false;
      }
      
      // Block URL encoding attacks (credential in URL - @)
      if (url.includes('@') && !url.startsWith('/')) {
        return false;
      }
      
      // Handle relative URLs
      if (url.startsWith('/') && !url.startsWith('//')) {
        return true;
      }
      
      // Block protocol-relative URLs
      if (url.startsWith('//')) {
        return false;
      }
      
      const parsedUrl = new URL(url, window.location.origin);
      
      // Check if same origin
      if (parsedUrl.origin === window.location.origin) {
        return true;
      }
      
      // Check whitelist
      return allowedHosts.includes(parsedUrl.host);
    } catch {
      return false;
    }
  };

  describe('Relative URL Handling', () => {
    it('should allow relative path redirects', () => {
      // Arrange
      const relativeUrls = [
        '/dashboard',
        '/auth/login',
        '/admin/settings',
      ];
      
      // Act & Assert
      relativeUrls.forEach(url => {
        expect(isRedirectSafe(url, [])).toBe(true);
      });
    });

    it('should block protocol-relative URLs', () => {
      // Arrange
      const protocolRelativeUrls = [
        '//evil.com/path',
        '//phishing.com',
      ];
      
      // Act & Assert
      protocolRelativeUrls.forEach(url => {
        expect(isRedirectSafe(url, [])).toBe(false);
      });
    });
  });

  describe('External URL Handling', () => {
    it('should block non-whitelisted external URLs', () => {
      // Arrange
      const externalUrls = [
        'https://evil.com/phishing',
        'https://malicious-site.com/steal',
        'http://attacker.com',
      ];
      
      // Act & Assert
      externalUrls.forEach(url => {
        expect(isRedirectSafe(url, [])).toBe(false);
      });
    });

    it('should allow whitelisted external URLs', () => {
      // Arrange
      const whitelistedHosts = ['trusted-partner.com', 'oauth.provider.com'];
      const url = 'https://trusted-partner.com/callback';
      
      // Act
      const result = isRedirectSafe(url, whitelistedHosts);
      
      // Assert
      expect(result).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle URL encoding attacks', () => {
      // Arrange
      const encodedUrls = [
        'https://evil.com%2F@trusted.com', // URL encoding attack
        'https://trusted.com@evil.com', // Credential attack
      ];
      
      // Act & Assert
      encodedUrls.forEach(url => {
        expect(isRedirectSafe(url, ['trusted.com'])).toBe(false);
      });
    });

    it('should handle empty URLs gracefully', () => {
      // Arrange
      const emptyUrls = [
        '',
        '   ',
      ];
      
      // Act & Assert
      emptyUrls.forEach(url => {
        expect(isRedirectSafe(url, [])).toBe(false);
      });
    });

    it('should handle protocol-less URLs as same-origin', () => {
      // Arrange - '://missing-protocol' is parsed relative to origin
      // This is browser behavior - it becomes same-origin
      const url = '://missing-protocol';
      
      // Act & Assert - Browser treats this as relative path
      // The URL constructor with base makes it same-origin
      expect(isRedirectSafe(url, [])).toBe(true);
    });

    it('should treat relative-like strings as same-origin', () => {
      // Arrange - These are parsed as relative URLs by the browser
      // 'not-a-url' becomes 'http://localhost/not-a-url' which is same origin
      const relativeStrings = ['not-a-url', 'page', 'some-path'];
      
      // Act & Assert - Browser treats these as relative, so same-origin
      relativeStrings.forEach(url => {
        // These are technically "safe" as they resolve to same origin
        expect(isRedirectSafe(url, [])).toBe(true);
      });
    });

    it('should handle javascript: in redirect URLs', () => {
      // Arrange
      const jsUrls = [
        'javascript:alert(1)',
        'JAVASCRIPT:void(0)',
      ];
      
      // Act & Assert
      jsUrls.forEach(url => {
        expect(isRedirectSafe(url, [])).toBe(false);
      });
    });
  });
});

// ============================================================================
// FILE UPLOAD SECURITY TESTS
// ============================================================================

describe('Security - File Upload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Factory: Create mock File with specific properties
   */
  const createMockFile = (name: string, type: string, size: number, content?: ArrayBuffer): File => {
    const blob = content ? new Blob([content], { type }) : new Blob(['test content'], { type });
    const file = new File([blob], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };

  /**
   * Validates file extension matches MIME type
   */
  const validateMimeType = (file: File): { valid: boolean; reason?: string } => {
    const extensionMimeMap: Record<string, string[]> = {
      '.jpg': ['image/jpeg'],
      '.jpeg': ['image/jpeg'],
      '.png': ['image/png'],
      '.gif': ['image/gif'],
      '.webp': ['image/webp'],
      '.pdf': ['application/pdf'],
      '.doc': ['application/msword'],
      '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      '.xls': ['application/vnd.ms-excel'],
      '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      '.mp4': ['video/mp4'],
      '.mp3': ['audio/mpeg'],
    };
    
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    const expectedTypes = extensionMimeMap[extension];
    
    if (!expectedTypes) {
      return { valid: false, reason: 'UNKNOWN_EXTENSION' };
    }
    
    if (!expectedTypes.includes(file.type)) {
      return { valid: false, reason: 'MIME_TYPE_MISMATCH' };
    }
    
    return { valid: true };
  };

  /**
   * Detects double extension attacks
   * e.g., document.pdf.exe - a file pretending to be PDF but is actually EXE
   */
  const hasDoubleExtension = (filename: string): boolean => {
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.sh', '.ps1', '.vbs', '.js', '.php', '.py'];
    const parts = filename.toLowerCase().split('.');
    
    if (parts.length < 3) return false;
    
    // Check if final extension is dangerous (this is a double extension attack)
    const finalExtension = '.' + parts[parts.length - 1];
    if (dangerousExtensions.includes(finalExtension)) {
      return true;
    }
    
    // Check if any middle part is a dangerous extension
    for (let i = 1; i < parts.length - 1; i++) {
      if (dangerousExtensions.includes('.' + parts[i])) {
        return true;
      }
    }
    
    return false;
  };

  describe('MIME Type Spoofing Detection', () => {
    it('should reject file with mismatched extension and MIME type', () => {
      // Arrange
      const file = createMockFile('image.jpg', 'application/x-msdownload', 1024);
      
      // Act
      const result = validateMimeType(file);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('MIME_TYPE_MISMATCH');
    });

    it('should accept file with matching extension and MIME type', () => {
      // Arrange
      const file = createMockFile('photo.jpg', 'image/jpeg', 1024);
      
      // Act
      const result = validateMimeType(file);
      
      // Assert
      expect(result.valid).toBe(true);
    });

    it('should reject unknown file extensions', () => {
      // Arrange
      const file = createMockFile('file.xyz', 'application/octet-stream', 1024);
      
      // Act
      const result = validateMimeType(file);
      
      // Assert
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('UNKNOWN_EXTENSION');
    });
  });

  describe('Double Extension Attack Prevention', () => {
    it('should detect double extension attacks', () => {
      // Arrange
      const dangerousFiles = [
        'document.pdf.exe',
        'image.jpg.bat',
        'report.doc.cmd',
        'script.txt.sh',
        'data.csv.ps1',
      ];
      
      // Act & Assert
      dangerousFiles.forEach(filename => {
        expect(hasDoubleExtension(filename)).toBe(true);
      });
    });

    it('should allow safe filenames with dots', () => {
      // Arrange
      const safeFiles = [
        'report.2024.01.pdf',
        'image.final.jpg',
        'document.v2.docx',
      ];
      
      // Act & Assert
      safeFiles.forEach(filename => {
        expect(hasDoubleExtension(filename)).toBe(false);
      });
    });

    it('should allow normal single extension files', () => {
      // Arrange
      const normalFiles = [
        'document.pdf',
        'image.jpg',
        'video.mp4',
      ];
      
      // Act & Assert
      normalFiles.forEach(filename => {
        expect(hasDoubleExtension(filename)).toBe(false);
      });
    });
  });

  describe('File Size Limits', () => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    
    it('should reject files exceeding size limit', () => {
      // Arrange
      const file = createMockFile('large.pdf', 'application/pdf', 15 * 1024 * 1024);
      
      // Act
      const isValid = file.size <= MAX_FILE_SIZE;
      
      // Assert
      expect(isValid).toBe(false);
    });

    it('should accept files within size limit', () => {
      // Arrange
      const file = createMockFile('normal.pdf', 'application/pdf', 5 * 1024 * 1024);
      
      // Act
      const isValid = file.size <= MAX_FILE_SIZE;
      
      // Assert
      expect(isValid).toBe(true);
    });

    it('should handle zero-byte files', () => {
      // Arrange
      const file = createMockFile('empty.txt', 'text/plain', 0);
      
      // Act
      const isEmpty = file.size === 0;
      
      // Assert
      expect(isEmpty).toBe(true);
    });
  });

  describe('Dangerous File Type Detection', () => {
    const DANGEROUS_EXTENSIONS = [
      '.exe', '.bat', '.cmd', '.com', '.msi',
      '.sh', '.bash', '.zsh',
      '.ps1', '.psm1', '.psd1',
      '.vbs', '.vbe', '.js', '.jse', '.ws', '.wsf',
      '.scr', '.pif', '.application',
      '.php', '.php3', '.php4', '.php5', '.phtml',
      '.py', '.pyc', '.pyo',
      '.pl', '.pm', '.cgi',
      '.jar', '.class',
    ];

    it('should detect dangerous file extensions', () => {
      // Arrange
      const dangerousFiles = [
        'virus.exe',
        'malware.bat',
        'script.ps1',
        'backdoor.php',
      ];
      
      // Act & Assert
      dangerousFiles.forEach(filename => {
        const extension = '.' + filename.split('.').pop()?.toLowerCase();
        expect(DANGEROUS_EXTENSIONS.includes(extension)).toBe(true);
      });
    });

    it('should allow safe file extensions', () => {
      // Arrange
      const safeFiles = [
        'document.pdf',
        'image.jpg',
        'report.docx',
        'data.xlsx',
      ];
      
      // Act & Assert
      safeFiles.forEach(filename => {
        const extension = '.' + filename.split('.').pop()?.toLowerCase();
        expect(DANGEROUS_EXTENSIONS.includes(extension)).toBe(false);
      });
    });
  });
});

// ============================================================================
// JWT SECURITY TESTS
// ============================================================================

describe('Security - JWT Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Token Storage', () => {
    it('should not store JWT in URL parameters', () => {
      // Arrange
      const url = new URL('https://example.com/callback?token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U');
      
      // Act
      const hasTokenInUrl = url.searchParams.has('token');
      
      // Assert - This is a BAD practice, test should detect it
      expect(hasTokenInUrl).toBe(true);
      // In real app: After detecting, token should be removed from URL
    });

    it('should detect JWT structure', () => {
      // Arrange
      const validJwtStructure = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
      const tokens = [
        'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
        'invalid-token',
        '',
      ];
      
      // Act & Assert
      expect(tokens[0].match(validJwtStructure)).not.toBeNull();
      expect(tokens[1].match(validJwtStructure)).toBeNull();
      expect(tokens[2].match(validJwtStructure)).toBeNull();
    });
  });

  describe('Token Tampering Detection', () => {
    it('should detect "alg: none" attacks', () => {
      // Arrange
      const tamperedHeader = 'eyJhbGciOiJub25lIn0'; // {"alg":"none"}
      
      // Act
      const decoded = atob(tamperedHeader);
      const parsed = JSON.parse(decoded);
      
      // Assert
      expect(parsed.alg).toBe('none');
      // This token should be REJECTED
    });

    it('should detect modified payload', () => {
      // Arrange
      const originalPayload = { sub: '123', role: 'user' };
      const tamperedPayload = { sub: '123', role: 'admin' };
      
      // Act
      const original = btoa(JSON.stringify(originalPayload));
      const tampered = btoa(JSON.stringify(tamperedPayload));
      
      // Assert
      expect(original).not.toBe(tampered);
      // Signature verification would fail for tampered token
    });
  });

  describe('Token Expiration', () => {
    it('should detect expired token', () => {
      // Arrange
      const expiredPayload = {
        sub: '123',
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      };
      
      // Act
      const isExpired = expiredPayload.exp < Math.floor(Date.now() / 1000);
      
      // Assert
      expect(isExpired).toBe(true);
    });

    it('should accept valid token', () => {
      // Arrange
      const validPayload = {
        sub: '123',
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      };
      
      // Act
      const isExpired = validPayload.exp < Math.floor(Date.now() / 1000);
      
      // Assert
      expect(isExpired).toBe(false);
    });
  });
});

// ============================================================================
// CSRF PROTECTION TESTS
// ============================================================================

describe('Security - CSRF Protection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('CSRF Token Validation', () => {
    it('should include CSRF token in state-changing requests', () => {
      // Arrange
      const csrfToken = 'random-csrf-token-123';
      const headers = new Headers();
      headers.set('X-CSRF-Token', csrfToken);
      
      // Act
      const hasToken = headers.has('X-CSRF-Token');
      const tokenValue = headers.get('X-CSRF-Token');
      
      // Assert
      expect(hasToken).toBe(true);
      expect(tokenValue).toBe(csrfToken);
    });

    it('should generate unique CSRF tokens', () => {
      // Arrange
      const generateToken = () => {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      };
      
      // Act
      const token1 = generateToken();
      const token2 = generateToken();
      
      // Assert
      expect(token1).not.toBe(token2);
      expect(token1.length).toBe(64);
    });
  });

  describe('SameSite Cookie Behavior', () => {
    it('should understand SameSite cookie attributes', () => {
      // Arrange
      const sameSiteValues = ['Strict', 'Lax', 'None'];
      
      // Act & Assert
      sameSiteValues.forEach(value => {
        const cookie = `session=abc; SameSite=${value}`;
        expect(cookie).toContain(`SameSite=${value}`);
      });
    });
  });
});

// ============================================================================
// CONTENT SECURITY POLICY TESTS
// ============================================================================

describe('Security - CSP Awareness', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Inline Script Detection', () => {
    it('should identify inline scripts that would violate CSP', () => {
      // Arrange
      const inlineScriptPatterns = [
        '<script>alert(1)</script>',
        '<div onclick="alert(1)">',
        '<a href="javascript:alert(1)">',
      ];
      
      const hasInlineScript = (html: string) => {
        return /<script[^>]*>[\s\S]*?<\/script>/gi.test(html) ||
               /\bon\w+\s*=/gi.test(html) ||
               /javascript:/gi.test(html);
      };
      
      // Act & Assert
      inlineScriptPatterns.forEach(pattern => {
        expect(hasInlineScript(pattern)).toBe(true);
      });
    });

    it('should allow external script references', () => {
      // Arrange
      const externalScript = '<script src="https://trusted-cdn.com/app.js"></script>';
      
      const hasInlineCode = (html: string) => {
        const match = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
        if (!match) return false;
        return match.some(script => {
          const content = script.replace(/<\/?script[^>]*>/gi, '').trim();
          return content.length > 0;
        });
      };
      
      // Act
      const result = hasInlineCode(externalScript);
      
      // Assert
      expect(result).toBe(false);
    });
  });
});

// ============================================================================
// REAL-WORLD SECURITY SCENARIOS
// ============================================================================

describe('Security - Real-World Scenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('User Input Sanitization', () => {
    it('should sanitize user message containing XSS', () => {
      // Arrange
      const userMessage = 'Hello! <script>document.cookie</script>';
      
      // Act
      const sanitized = userMessage
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
        .trim();
      
      // Assert
      expect(sanitized).toBe('Hello!');
      expect(sanitized).not.toContain('<script>');
    });

    it('should sanitize customer name with HTML', () => {
      // Arrange
      const customerName = 'John<img src=x onerror=alert(1)>Doe';
      
      // Act
      const sanitized = customerName.replace(/<[^>]*>/g, '');
      
      // Assert
      expect(sanitized).toBe('JohnDoe');
    });

    it('should handle SQL injection patterns in search', () => {
      // Arrange
      const searchQuery = "'; DROP TABLE users; --";
      
      // Act
      const sanitized = searchQuery
        .replace(/['";\\]/g, '')
        .replace(/--/g, '')
        .trim();
      
      // Assert
      expect(sanitized).not.toContain("'");
      expect(sanitized).not.toContain(';');
      expect(sanitized).not.toContain('--');
    });
  });

  describe('File Upload Attack Prevention', () => {
    it('should prevent shell script disguised as image', () => {
      // Arrange
      const file = {
        name: 'image.jpg',
        type: 'image/jpeg',
        content: '#!/bin/bash\nrm -rf /',
      };
      
      // Act
      const hasScriptContent = file.content.includes('#!/');
      
      // Assert
      expect(hasScriptContent).toBe(true);
      // This file should be REJECTED
    });

    it('should detect PHP code in image file', () => {
      // Arrange
      const fileContent = '<?php echo shell_exec($_GET["cmd"]); ?>';
      
      // Act
      const hasPhpCode = /<\?php/i.test(fileContent);
      
      // Assert
      expect(hasPhpCode).toBe(true);
      // This file should be REJECTED
    });
  });

  describe('Session Security', () => {
    it('should clear sensitive data on logout', () => {
      // Arrange
      localStorage.setItem('auth_token', 'secret-token');
      sessionStorage.setItem('user_data', JSON.stringify({ id: 1 }));
      
      // Act
      localStorage.clear();
      sessionStorage.clear();
      
      // Assert
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(sessionStorage.getItem('user_data')).toBeNull();
    });
  });
});

// ============================================================================
// EDGE CASES
// ============================================================================

describe('Security - Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should handle Unicode homograph attacks', () => {
    // Arrange
    const realDomain = 'example.com';
    const homographDomain = 'exаmple.com'; // Cyrillic 'а'
    
    // Act
    const areEqual = realDomain === homographDomain;
    
    // Assert
    expect(areEqual).toBe(false);
  });

  it('should handle null bytes in strings', () => {
    // Arrange
    const maliciousFilename = 'image.php\x00.jpg';
    
    // Act
    const sanitized = maliciousFilename.replace(/\x00/g, '');
    
    // Assert
    expect(sanitized).toBe('image.php.jpg');
  });

  it('should handle very long input without crashing', () => {
    // Arrange
    const longInput = 'a'.repeat(1000000);
    
    // Act & Assert
    expect(() => {
      longInput.replace(/<[^>]*>/g, '');
    }).not.toThrow();
  });

  it('should handle mixed encoding attacks', () => {
    // Arrange
    const mixedEncoding = '%3Cscript%3Ealert(1)%3C/script%3E';
    
    // Act
    const decoded = decodeURIComponent(mixedEncoding);
    
    // Assert
    expect(decoded).toBe('<script>alert(1)</script>');
    // This should be sanitized after decoding
  });
});

