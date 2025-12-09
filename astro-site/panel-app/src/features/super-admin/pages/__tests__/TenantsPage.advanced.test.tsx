/**
 * TenantsPage Component Tests - ADVANCED (Edge Cases & Accessibility)
 * 
 * Tests for edge cases and accessibility
 * 
 * @group page
 * @group super-admin
 * @group tenants
 * @group P0-critical
 * 
 * GOLDEN RULES:
 * ✅ #1: AAA Pattern (Arrange-Act-Assert)
 * ✅ #2: Single Responsibility
 * ✅ #3: State Isolation
 * ✅ #4: Consistent Mocks (Shared Infrastructure)
 * ✅ #5: Descriptive Names
 * ✅ #6: Edge Case Coverage
 * ✅ #7: Real-World Scenarios
 * ✅ #8: Error Handling
 * ✅ #9: Correct Async/Await
 * ✅ #10: Cleanup
 * ✅ #11: Immutability
 * ✅ #12: Type Safety
 * ✅ #13: Enterprise-Grade (MAX 15 tests) ✅
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TenantsPage from '../TenantsPage';
import { TenantBilling } from '@/types';

// ============================================================================
// MOCKS
// ============================================================================

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'superAdmin.tenants.searchPlaceholder': 'Firma ara...',
      };
      return translations[key] || key;
    },
  }),
}));

vi.mock('@/shared/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock('@/shared/utils/export-helpers-v2', () => ({
  exportToExcel: vi.fn().mockResolvedValue(undefined),
  exportToCSV: vi.fn().mockResolvedValue(undefined),
}));

const mockGetTenants = vi.fn();
const mockSuspendTenant = vi.fn();
const mockActivateTenant = vi.fn();
const mockDeleteTenant = vi.fn();

vi.mock('@/services/api', () => ({
  superAdminTenantsApi: {
    getTenants: (...args: any[]) => mockGetTenants(...args),
    suspendTenant: (...args: any[]) => mockSuspendTenant(...args),
    activateTenant: (...args: any[]) => mockActivateTenant(...args),
    deleteTenant: (...args: any[]) => mockDeleteTenant(...args),
  },
}));

vi.mock('@/services/api/mock/super-admin-tenants.mock', () => ({
  mockSuperAdminTenantsApi: {
    getTenants: (...args: any[]) => mockGetTenants(...args),
    suspendTenant: (...args: any[]) => mockSuspendTenant(...args),
    activateTenant: (...args: any[]) => mockActivateTenant(...args),
    deleteTenant: (...args: any[]) => mockDeleteTenant(...args),
  },
}));

vi.mock('@/services/api/config', () => ({
  isMockMode: () => false,
}));

// ============================================================================
// TEST DATA FACTORIES
// ============================================================================

const createMockTenant = (overrides?: Partial<TenantBilling>): TenantBilling => ({
  tenantId: 'tenant-1',
  tenantName: 'Test Company',
  subscription: {
    plan: 'professional',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    autoRenew: true,
  },
  monthlyRevenue: 999,
  totalRevenue: 5994,
  apiCosts: {
    llm: {
      provider: 'openai',
      model: 'gpt-4',
      inputTokens: 100000,
      outputTokens: 50000,
      cost: 150,
    },
    embedding: {
      provider: 'openai',
      model: 'text-embedding-3-small',
      tokens: 50000,
      cost: 10,
    },
    totalMonthlyCost: 160,
  },
  profitMargin: 84.0,
  paymentStatus: 'paid' as const,
  ...overrides,
});

const createMockTenantsResponse = (count: number = 3): { data: TenantBilling[] } => ({
  data: Array.from({ length: count }, (_, i) => createMockTenant({
    tenantId: `tenant-${i + 1}`,
    tenantName: `Company ${i + 1}`,
    monthlyRevenue: 999 + i * 100,
    subscription: {
      plan: i % 2 === 0 ? 'professional' : 'enterprise',
      status: i % 3 === 0 ? 'trial' : 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      autoRenew: true,
    },
  })),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

// ============================================================================
// TESTS - PART 4: ADVANCED (10 tests)
// ============================================================================

describe('TenantsPage - Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should handle fetch error gracefully', async () => {
    // Arrange
    mockGetTenants.mockRejectedValue(new Error('Network error'));

    // Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      // Page should still render, just with no data
      expect(screen.getByText('Firma Yönetimi')).toBeInTheDocument();
    });
  });

  it('should handle zero revenue correctly', async () => {
    // Arrange
    const response = createMockTenantsResponse(1);
    response.data[0].monthlyRevenue = 0;
    mockGetTenants.mockResolvedValue(response);

    // Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      const zeroElements = screen.getAllByText('$0');
      expect(zeroElements.length).toBeGreaterThan(0);
    });
  });

  it('should handle negative profit margin', async () => {
    // Arrange
    const response = createMockTenantsResponse(1);
    response.data[0].profitMargin = -15.5;
    mockGetTenants.mockResolvedValue(response);

    // Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('-15.5%')).toBeInTheDocument();
    });
  });

  it('should handle very long tenant names', async () => {
    // Arrange
    const response = createMockTenantsResponse(1);
    response.data[0].tenantName = 'A'.repeat(100);
    mockGetTenants.mockResolvedValue(response);

    // Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('A'.repeat(100))).toBeInTheDocument();
    });
  });

  it('should handle large number of tenants', async () => {
    // Arrange
    mockGetTenants.mockResolvedValue(createMockTenantsResponse(100));

    // Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Company 1')).toBeInTheDocument();
      expect(screen.getByText('Company 100')).toBeInTheDocument();
    });
  });

  it('should show empty state when no tenants', async () => {
    // Arrange
    mockGetTenants.mockResolvedValue({ data: [] });

    // Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Firma bulunamadı')).toBeInTheDocument();
    });
  });
});

describe('TenantsPage - Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should have accessible table structure', async () => {
    // Arrange
    mockGetTenants.mockResolvedValue(createMockTenantsResponse(3));

    // Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });
  });

  it('should have accessible buttons', async () => {
    // Arrange
    mockGetTenants.mockResolvedValue(createMockTenantsResponse(3));

    // Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  it('should have accessible form controls', async () => {
    // Arrange
    mockGetTenants.mockResolvedValue(createMockTenantsResponse(3));

    // Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Firma ara...');
      expect(searchInput).toHaveAttribute('type', 'text');
      
      const filterSelect = screen.getByRole('combobox');
      expect(filterSelect).toBeInTheDocument();
    });
  });

  it('should have proper page structure', async () => {
    // Arrange
    mockGetTenants.mockResolvedValue(createMockTenantsResponse(3));

    // Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Firma Yönetimi')).toBeInTheDocument();
      expect(screen.getByText('Tüm müşteri firmalarınızı ve finansal durumlarını yönetin')).toBeInTheDocument();
    });
  });
});

