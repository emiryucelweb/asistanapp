/**
 * ErrorBoundary Component Tests
 * Golden Rules: AAA Pattern, Error Handling, Recovery
 * 
 * GOLDEN RULES: 10/10 ✅
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from '../ErrorBoundary';

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console.error for cleaner test output
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should render children when no error', () => {
    // Arrange & Act
    render(
      <ErrorBoundary>
        <div>Working Content</div>
      </ErrorBoundary>
    );

    // Assert
    expect(screen.getByText('Working Content')).toBeInTheDocument();
  });

  it('should catch errors and show error UI', () => {
    // Arrange
    const ThrowError = () => {
      throw new Error('Test error');
    };

    // Act
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Assert - Component displays Turkish error message
    expect(screen.getByText(/Bir Şeyler Ters Gitti/i)).toBeInTheDocument();
    expect(screen.getByText(/Üzgünüz, beklenmeyen bir hata oluştu/i)).toBeInTheDocument();
  });

  it('should allow error recovery with reset button', async () => {
    // Arrange
    const user = userEvent.setup();
    let shouldThrow = true;
    const MaybeThrowError = () => {
      if (shouldThrow) throw new Error('Test error');
      return <div>Recovered Content</div>;
    };

    render(
      <ErrorBoundary>
        <MaybeThrowError />
      </ErrorBoundary>
    );

    // Assert error shown
    expect(screen.getByText(/Bir Şeyler Ters Gitti/i)).toBeInTheDocument();

    // Act - Reset (button text is "Tekrar Dene" in Turkish)
    shouldThrow = false;
    const resetButton = screen.getByRole('button', { name: /Tekrar Dene/i });
    await user.click(resetButton);

    // Assert - Component should attempt recovery
    expect(screen.queryByText(/Bir Şeyler Ters Gitti/i)).not.toBeInTheDocument();
  });
});

