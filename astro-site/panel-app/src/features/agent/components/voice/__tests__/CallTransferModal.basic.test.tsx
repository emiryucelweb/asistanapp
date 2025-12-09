/**
 * CallTransferModal Component Tests - BASIC (Part 1/2)
 * 
 * Basic rendering, header, search, and accessibility tests
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
import CallTransferModal from '../CallTransferModal';

// ============================================================================
// MOCKS
// ============================================================================

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'voice.callTransfer': 'Transfer Call',
        'voice.searchAgent': 'Search agent',
        'voice.searchPlaceholder': 'Search by name, department, or skill...',
        'voice.noAgentsAvailable': 'No agents available',
        'voice.transferType': 'Transfer Type',
        'voice.blindTransfer': 'Blind Transfer',
        'voice.blindTransferDesc': 'Transfer immediately without speaking',
        'voice.attendedTransfer': 'Attended Transfer',
        'voice.attendedTransferDesc': 'Speak with agent before transfer',
        'voice.transferNoteLabel': 'Transfer notes (optional)',
        'voice.transferNotePlaceholder': 'Add context for the receiving agent...',
        'voice.cancel': 'Cancel',
        'voice.transfer': 'Transfer',
        'status.available': 'Available',
        'status.busy': 'Busy',
        'status.offline': 'Offline',
      };
      return translations[key] || key;
    },
  }),
}));

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const mockCaller = {
  name: 'Jane Customer',
  phoneNumber: '+905551234567',
};

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

describe('CallTransferModal - Visibility', () => {
  it('should not render when isOpen is false', () => {
    // Arrange
    const mockHandlers = {
      onTransfer: vi.fn(),
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallTransferModal
        isOpen={false}
        callId="call-123"
        caller={mockCaller}
        {...mockHandlers}
      />
    );

    // Assert
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    // Arrange
    const mockHandlers = {
      onTransfer: vi.fn(),
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallTransferModal
        isOpen={true}
        callId="call-123"
        caller={mockCaller}
        {...mockHandlers}
      />
    );

    // Assert
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

describe('CallTransferModal - Header', () => {
  it('should display modal title', () => {
    // Arrange
    const mockHandlers = {
      onTransfer: vi.fn(),
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallTransferModal
        isOpen={true}
        callId="call-123"
        caller={mockCaller}
        {...mockHandlers}
      />
    );

    // Assert
    expect(screen.getByText('Transfer Call')).toBeInTheDocument();
  });

  it('should display caller information', () => {
    // Arrange
    const mockHandlers = {
      onTransfer: vi.fn(),
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallTransferModal
        isOpen={true}
        callId="call-123"
        caller={mockCaller}
        {...mockHandlers}
      />
    );

    // Assert
    expect(screen.getByText('Jane Customer - +905551234567')).toBeInTheDocument();
  });

  it('should have close button', () => {
    // Arrange
    const mockHandlers = {
      onTransfer: vi.fn(),
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallTransferModal
        isOpen={true}
        callId="call-123"
        caller={mockCaller}
        {...mockHandlers}
      />
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
      onTransfer: vi.fn(),
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallTransferModal
        isOpen={true}
        callId="call-123"
        caller={mockCaller}
        {...mockHandlers}
      />
    );

    const closeButton = screen.getAllByRole('button').find((btn) => 
      btn.querySelector('svg')?.classList.contains('lucide-x')
    );
    await user.click(closeButton!);

    // Assert
    expect(mockHandlers.onClose).toHaveBeenCalledTimes(1);
  });
});

describe('CallTransferModal - Search', () => {
  it('should display search input', () => {
    // Arrange
    const mockHandlers = {
      onTransfer: vi.fn(),
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallTransferModal
        isOpen={true}
        callId="call-123"
        caller={mockCaller}
        {...mockHandlers}
      />
    );

    // Assert
    const searchInput = screen.getByLabelText('Search agent');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', 'Search by name, department, or skill...');
  });

  it('should update search query on input', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockHandlers = {
      onTransfer: vi.fn(),
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallTransferModal
        isOpen={true}
        callId="call-123"
        caller={mockCaller}
        {...mockHandlers}
      />
    );

    const searchInput = screen.getByLabelText('Search agent');
    await user.type(searchInput, 'John');

    // Assert
    expect(searchInput).toHaveValue('John');
  });
});

describe('CallTransferModal - Empty State', () => {
  it('should display empty state when no agents available', () => {
    // Arrange
    const mockHandlers = {
      onTransfer: vi.fn(),
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallTransferModal
        isOpen={true}
        callId="call-123"
        caller={mockCaller}
        {...mockHandlers}
      />
    );

    // Assert
    expect(screen.getByText('No agents available')).toBeInTheDocument();
  });

  it('should not display transfer options when no agent selected', () => {
    // Arrange
    const mockHandlers = {
      onTransfer: vi.fn(),
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallTransferModal
        isOpen={true}
        callId="call-123"
        caller={mockCaller}
        {...mockHandlers}
      />
    );

    // Assert
    expect(screen.queryByText('Transfer Type')).not.toBeInTheDocument();
    expect(screen.queryByText('Blind Transfer')).not.toBeInTheDocument();
    expect(screen.queryByText('Attended Transfer')).not.toBeInTheDocument();
  });
});

describe('CallTransferModal - Accessibility', () => {
  it('should have proper ARIA attributes', () => {
    // Arrange
    const mockHandlers = {
      onTransfer: vi.fn(),
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallTransferModal
        isOpen={true}
        callId="call-123"
        caller={mockCaller}
        {...mockHandlers}
      />
    );

    // Assert
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'call-transfer-modal-title');
  });

  it('should have accessible search input', () => {
    // Arrange
    const mockHandlers = {
      onTransfer: vi.fn(),
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallTransferModal
        isOpen={true}
        callId="call-123"
        caller={mockCaller}
        {...mockHandlers}
      />
    );

    // Assert
    const searchInput = screen.getByLabelText('Search agent');
    expect(searchInput).toHaveAttribute('id', 'transfer-search');
  });
});

describe('CallTransferModal - Caller Info Display', () => {
  it('should display caller name without phone number', () => {
    // Arrange
    const mockHandlers = {
      onTransfer: vi.fn(),
      onClose: vi.fn(),
    };
    const callerWithoutPhone = {
      name: 'Bob Wilson',
      phoneNumber: undefined,
    };

    // Act
    render(
      <CallTransferModal
        isOpen={true}
        callId="call-123"
        caller={callerWithoutPhone}
        {...mockHandlers}
      />
    );

    // Assert
    expect(screen.getByText(/Bob Wilson/)).toBeInTheDocument();
  });

  it('should handle long caller names', () => {
    // Arrange
    const mockHandlers = {
      onTransfer: vi.fn(),
      onClose: vi.fn(),
    };
    const callerWithLongName = {
      name: 'A'.repeat(100),
      phoneNumber: '+905551234567',
    };

    // Act
    render(
      <CallTransferModal
        isOpen={true}
        callId="call-123"
        caller={callerWithLongName}
        {...mockHandlers}
      />
    );

    // Assert
    expect(screen.getByText(new RegExp('A+'))).toBeInTheDocument();
  });
});


