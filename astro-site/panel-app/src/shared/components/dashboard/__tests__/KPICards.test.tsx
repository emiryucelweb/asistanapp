/**
 * KPICards Component Tests
 * Golden Rules: AAA Pattern, Props Testing, Calculations
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import KPICards from '../KPICards';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock formatters
vi.mock('@/shared/utils/formatters', () => ({
  formatNumber: (num: number) => num.toString(),
  formatCurrency: (num: number) => `$${num}`,
}));

describe('KPICards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render 4 KPI cards', () => {
      // Arrange & Act
      const { container } = render(<KPICards />);

      // Assert
      const cards = container.querySelectorAll('.rounded-xl.border');
      expect(cards).toHaveLength(4);
    });

    it('should render with default 7d date range', () => {
      // Arrange & Act
      const { container } = render(<KPICards />);

      // Assert
      expect(container).toBeInTheDocument();
    });

    it('should display card titles', () => {
      // Arrange & Act
      render(<KPICards />);

      // Assert
      expect(screen.getByText('dashboard.kpi.activeConversations')).toBeInTheDocument();
      expect(screen.getByText('dashboard.kpi.aiResolutionRate')).toBeInTheDocument();
      expect(screen.getByText('dashboard.kpi.customerSatisfaction')).toBeInTheDocument();
      expect(screen.getByText('dashboard.kpi.revenue')).toBeInTheDocument();
    });

    it('should display change percentages', () => {
      // Arrange & Act
      render(<KPICards />);

      // Assert
      expect(screen.getByText('+10%')).toBeInTheDocument();
      expect(screen.getByText('+5%')).toBeInTheDocument();
      expect(screen.getByText('+3%')).toBeInTheDocument();
      expect(screen.getByText('+8%')).toBeInTheDocument();
    });
  });

  describe('Date Range Calculations', () => {
    it('should calculate values for 24h range', () => {
      // Arrange & Act
      render(<KPICards dateRange="24h" />);

      // Assert - 24h uses 0.15 multiplier
      // 125 * 0.15 = 18.75 -> 19
      expect(screen.getByText('19')).toBeInTheDocument();
    });

    it('should calculate values for 7d range (default)', () => {
      // Arrange & Act
      render(<KPICards dateRange="7d" />);

      // Assert - 7d uses 1x multiplier
      expect(screen.getByText('125')).toBeInTheDocument();
    });

    it('should calculate values for 30d range', () => {
      // Arrange & Act
      render(<KPICards dateRange="30d" />);

      // Assert - 30d uses 4x multiplier
      // 125 * 4 = 500
      expect(screen.getByText('500')).toBeInTheDocument();
    });

    it('should calculate values for 1y range', () => {
      // Arrange & Act
      render(<KPICards dateRange="1y" />);

      // Assert - 1y uses 50x multiplier
      // 125 * 50 = 6250
      expect(screen.getByText('6250')).toBeInTheDocument();
    });

    it('should calculate values for custom range', () => {
      // Arrange & Act
      render(<KPICards dateRange="custom" />);

      // Assert - custom uses 2x multiplier
      // 125 * 2 = 250
      expect(screen.getByText('250')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply hover effect class', () => {
      // Arrange & Act
      const { container } = render(<KPICards />);

      // Assert
      const card = container.querySelector('.hover\\:shadow-md');
      expect(card).toBeInTheDocument();
    });

    it('should have border styling', () => {
      // Arrange & Act
      const { container } = render(<KPICards />);

      // Assert
      const card = container.querySelector('.border-\\[\\#d0d9e7\\]');
      expect(card).toBeInTheDocument();
    });

    it('should show positive change in green', () => {
      // Arrange & Act
      const { container } = render(<KPICards />);

      // Assert
      const positiveChange = container.querySelector('.text-\\[\\#07883b\\]');
      expect(positiveChange).toBeInTheDocument();
    });
  });
});

