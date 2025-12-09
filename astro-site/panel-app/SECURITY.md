# 🔒 Security & Privacy Guidelines

**Frontend Security Best Practices for AsistanApp Panel**

This document outlines security measures, privacy considerations, and best practices for frontend development.

---

## 📋 Table of Contents

1. [Input Sanitization](#input-sanitization)
2. [XSS Prevention](#xss-prevention)
3. [CSRF Protection](#csrf-protection)
4. [Data Privacy (KVKK)](#data-privacy-kvkk)
5. [Authentication & Authorization](#authentication--authorization)
6. [Secure Storage](#secure-storage)
7. [API Security](#api-security)
8. [Third-Party Dependencies](#third-party-dependencies)
9. [Security Checklist](#security-checklist)

---

## 🛡️ Input Sanitization

### HTML Injection Prevention

```typescript
// ❌ BAD: Directly rendering user input as HTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ GOOD: Sanitize HTML before rendering
import DOMPurify from 'dompurify';

const sanitizedHTML = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
  ALLOWED_ATTR: ['href'],
});

<div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
```

### Form Input Validation

```typescript
import { z } from 'zod';

// Define strict validation schemas
const userInputSchema = z.object({
  email: z.string().email().max(255),
  message: z.string().min(1).max(5000).trim(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
});

// Validate before processing
try {
  const validData = userInputSchema.parse(formData);
  // Process valid data
} catch (error) {
  // Handle validation errors
}
```

### URL Validation

```typescript
// ❌ BAD: Direct window.location assignment
window.location.href = userProvidedURL;

// ✅ GOOD: Validate URLs before navigation
function isValidURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Only allow http/https protocols
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

if (isValidURL(userProvidedURL)) {
  window.location.href = userProvidedURL;
}
```

---

## 🚫 XSS Prevention

### Content Security Policy (CSP)

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               font-src 'self' data:; 
               connect-src 'self' https://api.asistanapp.com;">
```

### React's Built-in Protection

```typescript
// ✅ React automatically escapes JSX content
const userMessage = "<script>alert('xss')</script>";
<div>{userMessage}</div> // Rendered as text, not executed

// ❌ Only use dangerouslySetInnerHTML when absolutely necessary
// and ALWAYS sanitize first
```

### Safe innerHTML Patterns

```typescript
import { sanitizeHTML } from '@/shared/utils/sanitize';

// Custom sanitization utility
export function sanitizeHTML(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

// Or use DOMPurify for rich content
import DOMPurify from 'dompurify';

export function sanitizeRichContent(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
}
```

---

## 🔐 CSRF Protection

### API Request Headers

```typescript
// API client with CSRF token
import { apiClient } from '@/lib/api/client';

apiClient.interceptors.request.use((config) => {
  // Add CSRF token from meta tag or cookie
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  
  return config;
});
```

### SameSite Cookie Configuration

```typescript
// Backend should set cookies with:
// Set-Cookie: session=...; SameSite=Strict; Secure; HttpOnly
```

---

## 🇹🇷 Data Privacy (KVKK)

### Minimal Data Collection

```typescript
// ❌ BAD: Collecting unnecessary data
const userData = {
  email,
  password,
  ssn,              // ❌ Not needed
  creditCard,       // ❌ Not needed
  location,         // ❌ May not be needed
};

// ✅ GOOD: Only collect what's necessary
const userData = {
  email,
  hashedPassword,   // ✅ Never store plain passwords
  consent: {
    marketing: userConsent,
    analytics: userConsent,
  },
};
```

### LocalStorage & Cookie Management

```typescript
// Encrypt sensitive data before storing
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

export function secureStore(key: string, value: any): void {
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(value),
    ENCRYPTION_KEY
  ).toString();
  
  localStorage.setItem(key, encrypted);
}

export function secureRetrieve<T>(key: string): T | null {
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return null;
  
  try {
    const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  } catch {
    return null;
  }
}
```

### Data Retention Policy

```typescript
// Auto-clear sensitive data after inactivity
let inactivityTimer: NodeJS.Timeout;

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  
  inactivityTimer = setTimeout(() => {
    // Clear sensitive data
    localStorage.removeItem('session');
    sessionStorage.clear();
    
    // Redirect to login
    window.location.href = '/login';
  }, 30 * 60 * 1000); // 30 minutes
}

// Reset timer on user activity
['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
  document.addEventListener(event, resetInactivityTimer);
});
```

### KVKK Consent Management

```typescript
interface ConsentPreferences {
  necessary: boolean;      // Always true
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

export function saveConsent(preferences: ConsentPreferences): void {
  localStorage.setItem('kvkk-consent', JSON.stringify({
    ...preferences,
    timestamp: new Date().toISOString(),
    version: '1.0',
  }));
}

export function hasValidConsent(): boolean {
  const consent = localStorage.getItem('kvkk-consent');
  if (!consent) return false;
  
  const parsed = JSON.parse(consent);
  const consentDate = new Date(parsed.timestamp);
  const now = new Date();
  
  // Consent expires after 1 year
  const oneYear = 365 * 24 * 60 * 60 * 1000;
  return (now.getTime() - consentDate.getTime()) < oneYear;
}
```

---

## 🔑 Authentication & Authorization

### Token Management

```typescript
// Store tokens securely
export const authService = {
  setTokens(accessToken: string, refreshToken: string): void {
    // Use HttpOnly cookies for refresh token (backend)
    // Store access token in memory or sessionStorage (short-lived)
    sessionStorage.setItem('access_token', accessToken);
  },
  
  getAccessToken(): string | null {
    return sessionStorage.getItem('access_token');
  },
  
  clearTokens(): void {
    sessionStorage.removeItem('access_token');
    // Clear cookies via API call to backend
  },
};
```

### Route Protection

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedRoute({ children, requiredRole }: { 
  children: React.ReactNode;
  requiredRole?: string;
}) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
}
```

---

## 💾 Secure Storage

### What to Store Where

```typescript
// ✅ SessionStorage: Short-lived, per-tab data
sessionStorage.setItem('access_token', token);
sessionStorage.setItem('temp_form_data', JSON.stringify(formData));

// ✅ LocalStorage: Long-lived, non-sensitive preferences
localStorage.setItem('theme', 'dark');
localStorage.setItem('language', 'tr');

// ❌ NEVER store in LocalStorage/SessionStorage:
// - Passwords
// - Credit card numbers
// - Social security numbers
// - Unencrypted tokens
// - Personal health information
```

### IndexedDB for Large Data

```typescript
import { openDB } from 'idb';

const db = await openDB('AsistanApp', 1, {
  upgrade(db) {
    // Create object stores
    db.createObjectStore('conversations', { keyPath: 'id' });
  },
});

// Store conversation cache
await db.put('conversations', conversationData);

// Retrieve
const cached = await db.get('conversations', id);
```

---

## 🌐 API Security

### Request Signing

```typescript
import { createHmac } from 'crypto-js';

export function signRequest(payload: any, secret: string): string {
  const timestamp = Date.now();
  const message = `${timestamp}.${JSON.stringify(payload)}`;
  const signature = createHmac('sha256', secret).update(message).digest('hex');
  
  return `${timestamp}.${signature}`;
}

// Add to request headers
config.headers['X-Signature'] = signRequest(data, API_SECRET);
config.headers['X-Timestamp'] = timestamp;
```

### Rate Limiting (Client-Side)

```typescript
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  canMakeRequest(endpoint: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const key = endpoint;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const timestamps = this.requests.get(key)!;
    
    // Remove old timestamps
    const validTimestamps = timestamps.filter(t => now - t < windowMs);
    
    if (validTimestamps.length >= maxRequests) {
      return false;
    }
    
    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);
    
    return true;
  }
}

export const rateLimiter = new RateLimiter();
```

---

## 📦 Third-Party Dependencies

### Audit Dependencies Regularly

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Manual review
npm audit --json > audit-report.json
```

### Dependency Review Checklist

- [ ] Check npm package reputation (downloads, stars, maintainers)
- [ ] Review package permissions and access
- [ ] Check for known vulnerabilities
- [ ] Verify package signature if available
- [ ] Review bundle size impact
- [ ] Check last update date (avoid abandoned packages)

### Subresource Integrity (SRI)

```html
<!-- Use SRI for CDN resources -->
<script 
  src="https://cdn.example.com/library.js" 
  integrity="sha384-..." 
  crossorigin="anonymous">
</script>
```

---

## ✅ Security Checklist

### Development Phase
- [ ] Sanitize all user inputs before rendering
- [ ] Validate all form data with strict schemas
- [ ] Use HTTPS for all API calls
- [ ] Implement CSP headers
- [ ] Enable SameSite cookies
- [ ] Never store sensitive data in LocalStorage
- [ ] Encrypt data before storing locally
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Use secure authentication patterns

### Code Review Phase
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] No direct `eval()` or `Function()` usage
- [ ] No inline event handlers (`onclick=`)
- [ ] All external URLs are validated
- [ ] No hardcoded secrets or API keys
- [ ] All API responses are validated
- [ ] Error messages don't leak sensitive information

### Pre-Production Phase
- [ ] Run security audit (`npm audit`)
- [ ] Check for exposed environment variables
- [ ] Review CSP configuration
- [ ] Test authentication flows
- [ ] Verify KVKK compliance
- [ ] Check data retention policies
- [ ] Review access controls
- [ ] Test error handling

### Production Monitoring
- [ ] Monitor for unusual API activity
- [ ] Log and alert on authentication failures
- [ ] Track and investigate XSS attempts
- [ ] Monitor third-party dependencies
- [ ] Regular security audits
- [ ] Incident response plan

---

## 🚨 Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Email: security@asistanapp.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours.

---

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [KVKK (Turkish GDPR)](https://www.kvkk.gov.tr/)
- [Web Security MDN](https://developer.mozilla.org/en-US/docs/Web/Security)

---

**Last Updated**: October 30, 2025  
**Version**: 1.0.0  
**Security Team**: security@asistanapp.com


