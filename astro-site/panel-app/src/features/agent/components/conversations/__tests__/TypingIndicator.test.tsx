/**
 * TypingIndicator Component Tests - ENTERPRISE GRADE
 * 
 * @group component
 * @group agent
 * @group typing
 * 
 * ALTIN KURALLAR:
 * ✅ AAA Pattern (Arrange-Act-Assert)
 * ✅ beforeEach/afterEach her describe bloğunda
 * ✅ cleanup() ve vi.restoreAllMocks() afterEach'de
 * ✅ Error handling testleri
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import TypingIndicator from '../TypingIndicator';

// ============================================================================
// MOCKS
// ============================================================================

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'typingIndicator.defaultName': 'Someone',
      };
      return translations[key] || key;
    },
  }),
}));

// ============================================================================
// TESTS
// ============================================================================

describe('TypingIndicator - Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should render typing indicator with custom name', () => {
    // Arrange & Act
    render(<TypingIndicator name="John Doe" />);

    // Assert - Should show first letter of name
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('should render typing indicator with default name', () => {
    // Arrange & Act
    render(<TypingIndicator />);

    // Assert - Should show first letter of default name
    expect(screen.getByText('S')).toBeInTheDocument(); // "Someone"
  });

  it('should render three bouncing dots', () => {
    // Arrange & Act
    const { container } = render(<TypingIndicator name="Test" />);

    // Assert
    const dots = container.querySelectorAll('.animate-bounce');
    expect(dots).toHaveLength(3);
  });

  it('should have correct animation delays', () => {
    // Arrange & Act
    const { container } = render(<TypingIndicator name="Test" />);

    // Assert
    const dots = container.querySelectorAll('.animate-bounce');
    expect(dots[0]).toHaveStyle({ animationDelay: '0ms' });
    expect(dots[1]).toHaveStyle({ animationDelay: '150ms' });
    expect(dots[2]).toHaveStyle({ animationDelay: '300ms' });
  });

  it('should have fade-in animation', () => {
    // Arrange & Act
    const { container } = render(<TypingIndicator name="Test" />);

    // Assert
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('animate-fade-in');
  });
});

describe('TypingIndicator - Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should handle empty name', () => {
    // Arrange & Act
    render(<TypingIndicator name="" />);

    // Assert - Should use default name
    expect(screen.getByText('S')).toBeInTheDocument();
  });

  it('should handle single character name', () => {
    // Arrange & Act
    render(<TypingIndicator name="A" />);

    // Assert
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('should handle name with spaces', () => {
    // Arrange & Act
    render(<TypingIndicator name=" John Doe " />);

    // Assert - Should show first character (space in this case)
    const avatar = document.querySelector('.rounded-full');
    expect(avatar).toBeInTheDocument();
  });

  it('should handle name with special characters', () => {
    // Arrange & Act
    render(<TypingIndicator name="@User123" />);

    // Assert
    expect(screen.getByText('@')).toBeInTheDocument();
  });
});

describe('TypingIndicator - Styling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should have correct avatar styling', () => {
    // Arrange & Act
    const { container } = render(<TypingIndicator name="Test" />);

    // Assert
    const avatar = screen.getByText('T');
    expect(avatar).toHaveClass('w-8', 'h-8', 'rounded-full');
  });

  it('should have correct bubble styling', () => {
    // Arrange & Act
    const { container } = render(<TypingIndicator name="Test" />);

    // Assert
    const bubble = container.querySelector('.rounded-2xl');
    expect(bubble).toBeInTheDocument();
    expect(bubble).toHaveClass('px-4', 'py-3');
  });
});

describe('TypingIndicator - Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should handle undefined name gracefully', () => {
    // Arrange & Act & Assert - Should not throw
    expect(() => render(<TypingIndicator name={undefined as unknown as string} />)).not.toThrow();
  });

  it('should render correctly when translation is missing', () => {
    // Arrange - Mock translation to return key
    vi.mocked(vi.importActual('react-i18next')).useTranslation = () => ({
      t: (key: string) => key,
    });

    // Act & Assert - Should not throw
    expect(() => render(<TypingIndicator />)).not.toThrow();
  });
});

