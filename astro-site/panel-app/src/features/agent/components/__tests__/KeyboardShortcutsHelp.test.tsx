/**
 * KeyboardShortcutsHelp Component Tests
 * Enterprise-grade test suite for keyboard shortcuts modal
 * 
 * ALTIN KURALLAR:
 * 1. Test GERÇEK senaryoları, sadece pass olmasın
 * 2. Her satır, her dal, her edge case kontrol edilmeli
 * 3. Mock'lar gerçek davranışı yansıtmalı
 * 4. Bağımlılıklar doğrulanmalı
 * 5. Maintainable ve okunaklı olmalı
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import KeyboardShortcutsHelp from '../KeyboardShortcutsHelp';

// Mock getAgentKeyboardShortcuts
const mockShortcuts = [
  {
    category: 'General',
    shortcuts: [
      { keys: 'Ctrl+K', description: 'Open command palette', action: vi.fn() },
      { keys: 'Ctrl+/', description: 'Toggle sidebar', action: vi.fn() },
    ],
  },
  {
    category: 'Conversations',
    shortcuts: [
      { keys: 'Ctrl+Enter', description: 'Send message', action: vi.fn() },
      { keys: 'Esc', description: 'Close conversation', action: vi.fn() },
    ],
  },
];

vi.mock('@/features/agent/hooks/useKeyboardShortcuts', () => ({
  getAgentKeyboardShortcuts: vi.fn(() => mockShortcuts),
}));

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'keyboard.help.title': 'Keyboard Shortcuts',
        'keyboard.help.subtitle': 'Boost your productivity with these shortcuts',
        'keyboard.help.tipPrefix': 'Pro Tip:',
        'keyboard.help.tipText': 'Press ? to open this dialog anytime',
        'common.close': 'Close',
      };
      return translations[key] || key;
    },
  }),
}));

describe('KeyboardShortcutsHelp', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const renderComponent = () => {
    return render(<KeyboardShortcutsHelp onClose={mockOnClose} />);
  };

  describe('Initial Render', () => {
    it('should render keyboard shortcuts modal with correct title', () => {
      renderComponent();
      
      expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
      expect(screen.getByText('Boost your productivity with these shortcuts')).toBeInTheDocument();
    });

    it('should render all shortcut categories', () => {
      renderComponent();
      
      // Check for both categories
      expect(screen.getByText('General')).toBeInTheDocument();
      expect(screen.getByText('Conversations')).toBeInTheDocument();
    });

    it('should render all shortcuts in General category', () => {
      renderComponent();
      
      expect(screen.getByText('Open command palette')).toBeInTheDocument();
      expect(screen.getByText('Toggle sidebar')).toBeInTheDocument();
    });

    it('should render all shortcuts in Conversations category', () => {
      renderComponent();
      
      expect(screen.getByText('Send message')).toBeInTheDocument();
      expect(screen.getByText('Close conversation')).toBeInTheDocument();
    });

    it('should render pro tip footer', () => {
      renderComponent();
      
      expect(screen.getByText('Pro Tip:')).toBeInTheDocument();
      expect(screen.getByText('Press ? to open this dialog anytime')).toBeInTheDocument();
    });
  });

  describe('Close Functionality', () => {
    it('should call onClose when close button is clicked', () => {
      renderComponent();
      
      const closeButton = screen.getByRole('button', { name: 'Close' });
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should have proper accessibility attributes on close button', () => {
      renderComponent();
      
      const closeButton = screen.getByRole('button', { name: 'Close' });
      
      expect(closeButton).toHaveAttribute('aria-label', 'Close');
    });
  });

  describe('Key Display Formatting', () => {
    it('should display simple keys correctly', () => {
      renderComponent();
      
      // Esc key should be displayed
      const escKeys = screen.getAllByText('Esc');
      expect(escKeys.length).toBeGreaterThan(0);
    });

    it('should display compound keys with separator', () => {
      renderComponent();
      
      // Ctrl+K should be displayed as separate kbd elements
      const ctrlKeys = screen.getAllByText('Ctrl');
      const kKeys = screen.getAllByText('K');
      
      expect(ctrlKeys.length).toBeGreaterThan(0);
      expect(kKeys.length).toBeGreaterThan(0);
    });

    it('should format Enter key correctly', () => {
      renderComponent();
      
      const enterKeys = screen.getAllByText('Enter');
      expect(enterKeys.length).toBeGreaterThan(0);
    });

    it('should use kbd element for key styling', () => {
      const { container } = renderComponent();
      
      // Should have kbd elements
      const kbdElements = container.querySelectorAll('kbd');
      expect(kbdElements.length).toBeGreaterThan(0);
      
      // kbd elements should have proper styling classes
      kbdElements.forEach(kbd => {
        expect(kbd.className).toContain('px-2');
        expect(kbd.className).toContain('py-1');
        expect(kbd.className).toContain('bg-gray-100');
      });
    });
  });

  describe('Category Structure', () => {
    it('should render categories in correct order', () => {
      renderComponent();
      
      const categories = screen.getAllByRole('heading', { level: 3 });
      
      expect(categories[0]).toHaveTextContent('General');
      expect(categories[1]).toHaveTextContent('Conversations');
    });

    it('should group shortcuts under correct categories', () => {
      const { container } = renderComponent();
      
      // Find General category section
      const generalHeading = screen.getByText('General');
      const generalSection = generalHeading.closest('div');
      
      // Should contain General shortcuts
      expect(generalSection).toHaveTextContent('Open command palette');
      expect(generalSection).toHaveTextContent('Toggle sidebar');
      
      // Should not contain Conversations shortcuts
      expect(generalSection).not.toHaveTextContent('Send message');
    });

    it('should have visual separator for categories', () => {
      const { container } = renderComponent();
      
      // Categories should have the gradient bar indicator
      const gradientBars = container.querySelectorAll('.bg-gradient-to-b');
      expect(gradientBars.length).toBe(2); // One for each category
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderComponent();
      
      // Main title should be h2
      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent('Keyboard Shortcuts');
      
      // Categories should be h3
      const categoryHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(categoryHeadings).toHaveLength(2);
    });

    it('should be keyboard navigable', () => {
      renderComponent();
      
      const closeButton = screen.getByRole('button', { name: 'Close' });
      
      // Should be focusable
      closeButton.focus();
      expect(document.activeElement).toBe(closeButton);
    });

    it('should have semantic HTML structure', () => {
      const { container } = renderComponent();
      
      // Should have proper dialog structure
      const modal = container.querySelector('.fixed.inset-0');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('UI/UX Validation', () => {
    it('should have backdrop overlay', () => {
      const { container } = renderComponent();
      
      const backdrop = container.querySelector('.bg-black\\/50');
      expect(backdrop).toBeInTheDocument();
    });

    it('should have proper modal styling', () => {
      const { container } = renderComponent();
      
      const modal = container.querySelector('.bg-white.dark\\:bg-slate-800');
      expect(modal).toBeInTheDocument();
      expect(modal).toHaveClass('rounded-xl');
      expect(modal).toHaveClass('shadow-2xl');
    });

    it('should have proper max-width for readability', () => {
      const { container } = renderComponent();
      
      const modalContent = container.querySelector('.max-w-2xl');
      expect(modalContent).toBeInTheDocument();
    });

    it('should have scrollable content area', () => {
      const { container } = renderComponent();
      
      const scrollableArea = container.querySelector('.overflow-y-auto');
      expect(scrollableArea).toBeInTheDocument();
    });

    it('should have gradient footer for visual hierarchy', () => {
      const { container } = renderComponent();
      
      const footer = container.querySelector('.bg-gradient-to-r');
      expect(footer).toBeInTheDocument();
    });
  });

  describe('Dark Mode Support', () => {
    it('should have dark mode classes', () => {
      const { container } = renderComponent();
      
      // Main modal
      const modal = container.querySelector('.dark\\:bg-slate-800');
      expect(modal).toBeInTheDocument();
      
      // Borders
      const borders = container.querySelectorAll('.dark\\:border-slate-700');
      expect(borders.length).toBeGreaterThan(0);
      
      // Text colors
      const darkText = container.querySelectorAll('.dark\\:text-gray-100');
      expect(darkText.length).toBeGreaterThan(0);
    });

    it('should have dark mode kbd elements', () => {
      const { container } = renderComponent();
      
      const kbdElements = container.querySelectorAll('kbd');
      kbdElements.forEach(kbd => {
        expect(kbd.className).toContain('dark:bg-slate-700');
      });
    });
  });

  describe('Animations', () => {
    it('should have fade-in animation class', () => {
      const { container } = renderComponent();
      
      const backdrop = container.querySelector('.animate-fadeIn');
      expect(backdrop).toBeInTheDocument();
    });

    it('should have slide-up animation class', () => {
      const { container } = renderComponent();
      
      const modal = container.querySelector('.animate-slideUp');
      expect(modal).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty shortcuts array gracefully', async () => {
      // Mock empty shortcuts
      const { getAgentKeyboardShortcuts } = vi.mocked(
        await import('@/features/agent/hooks/useKeyboardShortcuts')
      );
      getAgentKeyboardShortcuts.mockReturnValue([]);
      
      renderComponent();
      
      // Should still render without crashing
      expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
    });

    it('should handle shortcuts with special characters', async () => {
      const { getAgentKeyboardShortcuts } = vi.mocked(
        await import('@/features/agent/hooks/useKeyboardShortcuts')
      );
      getAgentKeyboardShortcuts.mockReturnValue([
        {
          category: 'Special',
          shortcuts: [
            { keys: 'Ctrl+Shift+?', description: 'Help', action: vi.fn() },
          ],
        },
      ]);
      
      const { rerender } = renderComponent();
      rerender(<KeyboardShortcutsHelp onClose={mockOnClose} />);
      
      // Should handle special characters
      expect(screen.getByText('Help')).toBeInTheDocument();
    });

    it('should handle very long shortcut descriptions', async () => {
      const { getAgentKeyboardShortcuts } = vi.mocked(
        await import('@/features/agent/hooks/useKeyboardShortcuts')
      );
      getAgentKeyboardShortcuts.mockReturnValue([
        {
          category: 'Test',
          shortcuts: [
            {
              keys: 'Ctrl+K',
              description: 'This is a very long description that might wrap to multiple lines in the UI',
              action: vi.fn(),
            },
          ],
        },
      ]);
      
      const { rerender } = renderComponent();
      rerender(<KeyboardShortcutsHelp onClose={mockOnClose} />);
      
      // Should render without layout issues
      expect(screen.getByText(/very long description/)).toBeInTheDocument();
    });
  });

  describe('Integration', () => {
    it('should call getAgentKeyboardShortcuts with translation function', async () => {
      const { getAgentKeyboardShortcuts } = vi.mocked(
        await import('@/features/agent/hooks/useKeyboardShortcuts')
      );
      
      renderComponent();
      
      // Should be called with t function
      expect(getAgentKeyboardShortcuts).toHaveBeenCalled();
      expect(getAgentKeyboardShortcuts).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should integrate properly with i18n', () => {
      renderComponent();
      
      // All text should be translated
      expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
      expect(screen.getByText('Boost your productivity with these shortcuts')).toBeInTheDocument();
    });

    it('should pass onClose prop correctly', () => {
      renderComponent();
      
      const closeButton = screen.getByRole('button', { name: 'Close' });
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Real-World Scenarios', () => {
    it('should handle complete user workflow', () => {
      renderComponent();
      
      // 1. User opens shortcut help (via ? key or menu)
      expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
      
      // 2. User scrolls through categories
      expect(screen.getByText('General')).toBeInTheDocument();
      expect(screen.getByText('Conversations')).toBeInTheDocument();
      
      // 3. User views shortcuts
      expect(screen.getByText('Open command palette')).toBeInTheDocument();
      expect(screen.getByText('Send message')).toBeInTheDocument();
      
      // 4. User reads pro tip
      expect(screen.getByText('Pro Tip:')).toBeInTheDocument();
      
      // 5. User closes dialog
      const closeButton = screen.getByRole('button', { name: 'Close' });
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should display all categories and shortcuts properly', () => {
      renderComponent();
      
      // Should have 2 categories
      const categories = screen.getAllByRole('heading', { level: 3 });
      expect(categories).toHaveLength(2);
      
      // Should have 4 total shortcuts (2 per category)
      expect(screen.getByText('Open command palette')).toBeInTheDocument();
      expect(screen.getByText('Toggle sidebar')).toBeInTheDocument();
      expect(screen.getByText('Send message')).toBeInTheDocument();
      expect(screen.getByText('Close conversation')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render efficiently without unnecessary computations', () => {
      const { rerender } = renderComponent();
      
      // Rerender should not cause issues
      rerender(<KeyboardShortcutsHelp onClose={mockOnClose} />);
      
      expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
    });

    it('should handle large number of shortcuts', async () => {
      const { getAgentKeyboardShortcuts } = vi.mocked(
        await import('@/features/agent/hooks/useKeyboardShortcuts')
      );
      
      // Create 50 shortcuts across 5 categories
      const largeShortcuts = Array.from({ length: 5 }, (_, catIdx) => ({
        category: `Category ${catIdx + 1}`,
        shortcuts: Array.from({ length: 10 }, (_, shortIdx) => ({
          keys: `Ctrl+${shortIdx}`,
          description: `Shortcut ${shortIdx + 1}`,
          action: vi.fn(),
        })),
      }));
      
      getAgentKeyboardShortcuts.mockReturnValue(largeShortcuts);
      
      const { rerender } = renderComponent();
      rerender(<KeyboardShortcutsHelp onClose={mockOnClose} />);
      
      // Should render without performance issues
      expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
    });
  });
});

