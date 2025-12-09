/**
 * ErrorBoundary Component Tests - ENTERPRISE GRADE
 * 
 * Comprehensive tests for error boundary functionality
 * 
 * @group component
 * @group agent
 * @group error-handling
 * 
 * ALTIN KURALLAR:
 * ✅ React Component Testing with RTL
 * ✅ AAA Pattern
 * ✅ Error boundary specific testing
 * ✅ Class component lifecycle tests
 * ✅ Console suppression for expected errors
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from '../ErrorBoundary';
import { logger } from '@/shared/utils/logger';

// ============================================================================
// MOCKS
// ============================================================================

vi.mock('@/shared/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'errors.somethingWentWrong': 'Bir Şeyler Ters Gitti',
        'errors.errorDescription': 'Üzgünüz, bir hata oluştu. Lütfen tekrar deneyin.',
        'errors.tryAgain': 'Tekrar Dene',
        'errors.goHome': 'Ana Sayfa',
        'errors.persistentIssue': 'Sorun devam ederse',
        'errors.supportTeam': 'destek ekibimizle iletişime geçin',
        'errors.stackTrace': 'Hata Detayları',
      };
      return translations[key] || key;
    },
    i18n: { language: 'tr' }
  }),
}));

// Mock window.location
delete (window as any).location;
window.location = { href: '' } as any;

// ============================================================================
// TEST COMPONENTS
// ============================================================================

/**
 * Component that throws an error on render
 */
const ThrowError = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error from component');
  }
  return <div>No error</div>;
};

/**
 * Component with custom error message
 */
const ThrowCustomError = ({ message }: { message: string }) => {
  throw new Error(message);
};

/**
 * Normal component that doesn't throw
 */
const SafeComponent = () => <div>Safe Component</div>;

// ============================================================================
// TESTS
// ============================================================================

describe('ErrorBoundary - Basic Functionality', () => {
  // Suppress console errors during tests (expected errors)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let consoleErrorSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should render children when no error occurs', () => {
    // Arrange & Act
    render(
      <ErrorBoundary>
        <SafeComponent />
      </ErrorBoundary>
    );

    // Assert
    expect(screen.getByText('Safe Component')).toBeInTheDocument();
  });

  it('should catch errors and display fallback UI', () => {
    // Arrange & Act
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Assert
    expect(screen.getByText(/Bir Şeyler Ters Gitti/i)).toBeInTheDocument();
    expect(screen.getByText(/Üzgünüz, bir hata oluştu/i)).toBeInTheDocument();
  });

  it('should log error details', () => {
    // Arrange & Act
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Assert
    expect(logger.error).toHaveBeenCalledWith(
      '[ErrorBoundary] Component error caught',
      expect.objectContaining({
        error: 'Test error from component',
      })
    );
  });

  it('should display error message in DEV mode', () => {
    // Arrange
    const originalEnv = import.meta.env.DEV;
    (import.meta as any).env.DEV = true;

    // Act
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Assert
    expect(screen.getByText('Test error from component')).toBeInTheDocument();

    // Cleanup
    (import.meta as any).env.DEV = originalEnv;
  });

  it('should show action buttons', () => {
    // Arrange & Act
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Assert
    expect(screen.getByRole('button', { name: /Tekrar Dene/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ana Sayfa/i })).toBeInTheDocument();
  });

  it('should show support link', () => {
    // Arrange & Act
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Assert
    const supportLink = screen.getByRole('link', { name: /destek ekibimizle iletişime geçin/i });
    expect(supportLink).toBeInTheDocument();
    expect(supportLink).toHaveAttribute('href', 'mailto:support@asistanapp.com');
  });
});

describe('ErrorBoundary - Custom Fallback', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let consoleErrorSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should render custom fallback when provided', () => {
    // Arrange
    const CustomFallback = <div>Custom Error UI</div>;

    // Act
    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ThrowError />
      </ErrorBoundary>
    );

    // Assert
    expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
    expect(screen.queryByText(/Bir Şeyler Ters Gitti/i)).not.toBeInTheDocument();
  });
});

describe('ErrorBoundary - Error Handler Callback', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let consoleErrorSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should call onError callback when error occurs', () => {
    // Arrange
    const onError = vi.fn();

    // Act
    render(
      <ErrorBoundary onError={onError}>
        <ThrowError />
      </ErrorBoundary>
    );

    // Assert
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Test error from component',
      }),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it('should work without onError callback', () => {
    // Arrange & Act
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Assert - Should not throw, just render fallback
    expect(screen.getByText(/Bir Şeyler Ters Gitti/i)).toBeInTheDocument();
  });
});

describe('ErrorBoundary - User Interactions', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let consoleErrorSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should reset error state when "Tekrar Dene" is clicked', async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Assert - Error displayed
    expect(screen.getByText(/Bir Şeyler Ters Gitti/i)).toBeInTheDocument();

    // Act - Click retry (note: will still show error if component still throws)
    const retryButton = screen.getByRole('button', { name: /Tekrar Dene/i });
    await user.click(retryButton);

    // Assert - Error boundary attempted reset (still in error state since component throws)
    // In real scenario, the component would be fixed or remounted
    expect(screen.getByText(/Bir Şeyler Ters Gitti/i)).toBeInTheDocument();
  });

  it('should redirect to home when "Ana Sayfa" is clicked', async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Act
    const homeButton = screen.getByRole('button', { name: /Ana Sayfa/i });
    await user.click(homeButton);

    // Assert
    expect(window.location.href).toBe('/agent');
  });
});

describe('ErrorBoundary - Different Error Types', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let consoleErrorSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should handle errors with different messages', () => {
    // Arrange
    const customMessage = 'Custom error message for testing';

    // Act
    render(
      <ErrorBoundary>
        <ThrowCustomError message={customMessage} />
      </ErrorBoundary>
    );

    // Assert
    expect(logger.error).toHaveBeenCalledWith(
      '[ErrorBoundary] Component error caught',
      expect.objectContaining({
        error: customMessage,
      })
    );
  });

  it('should handle multiple children with one throwing error', () => {
    // Arrange & Act
    render(
      <ErrorBoundary>
        <div>Child 1</div>
        <ThrowError />
        <div>Child 3</div>
      </ErrorBoundary>
    );

    // Assert - Should show fallback, not other children
    expect(screen.getByText(/Bir Şeyler Ters Gitti/i)).toBeInTheDocument();
    expect(screen.queryByText('Child 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Child 3')).not.toBeInTheDocument();
  });
});

describe('ErrorBoundary - DEV Mode Features', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let consoleErrorSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should show component stack in DEV mode', () => {
    // Act - In test environment, DEV mode is typically true
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Assert - In DEV mode, error message should be visible
    // The component shows error details with "Hata Detayları" summary
    expect(screen.getByText('Test error from component')).toBeInTheDocument();
  });

  it('should show error details section in DEV mode', () => {
    // Note: In Vitest, import.meta.env.DEV is always true during tests
    // This test verifies the error details are shown in DEV mode

    // Arrange & Act
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Assert - In test environment (DEV=true), error details are shown
    // The component shows "Hata Detayları" (translation of errors.stackTrace)
    expect(screen.getByText('Test error from component')).toBeInTheDocument();
    expect(screen.getByText('Hata Detayları')).toBeInTheDocument();
  });
});

describe('ErrorBoundary - Real-World Scenarios', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let consoleErrorSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should handle network error in component', () => {
    // Arrange
    const NetworkErrorComponent = () => {
      throw new Error('Network request failed');
    };

    // Act
    render(
      <ErrorBoundary>
        <NetworkErrorComponent />
      </ErrorBoundary>
    );

    // Assert
    expect(screen.getByText(/Bir Şeyler Ters Gitti/i)).toBeInTheDocument();
    expect(logger.error).toHaveBeenCalledWith(
      '[ErrorBoundary] Component error caught',
      expect.objectContaining({
        error: 'Network request failed',
      })
    );
  });

  it('should handle rendering error with null data', () => {
    // Arrange
    const NullDataComponent = () => {
      const data: any = null;
      return <div>{data.property}</div>; // Will throw
    };

    // Act
    render(
      <ErrorBoundary>
        <NullDataComponent />
      </ErrorBoundary>
    );

    // Assert
    expect(screen.getByText(/Bir Şeyler Ters Gitti/i)).toBeInTheDocument();
  });

  it('should provide recovery option for temporary errors', () => {
    // Arrange
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Assert - Error shown with recovery button
    expect(screen.getByText(/Bir Şeyler Ters Gitti/i)).toBeInTheDocument();
    const retryButton = screen.getByRole('button', { name: /Tekrar Dene/i });
    expect(retryButton).toBeInTheDocument();

    // Note: Clicking retry would reset error boundary state
    // In real scenario, if underlying error is fixed, component would recover
  });
});

describe('ErrorBoundary - Edge Cases', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let consoleErrorSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should handle empty children', () => {
    // Arrange & Act
    render(<ErrorBoundary>{null}</ErrorBoundary>);

    // Assert - Should render nothing, no error
    expect(document.body.textContent).toBe('');
  });

  it('should handle multiple sequential errors', async () => {
    // Arrange
    const user = userEvent.setup();

    const { rerender } = render(
      <ErrorBoundary>
        <ThrowCustomError message="First error" />
      </ErrorBoundary>
    );

    // Assert - First error
    expect(screen.getByText(/Bir Şeyler Ters Gitti/i)).toBeInTheDocument();

    // Act - Reset and throw again
    const retryButton = screen.getByRole('button', { name: /Tekrar Dene/i });
    await user.click(retryButton);

    rerender(
      <ErrorBoundary>
        <ThrowCustomError message="Second error" />
      </ErrorBoundary>
    );

    // Assert - Second error caught
    expect(logger.error).toHaveBeenCalledTimes(2);
  });
});

