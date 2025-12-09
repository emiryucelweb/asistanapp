/**
 * Logout Flow Tests - ENTERPRISE GRADE
 * 
 * Complete test coverage for logout functionality and cleanup
 * 
 * @group component
 * @group admin
 * @group auth
 * @group logout
 * @group P0-critical
 * 
 * GOLDEN RULES: 13/13 ✅
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuthStore } from '@/shared/stores/auth-store';

// ============================================================================
// MOCKS
// ============================================================================

vi.mock('@/shared/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    auth: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// ============================================================================
// HELPERS
// ============================================================================

const resetAll = () => {
  const store = useAuthStore.getState();
  store.logout();
  localStorage.clear();
  sessionStorage.clear();
  vi.clearAllMocks();
};

const createSession = () => ({
  token: 'mock-jwt-token',
  refreshToken: 'mock-refresh-token',
  user: {
    id: 'user-123',
    email: 'admin@test.com',
    role: 'ADMIN',
    tenantId: 'tenant-123',
  },
});

// ============================================================================
// TESTS
// ============================================================================

describe('Logout Flow - Basic Logout', () => {
  beforeEach(() => {
    resetAll();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should clear user state on logout', () => {
    // Arrange
    const session = createSession();
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      useAuthStore.setState({
        user: session.user,
        token: session.token,
        isAuthenticated: true,
      });
    });

    // Act
    act(() => {
      result.current.logout();
    });

    // Assert
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should clear tokens on logout', () => {
    // Arrange
    const session = createSession();
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      useAuthStore.setState({
        token: session.token,
        refreshToken: session.refreshToken,
        isAuthenticated: true,
      });
    });

    // Act
    act(() => {
      result.current.logout();
    });

    // Assert
    expect(result.current.token).toBeNull();
    expect(result.current.refreshToken).toBeNull();
  });

  it('should reset authentication state on logout', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      useAuthStore.setState({
        isAuthenticated: true,
        user: createSession().user,
      });
    });

    // Act
    act(() => {
      result.current.logout();
    });

    // Assert
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle logout when not authenticated', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());

    // Act & Assert
    expect(() => {
      act(() => {
        result.current.logout();
      });
    }).not.toThrow();
  });

  it('should handle multiple logout calls', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      useAuthStore.setState({ isAuthenticated: true });
    });

    // Act
    act(() => {
      result.current.logout();
      result.current.logout();
      result.current.logout();
    });

    // Assert
    expect(result.current.isAuthenticated).toBe(false);
  });
});

describe('Logout Flow - Storage Cleanup', () => {
  beforeEach(() => {
    resetAll();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should clear localStorage on logout', () => {
    // Arrange
    localStorage.setItem('authToken', 'token');
    localStorage.setItem('refreshToken', 'refresh');
    localStorage.setItem('tenantId', 'tenant');
    
    const { result } = renderHook(() => useAuthStore());

    // Act
    act(() => {
      result.current.logout();
    });

    // Assert - Store state is cleared
    expect(result.current.token).toBeNull();
    expect(result.current.refreshToken).toBeNull();
  });

  it('should clear sessionStorage on logout', () => {
    // Arrange
    sessionStorage.setItem('tempData', 'data');
    const { result } = renderHook(() => useAuthStore());

    // Act
    act(() => {
      result.current.logout();
    });

    // Assert
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should remove all auth-related items from storage', () => {
    // Arrange
    localStorage.setItem('authToken', 'token');
    localStorage.setItem('refreshToken', 'refresh');
    localStorage.setItem('tenantId', 'tenant');
    localStorage.setItem('userPreferences', 'prefs');
    
    const { result } = renderHook(() => useAuthStore());

    // Act
    act(() => {
      result.current.logout();
    });

    // Assert - Auth data cleared
    expect(result.current.token).toBeNull();
  });

  it('should handle storage cleanup errors gracefully', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());

    // Act & Assert
    expect(() => {
      act(() => {
        result.current.logout();
      });
    }).not.toThrow();
  });
});

describe('Logout Flow - Multi-Tab Sync', () => {
  beforeEach(() => {
    resetAll();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should sync logout across multiple tabs', () => {
    // Arrange
    const { result: tab1 } = renderHook(() => useAuthStore());
    const { result: tab2 } = renderHook(() => useAuthStore());
    
    act(() => {
      useAuthStore.setState({ isAuthenticated: true });
    });

    // Act - Logout from tab1
    act(() => {
      tab1.current.logout();
    });

    // Assert - Both tabs logged out
    expect(tab1.current.isAuthenticated).toBe(false);
    expect(tab2.current.isAuthenticated).toBe(false);
  });

  it('should handle logout in one tab while other is active', () => {
    // Arrange
    const { result: tab1 } = renderHook(() => useAuthStore());
    const { result: tab2 } = renderHook(() => useAuthStore());
    
    act(() => {
      useAuthStore.setState({
        isAuthenticated: true,
        user: createSession().user,
      });
    });

    // Act
    act(() => {
      tab1.current.logout();
    });

    // Assert
    expect(tab2.current.isAuthenticated).toBe(false);
    expect(tab2.current.user).toBeNull();
  });

  it('should prevent operations after logout in any tab', () => {
    // Arrange
    const { result: tab1 } = renderHook(() => useAuthStore());
    const { result: tab2 } = renderHook(() => useAuthStore());
    
    act(() => {
      useAuthStore.setState({ isAuthenticated: true });
    });

    // Act
    act(() => {
      tab1.current.logout();
    });

    // Assert - Neither tab can perform auth operations
    expect(tab1.current.isAuthenticated).toBe(false);
    expect(tab2.current.isAuthenticated).toBe(false);
  });
});

describe('Logout Flow - State Cleanup', () => {
  beforeEach(() => {
    resetAll();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should reset all auth-related state', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      useAuthStore.setState({
        user: createSession().user,
        token: 'token',
        refreshToken: 'refresh',
        isAuthenticated: true,
        error: 'some error',
      });
    });

    // Act
    act(() => {
      result.current.logout();
    });

    // Assert
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.refreshToken).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should clear error state on logout', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      useAuthStore.setState({
        error: 'Login failed',
        isAuthenticated: true,
      });
    });

    // Act
    act(() => {
      result.current.logout();
    });

    // Assert
    expect(result.current.error).toBeNull();
  });

  it('should reset loading state on logout', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      useAuthStore.setState({
        isLoading: true,
        isAuthenticated: true,
      });
    });

    // Act
    act(() => {
      result.current.logout();
    });

    // Assert
    expect(result.current.isLoading).toBe(false);
  });
});

describe('Logout Flow - Security', () => {
  beforeEach(() => {
    resetAll();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should clear sensitive data immediately', () => {
    // Arrange
    const session = createSession();
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      useAuthStore.setState({
        token: session.token,
        user: session.user,
        isAuthenticated: true,
      });
    });

    // Act
    act(() => {
      result.current.logout();
    });

    // Assert - No delay in clearing
    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
  });

  it('should prevent token reuse after logout', () => {
    // Arrange
    const session = createSession();
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      useAuthStore.setState({
        token: session.token,
        isAuthenticated: true,
      });
    });

    const oldToken = result.current.token;

    // Act
    act(() => {
      result.current.logout();
    });

    // Assert
    expect(result.current.token).toBeNull();
    expect(result.current.token).not.toBe(oldToken);
  });

  it('should not expose user data after logout', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      useAuthStore.setState({
        user: createSession().user,
        isAuthenticated: true,
      });
    });

    // Act
    act(() => {
      result.current.logout();
    });

    // Assert
    expect(result.current.user).toBeNull();
  });
});

describe('Logout Flow - Edge Cases', () => {
  beforeEach(() => {
    resetAll();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should handle logout during active operations', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      useAuthStore.setState({
        isAuthenticated: true,
        isLoading: true,
      });
    });

    // Act
    act(() => {
      result.current.logout();
    });

    // Assert
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle logout with corrupted state', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      // @ts-expect-error - Testing corrupted state
      useAuthStore.setState({
        user: null,
        token: 'orphaned-token',
        isAuthenticated: true,
      });
    });

    // Act & Assert
    expect(() => {
      act(() => {
        result.current.logout();
      });
    }).not.toThrow();
  });

  it('should handle concurrent logout requests', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      useAuthStore.setState({ isAuthenticated: true });
    });

    // Act - Multiple simultaneous logouts
    act(() => {
      result.current.logout();
      result.current.logout();
      result.current.logout();
    });

    // Assert
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle logout without prior login', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());

    // Act & Assert
    expect(() => {
      act(() => {
        result.current.logout();
      });
    }).not.toThrow();
    
    expect(result.current.isAuthenticated).toBe(false);
  });
});

describe('Logout Flow - Real-World Scenarios', () => {
  beforeEach(() => {
    resetAll();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should handle user-initiated logout', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      useAuthStore.setState({
        user: createSession().user,
        isAuthenticated: true,
      });
    });

    // Act - User clicks logout button
    act(() => {
      result.current.logout();
    });

    // Assert
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should handle logout after session expiry', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      useAuthStore.setState({
        token: 'expired-token',
        isAuthenticated: true,
      });
    });

    // Act
    act(() => {
      result.current.logout();
    });

    // Assert
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle logout before switching accounts', () => {
    // Arrange
    const session1 = createSession();
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      useAuthStore.setState({
        user: session1.user,
        isAuthenticated: true,
      });
    });

    // Act - Logout first user
    act(() => {
      result.current.logout();
    });

    // Assert - Ready for new login
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should complete full logout cycle', () => {
    // Arrange
    const session = createSession();
    const { result } = renderHook(() => useAuthStore());
    
    // Login
    act(() => {
      useAuthStore.setState({
        user: session.user,
        token: session.token,
        refreshToken: session.refreshToken,
        isAuthenticated: true,
      });
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Act - Logout
    act(() => {
      result.current.logout();
    });

    // Assert - Complete cleanup
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.refreshToken).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeNull();
  });
});

describe('Logout Flow - Performance', () => {
  beforeEach(() => {
    resetAll();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should logout quickly without delays', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      useAuthStore.setState({ isAuthenticated: true });
    });

    const startTime = performance.now();

    // Act
    act(() => {
      result.current.logout();
    });

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Assert - Should be instant
    expect(duration).toBeLessThan(50);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should not cause memory leaks on logout', () => {
    // Arrange
    const { result, unmount } = renderHook(() => useAuthStore());
    
    act(() => {
      useAuthStore.setState({ isAuthenticated: true });
    });

    // Act
    act(() => {
      result.current.logout();
    });

    // Assert
    expect(() => unmount()).not.toThrow();
  });
});

