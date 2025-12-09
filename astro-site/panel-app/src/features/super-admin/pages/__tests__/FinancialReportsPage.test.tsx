/**
 * FinancialReportsPage Component Tests - ENTERPRISE GRADE
 * 
 * Comprehensive tests for financial reports and analytics page
 * 
 * @group page
 * @group super-admin
 * @group financial
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
import FinancialReportsPage from '../FinancialReportsPage';
import { TenantFinancialSummary } from '@/types';

// ============================================================================
// MOCKS
// ============================================================================

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      const translations: Record<string, string> = {
        'financial.title': 'Finansal Raporlar',
        'financial.subtitle': 'Detaylı gelir ve maliyet analizi',
        'financial.periods.30d': 'Son 30 Gün',
        'financial.periods.90d': 'Son 90 Gün',
        'financial.periods.1y': 'Son 1 Yıl',
        'financial.export.button': 'Excel olarak İndir',
        'financial.export.exporting': 'Dışa aktarılıyor...',
        'financial.export.loading': 'Yükleniyor...',
        'financial.messages.loading': 'Veriler yükleniyor...',
        'financial.messages.loadFailed': 'Veriler yüklenemedi',
        'financial.messages.noDataYet': 'Henüz veri yok',
        'financial.messages.exportFailed': 'Dışa aktarma başarısız',
        'financial.insights.lowChurn': 'Düşük Kayıp Oranı',
        'financial.insights.lowChurnDesc': `${options?.rate}% kayıp oranı`,
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

const mockExportToExcel = vi.fn().mockResolvedValue(undefined);
const mockExportToPDF = vi.fn().mockResolvedValue(undefined);

vi.mock('@/shared/utils/export-helpers-v2', () => ({
  exportToExcel: (...args: any[]) => mockExportToExcel(...args),
  exportToPDF: (...args: any[]) => mockExportToPDF(...args),
}));

const mockGetFinancialSummary = vi.fn();
const mockGetMonthlyTrend = vi.fn();
const mockGetPlanDistribution = vi.fn();
const mockGetTopTenants = vi.fn();
const mockGetCostBreakdown = vi.fn();

vi.mock('@/services/api', () => ({
  superAdminFinancialApi: {
    getFinancialSummary: (...args: any[]) => mockGetFinancialSummary(...args),
    getMonthlyTrend: (...args: any[]) => mockGetMonthlyTrend(...args),
    getPlanDistribution: (...args: any[]) => mockGetPlanDistribution(...args),
    getTopTenants: (...args: any[]) => mockGetTopTenants(...args),
    getCostBreakdown: (...args: any[]) => mockGetCostBreakdown(...args),
  },
}));

vi.mock('@/services/api/mock/super-admin-financial.mock', () => ({
  mockSuperAdminFinancialApi: {
    getFinancialSummary: (...args: any[]) => mockGetFinancialSummary(...args),
    getMonthlyTrend: (...args: any[]) => mockGetMonthlyTrend(...args),
    getPlanDistribution: (...args: any[]) => mockGetPlanDistribution(...args),
    getTopTenants: (...args: any[]) => mockGetTopTenants(...args),
    getCostBreakdown: (...args: any[]) => mockGetCostBreakdown(...args),
  },
}));

vi.mock('@/services/api/config', () => ({
  isMockMode: () => false,
}));

// ============================================================================
// TEST DATA FACTORIES
// ============================================================================

const createMockFinancialSummary = (): TenantFinancialSummary => ({
  totalTenants: 100,
  activeTenants: 85,
  trialTenants: 15,
  totalMonthlyRevenue: 150000,
  totalMonthlyCosts: 45000,
  totalProfit: 105000,
  averageRevenuePerTenant: 1500,
  churnRate: 2.5,
  growthRate: 15.5,
});

const createMockMonthlyTrend = () => [
  { month: 'Ocak', revenue: 120000, costs: 40000, profit: 80000 },
  { month: 'Şubat', revenue: 135000, costs: 42000, profit: 93000 },
  { month: 'Mart', revenue: 150000, costs: 45000, profit: 105000 },
];

const createMockPlanDistribution = () => [
  { plan: 'Enterprise', count: 20, revenue: 80000, percentage: 53 },
  { plan: 'Professional', count: 45, revenue: 55000, percentage: 37 },
  { plan: 'Starter', count: 35, revenue: 15000, percentage: 10 },
];

const createMockTopTenants = () => [
  { name: 'Acme Corp', revenue: 5000, profit: 3500, growth: 25 },
  { name: 'Tech Solutions', revenue: 4500, profit: 3200, growth: 18 },
  { name: 'Global Inc', revenue: 4000, profit: 2800, growth: 12 },
];

const createMockCostBreakdown = () => [
  { category: 'LLM API', amount: 25000, percentage: 55 },
  { category: 'Voice API', amount: 12000, percentage: 27 },
  { category: 'Storage', amount: 5000, percentage: 11 },
  { category: 'Other', amount: 3000, percentage: 7 },
];

// ============================================================================
// TESTS (15 tests MAX - Golden Rule #13)
// ============================================================================

describe('FinancialReportsPage - Rendering & Loading', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should show loading state while fetching data', async () => {
    // Arrange
    mockGetFinancialSummary.mockImplementation(() => new Promise(() => {})); // Never resolves
    mockGetMonthlyTrend.mockImplementation(() => new Promise(() => {}));
    mockGetPlanDistribution.mockImplementation(() => new Promise(() => {}));
    mockGetTopTenants.mockImplementation(() => new Promise(() => {}));
    mockGetCostBreakdown.mockImplementation(() => new Promise(() => {}));

    // Act
    render(<FinancialReportsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Veriler yükleniyor...')).toBeInTheDocument();
    });
  });

  it('should show error state when data fetch fails', async () => {
    // Arrange
    mockGetFinancialSummary.mockRejectedValue(new Error('Network error'));
    mockGetMonthlyTrend.mockRejectedValue(new Error('Network error'));
    mockGetPlanDistribution.mockRejectedValue(new Error('Network error'));
    mockGetTopTenants.mockRejectedValue(new Error('Network error'));
    mockGetCostBreakdown.mockRejectedValue(new Error('Network error'));

    // Act
    render(<FinancialReportsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Veriler yüklenemedi')).toBeInTheDocument();
    });
  });

  it('should render page header after data loads', async () => {
    // Arrange
    mockGetFinancialSummary.mockResolvedValue(createMockFinancialSummary());
    mockGetMonthlyTrend.mockResolvedValue(createMockMonthlyTrend());
    mockGetPlanDistribution.mockResolvedValue(createMockPlanDistribution());
    mockGetTopTenants.mockResolvedValue(createMockTopTenants());
    mockGetCostBreakdown.mockResolvedValue(createMockCostBreakdown());

    // Act
    render(<FinancialReportsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Finansal Raporlar')).toBeInTheDocument();
      expect(screen.getByText('Detaylı gelir ve maliyet analizi')).toBeInTheDocument();
    });
  });
});

describe('FinancialReportsPage - Summary Cards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetFinancialSummary.mockResolvedValue(createMockFinancialSummary());
    mockGetMonthlyTrend.mockResolvedValue(createMockMonthlyTrend());
    mockGetPlanDistribution.mockResolvedValue(createMockPlanDistribution());
    mockGetTopTenants.mockResolvedValue(createMockTopTenants());
    mockGetCostBreakdown.mockResolvedValue(createMockCostBreakdown());
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should display total revenue card', async () => {
    // Arrange & Act
    const { container } = render(<FinancialReportsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Toplam Gelir')).toBeInTheDocument();
      const text = container.textContent || '';
      expect(text).toContain('150');
      expect(screen.getByText('+15.5% büyüme')).toBeInTheDocument();
    });
  });

  it('should display total costs card', async () => {
    // Arrange & Act
    const { container } = render(<FinancialReportsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Toplam Maliyet')).toBeInTheDocument();
      const text = container.textContent || '';
      expect(text).toContain('45');
    });
  });

  it('should display net profit card with correct margin', async () => {
    // Arrange & Act
    const { container } = render(<FinancialReportsPage />);

    // Assert
    await waitFor(() => {
      const text = container.textContent || '';
      expect(text).toContain('Net Kar');
      expect(text).toContain('105');
      expect(text).toContain('70.0% kar marjı'); // (105000/150000)*100 = 70%
    });
  });

  it('should display active tenants card', async () => {
    // Arrange & Act
    render(<FinancialReportsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Aktif Firmalar')).toBeInTheDocument();
      expect(screen.getByText('85')).toBeInTheDocument();
      expect(screen.getByText('/100 toplam firma')).toBeInTheDocument();
    });
  });
});

describe('FinancialReportsPage - Period Selection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetFinancialSummary.mockResolvedValue(createMockFinancialSummary());
    mockGetMonthlyTrend.mockResolvedValue(createMockMonthlyTrend());
    mockGetPlanDistribution.mockResolvedValue(createMockPlanDistribution());
    mockGetTopTenants.mockResolvedValue(createMockTopTenants());
    mockGetCostBreakdown.mockResolvedValue(createMockCostBreakdown());
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should render period selector with default 30d', async () => {
    // Arrange & Act
    render(<FinancialReportsPage />);

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
    render(<FinancialReportsPage />);

    await waitFor(() => {
      expect(screen.getByText('Finansal Raporlar')).toBeInTheDocument();
    });

    // Act
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '90d');

    // Assert
    await waitFor(() => {
      // Should be called twice: once on mount with 30d, once with 90d
      expect(mockGetFinancialSummary).toHaveBeenCalledWith('90d');
    });
  });
});

describe('FinancialReportsPage - Export Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetFinancialSummary.mockResolvedValue(createMockFinancialSummary());
    mockGetMonthlyTrend.mockResolvedValue(createMockMonthlyTrend());
    mockGetPlanDistribution.mockResolvedValue(createMockPlanDistribution());
    mockGetTopTenants.mockResolvedValue(createMockTopTenants());
    mockGetCostBreakdown.mockResolvedValue(createMockCostBreakdown());
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should export to Excel when clicking export button', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<FinancialReportsPage />);

    await waitFor(() => {
      expect(screen.getByText('Excel olarak İndir')).toBeInTheDocument();
    });

    // Act
    const exportButton = screen.getByText('Excel olarak İndir');
    await user.click(exportButton);

    // Assert
    await waitFor(() => {
      expect(mockExportToExcel).toHaveBeenCalledTimes(1);
    });
  });

  it('should show exporting state during export', async () => {
    // Arrange
    const user = userEvent.setup();
    mockExportToExcel.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<FinancialReportsPage />);

    await waitFor(() => {
      expect(screen.getByText('Excel olarak İndir')).toBeInTheDocument();
    });

    // Act
    const exportButton = screen.getByText('Excel olarak İndir');
    await user.click(exportButton);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Dışa aktarılıyor...')).toBeInTheDocument();
    });
  });
});

describe('FinancialReportsPage - Data Display', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetFinancialSummary.mockResolvedValue(createMockFinancialSummary());
    mockGetMonthlyTrend.mockResolvedValue(createMockMonthlyTrend());
    mockGetPlanDistribution.mockResolvedValue(createMockPlanDistribution());
    mockGetTopTenants.mockResolvedValue(createMockTopTenants());
    mockGetCostBreakdown.mockResolvedValue(createMockCostBreakdown());
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should display monthly trend chart', async () => {
    // Arrange & Act
    render(<FinancialReportsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Gelir Trendi')).toBeInTheDocument();
      expect(screen.getByText('Ocak')).toBeInTheDocument();
      expect(screen.getByText('Şubat')).toBeInTheDocument();
      expect(screen.getByText('Mart')).toBeInTheDocument();
    });
  });

  it('should display plan distribution', async () => {
    // Arrange & Act
    render(<FinancialReportsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Plan Dağılımı')).toBeInTheDocument();
      expect(screen.getByText('Enterprise')).toBeInTheDocument();
      expect(screen.getByText('Professional')).toBeInTheDocument();
      expect(screen.getByText('Starter')).toBeInTheDocument();
    });
  });

  it('should display cost breakdown', async () => {
    // Arrange & Act
    render(<FinancialReportsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Maliyet Dağılımı')).toBeInTheDocument();
      expect(screen.getByText('LLM API')).toBeInTheDocument();
      expect(screen.getByText('Voice API')).toBeInTheDocument();
      expect(screen.getByText('Storage')).toBeInTheDocument();
    });
  });

  it('should display top performing tenants table', async () => {
    // Arrange & Act
    render(<FinancialReportsPage />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('En İyi Performans Gösteren Firmalar')).toBeInTheDocument();
      expect(screen.getByText('Acme Corp')).toBeInTheDocument();
      expect(screen.getByText('Tech Solutions')).toBeInTheDocument();
      expect(screen.getByText('Global Inc')).toBeInTheDocument();
    });
  });
});

