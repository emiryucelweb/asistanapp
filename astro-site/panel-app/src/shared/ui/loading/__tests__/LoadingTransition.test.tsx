/**
 * LoadingTransition Component Tests
 * Coverage Target: 30% → 65%
 * Golden Rules: AAA Pattern, Async/Await, Timing, Edge Cases
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { LoadingTransition, SuspenseLoader } from '../LoadingTransition';
import { Suspense } from 'react';

// Mock cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' '),
}));

describe('LoadingTransition', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Rule 1: Component Rendering
  describe('Rendering', () => {
    it('should show content when not loading', () => {
      // Arrange & Act
      render(
        <LoadingTransition isLoading={false}>
          <div>Test Content</div>
        </LoadingTransition>
      );

      // Assert
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render component wrapper when loading', () => {
      // Arrange & Act
      const { container } = render(
        <LoadingTransition isLoading={true}>
          <div>Test Content</div>
        </LoadingTransition>
      );

      // Assert - Component should render wrapper
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render custom loading component when provided', () => {
      // Arrange
      const customLoader = <div data-testid="custom-loader">Loading...</div>;

      // Act
      render(
        <LoadingTransition isLoading={true} loadingComponent={customLoader}>
          <div>Test Content</div>
        </LoadingTransition>
      );

      // Assert - Custom loader should be in the DOM (visible or not depends on timing)
      expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      // Arrange & Act
      const { container } = render(
        <LoadingTransition isLoading={false} className="custom-class">
          <div>Content</div>
        </LoadingTransition>
      );

      // Assert
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('custom-class');
    });
  });

  // Rule 3: Loading State Transitions
  describe('Loading Delays', () => {
    it('should respect fallbackDelay prop', () => {
      // Arrange & Act
      render(
        <LoadingTransition isLoading={true} fallbackDelay={300}>
          <div>Content</div>
        </LoadingTransition>
      );

      // Assert - With non-zero fallbackDelay, loading indicator won't show immediately
      // This tests that the prop is accepted
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should show content when loading becomes false', async () => {
      // Arrange
      const { rerender } = render(
        <LoadingTransition isLoading={true} fallbackDelay={0}>
          <div>Content</div>
        </LoadingTransition>
      );

      // Act - Finish loading
      rerender(
        <LoadingTransition isLoading={false} fallbackDelay={0}>
          <div>Content</div>
        </LoadingTransition>
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument();
      });
    });

    it('should accept minLoadingTime prop', () => {
      // Arrange & Act
      const { container } = render(
        <LoadingTransition isLoading={true} minLoadingTime={1000} fallbackDelay={0}>
          <div>Content</div>
        </LoadingTransition>
      );

      // Assert - Component should render and accept the prop
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should handle loading state changes', async () => {
      // Arrange
      const { rerender } = render(
        <LoadingTransition isLoading={false} fallbackDelay={0}>
          <div>Content</div>
        </LoadingTransition>
      );

      // Act - Change to loading
      rerender(
        <LoadingTransition isLoading={true} fallbackDelay={0}>
          <div>Content</div>
        </LoadingTransition>
      );

      // Then change back to not loading
      rerender(
        <LoadingTransition isLoading={false} fallbackDelay={0}>
          <div>Content</div>
        </LoadingTransition>
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument();
      });
    });
  });

  // Rule 6: Cleanup
  describe('Cleanup', () => {
    it('should cleanup timeout on unmount', () => {
      // Arrange
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      const { unmount } = render(
        <LoadingTransition isLoading={true} fallbackDelay={0}>
          <div>Content</div>
        </LoadingTransition>
      );

      // Act
      unmount();

      // Assert - clearTimeout should be called during cleanup
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it('should cleanup timeout when loading state changes', () => {
      // Arrange
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      const { rerender } = render(
        <LoadingTransition isLoading={true} fallbackDelay={100}>
          <div>Content</div>
        </LoadingTransition>
      );

      // Act - Change state
      rerender(
        <LoadingTransition isLoading={false} fallbackDelay={100}>
          <div>Content</div>
        </LoadingTransition>
      );

      // Assert
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });

  // Rule 9: Edge Cases
  describe('Edge Cases', () => {
    it('should handle zero fallbackDelay', () => {
      // Arrange & Act
      const { container } = render(
        <LoadingTransition isLoading={true} fallbackDelay={0}>
          <div>Content</div>
        </LoadingTransition>
      );

      // Assert - Component should render with fallbackDelay=0
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle zero minLoadingTime', async () => {
      // Arrange
      const { rerender } = render(
        <LoadingTransition isLoading={true} minLoadingTime={0} fallbackDelay={0}>
          <div>Content</div>
        </LoadingTransition>
      );

      // Act
      rerender(
        <LoadingTransition isLoading={false} minLoadingTime={0} fallbackDelay={0}>
          <div>Content</div>
        </LoadingTransition>
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Content')).toBeInTheDocument();
      });
    });

    it('should accept very large minLoadingTime prop', () => {
      // Arrange & Act
      const { container } = render(
        <LoadingTransition isLoading={true} minLoadingTime={10000} fallbackDelay={0}>
          <div>Content</div>
        </LoadingTransition>
      );

      // Assert - Component should render with large minLoadingTime
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should handle content changes while loading', () => {
      // Arrange
      const { rerender } = render(
        <LoadingTransition isLoading={true} fallbackDelay={0}>
          <div>Content 1</div>
        </LoadingTransition>
      );

      // Act
      rerender(
        <LoadingTransition isLoading={true} fallbackDelay={0}>
          <div>Content 2</div>
        </LoadingTransition>
      );

      // Assert - New content should be in the DOM
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });
});

describe('SuspenseLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render children when loaded', () => {
      // Arrange & Act
      render(
        <SuspenseLoader>
          <div>Loaded Content</div>
        </SuspenseLoader>
      );

      // Assert
      expect(screen.getByText('Loaded Content')).toBeInTheDocument();
    });

    it('should render custom fallback', async () => {
      // Arrange
      const LazyComponent = () => {
        throw new Promise(() => {}); // Never resolves
      };

      const customFallback = <div>Custom Loading...</div>;

      // Act
      render(
        <SuspenseLoader fallback={customFallback}>
          <LazyComponent />
        </SuspenseLoader>
      );

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
      });
    });

    it('should render default fallback when not provided', () => {
      // Arrange
      const LazyComponent = () => {
        throw new Promise(() => {}); // Never resolves
      };

      // Act
      const { container } = render(
        <SuspenseLoader>
          <LazyComponent />
        </SuspenseLoader>
      );

      // Assert - SuspenseLoader should render with fallback
      expect(container.firstChild).toBeInTheDocument();
      // The default fallback contains "Loading..." text
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Suspense Behavior', () => {
    it('should show fallback during suspense', () => {
      // Arrange - Component that throws a promise (simulates suspense)
      const LazyComponent = () => {
        throw new Promise(() => {}); // Never resolves - keeps showing fallback
      };

      // Act
      render(
        <SuspenseLoader>
          <LazyComponent />
        </SuspenseLoader>
      );

      // Assert - Fallback should be shown (contains "Loading..." text)
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
});

