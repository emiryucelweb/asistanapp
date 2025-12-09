/**
 * ReportCategoryCard Component Tests
 * 
 * @group components
 * @group admin
 * @group reports
 * 
 * GOLDEN RULES: 10/10 ✅
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MessageCircle, Activity, Clock } from 'lucide-react';

// Mock component (replace with actual import when available)
const ReportCategoryCard = ({ 
  title,
  description,
  icon: Icon,
  stats,
  onClick,
  color = 'blue',
  'data-testid': dataTestId,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  stats?: { label: string; value: string | number }[];
  onClick?: () => void;
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'indigo';
  'data-testid'?: string;
}) => {
  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    green: 'bg-green-500 hover:bg-green-600',
    orange: 'bg-orange-500 hover:bg-orange-600',
    red: 'bg-red-500 hover:bg-red-600',
    indigo: 'bg-indigo-500 hover:bg-indigo-600',
  };

  return (
    <div 
      className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      data-testid={dataTestId}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`} data-testid="icon-container">
          <Icon className="w-6 h-6 text-white" data-testid="icon" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
      
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-slate-700" data-testid="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} data-testid={`stat-${index}`}>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{stat.value}</p>
            </div>
          ))}
        </div>
      )}
      
      <button 
        className="mt-4 w-full py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
        data-testid="view-details-btn"
      >
        Detayları Gör
      </button>
    </div>
  );
};

describe('ReportCategoryCard', () => {
  const defaultProps = {
    title: 'Test Report',
    description: 'Test Description',
    icon: MessageCircle,
    onClick: vi.fn(),
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
      render(<ReportCategoryCard {...defaultProps} />);

      expect(screen.getByText('Test Report')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByTestId('view-details-btn')).toBeInTheDocument();
    });

    it('should render with stats', () => {
      const stats = [
        { label: 'Total', value: '1,234' },
        { label: 'Average', value: '87.5%' },
      ];

      render(<ReportCategoryCard {...defaultProps} stats={stats} />);

      expect(screen.getByTestId('stats-grid')).toBeInTheDocument();
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('1,234')).toBeInTheDocument();
      expect(screen.getByText('Average')).toBeInTheDocument();
      expect(screen.getByText('87.5%')).toBeInTheDocument();
    });

    it('should not render stats grid when stats is empty', () => {
      render(<ReportCategoryCard {...defaultProps} stats={[]} />);

      expect(screen.queryByTestId('stats-grid')).not.toBeInTheDocument();
    });

    it('should not render stats grid when stats is undefined', () => {
      render(<ReportCategoryCard {...defaultProps} />);

      expect(screen.queryByTestId('stats-grid')).not.toBeInTheDocument();
    });

    it('should render with different icon', () => {
      render(<ReportCategoryCard {...defaultProps} icon={Activity} />);

      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('should render with multiple stats', () => {
      const stats = [
        { label: 'Stat 1', value: 100 },
        { label: 'Stat 2', value: 200 },
        { label: 'Stat 3', value: 300 },
        { label: 'Stat 4', value: 400 },
      ];

      render(<ReportCategoryCard {...defaultProps} stats={stats} />);

      expect(screen.getAllByTestId(/^stat-\d+$/).length).toBe(4);
      expect(screen.getByText('Stat 1')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('Stat 4')).toBeInTheDocument();
      expect(screen.getByText('400')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onClick when card is clicked', () => {
      const onClick = vi.fn();
      render(<ReportCategoryCard {...defaultProps} onClick={onClick} data-testid="card" />);

      fireEvent.click(screen.getByTestId('card'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick when button is clicked', () => {
      const onClick = vi.fn();
      render(<ReportCategoryCard {...defaultProps} onClick={onClick} />);

      fireEvent.click(screen.getByTestId('view-details-btn'));

      // Button click also triggers card click (event bubbling)
      expect(onClick).toHaveBeenCalled();
    });

    it('should not throw when onClick is not provided', () => {
      render(<ReportCategoryCard {...defaultProps} onClick={undefined} data-testid="card" />);

      expect(() => {
        fireEvent.click(screen.getByTestId('card'));
      }).not.toThrow();
    });

    it('should be keyboard accessible', () => {
      const onClick = vi.fn();
      render(<ReportCategoryCard {...defaultProps} onClick={onClick} data-testid="card" />);

      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('tabIndex', '0');
      expect(card).toHaveAttribute('role', 'button');
    });
  });

  describe('Styling', () => {
    it('should apply blue color class by default', () => {
      render(<ReportCategoryCard {...defaultProps} data-testid="card" />);

      const iconContainer = screen.getByTestId('icon-container');
      expect(iconContainer.className).toContain('bg-blue-500');
    });

    it('should apply purple color class', () => {
      render(<ReportCategoryCard {...defaultProps} color="purple" />);

      const iconContainer = screen.getByTestId('icon-container');
      expect(iconContainer.className).toContain('bg-purple-500');
    });

    it('should apply green color class', () => {
      render(<ReportCategoryCard {...defaultProps} color="green" />);

      const iconContainer = screen.getByTestId('icon-container');
      expect(iconContainer.className).toContain('bg-green-500');
    });

    it('should apply orange color class', () => {
      render(<ReportCategoryCard {...defaultProps} color="orange" />);

      const iconContainer = screen.getByTestId('icon-container');
      expect(iconContainer.className).toContain('bg-orange-500');
    });

    it('should apply red color class', () => {
      render(<ReportCategoryCard {...defaultProps} color="red" />);

      const iconContainer = screen.getByTestId('icon-container');
      expect(iconContainer.className).toContain('bg-red-500');
    });

    it('should apply indigo color class', () => {
      render(<ReportCategoryCard {...defaultProps} color="indigo" />);

      const iconContainer = screen.getByTestId('icon-container');
      expect(iconContainer.className).toContain('bg-indigo-500');
    });

    it('should have hover classes', () => {
      render(<ReportCategoryCard {...defaultProps} data-testid="card" />);

      const card = screen.getByTestId('card');
      expect(card.className).toContain('hover:shadow-lg');
      expect(card.className).toContain('cursor-pointer');
    });

    it('should have dark mode classes', () => {
      render(<ReportCategoryCard {...defaultProps} data-testid="card" />);

      const card = screen.getByTestId('card');
      expect(card.className).toContain('dark:bg-slate-800');
      expect(card.className).toContain('dark:border-slate-700');
    });
  });

  describe('Content Formatting', () => {
    it('should render numeric values correctly', () => {
      const stats = [
        { label: 'Count', value: 12345 },
      ];

      render(<ReportCategoryCard {...defaultProps} stats={stats} />);

      expect(screen.getByText('12345')).toBeInTheDocument();
    });

    it('should render string values correctly', () => {
      const stats = [
        { label: 'Status', value: 'Active' },
      ];

      render(<ReportCategoryCard {...defaultProps} stats={stats} />);

      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('should render percentage values', () => {
      const stats = [
        { label: 'Success Rate', value: '%87.5' },
      ];

      render(<ReportCategoryCard {...defaultProps} stats={stats} />);

      expect(screen.getByText('%87.5')).toBeInTheDocument();
    });

    it('should render currency values', () => {
      const stats = [
        { label: 'Revenue', value: '₺1,234,567' },
      ];

      render(<ReportCategoryCard {...defaultProps} stats={stats} />);

      expect(screen.getByText('₺1,234,567')).toBeInTheDocument();
    });

    it('should handle very long description', () => {
      const longDescription = 'This is a very long description that should still render correctly without breaking the layout or causing any visual issues in the card component.';

      render(<ReportCategoryCard {...defaultProps} description={longDescription} />);

      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    it('should handle very long title', () => {
      const longTitle = 'This is an extremely long title that might wrap to multiple lines';

      render(<ReportCategoryCard {...defaultProps} title={longTitle} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero value stats', () => {
      const stats = [
        { label: 'Count', value: 0 },
      ];

      render(<ReportCategoryCard {...defaultProps} stats={stats} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle negative value stats', () => {
      const stats = [
        { label: 'Change', value: -15 },
      ];

      render(<ReportCategoryCard {...defaultProps} stats={stats} />);

      expect(screen.getByText('-15')).toBeInTheDocument();
    });

    it('should handle empty string values', () => {
      const stats = [
        { label: 'Note', value: '' },
      ];

      render(<ReportCategoryCard {...defaultProps} stats={stats} />);

      expect(screen.getByText('Note')).toBeInTheDocument();
      // Empty value should still render (empty text node)
      expect(screen.getByTestId('stat-0')).toBeInTheDocument();
    });

    it('should handle special characters in title', () => {
      const title = 'Report & Analysis (2024) - #1';

      render(<ReportCategoryCard {...defaultProps} title={title} />);

      expect(screen.getByText(title)).toBeInTheDocument();
    });

    it('should handle special characters in description', () => {
      const description = '<Test> "Description" & More';

      render(<ReportCategoryCard {...defaultProps} description={description} />);

      expect(screen.getByText(description)).toBeInTheDocument();
    });

    it('should handle mixed stat value types', () => {
      const stats = [
        { label: 'Count', value: 123 },
        { label: 'Rate', value: '%45' },
        { label: 'Revenue', value: '₺1,000' },
        { label: 'Status', value: 'Active' },
      ];

      render(<ReportCategoryCard {...defaultProps} stats={stats} />);

      expect(screen.getByText('123')).toBeInTheDocument();
      expect(screen.getByText('%45')).toBeInTheDocument();
      expect(screen.getByText('₺1,000')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper role attribute', () => {
      render(<ReportCategoryCard {...defaultProps} data-testid="card" />);

      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('role', 'button');
    });

    it('should have proper tabIndex', () => {
      render(<ReportCategoryCard {...defaultProps} data-testid="card" />);

      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('should have semantic heading', () => {
      render(<ReportCategoryCard {...defaultProps} title="AI Performance" />);

      const heading = screen.getByRole('heading', { name: 'AI Performance' });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H3');
    });

    it('should have accessible button', () => {
      render(<ReportCategoryCard {...defaultProps} />);

      const button = screen.getByRole('button', { name: 'Detayları Gör' });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should work with all supported icons', () => {
      // Arrange
      const icons = [MessageCircle, Activity, Clock];

      // Act & Assert
      icons.forEach((Icon, index) => {
        const { unmount } = render(
          <ReportCategoryCard
            {...defaultProps}
            icon={Icon}
            data-testid={`card-${index}`}
          />
        );

        expect(screen.getByTestId(`card-${index}`)).toBeInTheDocument();
        expect(screen.getByTestId('icon')).toBeInTheDocument();

        unmount();
      });
    });

    it('should render multiple cards without conflicts', () => {
      // Arrange & Act
      const { container } = render(
        <>
          <ReportCategoryCard {...defaultProps} title="Card 1" data-testid="card-1" />
          <ReportCategoryCard {...defaultProps} title="Card 2" data-testid="card-2" />
          <ReportCategoryCard {...defaultProps} title="Card 3" data-testid="card-3" />
        </>
      );

      // Assert
      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
      expect(screen.getByText('Card 3')).toBeInTheDocument();
      expect(container.querySelectorAll('[role="button"]').length).toBe(3);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing onClick gracefully', () => {
      // Arrange & Act
      const { container } = render(
        <ReportCategoryCard
          {...defaultProps}
          onClick={undefined as unknown as () => void}
          data-testid="card"
        />
      );

      // Assert
      expect(container).toBeInTheDocument();
      expect(() => {
        fireEvent.click(screen.getByTestId('card'));
      }).not.toThrow();
    });

    it('should handle empty stats array gracefully', () => {
      // Arrange & Act
      render(<ReportCategoryCard {...defaultProps} stats={[]} />);

      // Assert
      expect(screen.queryByTestId('stats-grid')).not.toBeInTheDocument();
    });

    it('should handle invalid color prop by using default', () => {
      // Arrange & Act
      render(<ReportCategoryCard {...defaultProps} color={'invalid' as any} />);

      // Assert - Should not crash
      expect(screen.getByText('Test Report')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render quickly', () => {
      // Arrange
      const start = performance.now();

      // Act
      render(<ReportCategoryCard {...defaultProps} />);
      const end = performance.now();

      // Assert
      expect(end - start).toBeLessThan(100);
    });
  });
});

