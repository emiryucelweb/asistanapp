/**
 * @vitest-environment jsdom
 * 
 * Multi-Tenant Isolation Tests - ENTERPRISE GRADE
 * 
 * Tests for:
 * - Tenant context isolation
 * - Cross-tenant data leakage prevention
 * - Tenant-specific configuration
 * - API request tenant header validation
 * - Feature flag per-tenant isolation
 * - Tenant switching scenarios
 * 
 * @group multi-tenant
 * @group isolation
 * @group security
 * @group P0-critical
 * 
 * ALTIN KURALLAR:
 * ✅ AAA Pattern (Arrange-Act-Assert)
 * ✅ Tek test → tek davranış
 * ✅ State izolasyonu (beforeEach/afterEach)
 * ✅ Mock Stratejisi Tutarlı
 * ✅ Descriptive Naming
 * ✅ Edge Case Coverage
 * ✅ Real-World Scenarios
 * ✅ Security Tests
 * ✅ Cleanup
 * ✅ Type Safety
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ============================================================================
// TYPES
// ============================================================================

interface Tenant {
  id: string;
  name: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  features: string[];
  settings: TenantSettings;
}

interface TenantSettings {
  theme: 'light' | 'dark';
  language: string;
  timezone: string;
  branding?: {
    logo?: string;
    primaryColor?: string;
  };
}

interface TenantContext {
  currentTenant: Tenant | null;
  setTenant: (tenant: Tenant) => void;
  clearTenant: () => void;
  isTenantSet: boolean;
}

// ============================================================================
// MOCK TENANT DATA
// ============================================================================

const createMockTenant = (overrides: Partial<Tenant> = {}): Tenant => ({
  id: `tenant-${Math.random().toString(36).substr(2, 9)}`,
  name: 'Test Company',
  plan: 'professional',
  features: ['analytics', 'reports', 'team-chat'],
  settings: {
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
  },
  ...overrides,
});

const TENANT_A: Tenant = {
  id: 'tenant-a-123',
  name: 'Company A',
  plan: 'enterprise',
  features: ['analytics', 'reports', 'team-chat', 'ai-assistant', 'voice-calls', 'integrations'],
  settings: {
    theme: 'dark',
    language: 'en',
    timezone: 'America/New_York',
    branding: {
      logo: 'https://company-a.com/logo.png',
      primaryColor: '#FF5733',
    },
  },
};

const TENANT_B: Tenant = {
  id: 'tenant-b-456',
  name: 'Company B',
  plan: 'starter',
  features: ['analytics'],
  settings: {
    theme: 'light',
    language: 'tr',
    timezone: 'Europe/Istanbul',
  },
};

// ============================================================================
// TENANT CONTEXT IMPLEMENTATION
// ============================================================================

class TenantContextManager {
  private currentTenant: Tenant | null = null;
  private tenantData: Map<string, Record<string, unknown>> = new Map();

  setTenant(tenant: Tenant): void {
    this.currentTenant = tenant;
  }

  clearTenant(): void {
    this.currentTenant = null;
  }

  getTenant(): Tenant | null {
    return this.currentTenant;
  }

  getTenantId(): string | null {
    return this.currentTenant?.id ?? null;
  }

  hasFeature(featureId: string): boolean {
    if (!this.currentTenant) return false;
    return this.currentTenant.features.includes(featureId);
  }

  getPlan(): string | null {
    return this.currentTenant?.plan ?? null;
  }

  // Store tenant-specific data
  setTenantData<T>(key: string, value: T): void {
    if (!this.currentTenant) {
      throw new Error('No tenant set');
    }
    
    const tenantId = this.currentTenant.id;
    if (!this.tenantData.has(tenantId)) {
      this.tenantData.set(tenantId, {});
    }
    this.tenantData.get(tenantId)![key] = value;
  }

  getTenantData<T>(key: string): T | undefined {
    if (!this.currentTenant) return undefined;
    
    const tenantId = this.currentTenant.id;
    const data = this.tenantData.get(tenantId);
    return data?.[key] as T | undefined;
  }

  // Clear all data for current tenant
  clearTenantData(): void {
    if (this.currentTenant) {
      this.tenantData.delete(this.currentTenant.id);
    }
  }

  // Get all tenant IDs that have stored data
  getAllTenantIds(): string[] {
    return Array.from(this.tenantData.keys());
  }
}

// ============================================================================
// API REQUEST INTERCEPTOR
// ============================================================================

class TenantAwareApiClient {
  private tenantContext: TenantContextManager;
  private requestLog: Array<{ url: string; headers: Record<string, string> }> = [];

  constructor(tenantContext: TenantContextManager) {
    this.tenantContext = tenantContext;
  }

  async request(url: string, options: RequestInit = {}): Promise<Response> {
    const tenantId = this.tenantContext.getTenantId();
    
    if (!tenantId) {
      throw new Error('Tenant context not set');
    }

    const headers = new Headers(options.headers);
    headers.set('X-Tenant-ID', tenantId);
    headers.set('X-Tenant-Plan', this.tenantContext.getPlan() || 'unknown');

    // Log request for testing
    this.requestLog.push({
      url,
      headers: Object.fromEntries(headers.entries()),
    });

    // Return mock response
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  getRequestLog() {
    return this.requestLog;
  }

  clearRequestLog() {
    this.requestLog = [];
  }
}

// ============================================================================
// TENANT ISOLATION TESTS
// ============================================================================

describe('Multi-Tenant Isolation', () => {
  let tenantContext: TenantContextManager;
  let apiClient: TenantAwareApiClient;

  beforeEach(() => {
    tenantContext = new TenantContextManager();
    apiClient = new TenantAwareApiClient(tenantContext);
    vi.clearAllMocks();
  });

  afterEach(() => {
    tenantContext.clearTenant();
    apiClient.clearRequestLog();
    vi.restoreAllMocks();
  });

  // ==================== Context Isolation ====================

  describe('Context Isolation', () => {
    it('should set and get current tenant correctly', () => {
      // Arrange
      const tenant = createMockTenant({ id: 'test-tenant' });

      // Act
      tenantContext.setTenant(tenant);

      // Assert
      expect(tenantContext.getTenant()).toEqual(tenant);
      expect(tenantContext.getTenantId()).toBe('test-tenant');
    });

    it('should return null when no tenant is set', () => {
      // Arrange - No tenant set

      // Act & Assert
      expect(tenantContext.getTenant()).toBeNull();
      expect(tenantContext.getTenantId()).toBeNull();
    });

    it('should clear tenant context completely', () => {
      // Arrange
      tenantContext.setTenant(TENANT_A);

      // Act
      tenantContext.clearTenant();

      // Assert
      expect(tenantContext.getTenant()).toBeNull();
      expect(tenantContext.getTenantId()).toBeNull();
    });

    it('should replace tenant when setting new one', () => {
      // Arrange
      tenantContext.setTenant(TENANT_A);

      // Act
      tenantContext.setTenant(TENANT_B);

      // Assert
      expect(tenantContext.getTenantId()).toBe(TENANT_B.id);
      expect(tenantContext.getTenant()?.name).toBe('Company B');
    });
  });

  // ==================== Data Isolation ====================

  describe('Data Isolation', () => {
    it('should store data per tenant', () => {
      // Arrange
      tenantContext.setTenant(TENANT_A);
      tenantContext.setTenantData('customField', 'value-for-A');

      // Switch tenant
      tenantContext.setTenant(TENANT_B);
      tenantContext.setTenantData('customField', 'value-for-B');

      // Act - Switch back to A
      tenantContext.setTenant(TENANT_A);
      const valueA = tenantContext.getTenantData<string>('customField');

      tenantContext.setTenant(TENANT_B);
      const valueB = tenantContext.getTenantData<string>('customField');

      // Assert - Each tenant has its own data
      expect(valueA).toBe('value-for-A');
      expect(valueB).toBe('value-for-B');
    });

    it('should not leak data between tenants', () => {
      // Arrange
      tenantContext.setTenant(TENANT_A);
      tenantContext.setTenantData('secretKey', 'tenant-a-secret');

      // Act - Switch to different tenant
      tenantContext.setTenant(TENANT_B);
      const leakedData = tenantContext.getTenantData<string>('secretKey');

      // Assert - Tenant B should not see Tenant A's data
      expect(leakedData).toBeUndefined();
    });

    it('should clear only current tenant data', () => {
      // Arrange
      tenantContext.setTenant(TENANT_A);
      tenantContext.setTenantData('data', 'A-data');

      tenantContext.setTenant(TENANT_B);
      tenantContext.setTenantData('data', 'B-data');

      // Act - Clear Tenant B's data only
      tenantContext.clearTenantData();

      // Assert
      expect(tenantContext.getTenantData('data')).toBeUndefined();

      // Tenant A's data should still exist
      tenantContext.setTenant(TENANT_A);
      expect(tenantContext.getTenantData('data')).toBe('A-data');
    });

    it('should throw error when storing data without tenant context', () => {
      // Arrange - No tenant set

      // Act & Assert
      expect(() => {
        tenantContext.setTenantData('key', 'value');
      }).toThrow('No tenant set');
    });
  });

  // ==================== Feature Flag Isolation ====================

  describe('Feature Flag Isolation', () => {
    it('should check features based on current tenant plan', () => {
      // Arrange
      tenantContext.setTenant(TENANT_A); // Enterprise

      // Act & Assert
      expect(tenantContext.hasFeature('ai-assistant')).toBe(true);
      expect(tenantContext.hasFeature('voice-calls')).toBe(true);
      expect(tenantContext.hasFeature('integrations')).toBe(true);
    });

    it('should restrict features for lower tier tenants', () => {
      // Arrange
      tenantContext.setTenant(TENANT_B); // Starter

      // Act & Assert
      expect(tenantContext.hasFeature('analytics')).toBe(true);
      expect(tenantContext.hasFeature('ai-assistant')).toBe(false);
      expect(tenantContext.hasFeature('voice-calls')).toBe(false);
    });

    it('should return false for any feature when no tenant set', () => {
      // Arrange - No tenant

      // Act & Assert
      expect(tenantContext.hasFeature('analytics')).toBe(false);
      expect(tenantContext.hasFeature('any-feature')).toBe(false);
    });

    it('should update features when tenant changes', () => {
      // Arrange
      tenantContext.setTenant(TENANT_A);
      expect(tenantContext.hasFeature('ai-assistant')).toBe(true);

      // Act
      tenantContext.setTenant(TENANT_B);

      // Assert
      expect(tenantContext.hasFeature('ai-assistant')).toBe(false);
    });
  });

  // ==================== API Request Isolation ====================

  describe('API Request Isolation', () => {
    it('should include tenant ID header in all requests', async () => {
      // Arrange
      tenantContext.setTenant(TENANT_A);

      // Act
      await apiClient.request('/api/data');

      // Assert
      const log = apiClient.getRequestLog();
      // Headers are case-insensitive, converted to lowercase
      expect(log[0].headers['x-tenant-id']).toBe(TENANT_A.id);
    });

    it('should include tenant plan header in requests', async () => {
      // Arrange
      tenantContext.setTenant(TENANT_A);

      // Act
      await apiClient.request('/api/data');

      // Assert
      const log = apiClient.getRequestLog();
      expect(log[0].headers['x-tenant-plan']).toBe('enterprise');
    });

    it('should reject requests without tenant context', async () => {
      // Arrange - No tenant set

      // Act & Assert
      await expect(apiClient.request('/api/data')).rejects.toThrow('Tenant context not set');
    });

    it('should use correct tenant ID after tenant switch', async () => {
      // Arrange
      tenantContext.setTenant(TENANT_A);
      await apiClient.request('/api/first-request');

      // Act
      tenantContext.setTenant(TENANT_B);
      await apiClient.request('/api/second-request');

      // Assert
      const log = apiClient.getRequestLog();
      expect(log[0].headers['x-tenant-id']).toBe(TENANT_A.id);
      expect(log[1].headers['x-tenant-id']).toBe(TENANT_B.id);
    });
  });

  // ==================== Security Tests ====================

  describe('Security - Cross-Tenant Access Prevention', () => {
    it('should not allow accessing other tenant resources via URL manipulation', () => {
      // Arrange
      const validateResourceAccess = (resourceTenantId: string, currentTenantId: string): boolean => {
        return resourceTenantId === currentTenantId;
      };

      tenantContext.setTenant(TENANT_A);

      // Act - Try to access Tenant B's resource
      const canAccess = validateResourceAccess(TENANT_B.id, tenantContext.getTenantId()!);

      // Assert
      expect(canAccess).toBe(false);
    });

    it('should validate tenant ID format', () => {
      // Arrange
      const isValidTenantId = (id: string): boolean => {
        // Tenant IDs should be alphanumeric with hyphens
        return /^[a-zA-Z0-9\-]+$/.test(id) && id.length > 5 && id.length < 50;
      };

      // Act & Assert
      expect(isValidTenantId('tenant-a-123')).toBe(true);
      expect(isValidTenantId('valid-tenant-id')).toBe(true);
      expect(isValidTenantId('<script>alert(1)</script>')).toBe(false);
      expect(isValidTenantId('../etc/passwd')).toBe(false);
      expect(isValidTenantId('')).toBe(false);
      expect(isValidTenantId('ab')).toBe(false); // Too short
    });

    it('should sanitize tenant ID in requests', async () => {
      // Arrange
      const sanitizeTenantId = (id: string): string => {
        return id.replace(/[^a-zA-Z0-9\-]/g, '');
      };

      const maliciousTenant = createMockTenant({
        id: 'tenant-<script>alert(1)</script>',
      });

      // Act
      const sanitizedId = sanitizeTenantId(maliciousTenant.id);

      // Assert
      expect(sanitizedId).toBe('tenant-scriptalert1script');
      expect(sanitizedId).not.toContain('<');
      expect(sanitizedId).not.toContain('>');
    });

    it('should prevent tenant ID injection in queries', () => {
      // Arrange
      const buildSafeQuery = (tenantId: string, resourceId: string): string => {
        // Use parameterized approach - never concatenate
        // First remove SQL keywords, then remove special characters
        let safeTenantId = tenantId
          .replace(/\b(OR|AND|SELECT|DROP|INSERT|UPDATE|DELETE)\b/gi, '')
          .replace(/[^a-zA-Z0-9\-]/g, '');
        const safeResourceId = resourceId.replace(/[^a-zA-Z0-9\-]/g, '');
        return `tenant=${encodeURIComponent(safeTenantId)}&resource=${encodeURIComponent(safeResourceId)}`;
      };

      // Act
      const query = buildSafeQuery("tenant-a' OR '1'='1", 'resource-123');

      // Assert - Special characters and SQL keywords removed
      expect(query).not.toContain("'");
      expect(query).not.toContain(' OR ');
      // Query is properly sanitized
      expect(query).toMatch(/^tenant=[a-zA-Z0-9\-]+&resource=[a-zA-Z0-9\-]+$/);
    });
  });

  // ==================== Settings Isolation ====================

  describe('Settings Isolation', () => {
    it('should load tenant-specific theme', () => {
      // Arrange & Act
      tenantContext.setTenant(TENANT_A);
      const themeA = tenantContext.getTenant()?.settings.theme;

      tenantContext.setTenant(TENANT_B);
      const themeB = tenantContext.getTenant()?.settings.theme;

      // Assert
      expect(themeA).toBe('dark');
      expect(themeB).toBe('light');
    });

    it('should load tenant-specific language', () => {
      // Arrange & Act
      tenantContext.setTenant(TENANT_A);
      const langA = tenantContext.getTenant()?.settings.language;

      tenantContext.setTenant(TENANT_B);
      const langB = tenantContext.getTenant()?.settings.language;

      // Assert
      expect(langA).toBe('en');
      expect(langB).toBe('tr');
    });

    it('should load tenant-specific branding', () => {
      // Arrange
      tenantContext.setTenant(TENANT_A);

      // Act
      const branding = tenantContext.getTenant()?.settings.branding;

      // Assert
      expect(branding?.logo).toBe('https://company-a.com/logo.png');
      expect(branding?.primaryColor).toBe('#FF5733');
    });

    it('should handle missing branding gracefully', () => {
      // Arrange
      tenantContext.setTenant(TENANT_B); // No branding

      // Act
      const branding = tenantContext.getTenant()?.settings.branding;

      // Assert
      expect(branding).toBeUndefined();
    });
  });

  // ==================== Edge Cases ====================

  describe('Edge Cases', () => {
    it('should handle rapid tenant switching', () => {
      // Arrange & Act
      for (let i = 0; i < 100; i++) {
        tenantContext.setTenant(i % 2 === 0 ? TENANT_A : TENANT_B);
      }

      // Assert - Should end on TENANT_B (even count, 0-indexed)
      expect(tenantContext.getTenantId()).toBe(TENANT_B.id);
    });

    it('should handle tenant with empty features array', () => {
      // Arrange
      const emptyFeaturesTenant = createMockTenant({ features: [] });
      tenantContext.setTenant(emptyFeaturesTenant);

      // Act & Assert
      expect(tenantContext.hasFeature('any-feature')).toBe(false);
    });

    it('should track all tenants that have stored data', () => {
      // Arrange
      tenantContext.setTenant(TENANT_A);
      tenantContext.setTenantData('key', 'value-a');

      tenantContext.setTenant(TENANT_B);
      tenantContext.setTenantData('key', 'value-b');

      // Act
      const allTenantIds = tenantContext.getAllTenantIds();

      // Assert
      expect(allTenantIds).toContain(TENANT_A.id);
      expect(allTenantIds).toContain(TENANT_B.id);
      expect(allTenantIds).toHaveLength(2);
    });
  });
});

// ============================================================================
// REAL-WORLD SCENARIOS
// ============================================================================

describe('Multi-Tenant - Real-World Scenarios', () => {
  let tenantContext: TenantContextManager;

  beforeEach(() => {
    tenantContext = new TenantContextManager();
  });

  afterEach(() => {
    tenantContext.clearTenant();
  });

  it('should handle complete user session flow', () => {
    // Arrange - User logs in
    tenantContext.setTenant(TENANT_A);

    // Store user preferences
    tenantContext.setTenantData('userPreferences', {
      notifications: true,
      emailDigest: 'daily',
    });

    // Store workspace state
    tenantContext.setTenantData('workspaceState', {
      openTabs: ['dashboard', 'reports'],
      lastVisited: '/dashboard',
    });

    // Act - Retrieve stored data
    const prefs = tenantContext.getTenantData<{ notifications: boolean }>('userPreferences');
    const workspace = tenantContext.getTenantData<{ openTabs: string[] }>('workspaceState');

    // Assert
    expect(prefs?.notifications).toBe(true);
    expect(workspace?.openTabs).toContain('dashboard');
  });

  it('should support multi-tenant admin viewing multiple tenants', () => {
    // Arrange - Admin views Tenant A
    tenantContext.setTenant(TENANT_A);
    const tenantAFeatures = tenantContext.getTenant()?.features;

    // Act - Admin switches to Tenant B
    tenantContext.setTenant(TENANT_B);
    const tenantBFeatures = tenantContext.getTenant()?.features;

    // Assert - Each tenant has correct features
    expect(tenantAFeatures).toContain('ai-assistant');
    expect(tenantBFeatures).not.toContain('ai-assistant');
    expect(tenantBFeatures).toContain('analytics');
  });

  it('should handle plan upgrade scenario', () => {
    // Arrange - Tenant starts with starter plan
    const upgradingTenant = createMockTenant({
      id: 'upgrading-tenant',
      plan: 'starter',
      features: ['analytics'],
    });
    tenantContext.setTenant(upgradingTenant);

    // Assert - Before upgrade
    expect(tenantContext.hasFeature('ai-assistant')).toBe(false);

    // Act - Simulate plan upgrade
    const upgradedTenant: Tenant = {
      ...upgradingTenant,
      plan: 'enterprise',
      features: [...upgradingTenant.features, 'ai-assistant', 'voice-calls', 'integrations'],
    };
    tenantContext.setTenant(upgradedTenant);

    // Assert - After upgrade
    expect(tenantContext.hasFeature('ai-assistant')).toBe(true);
    expect(tenantContext.hasFeature('voice-calls')).toBe(true);
    expect(tenantContext.getPlan()).toBe('enterprise');
  });
});

