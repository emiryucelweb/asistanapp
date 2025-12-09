/**
 * TenantsPage Component Tests - FILTERING (Search & Filter)
 * 
 * Tests for search functionality and filtering
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
import userEvent from '@testing-library/user-event';
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
        'tenants.payment.paid': 'Ödendi',
        'tenants.payment.pending': 'Bekliyor',
        'tenants.payment.overdue': 'Gecikmiş',
        'tenants.status.active': 'Aktif',
        'tenants.status.trial': 'Deneme',
        'tenants.status.canceled': 'İptal',
        'tenants.status.past_due': 'Gecikmiş',
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
// TESTS - PART 2: FILTERING (13 tests)
// ============================================================================

describe('TenantsPage - Tenant List Display', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should display tenants after loading', async () => {
    // Arrange
    mockGetTenants.mockResolvedValue(createMockTenantsResponse(3));

    // Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Company 1')).toBeInTheDocument();
      expect(screen.getByText('Company 2')).toBeInTheDocument();
      expect(screen.getByText('Company 3')).toBeInTheDocument();
    });
  });

  it('should display tenant IDs', async () => {
    // Arrange
    mockGetTenants.mockResolvedValue(createMockTenantsResponse(3));

    // Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('ID: tenant-1')).toBeInTheDocument();
      expect(screen.getByText('ID: tenant-2')).toBeInTheDocument();
    });
  });

  it('should display plan badges', async () => {
    // Arrange
    mockGetTenants.mockResolvedValue(createMockTenantsResponse(3));

    // Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      const profesyonelBadges = screen.getAllByText('Profesyonel');
      const kurumsalBadges = screen.getAllByText('Kurumsal');
      expect(profesyonelBadges.length).toBeGreaterThan(0);
      expect(kurumsalBadges.length).toBeGreaterThan(0);
    });
  });

  it('should display status badges', async () => {
    // Arrange
    mockGetTenants.mockResolvedValue(createMockTenantsResponse(3));

    // Act
    const { container } = renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      const text = container.textContent || '';
      // Check that either "Aktif" or "Deneme" status appears
      const hasStatus = text.includes('Aktif') || text.includes('Deneme');
      expect(hasStatus).toBe(true);
    });
  });

  it('should display monthly revenue', async () => {
    // Arrange
    mockGetTenants.mockResolvedValue(createMockTenantsResponse(3));

    // Act
    const { container } = renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      // Check if revenue values exist (may be formatted differently)
      const text = container.textContent || '';
      expect(text).toContain('999');
      expect(text).toContain('1');
      expect(text).toContain('099');
    });
  });

  it('should display profit margin', async () => {
    // Arrange
    mockGetTenants.mockResolvedValue(createMockTenantsResponse(3));

    // Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      const margins = screen.getAllByText(/\+?\d+\.\d%/);
      expect(margins.length).toBeGreaterThan(0);
    });
  });

  it('should display payment status icons', async () => {
    // Arrange
    const response = createMockTenantsResponse(3);
    response.data[0].paymentStatus = 'paid';
    response.data[1].paymentStatus = 'pending';
    response.data[2].paymentStatus = 'overdue';
    mockGetTenants.mockResolvedValue(response);

    // Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      const paidElements = screen.getAllByText('Ödendi');
      const pendingElements = screen.getAllByText('Bekliyor');
      const overdueElements = screen.getAllByText('Gecikmiş');
      expect(paidElements.length).toBeGreaterThan(0);
      expect(pendingElements.length).toBeGreaterThan(0);
      expect(overdueElements.length).toBeGreaterThan(0);
    });
  });
});

describe('TenantsPage - Search Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should filter tenants when typing in search', async () => {
    // Arrange
    const user = userEvent.setup();
    mockGetTenants.mockResolvedValue(createMockTenantsResponse(3));

    // Act
    renderWithRouter(<TenantsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Company 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Firma ara...');
    await user.type(searchInput, 'Company 1');

    // Assert
    await waitFor(() => {
      expect(mockGetTenants).toHaveBeenCalledWith({
        search: 'Company 1',
        status: undefined,
      });
    });
  });

  it('should clear search results when input is cleared', async () => {
    // Arrange
    const user = userEvent.setup();
    mockGetTenants.mockResolvedValue(createMockTenantsResponse(3));

    // Act
    renderWithRouter(<TenantsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Company 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Firma ara...') as HTMLInputElement;
    await user.type(searchInput, 'test');
    await user.clear(searchInput);

    // Assert
    await waitFor(() => {
      expect(mockGetTenants).toHaveBeenLastCalledWith({
        search: '',
        status: undefined,
      });
    });
  });

  it('should handle search with no results', async () => {
    // Arrange
    const user = userEvent.setup();
    mockGetTenants
      .mockResolvedValueOnce(createMockTenantsResponse(3))
      .mockResolvedValueOnce({ data: [] });

    // Act
    renderWithRouter(<TenantsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Company 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Firma ara...');
    await user.type(searchInput, 'NonExistent');

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Firma bulunamadı')).toBeInTheDocument();
    });
  });
});

describe('TenantsPage - Filter Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should filter by status', async () => {
    // Arrange
    const user = userEvent.setup();
    mockGetTenants.mockResolvedValue(createMockTenantsResponse(3));

    // Act
    renderWithRouter(<TenantsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Company 1')).toBeInTheDocument();
    });

    const filterSelect = screen.getByRole('combobox');
    await user.selectOptions(filterSelect, 'active');

    // Assert
    await waitFor(() => {
      expect(mockGetTenants).toHaveBeenCalledWith({
        search: '',
        status: 'active',
      });
    });
  });

  it('should show all tenants when filter is "all"', async () => {
    // Arrange
    const user = userEvent.setup();
    mockGetTenants.mockResolvedValue(createMockTenantsResponse(3));

    // Act
    renderWithRouter(<TenantsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Company 1')).toBeInTheDocument();
    });

    const filterSelect = screen.getByRole('combobox');
    await user.selectOptions(filterSelect, 'all');

    // Assert
    await waitFor(() => {
      expect(mockGetTenants).toHaveBeenCalledWith({
        search: '',
        status: undefined,
      });
    });
  });

  it('should combine search and filter', async () => {
    // Arrange
    const user = userEvent.setup();
    mockGetTenants.mockResolvedValue(createMockTenantsResponse(3));

    // Act
    renderWithRouter(<TenantsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Company 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Firma ara...');
    await user.type(searchInput, 'Company');

    const filterSelect = screen.getByRole('combobox');
    await user.selectOptions(filterSelect, 'trial');

    // Assert
    await waitFor(() => {
      expect(mockGetTenants).toHaveBeenLastCalledWith({
        search: 'Company',
        status: 'trial',
      });
    });
  });
});

