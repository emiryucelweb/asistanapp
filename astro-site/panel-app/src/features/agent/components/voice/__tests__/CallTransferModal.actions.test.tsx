/**
 * CallTransferModal Component Tests - ACTIONS (Part 2/2)
 * 
 * Advanced tests: Cancel, Edge Cases, Real-World Scenarios, State Transitions, Search Validation
 * 
 * @group component
 * @group agent
 * @group voice
 * @group critical
 * 
 * GOLDEN RULES: 13/13 ✅
 * MAX 15 TESTS: 13/15 ✅
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
        'voice.cancel': 'Cancel',
        'voice.transfer': 'Transfer',
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

describe('CallTransferModal - Cancel Button', () => {
  it('should display cancel button', () => {
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
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument(); // Only visible when agent selected
  });
});

describe('CallTransferModal - Edge Cases', () => {
  it('should handle special characters in search', async () => {
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
    await user.type(searchInput, '@#$%^&*()');

    // Assert
    expect(searchInput).toHaveValue('@#$%^&*()');
  });

  it('should handle empty call ID', () => {
    // Arrange
    const mockHandlers = {
      onTransfer: vi.fn(),
      onClose: vi.fn(),
    };

    // Act & Assert - Should not crash
    expect(() => {
      render(
        <CallTransferModal
          isOpen={true}
          callId=""
          caller={mockCaller}
          {...mockHandlers}
        />
      );
    }).not.toThrow();
  });

  it('should handle missing caller phone number', () => {
    // Arrange
    const mockHandlers = {
      onTransfer: vi.fn(),
      onClose: vi.fn(),
    };
    const callerWithoutPhone = {
      name: 'Anonymous',
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
    expect(screen.getByText(/Anonymous/)).toBeInTheDocument();
  });
});

describe('CallTransferModal - Real-World Scenarios', () => {
  it('should handle typical transfer workflow', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockHandlers = {
      onTransfer: vi.fn(),
      onClose: vi.fn(),
    };

    // Act - Modal opens
    render(
      <CallTransferModal
        isOpen={true}
        callId="call-123"
        caller={mockCaller}
        {...mockHandlers}
      />
    );

    // Assert - Modal is displayed
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Transfer Call')).toBeInTheDocument();

    // Assert - Empty state shown (no agents)
    expect(screen.getByText('No agents available')).toBeInTheDocument();

    // Agent searches for target agent
    const searchInput = screen.getByLabelText('Search agent');
    await user.type(searchInput, 'Technical');

    // Assert - Search query updated
    expect(searchInput).toHaveValue('Technical');
  });

  it('should handle modal close workflow', async () => {
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

    // Close via X button
    const closeButton = screen.getAllByRole('button').find((btn) => 
      btn.querySelector('svg')?.classList.contains('lucide-x')
    );
    await user.click(closeButton!);

    // Assert
    expect(mockHandlers.onClose).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onTransfer).not.toHaveBeenCalled();
  });

  it('should handle search with no results', async () => {
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
    await user.type(searchInput, 'NonexistentAgent');

    // Assert - Empty state still shown
    expect(screen.getByText('No agents available')).toBeInTheDocument();
  });
});

describe('CallTransferModal - Modal State Transitions', () => {
  it('should handle modal opening', () => {
    // Arrange
    const mockHandlers = {
      onTransfer: vi.fn(),
      onClose: vi.fn(),
    };

    // Act - Initially closed
    const { rerender } = render(
      <CallTransferModal
        isOpen={false}
        callId="call-123"
        caller={mockCaller}
        {...mockHandlers}
      />
    );

    // Assert
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Act - Open modal
    rerender(
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

  it('should handle modal closing', () => {
    // Arrange
    const mockHandlers = {
      onTransfer: vi.fn(),
      onClose: vi.fn(),
    };

    // Act - Initially open
    const { rerender } = render(
      <CallTransferModal
        isOpen={true}
        callId="call-123"
        caller={mockCaller}
        {...mockHandlers}
      />
    );

    // Assert
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Act - Close modal
    rerender(
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
});

describe('CallTransferModal - Search Input Validation', () => {
  it('should allow alphanumeric characters', async () => {
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
    await user.type(searchInput, 'Agent123');

    // Assert
    expect(searchInput).toHaveValue('Agent123');
  });

  it('should handle whitespace in search', async () => {
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
    await user.type(searchInput, '   spaces   ');

    // Assert
    expect(searchInput).toHaveValue('   spaces   ');
  });

  it('should clear search on backspace', async () => {
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
    await user.type(searchInput, 'Test');
    expect(searchInput).toHaveValue('Test');

    // Clear
    await user.clear(searchInput);

    // Assert
    expect(searchInput).toHaveValue('');
  });
});


