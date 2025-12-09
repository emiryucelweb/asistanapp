/**
 * CallHistoryPanel Component Tests - ACCESSIBILITY (Part 3/3)
 * 
 * Accessibility tests for buttons and controls
 * 
 * @group component
 * @group agent
 * @group voice
 * @group critical
 * 
 * GOLDEN RULES: 13/13 ✅
 * MAX 15 TESTS: 2/15 ✅
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import CallHistoryPanel from '../CallHistoryPanel';

// ============================================================================
// MOCKS
// ============================================================================

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'callHistory.all': 'All',
        'callHistory.incoming': 'Incoming',
        'callHistory.outgoing': 'Outgoing',
        'callHistory.missed': 'Missed',
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'en',
    },
  }),
}));

vi.mock('@/features/agent/utils/locale', () => ({
  formatTime: vi.fn(),
  formatDate: vi.fn(),
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

describe('CallHistoryPanel - Accessibility (Part 2)', () => {
  it('should have accessible filter buttons', () => {
    // Arrange
    const mockHandlers = {
      onClose: vi.fn(),
    };

    // Act
    render(
      <CallHistoryPanel isOpen={true} {...mockHandlers} />
    );

    // Assert - All buttons are accessible by role
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Incoming' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Outgoing' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Missed' })).toBeInTheDocument();
  });

  it('should have accessible close button', () => {
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
});


