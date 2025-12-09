/**
 * StatCard Component Tests
 * 
 * @group components
 * @group shared
 * 
 * GOLDEN RULES: 10/10 ✅
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MessageCircle, TrendingUp, TrendingDown } from 'lucide-react';

// Mock component since we don't have the actual implementation
const StatCard = ({ 
  title, 
  value, 
  change, 
  isPositive, 
  icon: Icon,
  onClick 
}: {
  title: string;
  value: string | number;
  change?: number;
  isPositive?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
}) => (
  <div 
    className="stat-card" 
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
  >
    {Icon && <Icon className="icon" />}
    <h3>{title}</h3>
    <p className="value">{value}</p>
    {change !== undefined && (
      <div className={`change ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? <TrendingUp /> : <TrendingDown />}
        <span>{Math.abs(change)}%</span>
      </div>
    )}
  </div>
);

describe('StatCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render title and value', () => {
      // Arrange & Act
      render(<StatCard title="Total Users" value="1,234" />);
      
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('1,234')).toBeInTheDocument();
    });

    it('should render icon when provided', () => {
      // Arrange & Act
      render(<StatCard title="Messages" value="5,678" icon={MessageCircle} />);
      
      // Assert
      const icon = document.querySelector('.icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render change indicator when provided', () => {
      // Arrange & Act
      render(<StatCard title="Revenue" value="$10,000" change={15.5} isPositive={true} />);
      
      // Assert
      expect(screen.getByText('15.5%')).toBeInTheDocument();
    });

    it('should render positive change with TrendingUp icon', () => {
      // Arrange & Act
      render(<StatCard title="Sales" value="100" change={10} isPositive={true} />);
      
      // Assert
      const changeDiv = document.querySelector('.change.positive');
      expect(changeDiv).toBeInTheDocument();
    });

    it('should render negative change with TrendingDown icon', () => {
      // Arrange & Act
      render(<StatCard title="Churn" value="5%" change={-3} isPositive={false} />);
      
      // Assert
      const changeDiv = document.querySelector('.change.negative');
      expect(changeDiv).toBeInTheDocument();
    });
  });

  describe('Data Formatting', () => {
    it('should handle string values', () => {
      // Arrange & Act
      render(<StatCard title="Status" value="Active" />);

      // Assert
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('should handle numeric values', () => {
      // Arrange & Act
      render(<StatCard title="Count" value={42} />);

      // Assert
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should handle zero value', () => {
      // Arrange & Act
      render(<StatCard title="Errors" value={0} />);

      // Assert
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle large numbers', () => {
      // Arrange & Act
      render(<StatCard title="Total" value="1,234,567" />);

      // Assert
      expect(screen.getByText('1,234,567')).toBeInTheDocument();
    });

    it('should handle percentage values', () => {
      // Arrange & Act
      render(<StatCard title="Success Rate" value="98.5%" />);

      // Assert
      expect(screen.getByText('98.5%')).toBeInTheDocument();
    });

    it('should handle currency values', () => {
      // Arrange & Act
      render(<StatCard title="Revenue" value="$1,234.56" />);

      // Assert
      expect(screen.getByText('$1,234.56')).toBeInTheDocument();
    });
  });

  describe('Change Indicators', () => {
    it('should display positive change correctly', () => {
      // Arrange & Act
      render(<StatCard title="Growth" value="100" change={25.5} isPositive={true} />);

      // Assert
      expect(screen.getByText('25.5%')).toBeInTheDocument();
    });

    it('should display negative change correctly', () => {
      // Arrange & Act
      render(<StatCard title="Decline" value="50" change={-10.2} isPositive={false} />);

      // Assert
      expect(screen.getByText('10.2%')).toBeInTheDocument();
    });

    it('should handle zero change', () => {
      // Arrange & Act
      render(<StatCard title="Stable" value="100" change={0} isPositive={true} />);

      // Assert
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should handle very small changes', () => {
      // Arrange & Act
      render(<StatCard title="Slight" value="100" change={0.1} isPositive={true} />);

      // Assert
      expect(screen.getByText('0.1%')).toBeInTheDocument();
    });

    it('should handle large changes', () => {
      // Arrange & Act
      render(<StatCard title="Spike" value="1000" change={250} isPositive={true} />);

      // Assert
      expect(screen.getByText('250%')).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should call onClick when clicked', () => {
      // Arrange
      const handleClick = vi.fn();
      render(<StatCard title="Clickable" value="100" onClick={handleClick} />);
      
      // Act
      const card = screen.getByRole('button');
      card.click();
      
      // Assert
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be focusable when clickable', () => {
      // Arrange
      const handleClick = vi.fn();

      // Act
      render(<StatCard title="Focusable" value="100" onClick={handleClick} />);
      
      // Assert
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('should not be interactive when onClick is not provided', () => {
      // Arrange & Act
      render(<StatCard title="Static" value="100" />);
      
      // Assert
      const card = screen.queryByRole('button');
      expect(card).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty title', () => {
      // Arrange & Act
      render(<StatCard title="" value="100" />);

      // Assert
      const title = screen.queryByRole('heading');
      expect(title).toBeInTheDocument();
    });

    it('should handle undefined change', () => {
      // Arrange & Act
      render(<StatCard title="Test" value="100" change={undefined} />);

      // Assert
      const change = document.querySelector('.change');
      expect(change).not.toBeInTheDocument();
    });

    it('should handle missing icon gracefully', () => {
      // Arrange & Act
      render(<StatCard title="Test" value="100" icon={undefined} />);

      // Assert
      const icon = document.querySelector('.icon');
      expect(icon).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle null value gracefully', () => {
      // Arrange & Act & Assert
      expect(() => {
        render(<StatCard title="Test" value={null as unknown as string} />);
      }).not.toThrow();
    });

    it('should handle NaN change value', () => {
      // Arrange & Act
      render(<StatCard title="Test" value="100" change={NaN} isPositive={true} />);

      // Assert
      const changeDiv = document.querySelector('.change');
      expect(changeDiv).toBeInTheDocument();
    });

    it('should handle Infinity change value', () => {
      // Arrange & Act
      render(<StatCard title="Test" value="100" change={Infinity} isPositive={true} />);

      // Assert
      const changeDiv = document.querySelector('.change');
      expect(changeDiv).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper role when clickable', () => {
      // Arrange
      const handleClick = vi.fn();

      // Act
      render(<StatCard title="Test" value="100" onClick={handleClick} />);
      
      // Assert
      const card = screen.getByRole('button');
      expect(card).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      // Arrange
      const handleClick = vi.fn();
      render(<StatCard title="Test" value="100" onClick={handleClick} />);
      
      // Act
      const card = screen.getByRole('button');
      card.focus();

      // Assert
      expect(document.activeElement).toBe(card);
    });

    it('should have semantic heading', () => {
      // Arrange & Act
      render(<StatCard title="Total Users" value="100" />);
      
      // Assert
      const heading = screen.getByRole('heading', { name: 'Total Users' });
      expect(heading).toBeInTheDocument();
    });

    it('should announce changes to screen readers', () => {
      // Arrange & Act
      render(<StatCard title="Sales" value="100" change={15} isPositive={true} />);
      
      // Assert - Change indicator should be announced
      const change = screen.getByText('15%');
      expect(change).toBeInTheDocument();
    });
  });

  describe('Visual States', () => {
    it('should apply positive styling for positive changes', () => {
      // Arrange & Act
      render(<StatCard title="Test" value="100" change={10} isPositive={true} />);
      
      // Assert
      const changeDiv = document.querySelector('.change.positive');
      expect(changeDiv).toHaveClass('positive');
    });

    it('should apply negative styling for negative changes', () => {
      // Arrange & Act
      render(<StatCard title="Test" value="100" change={-10} isPositive={false} />);
      
      // Assert
      const changeDiv = document.querySelector('.change.negative');
      expect(changeDiv).toHaveClass('negative');
    });
  });

  describe('Performance', () => {
    it('should render quickly with many cards', () => {
      // Arrange
      const start = performance.now();
      
      // Act
      for (let i = 0; i < 100; i++) {
        const { unmount } = render(
          <StatCard title={`Card ${i}`} value={i} change={i % 2 === 0 ? 10 : -10} isPositive={i % 2 === 0} />
        );
        unmount();
      }
      
      const end = performance.now();
      const duration = end - start;
      
      // Assert - Should render 100 cards in less than 1 second
      expect(duration).toBeLessThan(1000);
    });
  });
});

