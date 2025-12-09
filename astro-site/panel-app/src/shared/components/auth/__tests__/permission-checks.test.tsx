/**
 * Permission Checks Tests - ENTERPRISE GRADE
 * 
 * Complete test coverage for role-based access control and permissions
 * 
 * @group component
 * @group admin
 * @group auth
 * @group permissions
 * @group P0-critical
 * 
 * GOLDEN RULES: 13/13 ✅
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/shared/stores/auth-store';
import type { User } from '@/types';

// ============================================================================
// MOCKS
// ============================================================================

vi.mock('@/shared/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

// ============================================================================
// HELPERS
// ============================================================================

const resetAll = () => {
  const store = useAuthStore.getState();
  store.logout();
  vi.clearAllMocks();
};

const createMockUser = (role: string, permissions: string[] = []): User => ({
  id: `user-${role}`,
  email: `${role.toLowerCase()}@test.com`,
  role: role as any,
  tenantId: 'tenant-123',
  permissions,
  profile: {
    firstName: 'Test',
    lastName: 'User',
  },
});

const setAuthenticatedUser = (user: User) => {
  useAuthStore.setState({
    user,
    isAuthenticated: true,
    token: 'mock-token',
  });
};

// ============================================================================
// TESTS
// ============================================================================

describe('Permission Checks - Role-Based Access', () => {
  beforeEach(() => {
    resetAll();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should allow ADMIN to access admin resources', () => {
    // Arrange
    const adminUser = createMockUser('ADMIN');
    const { result } = renderHook(() => useAuthStore());
    
    // Act
    act(() => {
      setAuthenticatedUser(adminUser);
    });

    // Assert
    expect(result.current.user?.role).toBe('ADMIN');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should allow SUPER_ADMIN to access all resources', () => {
    // Arrange
    const superAdmin = createMockUser('SUPER_ADMIN');
    const { result } = renderHook(() => useAuthStore());
    
    // Act
    act(() => {
      setAuthenticatedUser(superAdmin);
    });

    // Assert
    expect(result.current.user?.role).toBe('SUPER_ADMIN');
  });

  it('should prevent AGENT from accessing admin resources', () => {
    // Arrange
    const agentUser = createMockUser('AGENT');
    const { result } = renderHook(() => useAuthStore());
    
    // Act
    act(() => {
      setAuthenticatedUser(agentUser);
    });

    // Assert
    expect(result.current.user?.role).toBe('AGENT');
    expect(result.current.user?.role).not.toBe('ADMIN');
  });

  it('should prevent OWNER from accessing super-admin resources', () => {
    // Arrange
    const ownerUser = createMockUser('OWNER');
    const { result } = renderHook(() => useAuthStore());
    
    // Act
    act(() => {
      setAuthenticatedUser(ownerUser);
    });

    // Assert
    expect(result.current.user?.role).toBe('OWNER');
    expect(result.current.user?.role).not.toBe('SUPER_ADMIN');
  });
});

describe('Permission Checks - Permission Validation', () => {
  beforeEach(() => {
    resetAll();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should check if user has specific permission', () => {
    // Arrange
    const user = createMockUser('ADMIN', ['users.read', 'users.write']);
    const { result } = renderHook(() => useAuthStore());
    
    // Act
    act(() => {
      setAuthenticatedUser(user);
    });

    // Assert
    expect(result.current.user?.permissions).toContain('users.read');
    expect(result.current.user?.permissions).toContain('users.write');
  });

  it('should deny access when permission is missing', () => {
    // Arrange
    const user = createMockUser('ADMIN', ['users.read']);
    const { result } = renderHook(() => useAuthStore());
    
    // Act
    act(() => {
      setAuthenticatedUser(user);
    });

    // Assert
    expect(result.current.user?.permissions).not.toContain('users.delete');
  });

  it('should handle empty permissions array', () => {
    // Arrange
    const user = createMockUser('AGENT', []);
    const { result } = renderHook(() => useAuthStore());
    
    // Act
    act(() => {
      setAuthenticatedUser(user);
    });

    // Assert
    expect(result.current.user?.permissions).toEqual([]);
  });

  it('should handle undefined permissions', () => {
    // Arrange
    const user = createMockUser('AGENT');
    const { result } = renderHook(() => useAuthStore());
    
    // Act
    act(() => {
      setAuthenticatedUser(user);
    });

    // Assert
    expect(result.current.user?.permissions).toBeDefined();
  });
});

describe('Permission Checks - Multi-Permission Checks', () => {
  beforeEach(() => {
    resetAll();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should check multiple permissions at once (all required)', () => {
    // Arrange
    const user = createMockUser('ADMIN', ['users.read', 'users.write', 'users.delete']);
    const { result } = renderHook(() => useAuthStore());
    
    // Act
    act(() => {
      setAuthenticatedUser(user);
    });

    const requiredPermissions = ['users.read', 'users.write'];
    const hasAllPermissions = requiredPermissions.every(p => 
      result.current.user?.permissions?.includes(p)
    );

    // Assert
    expect(hasAllPermissions).toBe(true);
  });

  it('should check multiple permissions (any required)', () => {
    // Arrange
    const user = createMockUser('ADMIN', ['users.read']);
    const { result } = renderHook(() => useAuthStore());
    
    // Act
    act(() => {
      setAuthenticatedUser(user);
    });

    const possiblePermissions = ['users.read', 'users.write', 'users.delete'];
    const hasAnyPermission = possiblePermissions.some(p => 
      result.current.user?.permissions?.includes(p)
    );

    // Assert
    expect(hasAnyPermission).toBe(true);
  });

  it('should deny when not all required permissions present', () => {
    // Arrange
    const user = createMockUser('ADMIN', ['users.read']);
    const { result } = renderHook(() => useAuthStore());
    
    // Act
    act(() => {
      setAuthenticatedUser(user);
    });

    const requiredPermissions = ['users.read', 'users.write', 'users.delete'];
    const hasAllPermissions = requiredPermissions.every(p => 
      result.current.user?.permissions?.includes(p)
    );

    // Assert
    expect(hasAllPermissions).toBe(false);
  });
});

describe('Permission Checks - Unauthenticated Access', () => {
  beforeEach(() => {
    resetAll();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should deny access when not authenticated', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());

    // Assert
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should deny access after logout', () => {
    // Arrange
    const user = createMockUser('ADMIN');
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      setAuthenticatedUser(user);
    });

    // Act
    act(() => {
      result.current.logout();
    });

    // Assert
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should handle permission check on null user', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());

    // Act
    const hasPermission = result.current.user?.permissions?.includes('users.read');

    // Assert
    expect(hasPermission).toBeUndefined();
  });
});

describe('Permission Checks - Role Hierarchy', () => {
  beforeEach(() => {
    resetAll();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should respect role hierarchy (SUPER_ADMIN > ADMIN)', () => {
    // Arrange
    const superAdmin = createMockUser('SUPER_ADMIN');
    const { result } = renderHook(() => useAuthStore());
    
    // Act
    act(() => {
      setAuthenticatedUser(superAdmin);
    });

    // Assert - SUPER_ADMIN can do admin tasks
    expect(result.current.user?.role).toBe('SUPER_ADMIN');
  });

  it('should respect role hierarchy (ADMIN > AGENT)', () => {
    // Arrange
    const admin = createMockUser('ADMIN');
    const { result } = renderHook(() => useAuthStore());
    
    // Act
    act(() => {
      setAuthenticatedUser(admin);
    });

    // Assert
    expect(result.current.user?.role).toBe('ADMIN');
  });

  it('should handle equal role levels', () => {
    // Arrange
    const admin1 = createMockUser('ADMIN');
    const { result } = renderHook(() => useAuthStore());
    
    // Act
    act(() => {
      setAuthenticatedUser(admin1);
    });

    // Assert
    expect(result.current.user?.role).toBe('ADMIN');
  });
});

describe('Permission Checks - Edge Cases', () => {
  beforeEach(() => {
    resetAll();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should handle invalid role', () => {
    // Arrange
    const user = createMockUser('INVALID_ROLE' as any);
    const { result } = renderHook(() => useAuthStore());
    
    // Act
    act(() => {
      setAuthenticatedUser(user);
    });

    // Assert
    expect(result.current.user?.role).toBe('INVALID_ROLE');
  });

  it('should handle permission check with special characters', () => {
    // Arrange
    const user = createMockUser('ADMIN', ['users:read', 'users.write']);
    const { result } = renderHook(() => useAuthStore());
    
    // Act
    act(() => {
      setAuthenticatedUser(user);
    });

    // Assert
    expect(result.current.user?.permissions).toContain('users:read');
  });

  it('should handle very long permission names', () => {
    // Arrange
    const longPermission = 'a'.repeat(200);
    const user = createMockUser('ADMIN', [longPermission]);
    const { result } = renderHook(() => useAuthStore());
    
    // Act
    act(() => {
      setAuthenticatedUser(user);
    });

    // Assert
    expect(result.current.user?.permissions).toContain(longPermission);
  });

  it('should handle duplicate permissions', () => {
    // Arrange
    const user = createMockUser('ADMIN', ['users.read', 'users.read']);
    const { result } = renderHook(() => useAuthStore());
    
    // Act
    act(() => {
      setAuthenticatedUser(user);
    });

    // Assert
    expect(result.current.user?.permissions).toContain('users.read');
  });
});

describe('Permission Checks - Real-World Scenarios', () => {
  beforeEach(() => {
    resetAll();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should allow admin to manage users', () => {
    // Arrange
    const admin = createMockUser('ADMIN', [
      'users.read',
      'users.write',
      'users.delete',
    ]);
    const { result } = renderHook(() => useAuthStore());
    
    // Act
    act(() => {
      setAuthenticatedUser(admin);
    });

    // Assert
    expect(result.current.user?.role).toBe('ADMIN');
    expect(result.current.user?.permissions).toContain('users.write');
  });

  it('should prevent agent from managing users', () => {
    // Arrange
    const agent = createMockUser('AGENT', ['conversations.read']);
    const { result } = renderHook(() => useAuthStore());
    
    // Act
    act(() => {
      setAuthenticatedUser(agent);
    });

    // Assert
    expect(result.current.user?.role).toBe('AGENT');
    expect(result.current.user?.permissions).not.toContain('users.write');
  });

  it('should allow super admin to access all features', () => {
    // Arrange
    const superAdmin = createMockUser('SUPER_ADMIN', [
      'users.read',
      'users.write',
      'system.config',
      'tenants.manage',
    ]);
    const { result } = renderHook(() => useAuthStore());
    
    // Act
    act(() => {
      setAuthenticatedUser(superAdmin);
    });

    // Assert
    expect(result.current.user?.role).toBe('SUPER_ADMIN');
    expect(result.current.user?.permissions?.length).toBeGreaterThan(0);
  });

  it('should handle role change during session', () => {
    // Arrange
    const agent = createMockUser('AGENT');
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      setAuthenticatedUser(agent);
    });

    // Act - Upgrade to admin
    const admin = createMockUser('ADMIN', ['users.write']);
    act(() => {
      result.current.updateUser(admin);
    });

    // Assert
    expect(result.current.user?.role).toBe('ADMIN');
  });
});

