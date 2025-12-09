/**
 * CallHistoryPanel Component Tests - ADVANCED (Part 2/3)
 * 
 * Advanced tests: Empty State, Edge Cases, Real-World Scenarios, State Transitions
 * 
 * @group component
 * @group agent
 * @group voice
 * @group critical
 * 
 * GOLDEN RULES: 13/13 ✅
 * MAX 15 TESTS: 15/15 ✅
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CallHistoryPanel from '../CallHistoryPanel';

// ============================================================================
// MOCKS
// ============================================================================

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        'callHistory.title': 'Call History',
        'callHistory.recordCount': `${params?.count || 0} records`,
        'callHistory.searchPlaceholder': 'Search by name or number...',
        'callHistory.all': 'All',
        'callHistory.incoming': 'Incoming',
        'callHistory.outgoing': 'Outgoing',
        'callHistory.missed': 'Missed',
        'callHistory.noRecords': 'No call records found',
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'en',
    },
  }),
}));

vi.mock('@/features/agent/utils/locale', () => ({
  formatTime: vi.fn((date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }),
  formatDate: vi.fn((date) => {
    const month = date.toLocaleString('en', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  }),
}));

// ============================================================================
// TESTS
// ============================================================================

// Global setup
beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('CallHistoryPanel - Empty State', () => {
  it('should display empty state when no calls', () => {
    // Arrange
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    // Assert
    expect(screen.getByText('No call records found')).toBeInTheDocument();
  });

  it('should display empty state with filter applied', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    // Apply filter
    const missedButton = screen.getByRole('button', { name: 'Missed' });
    await user.click(missedButton);

    // Assert
    expect(screen.getByText('No call records found')).toBeInTheDocument();
  });

  it('should display empty state with search query', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    const searchInput = screen.getByPlaceholderText('Search by name or number...');
    await user.type(searchInput, 'NonexistentPerson');

    // Assert
    expect(screen.getByText('No call records found')).toBeInTheDocument();
  });
});

describe('CallHistoryPanel - Edge Cases', () => {
  it('should handle special characters in search', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    const searchInput = screen.getByPlaceholderText('Search by name or number...');
    await user.type(searchInput, '@#$%^&*()');

    // Assert
    expect(searchInput).toHaveValue('@#$%^&*()');
  });

  it('should handle whitespace in search', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    const searchInput = screen.getByPlaceholderText('Search by name or number...');
    await user.type(searchInput, '   spaces   ');

    // Assert
    expect(searchInput).toHaveValue('   spaces   ');
  });

  it('should display search input without errors', () => {
    // Arrange
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    // Assert - Search input is present and functional
    const searchInput = screen.getByPlaceholderText('Search by name or number...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'text');
  });

  it('should handle missing onPlayRecording callback', () => {
    // Arrange
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act & Assert - Should not crash
    expect(() => {
      render(
        <CallHistoryPanel
          isOpen={true}
          onPlayRecording={undefined}
          {...mockHandlers}
        />
      );
    }).not.toThrow();
  });
});

describe('CallHistoryPanel - Real-World Scenarios', () => {
  it('should handle typical panel open workflow', async () => {
    // Arrange
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act - Panel opens
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    // Assert - Panel is displayed
    expect(screen.getByText('Call History')).toBeInTheDocument();
    expect(screen.getByText('0 records')).toBeInTheDocument();

    // Assert - All filters available
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Incoming' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Outgoing' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Missed' })).toBeInTheDocument();

    // Assert - Empty state
    expect(screen.getByText('No call records found')).toBeInTheDocument();
  });

  it('should display filter buttons and search together', () => {
    // Arrange
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    // Assert - Both filters and search are available
    expect(screen.getByRole('button', { name: 'Missed' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by name or number...')).toBeInTheDocument();
    expect(screen.getByText('No call records found')).toBeInTheDocument();
  });

  it('should handle rapid filter changes', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    // Rapidly change filters
    const incomingButton = screen.getByRole('button', { name: 'Incoming' });
    const outgoingButton = screen.getByRole('button', { name: 'Outgoing' });
    const missedButton = screen.getByRole('button', { name: 'Missed' });
    const allButton = screen.getByRole('button', { name: 'All' });

    await user.click(incomingButton);
    await user.click(outgoingButton);
    await user.click(missedButton);
    await user.click(allButton);

    // Assert - Final state is "All"
    expect(allButton).toHaveClass('bg-purple-600');
  });

  it('should handle panel close workflow', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    // Close panel
    const closeButton = screen.getAllByRole('button').find((btn) =>
      btn.querySelector('svg')?.classList.contains('lucide-x')
    );
    await user.click(closeButton!);

    // Assert
    expect(mockHandlers.onClose).toHaveBeenCalledTimes(1);
  });

  it('should handle search and clear workflow', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    // Search
    const searchInput = screen.getByPlaceholderText('Search by name or number...');
    await user.type(searchInput, 'Customer Name');
    expect(searchInput).toHaveValue('Customer Name');

    // Clear search
    await user.clear(searchInput);

    // Assert
    expect(searchInput).toHaveValue('');
  });
});

describe('CallHistoryPanel - State Transitions', () => {
  it('should handle panel opening', () => {
    // Arrange
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act - Initially closed
    const { rerender, container } = render(
      <CallHistoryPanel isOpen={false} {...mockHandlers} />
    );

    // Assert
    expect(container.firstChild).toBeNull();

    // Act - Open panel
    rerender(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    // Assert
    expect(screen.getByText('Call History')).toBeInTheDocument();
  });

  it('should handle panel closing', () => {
    // Arrange
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act - Initially open
    const { rerender, container } = render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    // Assert
    expect(screen.getByText('Call History')).toBeInTheDocument();

    // Act - Close panel
    rerender(
      <CallHistoryPanel isOpen={false} {...mockHandlers} />
    );

    // Assert
    expect(container.firstChild).toBeNull();
  });
});

describe('CallHistoryPanel - Accessibility (Part 1)', () => {
  it('should have accessible search input', () => {
    // Arrange
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    // Assert
    const searchInput = screen.getByPlaceholderText('Search by name or number...');
    expect(searchInput).toHaveAttribute('type', 'text');
  });
});


