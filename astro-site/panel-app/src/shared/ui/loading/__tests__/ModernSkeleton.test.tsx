/**
 * ModernSkeleton Component Tests
 * Coverage Target: 30% → 65%
 * Golden Rules: AAA Pattern, Variant Testing, Props Validation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  ModernSkeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonListItem,
  SkeletonTableRow,
  SkeletonStatsCard,
  SkeletonChart,
  SkeletonMessage,
  SkeletonGrid,
} from '../ModernSkeleton';

// Mock cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' '),
}));

describe('ModernSkeleton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Rule 1: Component Rendering
  describe('Rendering', () => {
    it('should render skeleton with default props', () => {
      // Arrange & Act
      render(<ModernSkeleton />);

      // Assert
      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveAttribute('aria-label', 'Loading...');
    });

    it('should apply rectangular variant by default', () => {
      // Arrange & Act
      render(<ModernSkeleton data-testid="skeleton" />);

      // Assert
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('rounded-none');
    });

    it('should apply text variant', () => {
      // Arrange & Act
      render(<ModernSkeleton variant="text" data-testid="skeleton" />);

      // Assert
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('rounded', 'h-4');
    });

    it('should apply circular variant', () => {
      // Arrange & Act
      render(<ModernSkeleton variant="circular" data-testid="skeleton" />);

      // Assert
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('rounded-full');
    });

    it('should apply rounded variant', () => {
      // Arrange & Act
      render(<ModernSkeleton variant="rounded" data-testid="skeleton" />);

      // Assert
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('rounded-lg');
    });
  });

  describe('Animations', () => {
    it('should apply shimmer animation by default', () => {
      // Arrange & Act
      render(<ModernSkeleton data-testid="skeleton" />);

      // Assert
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('before:animate-shimmer');
    });

    it('should apply pulse animation', () => {
      // Arrange & Act
      render(<ModernSkeleton animation="pulse" data-testid="skeleton" />);

      // Assert
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('should apply wave animation', () => {
      // Arrange & Act
      render(<ModernSkeleton animation="wave" data-testid="skeleton" />);

      // Assert
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('animate-wave');
    });

    it('should apply no animation', () => {
      // Arrange & Act
      render(<ModernSkeleton animation="none" data-testid="skeleton" />);

      // Assert
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).not.toHaveClass('animate-pulse');
      expect(skeleton).not.toHaveClass('animate-wave');
    });
  });

  describe('Dimensions', () => {
    it('should apply custom width as number', () => {
      // Arrange & Act
      render(<ModernSkeleton width={200} data-testid="skeleton" />);

      // Assert
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveStyle({ width: '200px' });
    });

    it('should apply custom width as string', () => {
      // Arrange & Act
      render(<ModernSkeleton width="50%" data-testid="skeleton" />);

      // Assert
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveStyle({ width: '50%' });
    });

    it('should apply custom height as number', () => {
      // Arrange & Act
      render(<ModernSkeleton height={100} data-testid="skeleton" />);

      // Assert
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveStyle({ height: '100px' });
    });

    it('should apply custom height as string', () => {
      // Arrange & Act
      render(<ModernSkeleton height="4rem" data-testid="skeleton" />);

      // Assert
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveStyle({ height: '4rem' });
    });

    it('should apply both width and height', () => {
      // Arrange & Act
      render(<ModernSkeleton width={300} height={150} data-testid="skeleton" />);

      // Assert
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveStyle({ width: '300px', height: '150px' });
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      // Arrange & Act
      render(<ModernSkeleton className="custom-skeleton" data-testid="skeleton" />);

      // Assert
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('custom-skeleton');
    });
  });
});

describe('SkeletonText', () => {
  it('should render as text variant', () => {
    // Arrange & Act
    render(<SkeletonText data-testid="skeleton-text" />);

    // Assert
    const skeleton = screen.getByTestId('skeleton-text');
    expect(skeleton).toHaveClass('rounded', 'h-4');
  });

  it('should accept width prop', () => {
    // Arrange & Act
    render(<SkeletonText width="80%" data-testid="skeleton-text" />);

    // Assert
    const skeleton = screen.getByTestId('skeleton-text');
    expect(skeleton).toHaveStyle({ width: '80%' });
  });
});

describe('SkeletonAvatar', () => {
  it('should render as circular variant', () => {
    // Arrange & Act
    render(<SkeletonAvatar data-testid="skeleton-avatar" />);

    // Assert
    const skeleton = screen.getByTestId('skeleton-avatar');
    expect(skeleton).toHaveClass('rounded-full');
  });

  it('should have default size of 40x40', () => {
    // Arrange & Act
    render(<SkeletonAvatar data-testid="skeleton-avatar" />);

    // Assert
    const skeleton = screen.getByTestId('skeleton-avatar');
    expect(skeleton).toHaveStyle({ width: '40px', height: '40px' });
  });

  it('should accept custom size', () => {
    // Arrange & Act
    render(<SkeletonAvatar width={64} height={64} data-testid="skeleton-avatar" />);

    // Assert
    const skeleton = screen.getByTestId('skeleton-avatar');
    expect(skeleton).toHaveStyle({ width: '64px', height: '64px' });
  });
});

describe('SkeletonCard', () => {
  it('should render complete card structure', () => {
    // Arrange & Act
    const { container } = render(<SkeletonCard />);

    // Assert
    expect(container.querySelector('.bg-white')).toBeInTheDocument();
    expect(container.querySelector('.rounded-xl')).toBeInTheDocument();
  });

  it('should render avatar and text lines', () => {
    // Arrange & Act
    const { container } = render(<SkeletonCard />);

    // Assert
    const avatar = container.querySelector('.rounded-full');
    expect(avatar).toBeInTheDocument();
  });

  it('should accept animation prop', () => {
    // Arrange & Act
    const { container } = render(<SkeletonCard animation="pulse" />);

    // Assert
    const pulseElements = container.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it('should accept className prop', () => {
    // Arrange & Act
    const { container } = render(<SkeletonCard className="custom-card" />);

    // Assert
    const card = container.firstChild;
    expect(card).toHaveClass('custom-card');
  });
});

describe('SkeletonListItem', () => {
  it('should render list item structure', () => {
    // Arrange & Act
    const { container } = render(<SkeletonListItem />);

    // Assert
    const avatar = container.querySelector('.rounded-full');
    expect(avatar).toBeInTheDocument();
  });

  it('should have border bottom', () => {
    // Arrange & Act
    const { container } = render(<SkeletonListItem />);

    // Assert
    const listItem = container.querySelector('.border-b');
    expect(listItem).toBeInTheDocument();
  });

  it('should accept animation prop', () => {
    // Arrange & Act
    const { container } = render(<SkeletonListItem animation="wave" />);

    // Assert
    const waveElements = container.querySelectorAll('.animate-wave');
    expect(waveElements.length).toBeGreaterThan(0);
  });
});

describe('SkeletonTableRow', () => {
  it('should render table row with default 5 columns', () => {
    // Arrange & Act
    const { container } = render(
      <table>
        <tbody>
          <SkeletonTableRow />
        </tbody>
      </table>
    );

    // Assert
    const cells = container.querySelectorAll('td');
    expect(cells).toHaveLength(5);
  });

  it('should render custom number of columns', () => {
    // Arrange & Act
    const { container } = render(
      <table>
        <tbody>
          <SkeletonTableRow columns={3} />
        </tbody>
      </table>
    );

    // Assert
    const cells = container.querySelectorAll('td');
    expect(cells).toHaveLength(3);
  });

  it('should accept animation prop', () => {
    // Arrange & Act
    const { container } = render(
      <table>
        <tbody>
          <SkeletonTableRow animation="pulse" />
        </tbody>
      </table>
    );

    // Assert
    const pulseElements = container.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(0);
  });
});

describe('SkeletonStatsCard', () => {
  it('should render stats card structure', () => {
    // Arrange & Act
    const { container } = render(<SkeletonStatsCard />);

    // Assert
    expect(container.querySelector('.bg-white')).toBeInTheDocument();
    expect(container.querySelector('.rounded-xl')).toBeInTheDocument();
  });

  it('should render circular icon placeholder', () => {
    // Arrange & Act
    const { container } = render(<SkeletonStatsCard />);

    // Assert
    const circular = container.querySelector('.rounded-full');
    expect(circular).toBeInTheDocument();
  });

  it('should accept animation prop', () => {
    // Arrange & Act
    const { container } = render(<SkeletonStatsCard animation="pulse" />);

    // Assert
    const pulseElements = container.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(0);
  });
});

describe('SkeletonChart', () => {
  it('should render chart structure', () => {
    // Arrange & Act
    const { container } = render(<SkeletonChart />);

    // Assert
    expect(container.querySelector('.bg-white')).toBeInTheDocument();
    expect(container.querySelector('.rounded-xl')).toBeInTheDocument();
  });

  it('should have default height of 300', () => {
    // Arrange & Act
    const { container } = render(<SkeletonChart data-testid="chart" />);

    // Assert
    const chartBody = container.querySelector('[style*="height: 300px"]');
    expect(chartBody).toBeInTheDocument();
  });

  it('should accept custom height', () => {
    // Arrange & Act
    const { container } = render(<SkeletonChart height={400} />);

    // Assert
    const chartBody = container.querySelector('[style*="height: 400px"]');
    expect(chartBody).toBeInTheDocument();
  });

  it('should accept className prop', () => {
    // Arrange & Act
    const { container } = render(<SkeletonChart className="custom-chart" />);

    // Assert
    const chart = container.firstChild;
    expect(chart).toHaveClass('custom-chart');
  });

  it('should accept animation prop', () => {
    // Arrange & Act
    const { container } = render(<SkeletonChart animation="wave" />);

    // Assert
    const waveElements = container.querySelectorAll('.animate-wave');
    expect(waveElements.length).toBeGreaterThan(0);
  });
});

describe('SkeletonMessage', () => {
  it('should render message structure', () => {
    // Arrange & Act
    const { container } = render(<SkeletonMessage />);

    // Assert
    const avatar = container.querySelector('.rounded-full');
    expect(avatar).toBeInTheDocument();
  });

  it('should align left by default', () => {
    // Arrange & Act
    const { container } = render(<SkeletonMessage />);

    // Assert
    const wrapper = container.querySelector('.flex');
    expect(wrapper).not.toHaveClass('flex-row-reverse');
  });

  it('should align right when specified', () => {
    // Arrange & Act
    const { container } = render(<SkeletonMessage align="right" />);

    // Assert
    const wrapper = container.querySelector('.flex-row-reverse');
    expect(wrapper).toBeInTheDocument();
  });

  it('should accept animation prop', () => {
    // Arrange & Act
    const { container } = render(<SkeletonMessage animation="pulse" />);

    // Assert
    const pulseElements = container.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(0);
  });
});

describe('SkeletonGrid', () => {
  it('should render default 6 cards', () => {
    // Arrange & Act
    const { container } = render(<SkeletonGrid />);

    // Assert
    const cards = container.querySelectorAll('.bg-white');
    expect(cards.length).toBe(6);
  });

  it('should render custom count of cards', () => {
    // Arrange & Act
    const { container } = render(<SkeletonGrid count={4} />);

    // Assert
    const cards = container.querySelectorAll('.bg-white');
    expect(cards.length).toBe(4);
  });

  it('should apply 3 column grid by default', () => {
    // Arrange & Act
    const { container } = render(<SkeletonGrid />);

    // Assert
    const grid = container.querySelector('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
    expect(grid).toBeInTheDocument();
  });

  it('should apply 1 column grid', () => {
    // Arrange & Act
    const { container } = render(<SkeletonGrid columns={1} />);

    // Assert
    const grid = container.querySelector('.grid-cols-1');
    expect(grid).toBeInTheDocument();
  });

  it('should apply 2 column grid', () => {
    // Arrange & Act
    const { container } = render(<SkeletonGrid columns={2} />);

    // Assert
    const grid = container.querySelector('.grid-cols-1.lg\\:grid-cols-2');
    expect(grid).toBeInTheDocument();
  });

  it('should apply 4 column grid', () => {
    // Arrange & Act
    const { container } = render(<SkeletonGrid columns={4} />);

    // Assert
    const grid = container.querySelector('.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4');
    expect(grid).toBeInTheDocument();
  });

  it('should accept animation prop', () => {
    // Arrange & Act
    const { container } = render(<SkeletonGrid count={2} animation="pulse" />);

    // Assert
    const pulseElements = container.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  // Rule 9: Edge Cases
  describe('Edge Cases', () => {
    it('should handle zero count', () => {
      // Arrange & Act
      const { container } = render(<SkeletonGrid count={0} />);

      // Assert
      const cards = container.querySelectorAll('.bg-white');
      expect(cards.length).toBe(0);
    });

    it('should handle large count', () => {
      // Arrange & Act
      const { container } = render(<SkeletonGrid count={50} />);

      // Assert
      const cards = container.querySelectorAll('.bg-white');
      expect(cards.length).toBe(50);
    });
  });
});

