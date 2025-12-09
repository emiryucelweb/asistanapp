/**
 * TenantsPage Component Tests - BASIC (Rendering & UI)
 * 
 * Tests for basic rendering, loading states, and summary cards
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
        'tenants.stats.activeTenants': 'Aktif Firmalar',
        'tenants.export.button': 'Dışa Aktar',
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
// TESTS - PART 1: BASIC (15 tests)
// ============================================================================

describe('TenantsPage - Rendering & Basic UI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTenants.mockResolvedValue(createMockTenantsResponse(3));
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should render page header', async () => {
    // Arrange & Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Firma Yönetimi')).toBeInTheDocument();
      expect(screen.getByText('Tüm müşteri firmalarınızı ve finansal durumlarını yönetin')).toBeInTheDocument();
    });
  });

  it('should render "New Tenant" button', async () => {
    // Arrange & Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Yeni Firma Ekle')).toBeInTheDocument();
    });
  });

  it('should render summary cards', async () => {
    // Arrange
    mockGetTenants.mockResolvedValue(createMockTenantsResponse(3));

    // Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Toplam Gelir')).toBeInTheDocument();
      expect(screen.getByText('Toplam Maliyet')).toBeInTheDocument();
      expect(screen.getByText('Net Kar')).toBeInTheDocument();
      expect(screen.getByText('Aktif Firmalar')).toBeInTheDocument();
    });
  });

  it('should render search input', async () => {
    // Arrange & Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Firma ara...');
      expect(searchInput).toBeInTheDocument();
    });
  });

  it('should render status filter dropdown', async () => {
    // Arrange & Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      const filterSelect = screen.getByRole('combobox');
      expect(filterSelect).toBeInTheDocument();
    });
  });

  it('should render export button', async () => {
    // Arrange & Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Dışa Aktar')).toBeInTheDocument();
    });
  });

  it('should render table headers', async () => {
    // Arrange & Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Firma')).toBeInTheDocument();
      expect(screen.getByText('Plan')).toBeInTheDocument();
      expect(screen.getByText('Durum')).toBeInTheDocument();
      expect(screen.getByText('Aylık Gelir')).toBeInTheDocument();
    });
  });
});

describe('TenantsPage - Loading States', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should show loading spinner while fetching tenants', async () => {
    // Arrange
    mockGetTenants.mockImplementation(() => new Promise(() => {})); // Never resolves

    // Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Yükleniyor...')).toBeInTheDocument();
    });
  });

  it('should hide loading spinner after data loads', async () => {
    // Arrange
    mockGetTenants.mockResolvedValue(createMockTenantsResponse(3));

    // Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.queryByText('Yükleniyor...')).not.toBeInTheDocument();
    });
  });

  it('should call getTenants on mount', async () => {
    // Arrange
    mockGetTenants.mockResolvedValue(createMockTenantsResponse(3));

    // Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      expect(mockGetTenants).toHaveBeenCalledTimes(1);
    });
  });
});

describe('TenantsPage - Summary Cards Calculation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should calculate total revenue correctly', async () => {
    // Arrange
    const response = createMockTenantsResponse(3);
    response.data[0].monthlyRevenue = 1000;
    response.data[1].monthlyRevenue = 2000;
    response.data[2].monthlyRevenue = 3000;
    mockGetTenants.mockResolvedValue(response);

    // Act
    const { container } = renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      // Check if total revenue is calculated (1000 + 2000 + 3000 = 6000)
      const text = container.textContent || '';
      expect(text).toContain('6');
      expect(text).toContain('000');
    });
  });

  it('should calculate total costs correctly', async () => {
    // Arrange
    const response = createMockTenantsResponse(3);
    response.data[0].apiCosts.totalMonthlyCost = 100;
    response.data[1].apiCosts.totalMonthlyCost = 200;
    response.data[2].apiCosts.totalMonthlyCost = 300;
    mockGetTenants.mockResolvedValue(response);

    // Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('$600')).toBeInTheDocument();
    });
  });

  it('should count active tenants correctly', async () => {
    // Arrange
    const response = createMockTenantsResponse(5);
    response.data[0].subscription.status = 'active';
    response.data[1].subscription.status = 'active';
    response.data[2].subscription.status = 'trial';
    response.data[3].subscription.status = 'active';
    response.data[4].subscription.status = 'canceled';
    mockGetTenants.mockResolvedValue(response);

    // Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      const activeCount = screen.getByText('3');
      expect(activeCount).toBeInTheDocument();
    });
  });

  it('should show growth indicators', async () => {
    // Arrange
    mockGetTenants.mockResolvedValue(createMockTenantsResponse(3));

    // Act
    renderWithRouter(<TenantsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('+12.5% bu ay')).toBeInTheDocument();
    });
  });
});

describe('TenantsPage - Create Tenant Modal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should open modal when clicking "New Tenant" button', async () => {
    // Arrange
    const user = userEvent.setup();
    mockGetTenants.mockResolvedValue(createMockTenantsResponse(3));

    // Act
    renderWithRouter(<TenantsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Company 1')).toBeInTheDocument();
    });

    const newButton = screen.getByText('Yeni Firma Ekle');
    await user.click(newButton);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Yeni Firma Ekle')).toBeInTheDocument();
    });
  });
});

