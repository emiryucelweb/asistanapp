/**
 * ModernLoader Component Tests
 * Coverage Target: 30% → 65%
 * Golden Rules: AAA Pattern, Variant Testing, Props Testing
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  ModernLoader,
  FullPageLoader,
  InlineLoader,
  ButtonLoader,
} from '../ModernLoader';

// Mock cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' '),
}));

describe('ModernLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Rule 1: Component Rendering
  describe('Rendering', () => {
    it('should render spinner variant by default', () => {
      // Arrange & Act
      const { container } = render(<ModernLoader />);

      // Assert - Check for spinner animation classes
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should render dots variant', () => {
      // Arrange & Act
      const { container } = render(<ModernLoader variant="dots" />);

      // Assert
      const dots = container.querySelectorAll('.animate-bounce');
      expect(dots.length).toBe(3);
    });

    it('should render pulse variant', () => {
      // Arrange & Act
      const { container } = render(<ModernLoader variant="pulse" />);

      // Assert
      const pulses = container.querySelectorAll('.animate-ping');
      expect(pulses.length).toBeGreaterThan(0);
    });

    it('should render bars variant', () => {
      // Arrange & Act
      const { container } = render(<ModernLoader variant="bars" />);

      // Assert
      const bars = container.querySelectorAll('.animate-pulse');
      expect(bars.length).toBe(4);
    });

    it('should render ring variant', () => {
      // Arrange & Act
      const { container } = render(<ModernLoader variant="ring" />);

      // Assert
      const ring = container.querySelector('.animate-spin');
      expect(ring).toBeInTheDocument();
    });

    it('should render brand variant', () => {
      // Arrange & Act
      const { container } = render(<ModernLoader variant="brand" />);

      // Assert
      const brand = container.querySelector('.animate-pulse');
      expect(brand).toBeInTheDocument();
    });
  });

  // Size Testing
  describe('Size Variants', () => {
    it('should apply sm size class', () => {
      // Arrange & Act
      const { container } = render(<ModernLoader size="sm" />);

      // Assert
      const loader = container.querySelector('.w-6');
      expect(loader).toBeInTheDocument();
    });

    it('should apply md size class by default', () => {
      // Arrange & Act
      const { container } = render(<ModernLoader />);

      // Assert
      const loader = container.querySelector('.w-10');
      expect(loader).toBeInTheDocument();
    });

    it('should apply lg size class', () => {
      // Arrange & Act
      const { container } = render(<ModernLoader size="lg" />);

      // Assert
      const loader = container.querySelector('.w-16');
      expect(loader).toBeInTheDocument();
    });

    it('should apply xl size class', () => {
      // Arrange & Act
      const { container } = render(<ModernLoader size="xl" />);

      // Assert
      const loader = container.querySelector('.w-24');
      expect(loader).toBeInTheDocument();
    });
  });

  // Color Testing
  describe('Color Variants', () => {
    it('should apply primary color by default', () => {
      // Arrange & Act
      const { container } = render(<ModernLoader />);

      // Assert
      const loader = container.querySelector('.text-blue-600');
      expect(loader).toBeInTheDocument();
    });

    it('should apply secondary color', () => {
      // Arrange & Act
      const { container } = render(<ModernLoader color="secondary" />);

      // Assert
      const loader = container.querySelector('.text-gray-600');
      expect(loader).toBeInTheDocument();
    });

    it('should apply white color', () => {
      // Arrange & Act
      const { container } = render(<ModernLoader color="white" />);

      // Assert
      const loader = container.querySelector('.text-white');
      expect(loader).toBeInTheDocument();
    });

    it('should apply dark color', () => {
      // Arrange & Act
      const { container } = render(<ModernLoader color="dark" />);

      // Assert
      const loader = container.querySelector('.text-gray-900');
      expect(loader).toBeInTheDocument();
    });
  });

  // Text Display
  describe('Text Display', () => {
    it('should display text when provided', () => {
      // Arrange & Act
      render(<ModernLoader text="Loading..." />);

      // Assert
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should not display text by default', () => {
      // Arrange & Act
      const { container } = render(<ModernLoader />);

      // Assert
      const text = container.querySelector('p');
      expect(text).not.toBeInTheDocument();
    });

    it('should apply color to text', () => {
      // Arrange & Act
      const { container } = render(<ModernLoader text="Loading..." color="white" />);

      // Assert - Find the p element with text
      const text = container.querySelector('p');
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent('Loading...');
    });

    it('should animate text', () => {
      // Arrange & Act
      const { container } = render(<ModernLoader text="Loading..." />);

      // Assert
      const text = container.querySelector('.animate-pulse');
      expect(text).toHaveTextContent('Loading...');
    });
  });

  // Custom ClassName
  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      // Arrange & Act
      const { container } = render(<ModernLoader className="custom-loader" />);

      // Assert
      const loader = container.firstChild;
      expect(loader).toHaveClass('custom-loader');
    });
  });

  // Rule 9: Edge Cases
  describe('Edge Cases', () => {
    it('should handle all variant combinations', () => {
      // Arrange
      const variants = ['spinner', 'dots', 'pulse', 'bars', 'ring', 'brand'] as const;

      // Act & Assert
      variants.forEach(variant => {
        const { container, unmount } = render(<ModernLoader variant={variant} />);
        expect(container.firstChild).toBeInTheDocument();
        unmount();
      });
    });

    it('should handle all size combinations', () => {
      // Arrange
      const sizes = ['sm', 'md', 'lg', 'xl'] as const;

      // Act & Assert
      sizes.forEach(size => {
        const { container, unmount } = render(<ModernLoader size={size} />);
        expect(container.firstChild).toBeInTheDocument();
        unmount();
      });
    });

    it('should handle all color combinations', () => {
      // Arrange
      const colors = ['primary', 'secondary', 'white', 'dark'] as const;

      // Act & Assert
      colors.forEach(color => {
        const { container, unmount } = render(<ModernLoader color={color} />);
        expect(container.firstChild).toBeInTheDocument();
        unmount();
      });
    });

    it('should handle long text', () => {
      // Arrange
      const longText = 'Loading very long content that might wrap to multiple lines';

      // Act
      render(<ModernLoader text={longText} />);

      // Assert
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('should handle empty text', () => {
      // Arrange & Act
      const { container } = render(<ModernLoader text="" />);

      // Assert - Empty text should not render a text element
      const textElement = container.querySelector('p.text-sm');
      // Either no text element or the text element should be empty/not visible
      if (textElement) {
        expect(textElement.textContent).toBe('');
      } else {
        expect(textElement).toBeNull();
      }
    });
  });
});

describe('FullPageLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render full page loader', () => {
      // Arrange & Act
      const { container } = render(<FullPageLoader />);

      // Assert
      const loader = container.querySelector('.fixed.inset-0');
      expect(loader).toBeInTheDocument();
    });

    it('should have z-50 class for layering', () => {
      // Arrange & Act
      const { container } = render(<FullPageLoader />);

      // Assert
      const loader = container.querySelector('.z-50');
      expect(loader).toBeInTheDocument();
    });

    it('should have backdrop blur', () => {
      // Arrange & Act
      const { container } = render(<FullPageLoader />);

      // Assert
      const loader = container.querySelector('.backdrop-blur-sm');
      expect(loader).toBeInTheDocument();
    });

    it('should force xl size', () => {
      // Arrange & Act
      const { container } = render(<FullPageLoader />);

      // Assert
      const loader = container.querySelector('.w-24');
      expect(loader).toBeInTheDocument();
    });

    it('should accept variant prop', () => {
      // Arrange & Act
      const { container } = render(<FullPageLoader variant="dots" />);

      // Assert
      const dots = container.querySelectorAll('.animate-bounce');
      expect(dots.length).toBe(3);
    });

    it('should accept color prop', () => {
      // Arrange & Act
      const { container } = render(<FullPageLoader color="white" />);

      // Assert
      const loader = container.querySelector('.text-white');
      expect(loader).toBeInTheDocument();
    });

    it('should accept text prop', () => {
      // Arrange & Act
      render(<FullPageLoader text="Loading application..." />);

      // Assert
      expect(screen.getByText('Loading application...')).toBeInTheDocument();
    });
  });
});

describe('InlineLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render inline loader', () => {
      // Arrange & Act
      const { container } = render(<InlineLoader />);

      // Assert
      const loader = container.querySelector('.inline-flex');
      expect(loader).toBeInTheDocument();
    });

    it('should force sm size', () => {
      // Arrange & Act
      const { container } = render(<InlineLoader />);

      // Assert
      const loader = container.querySelector('.w-6');
      expect(loader).toBeInTheDocument();
    });

    it('should accept variant prop', () => {
      // Arrange & Act
      const { container } = render(<InlineLoader variant="ring" />);

      // Assert
      const ring = container.querySelector('.animate-spin');
      expect(ring).toBeInTheDocument();
    });

    it('should accept color prop', () => {
      // Arrange & Act
      const { container } = render(<InlineLoader color="secondary" />);

      // Assert
      const loader = container.querySelector('.text-gray-600');
      expect(loader).toBeInTheDocument();
    });

    it('should accept text prop', () => {
      // Arrange & Act
      render(<InlineLoader text="Processing..." />);

      // Assert
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });
  });
});

describe('ButtonLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render dots variant by default', () => {
      // Arrange & Act
      const { container } = render(<ButtonLoader />);

      // Assert
      const dots = container.querySelectorAll('.animate-bounce');
      expect(dots.length).toBe(3);
    });

    it('should render spinner variant', () => {
      // Arrange & Act
      const { container } = render(<ButtonLoader variant="spinner" />);

      // Assert
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('should have fixed height for consistent button sizing', () => {
      // Arrange & Act
      const { container } = render(<ButtonLoader />);

      // Assert
      const wrapper = container.querySelector('.h-4');
      expect(wrapper).toBeInTheDocument();
    });

    it('should have small size for button context', () => {
      // Arrange & Act
      const { container } = render(<ButtonLoader variant="spinner" />);

      // Assert
      const spinner = container.querySelector('.h-4.w-4');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Animations', () => {
    it('should have staggered animation for dots', () => {
      // Arrange & Act
      const { container } = render(<ButtonLoader variant="dots" />);

      // Assert
      const dots = Array.from(container.querySelectorAll('.animate-bounce'));
      expect(dots).toHaveLength(3);
      
      // Each dot should have different animation delay
      dots.forEach((dot, i) => {
        const style = (dot as HTMLElement).style;
        expect(style.animationDelay).toBeTruthy();
      });
    });

    it('should have spin animation for spinner', () => {
      // Arrange & Act
      const { container } = render(<ButtonLoader variant="spinner" />);

      // Assert
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  // Rule 9: Edge Cases
  describe('Edge Cases', () => {
    it('should handle rapid variant switches', () => {
      // Arrange
      const { rerender, container } = render(<ButtonLoader variant="dots" />);

      // Act
      rerender(<ButtonLoader variant="spinner" />);
      rerender(<ButtonLoader variant="dots" />);

      // Assert
      const dots = container.querySelectorAll('.animate-bounce');
      expect(dots.length).toBe(3);
    });
  });
});

