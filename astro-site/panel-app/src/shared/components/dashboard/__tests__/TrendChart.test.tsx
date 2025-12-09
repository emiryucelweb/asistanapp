/**
 * TrendChart Component Tests
 * Golden Rules: AAA Pattern, Props Testing, Data Generation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import TrendChart from '../TrendChart';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: { language: 'en' },
  }),
}));

// Mock formatters
vi.mock('@/shared/utils/formatters', () => ({
  formatNumber: (num: number) => num.toString(),
  formatCurrency: (num: number) => `$${num}`,
}));

// Mock TrendLineChart
vi.mock('@/shared/ui/charts/TrendLineChart', () => ({
  default: ({ data, title }: any) => (
    <div data-testid="trend-line-chart">
      {data.length} data points
    </div>
  ),
}));

describe('TrendChart', () => {
  const defaultProps = {
    title: 'Test Chart',
    value: '1,234',
    subtitle: 'Test Subtitle',
    change: '+10%',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render chart with title', () => {
      // Arrange & Act
      render(<TrendChart {...defaultProps} />);

      // Assert
      expect(screen.getByText('Test Chart')).toBeInTheDocument();
    });

    it('should render value', () => {
      // Arrange & Act
      render(<TrendChart {...defaultProps} />);

      // Assert
      expect(screen.getByText('1,234')).toBeInTheDocument();
    });

    it('should render subtitle', () => {
      // Arrange & Act
      render(<TrendChart {...defaultProps} />);

      // Assert
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('should render change percentage', () => {
      // Arrange & Act
      render(<TrendChart {...defaultProps} />);

      // Assert
      expect(screen.getByText('+10%')).toBeInTheDocument();
    });

    it('should render TrendLineChart component', () => {
      // Arrange & Act
      render(<TrendChart {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('trend-line-chart')).toBeInTheDocument();
    });
  });

  describe('Change Indicator', () => {
    it('should show positive change in green', () => {
      // Arrange & Act
      const { container } = render(
        <TrendChart {...defaultProps} positive={true} />
      );

      // Assert
      const changeText = container.querySelector('.text-\\[\\#07883b\\]');
      expect(changeText).toBeInTheDocument();
    });

    it('should show negative change in red', () => {
      // Arrange & Act
      const { container } = render(
        <TrendChart {...defaultProps} positive={false} change="-5%" />
      );

      // Assert
      const changeText = container.querySelector('.text-\\[\\#ef4444\\]');
      expect(changeText).toBeInTheDocument();
    });
  });

  describe('Date Range Data Generation', () => {
    it('should generate 24 data points for 24h range', () => {
      // Arrange & Act
      render(<TrendChart {...defaultProps} dateRange="24h" />);

      // Assert
      expect(screen.getByText('24 data points')).toBeInTheDocument();
    });

    it('should generate 7 data points for 7d range', () => {
      // Arrange & Act
      render(<TrendChart {...defaultProps} dateRange="7d" />);

      // Assert
      expect(screen.getByText('7 data points')).toBeInTheDocument();
    });

    it('should generate 30 data points for 30d range', () => {
      // Arrange & Act
      render(<TrendChart {...defaultProps} dateRange="30d" />);

      // Assert
      expect(screen.getByText('30 data points')).toBeInTheDocument();
    });

    it('should generate 12 data points for 1y range', () => {
      // Arrange & Act
      render(<TrendChart {...defaultProps} dateRange="1y" />);

      // Assert
      expect(screen.getByText('12 data points')).toBeInTheDocument();
    });

    it('should generate 14 data points for custom range', () => {
      // Arrange & Act
      render(<TrendChart {...defaultProps} dateRange="custom" />);

      // Assert
      expect(screen.getByText('14 data points')).toBeInTheDocument();
    });
  });

  describe('Chart Type', () => {
    it('should default to conversation type', () => {
      // Arrange & Act
      render(<TrendChart {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('trend-line-chart')).toBeInTheDocument();
    });

    it('should handle revenue type', () => {
      // Arrange & Act
      render(<TrendChart {...defaultProps} type="revenue" />);

      // Assert
      expect(screen.getByTestId('trend-line-chart')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply hover effect', () => {
      // Arrange & Act
      const { container } = render(<TrendChart {...defaultProps} />);

      // Assert
      const card = container.querySelector('.hover\\:shadow-md');
      expect(card).toBeInTheDocument();
    });

    it('should apply border styling', () => {
      // Arrange & Act
      const { container } = render(<TrendChart {...defaultProps} />);

      // Assert
      const card = container.querySelector('.border-\\[\\#d0d9e7\\]');
      expect(card).toBeInTheDocument();
    });

    it('should truncate long values', () => {
      // Arrange & Act
      const { container } = render(
        <TrendChart {...defaultProps} value="Very long value that should be truncated" />
      );

      // Assert
      const valueElement = container.querySelector('.truncate');
      expect(valueElement).toBeInTheDocument();
    });
  });
});

