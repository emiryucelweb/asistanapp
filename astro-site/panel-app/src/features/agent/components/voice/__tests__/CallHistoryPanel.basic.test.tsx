/**
 * CallHistoryPanel Component Tests - BASIC (Part 1/3)
 * 
 * Basic rendering, header, search, and filter tests
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

describe('CallHistoryPanel - Visibility', () => {
  it('should not render when isOpen is false', () => {
    // Arrange
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    const { container } = render(
      <CallHistoryPanel isOpen={false} {...mockHandlers} />
    );

    // Assert
    expect(container.firstChild).toBeNull();
  });

  it('should render when isOpen is true', () => {
    // Arrange
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    // Assert
    expect(screen.getByText('Call History')).toBeInTheDocument();
  });
});

describe('CallHistoryPanel - Header', () => {
  it('should display panel title', () => {
    // Arrange
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    // Assert
    expect(screen.getByText('Call History')).toBeInTheDocument();
  });

  it('should display record count', () => {
    // Arrange
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    // Assert
    expect(screen.getByText('0 records')).toBeInTheDocument();
  });

  it('should have close button', () => {
    // Arrange
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    // Assert
    const closeButton = screen.getAllByRole('button').find((btn) =>
      btn.querySelector('svg')?.classList.contains('lucide-x')
    );
    expect(closeButton).toBeInTheDocument();
  });

  it('should call onClose when close button clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    const closeButton = screen.getAllByRole('button').find((btn) =>
      btn.querySelector('svg')?.classList.contains('lucide-x')
    );
    await user.click(closeButton!);

    // Assert
    expect(mockHandlers.onClose).toHaveBeenCalledTimes(1);
  });
});

describe('CallHistoryPanel - Search', () => {
  it('should display search input', () => {
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
    expect(searchInput).toBeInTheDocument();
  });

  it('should update search query on input', async () => {
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
    await user.type(searchInput, 'John');

    // Assert
    expect(searchInput).toHaveValue('John');
  });

  it('should clear search on backspace', async () => {
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
    await user.type(searchInput, 'Test');
    expect(searchInput).toHaveValue('Test');

    await user.clear(searchInput);

    // Assert
    expect(searchInput).toHaveValue('');
  });
});

describe('CallHistoryPanel - Filters', () => {
  it('should display all filter buttons', () => {
    // Arrange
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    // Assert
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Incoming' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Outgoing' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Missed' })).toBeInTheDocument();
  });

  it('should have "All" filter selected by default', () => {
    // Arrange
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    // Assert
    const allButton = screen.getByRole('button', { name: 'All' });
    expect(allButton).toHaveClass('bg-purple-600');
  });

  it('should change filter when clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    const incomingButton = screen.getByRole('button', { name: 'Incoming' });
    await user.click(incomingButton);

    // Assert
    expect(incomingButton).toHaveClass('bg-green-600');
  });

  it('should change filter to outgoing', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    const outgoingButton = screen.getByRole('button', { name: 'Outgoing' });
    await user.click(outgoingButton);

    // Assert
    expect(outgoingButton).toHaveClass('bg-blue-600');
  });

  it('should change filter to missed', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    const missedButton = screen.getByRole('button', { name: 'Missed' });
    await user.click(missedButton);

    // Assert
    expect(missedButton).toHaveClass('bg-red-600');
  });

  it('should switch between filters', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    // Click incoming
    const incomingButton = screen.getByRole('button', { name: 'Incoming' });
    await user.click(incomingButton);
    expect(incomingButton).toHaveClass('bg-green-600');

    // Click back to all
    const allButton = screen.getByRole('button', { name: 'All' });
    await user.click(allButton);

    // Assert
    expect(allButton).toHaveClass('bg-purple-600');
    expect(incomingButton).not.toHaveClass('bg-green-600');
  });
});


