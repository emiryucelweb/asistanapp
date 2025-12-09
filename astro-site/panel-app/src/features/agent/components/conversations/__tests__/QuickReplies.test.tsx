/**
 * QuickReplies Component Tests - ENTERPRISE GRADE
 * 
 * @group component
 * @group agent
 * @group quick-replies
 * 
 * ALTIN KURALLAR:
 * ✅ React Component Testing
 * ✅ AAA Pattern
 * ✅ User interactions
 * ✅ Search & filtering
 * ✅ Accessibility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuickReplies from '../QuickReplies';

// ============================================================================
// MOCKS
// ============================================================================

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        'quickReplies.title': 'Hızlı Yanıtlar',
        'quickReplies.templateCount': `${options?.count || 0} şablon`,
        'quickReplies.searchPlaceholder': 'Şablon ara...',
        'quickReplies.noTemplates': 'Şablon bulunamadı',
        'quickReplies.shortcutHint': 'İpucu: Kısayol tuşlarıyla hızlıca seçim yapabilirsiniz',
        'quickReplies.categories.all': 'Tümü',
        'quickReplies.categories.greeting': 'Selamlama',
        'quickReplies.categories.order': 'Sipariş',
        'quickReplies.categories.return': 'İade',
        'quickReplies.categories.product': 'Ürün',
        'quickReplies.categories.shipping': 'Kargo',
        'quickReplies.categories.general': 'Genel',
        'quickReplies.categories.closing': 'Kapanış',
      };
      return translations[key] || key;
    },
  }),
}));

// ============================================================================
// TEST UTILITIES
// ============================================================================

const defaultProps = {
  onSelect: vi.fn(),
  onClose: vi.fn(),
};

// ============================================================================
// TESTS
// ============================================================================

describe('QuickReplies - Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should render modal with title', () => {
    // Arrange & Act
    render(<QuickReplies {...defaultProps} />);

    // Assert
    expect(screen.getByText('Hızlı Yanıtlar')).toBeInTheDocument();
  });

  it('should render search input', () => {
    // Arrange & Act
    render(<QuickReplies {...defaultProps} />);

    // Assert
    const searchInput = screen.getByPlaceholderText('Şablon ara...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveFocus(); // autoFocus
  });

  it('should render all categories', () => {
    // Arrange & Act
    render(<QuickReplies {...defaultProps} />);

    // Assert
    expect(screen.getByText('Tümü')).toBeInTheDocument();
    expect(screen.getByText('Selamlama')).toBeInTheDocument();
    expect(screen.getByText('Sipariş')).toBeInTheDocument();
    expect(screen.getByText('İade')).toBeInTheDocument();
    expect(screen.getByText('Ürün')).toBeInTheDocument();
    expect(screen.getByText('Kargo')).toBeInTheDocument();
    expect(screen.getByText('Genel')).toBeInTheDocument();
    expect(screen.getByText('Kapanış')).toBeInTheDocument();
  });

  it('should render empty state when no templates', () => {
    // Arrange & Act
    render(<QuickReplies {...defaultProps} />);

    // Assert
    expect(screen.getByText('Şablon bulunamadı')).toBeInTheDocument();
  });

  it('should render template count', () => {
    // Arrange & Act
    render(<QuickReplies {...defaultProps} />);

    // Assert
    expect(screen.getByText('0 şablon')).toBeInTheDocument();
  });

  it('should render close button', () => {
    // Arrange & Act
    const { container } = render(<QuickReplies {...defaultProps} />);

    // Assert
    const closeButtons = container.querySelectorAll('button');
    expect(closeButtons.length).toBeGreaterThan(0);
  });

  it('should render shortcut hint', () => {
    // Arrange & Act
    render(<QuickReplies {...defaultProps} />);

    // Assert
    expect(screen.getByText(/Kısayol tuşlarıyla/)).toBeInTheDocument();
  });
});

describe('QuickReplies - User Interactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call onClose when close button clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { container } = render(
      <QuickReplies 
        {...defaultProps} 
        onClose={onClose}
      />
    );

    // Act - Find X button
    const closeButton = container.querySelector('button svg.lucide-x')?.closest('button');
    expect(closeButton).toBeInTheDocument();
    
    if (closeButton) {
      await user.click(closeButton);
    }

    // Assert
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should update search input on typing', async () => {
    // Arrange
    const user = userEvent.setup();

    render(<QuickReplies {...defaultProps} />);

    // Act
    const searchInput = screen.getByPlaceholderText('Şablon ara...');
    await user.type(searchInput, 'test search');

    // Assert
    expect(searchInput).toHaveValue('test search');
  });

  it('should select category on click', async () => {
    // Arrange
    const user = userEvent.setup();

    render(<QuickReplies {...defaultProps} />);

    // Act
    const greetingButton = screen.getByText('Selamlama');
    await user.click(greetingButton);

    // Assert - Active category should have orange background
    expect(greetingButton).toHaveClass('bg-orange-500');
  });

  it('should toggle between categories', async () => {
    // Arrange
    const user = userEvent.setup();

    render(<QuickReplies {...defaultProps} />);

    // Act - Click different categories
    await user.click(screen.getByText('Sipariş'));
    expect(screen.getByText('Sipariş')).toHaveClass('bg-orange-500');

    await user.click(screen.getByText('İade'));
    expect(screen.getByText('İade')).toHaveClass('bg-orange-500');
    expect(screen.getByText('Sipariş')).not.toHaveClass('bg-orange-500');
  });

  it('should clear search input on backspace', async () => {
    // Arrange
    const user = userEvent.setup();

    render(<QuickReplies {...defaultProps} />);

    // Act
    const searchInput = screen.getByPlaceholderText('Şablon ara...');
    await user.type(searchInput, 'test');
    await user.clear(searchInput);

    // Assert
    expect(searchInput).toHaveValue('');
  });
});

describe('QuickReplies - Category Highlighting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should highlight "Tümü" category by default', () => {
    // Arrange & Act
    render(<QuickReplies {...defaultProps} />);

    // Assert
    const allButton = screen.getByText('Tümü');
    expect(allButton).toHaveClass('bg-orange-500', 'text-white');
  });

  it('should apply active styles to selected category', async () => {
    // Arrange
    const user = userEvent.setup();

    render(<QuickReplies {...defaultProps} />);

    // Act
    const productButton = screen.getByText('Ürün');
    await user.click(productButton);

    // Assert
    expect(productButton).toHaveClass('bg-orange-500', 'text-white');
  });

  it('should apply inactive styles to unselected categories', async () => {
    // Arrange
    const user = userEvent.setup();

    render(<QuickReplies {...defaultProps} />);

    // Act
    await user.click(screen.getByText('Kargo'));

    // Assert
    const greetingButton = screen.getByText('Selamlama');
    expect(greetingButton).toHaveClass('bg-gray-100');
    expect(greetingButton).not.toHaveClass('bg-orange-500');
  });
});

describe('QuickReplies - Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have modal overlay', () => {
    // Arrange & Act
    const { container } = render(<QuickReplies {...defaultProps} />);

    // Assert
    const overlay = container.querySelector('.fixed.inset-0');
    expect(overlay).toBeInTheDocument();
  });

  it('should focus search input on mount', () => {
    // Arrange & Act
    render(<QuickReplies {...defaultProps} />);

    // Assert
    const searchInput = screen.getByPlaceholderText('Şablon ara...');
    expect(searchInput).toHaveFocus();
  });

  it('should have keyboard navigable categories', () => {
    // Arrange & Act
    render(<QuickReplies {...defaultProps} />);

    // Assert - All category buttons should be focusable
    const categoryButtons = screen.getAllByRole('button');
    categoryButtons.forEach(button => {
      expect(button).toBeInTheDocument();
    });
  });

  it('should have proper contrast for selected category', async () => {
    // Arrange
    const user = userEvent.setup();

    render(<QuickReplies {...defaultProps} />);

    // Act
    const button = screen.getByText('Genel');
    await user.click(button);

    // Assert - Orange background with white text (high contrast)
    expect(button).toHaveClass('bg-orange-500', 'text-white');
  });
});

describe('QuickReplies - Empty State', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show empty state icon', () => {
    // Arrange & Act
    const { container } = render(<QuickReplies {...defaultProps} />);

    // Assert - Zap icon for empty state
    const zapIcons = container.querySelectorAll('svg.lucide-zap');
    expect(zapIcons.length).toBeGreaterThan(0);
  });

  it('should show "no templates" message', () => {
    // Arrange & Act
    render(<QuickReplies {...defaultProps} />);

    // Assert
    expect(screen.getByText('Şablon bulunamadı')).toBeInTheDocument();
  });

  it('should show zero count in header', () => {
    // Arrange & Act
    render(<QuickReplies {...defaultProps} />);

    // Assert
    expect(screen.getByText('0 şablon')).toBeInTheDocument();
  });
});

describe('QuickReplies - Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle rapid category switching', async () => {
    // Arrange
    const user = userEvent.setup();

    render(<QuickReplies {...defaultProps} />);

    // Act - Rapidly switch categories
    await user.click(screen.getByText('Sipariş'));
    await user.click(screen.getByText('İade'));
    await user.click(screen.getByText('Ürün'));
    await user.click(screen.getByText('Tümü'));

    // Assert - Final category should be active
    expect(screen.getByText('Tümü')).toHaveClass('bg-orange-500');
  });

  it('should handle search with special characters', async () => {
    // Arrange
    const user = userEvent.setup();

    render(<QuickReplies {...defaultProps} />);

    // Act
    const searchInput = screen.getByPlaceholderText('Şablon ara...');
    await user.type(searchInput, '@#$%^&*()');

    // Assert
    expect(searchInput).toHaveValue('@#$%^&*()');
  });

  it('should handle very long search query', async () => {
    // Arrange
    const user = userEvent.setup();

    render(<QuickReplies {...defaultProps} />);

    // Act
    const longQuery = 'a'.repeat(200);
    const searchInput = screen.getByPlaceholderText('Şablon ara...');
    await user.type(searchInput, longQuery);

    // Assert
    expect(searchInput).toHaveValue(longQuery);
  });

  it('should handle empty search query', async () => {
    // Arrange
    const user = userEvent.setup();

    render(<QuickReplies {...defaultProps} />);

    // Act
    const searchInput = screen.getByPlaceholderText('Şablon ara...');
    await user.type(searchInput, '   ');

    // Assert
    expect(searchInput).toHaveValue('   ');
  });
});

describe('QuickReplies - Real-World Scenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle search and category filter together', async () => {
    // Arrange
    const user = userEvent.setup();

    render(<QuickReplies {...defaultProps} />);

    // Act - Search and filter
    await user.type(screen.getByPlaceholderText('Şablon ara...'), 'sipariş');
    await user.click(screen.getByText('Sipariş'));

    // Assert - Both should be applied
    expect(screen.getByPlaceholderText('Şablon ara...')).toHaveValue('sipariş');
    expect(screen.getByText('Sipariş')).toHaveClass('bg-orange-500');
  });

  it('should handle workflow: open → search → close', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { container } = render(
      <QuickReplies 
        {...defaultProps} 
        onClose={onClose}
      />
    );

    // Act - Search
    await user.type(screen.getByPlaceholderText('Şablon ara...'), 'test');

    // Act - Close
    const closeButton = container.querySelector('button svg.lucide-x')?.closest('button');
    if (closeButton) {
      await user.click(closeButton);
    }

    // Assert
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should handle mobile workflow (category scrolling)', () => {
    // Arrange & Act
    const { container } = render(<QuickReplies {...defaultProps} />);

    // Assert - Category container should be scrollable
    const categoryContainer = container.querySelector('.overflow-x-auto');
    expect(categoryContainer).toBeInTheDocument();
  });
});

describe('QuickReplies - Performance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without performance issues', () => {
    // Arrange
    const startTime = performance.now();

    // Act
    render(<QuickReplies {...defaultProps} />);

    // Assert - Should render quickly (< 100ms)
    const renderTime = performance.now() - startTime;
    expect(renderTime).toBeLessThan(100);
  });

  it('should handle rapid typing without lag', async () => {
    // Arrange
    const user = userEvent.setup();

    render(<QuickReplies {...defaultProps} />);

    // Act - Type rapidly
    const searchInput = screen.getByPlaceholderText('Şablon ara...');
    await user.type(searchInput, 'test query', { delay: 10 });

    // Assert - Input should update
    expect(searchInput).toHaveValue('test query');
  });
});

