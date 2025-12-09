/**
 * TenantDetailPage Component Tests - ENTERPRISE GRADE
 * 
 * Comprehensive tests for tenant detail page with financial and usage metrics
 * 
 * @group page
 * @group super-admin
 * @group tenant-detail
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
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TenantDetailPage from '../TenantDetailPage';
import { TenantBilling, TenantUsageMetrics } from '@/types';

// ============================================================================
// MOCKS
// ============================================================================

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'tenantDetail.notFound': 'Firma bulunamadı',
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

const mockGetTenant = vi.fn();
const mockGetTenantUsage = vi.fn();

vi.mock('@/services/api', () => ({
  superAdminTenantsApi: {
    getTenant: (...args: any[]) => mockGetTenant(...args),
    getTenantUsage: (...args: any[]) => mockGetTenantUsage(...args),
  },
}));

vi.mock('@/services/api/mock/super-admin-tenants.mock', () => ({
  mockSuperAdminTenantsApi: {
    getTenant: (...args: any[]) => mockGetTenant(...args),
    getTenantUsage: (...args: any[]) => mockGetTenantUsage(...args),
  },
}));

vi.mock('@/services/api/config', () => ({
  isMockMode: () => false,
}));

// ============================================================================
// TEST DATA FACTORIES
// ============================================================================

const createMockTenant = (overrides?: Partial<TenantBilling>): TenantBilling => ({
  tenantId: 'tenant-123',
  tenantName: 'Acme Corporation',
  subscription: {
    plan: 'professional',
    status: 'active',
    currentPeriodStart: '2024-01-01',
    currentPeriodEnd: '2024-12-31',
    limits: {
      conversations: 1000,
      users: 50,
      storage: 100,
      apiCalls: 100000,
    },
    usage: {
      conversations: 750,
      users: 35,
      storage: 65,
      apiCalls: 75000,
    },
  },
  monthlyRevenue: 2999,
  totalRevenue: 35988,
  apiCosts: {
    llm: {
      provider: 'openai',
      totalCalls: 5000,
      totalTokens: 500000,
      totalCost: 450,
      breakdown: {
        gpt4: { calls: 3000, tokens: 300000, cost: 360 },
        gpt35: { calls: 1500, tokens: 150000, cost: 60 },
        embedding: { calls: 500, tokens: 50000, cost: 30 },
      },
    },
    voice: {
      provider: 'elevenlabs',
      totalMinutes: 200,
      totalCost: 100,
    },
    whatsapp: {
      totalMessages: 5000,
      totalCost: 150,
    },
    storage: {
      totalGB: 65,
      totalCost: 65,
    },
    other: [
      { description: 'SMS', totalCost: 35 },
    ],
    totalMonthlyCost: 800,
  },
  profitMargin: 73.3,
  paymentStatus: 'paid' as const,
  nextBillingDate: '2024-02-01',
  billingEmail: 'billing@acme.com',
  billingAddress: {
    company: 'Acme Corporation Ltd.',
    street: '123 Business Ave',
    city: 'Istanbul',
    state: 'Kadıköy',
    postalCode: '34710',
    country: 'Turkey',
    taxId: '1234567890',
  },
  ...overrides,
});

const createMockMetrics = (overrides?: Partial<TenantUsageMetrics>): TenantUsageMetrics => ({
  tenantId: 'tenant-123',
  period: {
    start: '2024-01-01',
    end: '2024-01-31',
  },
  conversations: {
    total: 750,
    byChannel: {
      web: 400,
      whatsapp: 250,
      instagram: 100,
      voice: 0,
    },
    avgDuration: 185, // seconds
  },
  messages: {
    total: 5600,
    aiGenerated: 4200,
    agentHandled: 1400,
  },
  apiCalls: {
    total: 75000,
    byEndpoint: {
      '/chat/completions': 5000,
      '/embeddings': 500,
    },
  },
  storage: {
    totalGB: 65,
    files: 8500,
    media: 2300,
  },
  activeUsers: 35,
  ...overrides,
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const renderWithRouter = (tenantId: string = 'tenant-123') => {
  return render(
    <MemoryRouter initialEntries={[`/asistansuper/tenants/${tenantId}`]}>
      <Routes>
        <Route path="/asistansuper/tenants/:tenantId" element={<TenantDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
};

// ============================================================================
// TESTS (15 tests MAX - Golden Rule #13)
// ============================================================================

describe('TenantDetailPage - Loading & Error States', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should show loading state while fetching data', async () => {
    // Arrange
    mockGetTenant.mockImplementation(() => new Promise(() => {})); // Never resolves
    mockGetTenantUsage.mockImplementation(() => new Promise(() => {}));

    // Act
    renderWithRouter();

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Firma bilgileri yükleniyor...')).toBeInTheDocument();
    });
  });

  it('should show error state when tenant not found', async () => {
    // Arrange
    mockGetTenant.mockResolvedValue(null);
    mockGetTenantUsage.mockResolvedValue(null);

    // Act
    renderWithRouter();

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Firma bulunamadı')).toBeInTheDocument();
      expect(screen.getByText('Firmalara Dön')).toBeInTheDocument();
    });
  });

  it('should fetch tenant and metrics data on mount', async () => {
    // Arrange
    mockGetTenant.mockResolvedValue(createMockTenant());
    mockGetTenantUsage.mockResolvedValue(createMockMetrics());

    // Act
    renderWithRouter();

    // Assert
    await waitFor(() => {
      expect(mockGetTenant).toHaveBeenCalledWith('tenant-123');
      expect(mockGetTenantUsage).toHaveBeenCalledWith('tenant-123', '30d');
    });
  });
});

describe('TenantDetailPage - Financial Overview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTenant.mockResolvedValue(createMockTenant());
    mockGetTenantUsage.mockResolvedValue(createMockMetrics());
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should display tenant name and ID in header', async () => {
    // Arrange & Act
    renderWithRouter();

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
      expect(screen.getByText('ID: tenant-123')).toBeInTheDocument();
    });
  });

  it('should display monthly revenue card', async () => {
    // Arrange & Act
    const { container } = renderWithRouter();

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Aylık Gelir')).toBeInTheDocument();
      const text = container.textContent || '';
      expect(text).toContain('2');
      expect(text).toContain('999');
    });
  });

  it('should display API cost card with providers', async () => {
    // Arrange & Act
    const { container } = renderWithRouter();

    // Assert
    await waitFor(() => {
      expect(screen.getByText('API Maliyeti')).toBeInTheDocument();
      const text = container.textContent || '';
      expect(text).toContain('OPENAI');
      expect(text).toContain('elevenlabs');
    });
  });

  it('should calculate and display net profit', async () => {
    // Arrange & Act
    const { container } = renderWithRouter();

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Net Kar')).toBeInTheDocument();
      const text = container.textContent || '';
      // Net profit = 2999 - 800 = 2199
      expect(text).toContain('2');
      expect(text).toContain('199');
    });
  });

  it('should display payment status with icon', async () => {
    // Arrange & Act
    renderWithRouter();

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Ödeme Durumu')).toBeInTheDocument();
      expect(screen.getByText('Ödendi')).toBeInTheDocument();
    });
  });
});

describe('TenantDetailPage - Period Selection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTenant.mockResolvedValue(createMockTenant());
    mockGetTenantUsage.mockResolvedValue(createMockMetrics());
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should render period selector with default 30d', async () => {
    // Arrange & Act
    renderWithRouter();

    // Assert
    await waitFor(() => {
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select).toBeInTheDocument();
      expect(select.value).toBe('30d');
    });
  });

  it('should fetch new data when period changes', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
    });

    // Act
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '7d');

    // Assert
    await waitFor(() => {
      // Should be called twice: once on mount with 30d, once with 7d
      expect(mockGetTenantUsage).toHaveBeenCalledWith('tenant-123', '7d');
    });
  });
});

describe('TenantDetailPage - API Costs Breakdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTenant.mockResolvedValue(createMockTenant());
    mockGetTenantUsage.mockResolvedValue(createMockMetrics());
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should display API cost breakdown section', async () => {
    // Arrange & Act
    renderWithRouter();

    // Assert
    await waitFor(() => {
      expect(screen.getByText('API Maliyet Dağılımı')).toBeInTheDocument();
    });
  });

  it('should display LLM costs with breakdown', async () => {
    // Arrange & Act
    renderWithRouter();

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/LLM \(OPENAI\)/)).toBeInTheDocument();
      expect(screen.getByText(/GPT-4:/)).toBeInTheDocument();
      expect(screen.getByText(/GPT-3.5:/)).toBeInTheDocument();
      expect(screen.getByText(/Embedding:/)).toBeInTheDocument();
    });
  });

});

describe('TenantDetailPage - Usage Metrics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTenant.mockResolvedValue(createMockTenant());
    mockGetTenantUsage.mockResolvedValue(createMockMetrics());
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should display conversation statistics', async () => {
    // Arrange & Act
    const { container } = renderWithRouter();

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Konuşma İstatistikleri')).toBeInTheDocument();
      const text = container.textContent || '';
      expect(text).toContain('750');
      expect(text).toContain('1');
      expect(text).toContain('000');
    });
  });

  it('should display usage percentage with progress bar', async () => {
    // Arrange & Act
    renderWithRouter();

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Kullanım')).toBeInTheDocument();
      // Usage: 750/1000 = 75%
      expect(screen.getByText('75.0% kullanıldı')).toBeInTheDocument();
    });
  });

  it('should display storage metrics', async () => {
    // Arrange & Act
    const { container } = renderWithRouter();

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Kullanım & Kaynaklar')).toBeInTheDocument();
      const text = container.textContent || '';
      expect(text).toContain('65 GB');
      expect(text).toContain('100 GB');
    });
  });
});

