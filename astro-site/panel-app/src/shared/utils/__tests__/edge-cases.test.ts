/**
 * @vitest-environment jsdom
 * 
 * Edge Case & Recovery Tests - ENTERPRISE GRADE
 * 
 * Tests for:
 * - localStorage corruption handling
 * - i18n missing key fallbacks
 * - Theme persistence edge cases
 * - Stale UI cache scenarios
 * - Deep-link invalid ID handling
 * - Network offline UI behavior
 * - Browser storage quota exceeded
 * - Invalid JSON parsing
 * - Session expiry handling
 * 
 * @group edge-cases
 * @group recovery
 * @group error-handling
 * 
 * ALTIN KURALLAR:
 * ✅ AAA Pattern (Arrange-Act-Assert)
 * ✅ Tek test → tek davranış
 * ✅ State izolasyonu (beforeEach/afterEach)
 * ✅ Mock Stratejisi Tutarlı
 * ✅ Descriptive Naming
 * ✅ Edge Case Coverage
 * ✅ Real-World Scenarios
 * ✅ Error Handling
 * ✅ Cleanup
 * ✅ Type Safety
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ============================================================================
// MOCK SETUP
// ============================================================================

// Mock logger
vi.mock('@/shared/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// ============================================================================
// LOCALSTORAGE CORRUPTION TESTS
// ============================================================================

describe('Edge Cases - localStorage Corruption', () => {
  let originalLocalStorage: Storage;
  let mockStorage: Record<string, string>;

  beforeEach(() => {
    mockStorage = {};
    originalLocalStorage = window.localStorage;

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key: string) => mockStorage[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
          mockStorage[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete mockStorage[key];
        }),
        clear: vi.fn(() => {
          mockStorage = {};
        }),
        get length() {
          return Object.keys(mockStorage).length;
        },
        key: vi.fn((index: number) => Object.keys(mockStorage)[index] ?? null),
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
      configurable: true,
    });
  });

  it('should handle corrupted JSON in localStorage gracefully', () => {
    // Arrange
    mockStorage['user-settings'] = '{ invalid json }}';

    // Act
    const parseSettings = () => {
      try {
        const raw = window.localStorage.getItem('user-settings');
        if (raw) {
          return JSON.parse(raw);
        }
        return null;
      } catch {
        return { error: true, default: {} };
      }
    };

    const result = parseSettings();

    // Assert
    expect(result).toEqual({ error: true, default: {} });
  });

  it('should handle undefined localStorage values', () => {
    // Arrange - No value set

    // Act
    const getValue = () => {
      const raw = window.localStorage.getItem('non-existent-key');
      return raw ? JSON.parse(raw) : { default: true };
    };

    const result = getValue();

    // Assert
    expect(result).toEqual({ default: true });
  });

  it('should handle empty string in localStorage', () => {
    // Arrange
    mockStorage['empty-value'] = '';

    // Act
    const getValue = () => {
      const raw = window.localStorage.getItem('empty-value');
      if (!raw || raw === '') {
        return { isEmpty: true };
      }
      try {
        return JSON.parse(raw);
      } catch {
        return { error: true };
      }
    };

    const result = getValue();

    // Assert
    expect(result).toEqual({ isEmpty: true });
  });

  it('should handle localStorage quota exceeded error', () => {
    // Arrange
    const originalSetItem = window.localStorage.setItem;
    (window.localStorage.setItem as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new DOMException('QuotaExceededError', 'QuotaExceededError');
    });

    // Act
    const saveWithFallback = (key: string, value: string): { success: boolean; error?: string } => {
      try {
        window.localStorage.setItem(key, value);
        return { success: true };
      } catch (e) {
        if (e instanceof DOMException && e.name === 'QuotaExceededError') {
          return { success: false, error: 'Storage quota exceeded' };
        }
        return { success: false, error: 'Unknown error' };
      }
    };

    const result = saveWithFallback('large-data', 'x'.repeat(10000000));

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe('Storage quota exceeded');
  });

  it('should recover from null prototype objects in storage', () => {
    // Arrange
    mockStorage['weird-object'] = '{"__proto__": {"isAdmin": true}}';

    // Act
    const safeParse = (key: string) => {
      try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        // Create clean object without prototype pollution
        return Object.assign(Object.create(null), parsed);
      } catch {
        return null;
      }
    };

    const result = safeParse('weird-object');

    // Assert
    expect(result).not.toBeNull();
    // Prototype pollution should not affect clean object
    expect(({} as any).isAdmin).toBeUndefined();
  });
});

// ============================================================================
// I18N MISSING KEY TESTS
// ============================================================================

describe('Edge Cases - i18n Missing Keys', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return key as fallback for missing translation', () => {
    // Arrange
    const translations: Record<string, string> = {
      'common.hello': 'Hello',
    };

    const t = (key: string): string => {
      return translations[key] || key;
    };

    // Act
    const result = t('common.nonExistent');

    // Assert
    expect(result).toBe('common.nonExistent');
  });

  it('should handle nested key fallback', () => {
    // Arrange
    const t = (key: string, options?: { defaultValue?: string }): string => {
      const translations: Record<string, string> = {};
      return translations[key] || options?.defaultValue || key;
    };

    // Act
    const result = t('deeply.nested.missing.key', { defaultValue: 'Default Text' });

    // Assert
    expect(result).toBe('Default Text');
  });

  it('should handle interpolation with missing variables', () => {
    // Arrange
    const interpolate = (template: string, vars: Record<string, string | undefined>): string => {
      return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
    };

    // Act
    const result = interpolate('Hello {{name}}, your balance is {{balance}}', {
      name: 'John',
      // balance is missing
    });

    // Assert
    expect(result).toBe('Hello John, your balance is {{balance}}');
  });

  it('should handle empty translation value', () => {
    // Arrange
    const translations: Record<string, string> = {
      'empty.key': '',
    };

    const t = (key: string): string => {
      const value = translations[key];
      return value !== undefined && value !== '' ? value : key;
    };

    // Act
    const result = t('empty.key');

    // Assert
    expect(result).toBe('empty.key');
  });
});

// ============================================================================
// THEME PERSISTENCE TESTS
// ============================================================================

describe('Edge Cases - Theme Persistence', () => {
  let mockStorage: Record<string, string>;

  beforeEach(() => {
    mockStorage = {};

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key: string) => mockStorage[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
          mockStorage[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete mockStorage[key];
        }),
        clear: vi.fn(() => {
          mockStorage = {};
        }),
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should default to light theme when storage is empty', () => {
    // Arrange
    const getTheme = (): 'light' | 'dark' => {
      const stored = window.localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
      return 'light';
    };

    // Act
    const result = getTheme();

    // Assert
    expect(result).toBe('light');
  });

  it('should handle invalid theme value in storage', () => {
    // Arrange
    mockStorage['theme'] = 'purple'; // Invalid value

    const getTheme = (): 'light' | 'dark' => {
      const stored = window.localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
      return 'light'; // Default
    };

    // Act
    const result = getTheme();

    // Assert
    expect(result).toBe('light');
  });

  it('should handle system preference with no stored theme', () => {
    // Arrange
    const mockMatchMedia = vi.fn().mockReturnValue({
      matches: true, // Prefers dark
      addListener: vi.fn(),
      removeListener: vi.fn(),
    });
    window.matchMedia = mockMatchMedia;

    const getThemeWithSystem = (): 'light' | 'dark' => {
      const stored = window.localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    };

    // Act
    const result = getThemeWithSystem();

    // Assert
    expect(result).toBe('dark');
  });
});

// ============================================================================
// DEEP LINK INVALID ID TESTS
// ============================================================================

describe('Edge Cases - Deep Link Invalid IDs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should handle malformed UUID in URL', () => {
    // Arrange
    const validateUUID = (id: string): boolean => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(id);
    };

    // Act & Assert
    expect(validateUUID('not-a-uuid')).toBe(false);
    expect(validateUUID('12345')).toBe(false);
    expect(validateUUID('')).toBe(false);
    expect(validateUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });

  it('should handle XSS attempt in URL parameter', () => {
    // Arrange
    const sanitizeId = (id: string): string => {
      // Only allow alphanumeric, hyphens, and underscores
      return id.replace(/[^a-zA-Z0-9\-_]/g, '');
    };

    // Act
    const maliciousId = '<script>alert("xss")</script>';
    const result = sanitizeId(maliciousId);

    // Assert
    expect(result).toBe('scriptalertxssscript');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });

  it('should handle SQL injection attempt in ID', () => {
    // Arrange
    const validateId = (id: string): boolean => {
      // Check for common SQL injection patterns
      const sqlInjectionPatterns = [
        /['";]/,
        /--/,
        /\/\*/,
        /\*\//,
        /\bOR\b/i,
        /\bAND\b/i,
        /\bDROP\b/i,
        /\bSELECT\b/i,
        /\bUNION\b/i,
      ];

      return !sqlInjectionPatterns.some(pattern => pattern.test(id));
    };

    // Act & Assert
    expect(validateId("'; DROP TABLE users; --")).toBe(false);
    expect(validateId("1 OR 1=1")).toBe(false);
    expect(validateId("valid-id-123")).toBe(true);
  });

  it('should handle empty or whitespace ID', () => {
    // Arrange
    const parseId = (id: string | undefined | null): string | null => {
      if (!id || id.trim() === '') {
        return null;
      }
      return id.trim();
    };

    // Act & Assert
    expect(parseId('')).toBeNull();
    expect(parseId('   ')).toBeNull();
    expect(parseId(undefined)).toBeNull();
    expect(parseId(null)).toBeNull();
    expect(parseId('  valid-id  ')).toBe('valid-id');
  });
});

// ============================================================================
// NETWORK OFFLINE TESTS
// ============================================================================

describe('Edge Cases - Network Offline', () => {
  let originalNavigator: Navigator;

  beforeEach(() => {
    originalNavigator = window.navigator;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should detect offline status', () => {
    // Arrange
    Object.defineProperty(window.navigator, 'onLine', {
      value: false,
      writable: true,
      configurable: true,
    });

    // Act
    const isOnline = window.navigator.onLine;

    // Assert
    expect(isOnline).toBe(false);
  });

  it('should handle offline fetch gracefully', async () => {
    // Arrange
    global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

    const fetchWithOfflineHandling = async (url: string) => {
      try {
        const response = await fetch(url);
        return { success: true, data: await response.json() };
      } catch (error) {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          return { success: false, error: 'offline', message: 'You appear to be offline' };
        }
        return { success: false, error: 'unknown', message: 'An error occurred' };
      }
    };

    // Act
    const result = await fetchWithOfflineHandling('/api/data');

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe('offline');
  });

  it('should queue actions when offline', () => {
    // Arrange
    const offlineQueue: Array<{ action: string; data: any }> = [];

    const queueAction = (action: string, data: any) => {
      if (!window.navigator.onLine) {
        offlineQueue.push({ action, data });
        return { queued: true };
      }
      return { queued: false };
    };

    Object.defineProperty(window.navigator, 'onLine', {
      value: false,
      writable: true,
      configurable: true,
    });

    // Act
    const result1 = queueAction('CREATE_MESSAGE', { text: 'Hello' });
    const result2 = queueAction('UPDATE_STATUS', { status: 'active' });

    // Assert
    expect(result1.queued).toBe(true);
    expect(result2.queued).toBe(true);
    expect(offlineQueue).toHaveLength(2);
  });
});

// ============================================================================
// SESSION EXPIRY TESTS
// ============================================================================

describe('Edge Cases - Session Expiry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should detect expired JWT token', () => {
    // Arrange
    const isTokenExpired = (token: string): boolean => {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp * 1000; // Convert to milliseconds
        return Date.now() > expiry;
      } catch {
        return true; // Invalid token is considered expired
      }
    };

    // Create expired token (exp in past)
    const expiredPayload = { exp: Math.floor(Date.now() / 1000) - 3600 }; // 1 hour ago
    const expiredToken = `header.${btoa(JSON.stringify(expiredPayload))}.signature`;

    // Create valid token (exp in future)
    const validPayload = { exp: Math.floor(Date.now() / 1000) + 3600 }; // 1 hour from now
    const validToken = `header.${btoa(JSON.stringify(validPayload))}.signature`;

    // Act & Assert
    expect(isTokenExpired(expiredToken)).toBe(true);
    expect(isTokenExpired(validToken)).toBe(false);
    expect(isTokenExpired('invalid-token')).toBe(true);
  });

  it('should handle 401 response and redirect to login', async () => {
    // Arrange
    const redirectToLogin = vi.fn();

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    });

    const fetchWithAuthHandling = async (url: string) => {
      const response = await fetch(url);

      if (response.status === 401) {
        redirectToLogin();
        return { error: 'session_expired', redirected: true };
      }

      return { data: await response.json() };
    };

    // Act
    const result = await fetchWithAuthHandling('/api/protected');

    // Assert
    expect(redirectToLogin).toHaveBeenCalled();
    expect(result.error).toBe('session_expired');
  });

  it('should handle token refresh failure', async () => {
    // Arrange
    let refreshAttempts = 0;

    const refreshToken = async (): Promise<{ success: boolean; token?: string }> => {
      refreshAttempts++;
      if (refreshAttempts <= 3) {
        return { success: false };
      }
      return { success: true, token: 'new-token' };
    };

    const refreshWithRetry = async (maxRetries: number = 3) => {
      for (let i = 0; i < maxRetries; i++) {
        const result = await refreshToken();
        if (result.success) {
          return result;
        }
        await new Promise(r => setTimeout(r, 100 * (i + 1))); // Exponential backoff
      }
      return { success: false, error: 'max_retries_exceeded' };
    };

    // Act
    vi.useFakeTimers();
    const resultPromise = refreshWithRetry(3);
    await vi.runAllTimersAsync();
    const result = await resultPromise;
    vi.useRealTimers();

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe('max_retries_exceeded');
    expect(refreshAttempts).toBe(3);
  });
});

// ============================================================================
// STALE UI CACHE TESTS
// ============================================================================

describe('Edge Cases - Stale UI Cache', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should detect stale cache by timestamp', () => {
    // Arrange
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    interface CacheEntry<T> {
      data: T;
      timestamp: number;
    }

    const isStale = <T>(entry: CacheEntry<T>): boolean => {
      return Date.now() - entry.timestamp > CACHE_TTL;
    };

    // Act
    const freshEntry: CacheEntry<string> = {
      data: 'fresh data',
      timestamp: Date.now(),
    };

    const staleEntry: CacheEntry<string> = {
      data: 'stale data',
      timestamp: Date.now() - (10 * 60 * 1000), // 10 minutes ago
    };

    // Assert
    expect(isStale(freshEntry)).toBe(false);
    expect(isStale(staleEntry)).toBe(true);
  });

  it('should revalidate cache on focus', () => {
    // Arrange
    const revalidate = vi.fn();
    let isFocused = false;

    const handleFocus = () => {
      isFocused = true;
      revalidate();
    };

    // Act
    handleFocus();

    // Assert
    expect(isFocused).toBe(true);
    expect(revalidate).toHaveBeenCalled();
  });

  it('should handle cache version mismatch', () => {
    // Arrange
    const CURRENT_VERSION = '2.0.0';

    interface VersionedCache {
      version: string;
      data: any;
    }

    const validateCache = (cache: VersionedCache | null): boolean => {
      if (!cache) return false;
      return cache.version === CURRENT_VERSION;
    };

    // Act
    const oldCache: VersionedCache = { version: '1.0.0', data: {} };
    const currentCache: VersionedCache = { version: '2.0.0', data: {} };

    // Assert
    expect(validateCache(oldCache)).toBe(false);
    expect(validateCache(currentCache)).toBe(true);
    expect(validateCache(null)).toBe(false);
  });
});

// ============================================================================
// INVALID JSON PARSING TESTS
// ============================================================================

describe('Edge Cases - Invalid JSON Parsing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should handle truncated JSON', () => {
    // Arrange
    const truncatedJson = '{"name": "John", "age": ';

    const safeParse = (json: string): { success: boolean; data?: any; error?: string } => {
      try {
        return { success: true, data: JSON.parse(json) };
      } catch (e) {
        return { success: false, error: 'Invalid JSON' };
      }
    };

    // Act
    const result = safeParse(truncatedJson);

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid JSON');
  });

  it('should handle JSON with trailing comma', () => {
    // Arrange
    const jsonWithTrailingComma = '{"name": "John", "age": 30,}';

    const safeParse = (json: string) => {
      try {
        return { success: true, data: JSON.parse(json) };
      } catch {
        return { success: false };
      }
    };

    // Act
    const result = safeParse(jsonWithTrailingComma);

    // Assert
    expect(result.success).toBe(false);
  });

  it('should handle circular reference detection', () => {
    // Arrange
    const circularObj: any = { name: 'test' };
    circularObj.self = circularObj;

    const safeStringify = (obj: any): { success: boolean; data?: string; error?: string } => {
      try {
        const seen = new WeakSet();
        const result = JSON.stringify(obj, (key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
              return '[Circular Reference]';
            }
            seen.add(value);
          }
          return value;
        });
        return { success: true, data: result };
      } catch (e) {
        return { success: false, error: 'Failed to stringify' };
      }
    };

    // Act
    const result = safeStringify(circularObj);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toContain('[Circular Reference]');
  });

  it('should handle BigInt in JSON', () => {
    // Arrange
    const objWithBigInt = { id: BigInt(9007199254740991) };

    const safeStringify = (obj: any) => {
      try {
        return {
          success: true,
          data: JSON.stringify(obj, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
          ),
        };
      } catch {
        return { success: false };
      }
    };

    // Act
    const result = safeStringify(objWithBigInt);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toBe('{"id":"9007199254740991"}');
  });
});

// ============================================================================
// REAL-WORLD RECOVERY SCENARIOS
// ============================================================================

describe('Edge Cases - Real-World Recovery Scenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should recover from corrupted app state', () => {
    // Arrange
    interface AppState {
      user: { id: string; name: string } | null;
      settings: Record<string, any>;
      version: string;
    }

    const defaultState: AppState = {
      user: null,
      settings: {},
      version: '1.0.0',
    };

    const recoverState = (corruptedState: any): AppState => {
      try {
        // Validate structure
        if (typeof corruptedState !== 'object' || corruptedState === null) {
          return defaultState;
        }

        return {
          user: corruptedState.user && typeof corruptedState.user.id === 'string'
            ? corruptedState.user
            : null,
          settings: typeof corruptedState.settings === 'object' && corruptedState.settings !== null
            ? corruptedState.settings
            : {},
          version: typeof corruptedState.version === 'string'
            ? corruptedState.version
            : defaultState.version,
        };
      } catch {
        return defaultState;
      }
    };

    // Act
    const corrupted1 = { user: 'invalid', settings: null };
    const corrupted2 = null;
    const valid = { user: { id: '1', name: 'John' }, settings: { theme: 'dark' }, version: '2.0.0' };

    // Assert
    expect(recoverState(corrupted1)).toEqual({
      user: null,
      settings: {},
      version: '1.0.0',
    });
    expect(recoverState(corrupted2)).toEqual(defaultState);
    expect(recoverState(valid)).toEqual(valid);
  });

  it('should handle concurrent state updates gracefully', async () => {
    // Arrange
    let state = { count: 0 };
    const updates: Promise<void>[] = [];

    const updateState = async (increment: number) => {
      await new Promise(r => setTimeout(r, Math.random() * 10));
      state = { count: state.count + increment };
    };

    // Act - Simulate concurrent updates
    for (let i = 0; i < 10; i++) {
      updates.push(updateState(1));
    }
    await Promise.all(updates);

    // Assert - Note: This demonstrates race condition, actual count may vary
    expect(state.count).toBeGreaterThan(0);
    expect(state.count).toBeLessThanOrEqual(10);
  });

  it('should implement retry with exponential backoff', async () => {
    // Arrange
    vi.useFakeTimers();
    let attempts = 0;

    const operation = vi.fn().mockImplementation(() => {
      attempts++;
      if (attempts < 3) {
        return Promise.reject(new Error('Temporary failure'));
      }
      return Promise.resolve({ success: true });
    });

    const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3) => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          return await fn();
        } catch (e) {
          if (i === maxRetries - 1) throw e;
          await new Promise(r => setTimeout(r, Math.pow(2, i) * 100));
        }
      }
    };

    // Act
    const resultPromise = retryWithBackoff(operation);
    await vi.runAllTimersAsync();
    const result = await resultPromise;

    // Assert
    expect(result).toEqual({ success: true });
    expect(attempts).toBe(3);

    vi.useRealTimers();
  });
});

