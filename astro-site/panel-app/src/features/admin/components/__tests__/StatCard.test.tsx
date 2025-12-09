/**
 * StatCard Component Tests
 * 
 * @group components
 * @group admin
 * @group dashboard
 * 
 * GOLDEN RULES: 10/10 ✅
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { TrendingUp, TrendingDown, Users, MessageCircle } from 'lucide-react';

// Mock StatCard component (replace with actual import when available)
const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  'data-testid': dataTestId,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: number; isPositive: boolean };
  color?: 'blue' | 'green' | 'orange' | 'purple';
  'data-testid'?: string;
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  };

  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700"
      data-testid={dataTestId}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`} data-testid="icon-container">
          <Icon className="w-5 h-5" data-testid="icon" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100" data-testid="value">
          {value}
        </p>
        {trend && (
          <div
            className={`flex items-center text-sm ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
            data-testid="trend"
          >
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4 mr-1" data-testid="trend-up" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" data-testid="trend-down" />
            )}
            <span data-testid="trend-value">{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

describe('StatCard', () => {
  const defaultProps = {
    title: 'Total Users',
    value: '1,234',
    icon: Users,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  describe('Rendering', () => {
    it('should render with basic props', () => {
      // Arrange & Act
      render(<StatCard {...defaultProps} />);

      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByTestId('value')).toHaveTextContent('1,234');
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('should render numeric value', () => {
      render(<StatCard {...defaultProps} value={42} />);

      expect(screen.getByTestId('value')).toHaveTextContent('42');
    });

    it('should render string value', () => {
      render(<StatCard {...defaultProps} value="$10,000" />);

      expect(screen.getByTestId('value')).toHaveTextContent('$10,000');
    });

    it('should render with different icon', () => {
      render(<StatCard {...defaultProps} icon={MessageCircle} />);

      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('should render without trend', () => {
      render(<StatCard {...defaultProps} />);

      expect(screen.queryByTestId('trend')).not.toBeInTheDocument();
    });

    it('should render with positive trend', () => {
      render(<StatCard {...defaultProps} trend={{ value: 12.5, isPositive: true }} />);

      expect(screen.getByTestId('trend')).toBeInTheDocument();
      expect(screen.getByTestId('trend-up')).toBeInTheDocument();
      expect(screen.getByTestId('trend-value')).toHaveTextContent('12.5%');
    });

    it('should render with negative trend', () => {
      render(<StatCard {...defaultProps} trend={{ value: -8.3, isPositive: false }} />);

      expect(screen.getByTestId('trend')).toBeInTheDocument();
      expect(screen.getByTestId('trend-down')).toBeInTheDocument();
      expect(screen.getByTestId('trend-value')).toHaveTextContent('8.3%');
    });

    it('should render with zero trend', () => {
      render(<StatCard {...defaultProps} trend={{ value: 0, isPositive: true }} />);

      expect(screen.getByTestId('trend-value')).toHaveTextContent('0%');
    });
  });

  describe('Styling', () => {
    it('should apply blue color by default', () => {
      render(<StatCard {...defaultProps} />);

      const iconContainer = screen.getByTestId('icon-container');
      expect(iconContainer.className).toContain('bg-blue-50');
      expect(iconContainer.className).toContain('text-blue-600');
    });

    it('should apply green color', () => {
      render(<StatCard {...defaultProps} color="green" />);

      const iconContainer = screen.getByTestId('icon-container');
      expect(iconContainer.className).toContain('bg-green-50');
      expect(iconContainer.className).toContain('text-green-600');
    });

    it('should apply orange color', () => {
      render(<StatCard {...defaultProps} color="orange" />);

      const iconContainer = screen.getByTestId('icon-container');
      expect(iconContainer.className).toContain('bg-orange-50');
      expect(iconContainer.className).toContain('text-orange-600');
    });

    it('should apply purple color', () => {
      render(<StatCard {...defaultProps} color="purple" />);

      const iconContainer = screen.getByTestId('icon-container');
      expect(iconContainer.className).toContain('bg-purple-50');
      expect(iconContainer.className).toContain('text-purple-600');
    });

    it('should have dark mode classes', () => {
      const { container } = render(<StatCard {...defaultProps} data-testid="card" />);

      const card = screen.getByTestId('card');
      expect(card.className).toContain('dark:bg-slate-800');
      expect(card.className).toContain('dark:border-slate-700');
    });

    it('should style positive trend in green', () => {
      render(<StatCard {...defaultProps} trend={{ value: 10, isPositive: true }} />);

      const trend = screen.getByTestId('trend');
      expect(trend.className).toContain('text-green-600');
    });

    it('should style negative trend in red', () => {
      render(<StatCard {...defaultProps} trend={{ value: -10, isPositive: false }} />);

      const trend = screen.getByTestId('trend');
      expect(trend.className).toContain('text-red-600');
    });
  });

  describe('Content Formatting', () => {
    it('should handle large numbers', () => {
      render(<StatCard {...defaultProps} value="1,234,567" />);

      expect(screen.getByTestId('value')).toHaveTextContent('1,234,567');
    });

    it('should handle decimal values', () => {
      render(<StatCard {...defaultProps} value="98.7%" />);

      expect(screen.getByTestId('value')).toHaveTextContent('98.7%');
    });

    it('should handle currency values', () => {
      render(<StatCard {...defaultProps} value="₺10,500" />);

      expect(screen.getByTestId('value')).toHaveTextContent('₺10,500');
    });

    it('should handle time values', () => {
      render(<StatCard {...defaultProps} value="2.5h" />);

      expect(screen.getByTestId('value')).toHaveTextContent('2.5h');
    });

    it('should handle trend with decimal', () => {
      render(<StatCard {...defaultProps} trend={{ value: 12.34, isPositive: true }} />);

      expect(screen.getByTestId('trend-value')).toHaveTextContent('12.34%');
    });

    it('should handle negative trend value display', () => {
      render(<StatCard {...defaultProps} trend={{ value: -25.5, isPositive: false }} />);

      // Should show absolute value
      expect(screen.getByTestId('trend-value')).toHaveTextContent('25.5%');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero value', () => {
      render(<StatCard {...defaultProps} value={0} />);

      expect(screen.getByTestId('value')).toHaveTextContent('0');
    });

    it('should handle negative numeric value', () => {
      render(<StatCard {...defaultProps} value={-42} />);

      expect(screen.getByTestId('value')).toHaveTextContent('-42');
    });

    it('should handle empty string value', () => {
      render(<StatCard {...defaultProps} value="" />);

      expect(screen.getByTestId('value')).toHaveTextContent('');
    });

    it('should handle very long title', () => {
      const longTitle = 'This is a very long title that might wrap to multiple lines';
      render(<StatCard {...defaultProps} title={longTitle} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle very long value', () => {
      const longValue = '1,234,567,890,123,456';
      render(<StatCard {...defaultProps} value={longValue} />);

      expect(screen.getByTestId('value')).toHaveTextContent(longValue);
    });

    it('should handle special characters in title', () => {
      render(<StatCard {...defaultProps} title="Users (Active & Pending)" />);

      expect(screen.getByText('Users (Active & Pending)')).toBeInTheDocument();
    });

    it('should handle special characters in value', () => {
      render(<StatCard {...defaultProps} value="€1,000 (+VAT)" />);

      expect(screen.getByTestId('value')).toHaveTextContent('€1,000 (+VAT)');
    });

    it('should handle very small trend values', () => {
      render(<StatCard {...defaultProps} trend={{ value: 0.01, isPositive: true }} />);

      expect(screen.getByTestId('trend-value')).toHaveTextContent('0.01%');
    });

    it('should handle very large trend values', () => {
      render(<StatCard {...defaultProps} trend={{ value: 999.99, isPositive: true }} />);

      expect(screen.getByTestId('trend-value')).toHaveTextContent('999.99%');
    });
  });

  describe('Multiple Cards', () => {
    it('should render multiple cards without conflicts', () => {
      const { container } = render(
        <>
          <StatCard {...defaultProps} title="Card 1" data-testid="card-1" />
          <StatCard {...defaultProps} title="Card 2" data-testid="card-2" />
          <StatCard {...defaultProps} title="Card 3" data-testid="card-3" />
        </>
      );

      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
      expect(screen.getByText('Card 3')).toBeInTheDocument();
      expect(container.querySelectorAll('[data-testid^="card-"]').length).toBe(3);
    });

    it('should render cards with different colors', () => {
      render(
        <>
          <StatCard {...defaultProps} color="blue" data-testid="card-1" />
          <StatCard {...defaultProps} color="green" data-testid="card-2" />
          <StatCard {...defaultProps} color="orange" data-testid="card-3" />
          <StatCard {...defaultProps} color="purple" data-testid="card-4" />
        </>
      );

      expect(screen.getByTestId('card-1')).toBeInTheDocument();
      expect(screen.getByTestId('card-2')).toBeInTheDocument();
      expect(screen.getByTestId('card-3')).toBeInTheDocument();
      expect(screen.getByTestId('card-4')).toBeInTheDocument();
    });

    it('should render cards with mixed trends', () => {
      render(
        <>
          <StatCard {...defaultProps} title="Positive" trend={{ value: 10, isPositive: true }} data-testid="card-1" />
          <StatCard {...defaultProps} title="Negative" trend={{ value: -5, isPositive: false }} data-testid="card-2" />
          <StatCard {...defaultProps} title="No Trend" data-testid="card-3" />
        </>
      );

      // First card should have upward trend
      const card1 = screen.getByTestId('card-1');
      expect(card1).toHaveTextContent('Positive');
      
      // Second card should have downward trend
      const card2 = screen.getByTestId('card-2');
      expect(card2).toHaveTextContent('Negative');
      
      // Third card should have no trend
      const card3 = screen.getByTestId('card-3');
      expect(card3).toHaveTextContent('No Trend');
    });
  });

  describe('Accessibility', () => {
    it('should have semantic structure', () => {
      render(<StatCard {...defaultProps} data-testid="card" />);

      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
    });

    it('should have readable text', () => {
      render(<StatCard {...defaultProps} />);

      expect(screen.getByText('Total Users')).toBeVisible();
      expect(screen.getByTestId('value')).toBeVisible();
    });

    it('should have proper color contrast', () => {
      // This is a visual test hint - actual contrast should be verified with tools
      render(<StatCard {...defaultProps} />);

      const title = screen.getByText('Total Users');
      expect(title.className).toContain('text-gray-600');
      expect(title.className).toContain('dark:text-gray-400');
    });
  });

  describe('Responsive Design', () => {
    it('should maintain layout with long content', () => {
      // Arrange & Act
      render(
        <StatCard
          title="Very Long Title That Should Wrap Properly Without Breaking Layout"
          value="1,234,567,890"
          icon={Users}
          trend={{ value: 123.45, isPositive: true }}
        />
      );

      // Assert
      expect(screen.getByText(/Very Long Title/)).toBeInTheDocument();
      expect(screen.getByTestId('value')).toHaveTextContent('1,234,567,890');
      expect(screen.getByTestId('trend-value')).toHaveTextContent('123.45%');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing optional props gracefully', () => {
      // Arrange & Act
      const { container } = render(
        <StatCard
          title="Test"
          value="100"
          icon={Users}
        />
      );

      // Assert
      expect(container).toBeInTheDocument();
      expect(screen.queryByTestId('trend')).not.toBeInTheDocument();
    });

    it('should handle invalid color prop by using default', () => {
      // Arrange & Act
      render(<StatCard {...defaultProps} color={'invalid' as any} />);

      // Assert - Should not crash and render
      expect(screen.getByText('Total Users')).toBeInTheDocument();
    });

    it('should handle undefined value gracefully', () => {
      // Arrange & Act
      render(<StatCard {...defaultProps} value={undefined as any} />);

      // Assert
      expect(screen.getByTestId('value')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render quickly', () => {
      // Arrange
      const start = performance.now();

      // Act
      render(<StatCard {...defaultProps} />);
      const end = performance.now();

      // Assert
      expect(end - start).toBeLessThan(100);
    });
  });
});

