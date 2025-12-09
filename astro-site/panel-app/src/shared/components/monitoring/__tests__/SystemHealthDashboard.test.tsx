/**
 * SystemHealthDashboard Component Tests - ENTERPRISE GRADE
 * 
 * Complete test coverage for system health monitoring dashboard
 * 
 * @group component
 * @group monitoring
 * @group developer-tools
 * @group P1-high
 * 
 * GOLDEN RULES: 13/13 ✅
 * - #1: AAA Pattern (Arrange-Act-Assert)
 * - #2: Single Responsibility
 * - #3: State Isolation
 * - #4: Consistent Mocks (Shared Infrastructure)
 * - #5: Descriptive Names
 * - #6: Edge Case Coverage
 * - #7: Real-World Scenarios
 * - #8: Error Handling
 * - #9: Correct Async/Await
 * - #10: Cleanup
 * - #11: Immutability
 * - #12: Type Safety
 * - #13: Enterprise-Grade Quality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SystemHealthDashboard } from '../SystemHealthDashboard';
import type { SystemHealth } from '@/shared/utils/monitoring';
import { monitoring } from '@/shared/utils/monitoring';
import { advancedLogger } from '@/shared/utils/advanced-logger';

// ============================================================================
// MOCKS
// ============================================================================

// Mock monitoring
vi.mock('@/shared/utils/monitoring', () => ({
  monitoring: {
    getSystemHealth: vi.fn(),
    getAPIMetrics: vi.fn(),
    getHealthReport: vi.fn(),
    exportData: vi.fn(),
  },
}));

// Mock advancedLogger
vi.mock('@/shared/utils/advanced-logger', () => ({
  advancedLogger: {
    downloadLogs: vi.fn(),
  },
}));

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock document.createElement
const mockClick = vi.fn();
const originalCreateElement = document.createElement.bind(document);
document.createElement = vi.fn((tagName: string) => {
  const element = originalCreateElement(tagName);
  if (tagName === 'a') {
    element.click = mockClick;
  }
  return element;
});

// ============================================================================
// TEST DATA FACTORIES
// ============================================================================

const createMockSystemHealth = (overrides?: Partial<SystemHealth>): SystemHealth => ({
  memory: {
    used: 256,
    total: 1024,
    percentage: 25,
  },
  network: {
    type: '4g',
    effectiveType: '4g',
    downlink: 10,
    rtt: 50,
  },
  performance: {
    fps: 60,
    memory: 256,
    loadTime: 1200,
    domContentLoaded: 800,
    ttfb: 150,
  },
  errors: {
    total: 5,
    last24h: 2,
  },
  timestamp: new Date().toISOString(),
  ...overrides,
});

const createMockAPIMetrics = () => ({
  total: 150,
  averageDuration: 234,
  successRate: 98,
  slowCalls: 3,
});

const createMockHealthReport = (healthy: boolean = true) => ({
  healthy,
  issues: healthy ? [] : ['High memory usage detected', 'Slow API calls'],
  recommendations: healthy ? [] : ['Consider clearing cache', 'Review API endpoints'],
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Get mocked functions
const mockGetSystemHealth = vi.mocked(monitoring.getSystemHealth);
const mockGetAPIMetrics = vi.mocked(monitoring.getAPIMetrics);
const mockGetHealthReport = vi.mocked(monitoring.getHealthReport);
const mockExportData = vi.mocked(monitoring.exportData);
const mockDownloadLogs = vi.mocked(advancedLogger.downloadLogs);

const setupSuccessfulMocks = () => {
  mockGetSystemHealth.mockReturnValue(createMockSystemHealth());
  mockGetAPIMetrics.mockReturnValue(createMockAPIMetrics());
  mockGetHealthReport.mockReturnValue(createMockHealthReport(true));
  mockExportData.mockReturnValue(JSON.stringify({ test: 'data' }));
};

const resetAllMocks = () => {
  vi.clearAllMocks();
  vi.clearAllTimers();
};

// ============================================================================
// TESTS - RENDERING
// ============================================================================

describe('SystemHealthDashboard - Rendering', () => {
  beforeEach(() => {
    resetAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should render dashboard modal when health data exists', () => {
    // Arrange
    setupSuccessfulMocks();
    const mockOnClose = vi.fn();

    // Act
    render(<SystemHealthDashboard onClose={mockOnClose} />);

    // Assert
    expect(screen.getByText('System Health Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Real-time monitoring • Developer Mode')).toBeInTheDocument();
  });

  it('should return null when health data is not yet loaded', () => {
    // Arrange
    mockGetSystemHealth.mockReturnValue(null);
    const mockOnClose = vi.fn();

    // Act
    const { container } = render(<SystemHealthDashboard onClose={mockOnClose} />);

    // Assert
    expect(container.firstChild).toBeNull();
  });

  it('should display close button', () => {
    // Arrange
    setupSuccessfulMocks();
    const mockOnClose = vi.fn();

    // Act
    render(<SystemHealthDashboard onClose={mockOnClose} />);

    // Assert
    const closeButton = screen.getByRole('button', { name: '' });
    expect(closeButton).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS - HEALTH STATUS
// ============================================================================

describe('SystemHealthDashboard - Health Status', () => {
  beforeEach(() => {
    resetAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should show healthy status when system is healthy', () => {
    // Arrange
    setupSuccessfulMocks();
    const mockOnClose = vi.fn();

    // Act
    render(<SystemHealthDashboard onClose={mockOnClose} />);

    // Assert
    expect(screen.getByText('System Healthy')).toBeInTheDocument();
  });

  it('should show issues when system is unhealthy', () => {
    // Arrange
    mockGetSystemHealth.mockReturnValue(createMockSystemHealth());
    mockGetAPIMetrics.mockReturnValue(createMockAPIMetrics());
    mockGetHealthReport.mockReturnValue(createMockHealthReport(false));
    const mockOnClose = vi.fn();

    // Act
    render(<SystemHealthDashboard onClose={mockOnClose} />);

    // Assert
    expect(screen.getByText('Issues Detected')).toBeInTheDocument();
    expect(screen.getByText('High memory usage detected')).toBeInTheDocument();
    expect(screen.getByText('Slow API calls')).toBeInTheDocument();
  });

  it('should display recommendations for issues', () => {
    // Arrange
    mockGetSystemHealth.mockReturnValue(createMockSystemHealth());
    mockGetAPIMetrics.mockReturnValue(createMockAPIMetrics());
    mockGetHealthReport.mockReturnValue(createMockHealthReport(false));
    const mockOnClose = vi.fn();

    // Act
    render(<SystemHealthDashboard onClose={mockOnClose} />);

    // Assert
    expect(screen.getByText(/Consider clearing cache/)).toBeInTheDocument();
    expect(screen.getByText(/Review API endpoints/)).toBeInTheDocument();
  });
});

// ============================================================================
// TESTS - METRICS DISPLAY
// ============================================================================

describe('SystemHealthDashboard - Metrics Display', () => {
  beforeEach(() => {
    resetAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should display memory metrics', () => {
    // Arrange
    setupSuccessfulMocks();
    const mockOnClose = vi.fn();

    // Act
    render(<SystemHealthDashboard onClose={mockOnClose} />);

    // Assert
    expect(screen.getByText('Memory')).toBeInTheDocument();
    expect(screen.getByText('256 MB')).toBeInTheDocument();
    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(screen.getByText('1024 MB total')).toBeInTheDocument();
  });

  it('should display performance metrics', () => {
    // Arrange
    setupSuccessfulMocks();
    const mockOnClose = vi.fn();

    // Act
    render(<SystemHealthDashboard onClose={mockOnClose} />);

    // Assert
    expect(screen.getByText('Performance')).toBeInTheDocument();
    expect(screen.getByText('60 FPS')).toBeInTheDocument();
    expect(screen.getByText(/Load: 1200ms • TTFB: 150ms/)).toBeInTheDocument();
  });

  it('should display network metrics', () => {
    // Arrange
    setupSuccessfulMocks();
    const mockOnClose = vi.fn();

    // Act
    render(<SystemHealthDashboard onClose={mockOnClose} />);

    // Assert
    expect(screen.getByText('Network')).toBeInTheDocument();
    expect(screen.getByText('4G')).toBeInTheDocument();
    expect(screen.getByText(/10 Mbps • RTT: 50ms/)).toBeInTheDocument();
  });

  it('should display error metrics', () => {
    // Arrange
    setupSuccessfulMocks();
    const mockOnClose = vi.fn();

    // Act
    render(<SystemHealthDashboard onClose={mockOnClose} />);

    // Assert
    expect(screen.getByText('Errors')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Last 24h • 5 total')).toBeInTheDocument();
  });

  it('should display API metrics when available', () => {
    // Arrange
    setupSuccessfulMocks();
    const mockOnClose = vi.fn();

    // Act
    render(<SystemHealthDashboard onClose={mockOnClose} />);

    // Assert
    expect(screen.getByText('API Metrics')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument(); // Total Calls
    expect(screen.getByText('234ms')).toBeInTheDocument(); // Avg Duration
    expect(screen.getByText('98%')).toBeInTheDocument(); // Success Rate
    expect(screen.getByText('3')).toBeInTheDocument(); // Slow Calls
  });
});

// ============================================================================
// TESTS - USER INTERACTIONS
// ============================================================================

describe('SystemHealthDashboard - User Interactions', () => {
  beforeEach(() => {
    resetAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should call onClose when close button is clicked', async () => {
    // Arrange
    const user = userEvent.setup({ delay: null });
    setupSuccessfulMocks();
    const mockOnClose = vi.fn();

    // Act
    render(<SystemHealthDashboard onClose={mockOnClose} />);
    
    const closeButton = screen.getByRole('button', { name: '' });
    await user.click(closeButton);

    // Assert
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should download logs when Download Logs button is clicked', async () => {
    // Arrange
    const user = userEvent.setup({ delay: null });
    setupSuccessfulMocks();
    const mockOnClose = vi.fn();

    // Act
    render(<SystemHealthDashboard onClose={mockOnClose} />);
    
    const downloadLogsButton = screen.getByText('Download Logs');
    await user.click(downloadLogsButton);

    // Assert
    expect(mockDownloadLogs).toHaveBeenCalledTimes(1);
  });

  it('should download monitoring data when Download Monitoring button is clicked', async () => {
    // Arrange
    const user = userEvent.setup({ delay: null });
    setupSuccessfulMocks();
    const mockOnClose = vi.fn();

    // Act
    render(<SystemHealthDashboard onClose={mockOnClose} />);
    
    const downloadMonitoringButton = screen.getByText('Download Monitoring');
    await user.click(downloadMonitoringButton);

    // Assert
    expect(mockExportData).toHaveBeenCalledTimes(1);
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});

// ============================================================================
// TESTS - AUTO-REFRESH
// ============================================================================

describe('SystemHealthDashboard - Auto-Refresh', () => {
  beforeEach(() => {
    resetAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should fetch health data on mount', () => {
    // Arrange
    setupSuccessfulMocks();
    const mockOnClose = vi.fn();

    // Act
    render(<SystemHealthDashboard onClose={mockOnClose} />);

    // Assert
    expect(mockGetSystemHealth).toHaveBeenCalledTimes(1);
    expect(mockGetAPIMetrics).toHaveBeenCalledTimes(1);
    expect(mockGetHealthReport).toHaveBeenCalledTimes(1);
  });

  it('should refresh health data every 2 seconds', () => {
    // Arrange
    setupSuccessfulMocks();
    const mockOnClose = vi.fn();

    // Act
    render(<SystemHealthDashboard onClose={mockOnClose} />);

    // Initial call
    expect(mockGetSystemHealth).toHaveBeenCalledTimes(1);

    // Advance time by 2 seconds
    vi.advanceTimersByTime(2000);

    // Assert - Should have refreshed
    expect(mockGetSystemHealth).toHaveBeenCalledTimes(2);
    expect(mockGetAPIMetrics).toHaveBeenCalledTimes(2);
    expect(mockGetHealthReport).toHaveBeenCalledTimes(2);
  });

  it('should clean up interval on unmount', () => {
    // Arrange
    setupSuccessfulMocks();
    const mockOnClose = vi.fn();

    // Act
    const { unmount } = render(<SystemHealthDashboard onClose={mockOnClose} />);
    
    expect(mockGetSystemHealth).toHaveBeenCalledTimes(1);
    
    unmount();
    
    // Advance time after unmount
    vi.advanceTimersByTime(2000);

    // Assert - Should not refresh after unmount
    expect(mockGetSystemHealth).toHaveBeenCalledTimes(1);
  });
});

