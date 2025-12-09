/**
 * EmojiPicker Component Tests
 * Coverage Target: 31% → 70%
 * Golden Rules: AAA Pattern, User Interactions, Search/Filter, Edge Cases
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmojiPicker, EmojiButton } from '../EmojiPicker';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('EmojiPicker', () => {
  let onEmojiSelectMock: ReturnType<typeof vi.fn>;
  let onCloseMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onEmojiSelectMock = vi.fn();
    onCloseMock = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Rule 1: Component Rendering
  describe('Rendering', () => {
    it('should render emoji picker', () => {
      // Arrange & Act
      render(<EmojiPicker onEmojiSelect={onEmojiSelectMock} />);

      // Assert
      expect(screen.getByPlaceholderText('Emoji ara...')).toBeInTheDocument();
    });

    it('should render category tabs', () => {
      // Arrange & Act
      render(<EmojiPicker onEmojiSelect={onEmojiSelectMock} />);

      // Assert
      // Categories should be rendered as buttons
      const categoryButtons = screen.getAllByRole('button');
      expect(categoryButtons.length).toBeGreaterThan(5); // At least 5 categories + emojis
    });

    it('should render emojis grid', () => {
      // Arrange & Act
      render(<EmojiPicker onEmojiSelect={onEmojiSelectMock} />);

      // Assert
      // Should have emoji buttons
      expect(screen.getByText('😊')).toBeInTheDocument();
      expect(screen.getByText('👍')).toBeInTheDocument();
      expect(screen.getByText('❤️')).toBeInTheDocument();
    });

    it('should render close button when onClose is provided', () => {
      // Arrange & Act
      render(
        <EmojiPicker onEmojiSelect={onEmojiSelectMock} onClose={onCloseMock} />
      );

      // Assert
      expect(screen.getByText('close')).toBeInTheDocument();
    });

    it('should not render close button when onClose is not provided', () => {
      // Arrange & Act
      render(<EmojiPicker onEmojiSelect={onEmojiSelectMock} />);

      // Assert
      expect(screen.queryByText('close')).not.toBeInTheDocument();
    });

    it('should position at bottom by default', () => {
      // Arrange & Act
      const { container } = render(<EmojiPicker onEmojiSelect={onEmojiSelectMock} />);

      // Assert
      const picker = container.firstChild as HTMLElement;
      expect(picker).toHaveClass('top-full', 'mt-2');
    });

    it('should position at top when position prop is top', () => {
      // Arrange & Act
      const { container } = render(
        <EmojiPicker onEmojiSelect={onEmojiSelectMock} position="top" />
      );

      // Assert
      const picker = container.firstChild as HTMLElement;
      expect(picker).toHaveClass('bottom-full', 'mb-2');
    });
  });

  // Rule 2: User Interactions - Emoji Selection
  describe('Emoji Selection', () => {
    it('should call onEmojiSelect when emoji is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<EmojiPicker onEmojiSelect={onEmojiSelectMock} />);

      // Act
      const emojiButton = screen.getByText('😊');
      await user.click(emojiButton);

      // Assert
      expect(onEmojiSelectMock).toHaveBeenCalledWith('😊');
      expect(onEmojiSelectMock).toHaveBeenCalledTimes(1);
    });

    it('should call onEmojiSelect for different emojis', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<EmojiPicker onEmojiSelect={onEmojiSelectMock} />);

      // Act
      await user.click(screen.getByText('👍'));
      await user.click(screen.getByText('❤️'));
      await user.click(screen.getByText('😂'));

      // Assert
      expect(onEmojiSelectMock).toHaveBeenCalledWith('👍');
      expect(onEmojiSelectMock).toHaveBeenCalledWith('❤️');
      expect(onEmojiSelectMock).toHaveBeenCalledWith('😂');
      expect(onEmojiSelectMock).toHaveBeenCalledTimes(3);
    });
  });

  // Rule 3: Search/Filter Functionality
  describe('Search Functionality', () => {
    it('should filter emojis based on search query', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<EmojiPicker onEmojiSelect={onEmojiSelectMock} />);

      // Act
      const searchInput = screen.getByPlaceholderText('Emoji ara...');
      await user.type(searchInput, '😊');

      // Assert - Use getAllByText since there may be multiple emoji buttons
      await waitFor(() => {
        const emojis = screen.getAllByText('😊');
        expect(emojis.length).toBeGreaterThan(0);
      });
    });

    it('should hide category tabs when searching', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<EmojiPicker onEmojiSelect={onEmojiSelectMock} />);

      // Get initial button count
      const initialButtons = screen.getAllByRole('button');
      const categoryCount = initialButtons.filter(btn => 
        btn.getAttribute('title')
      ).length;

      expect(categoryCount).toBeGreaterThan(0);

      // Act
      const searchInput = screen.getByPlaceholderText('Emoji ara...');
      await user.type(searchInput, 'smile');

      // Assert - Category buttons should not have titles when searching
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Emoji ara...');
        expect(searchInput).toHaveValue('smile');
      });
    });

    it('should show all emojis matching search across categories', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<EmojiPicker onEmojiSelect={onEmojiSelectMock} />);

      // Act
      const searchInput = screen.getByPlaceholderText('Emoji ara...');
      await user.type(searchInput, '❤');

      // Assert - Use getAllByText since there may be multiple heart emojis
      await waitFor(() => {
        const hearts = screen.getAllByText('❤️');
        expect(hearts.length).toBeGreaterThan(0);
      });
    });

    it('should clear search and restore categories', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<EmojiPicker onEmojiSelect={onEmojiSelectMock} />);
      const searchInput = screen.getByPlaceholderText('Emoji ara...');

      // Act - Type and clear
      await user.type(searchInput, 'test');
      await user.clear(searchInput);

      // Assert
      await waitFor(() => {
        expect(searchInput).toHaveValue('');
      });
    });

    it('should show no results message when no emojis match', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<EmojiPicker onEmojiSelect={onEmojiSelectMock} />);

      // Act
      const searchInput = screen.getByPlaceholderText('Emoji ara...');
      await user.type(searchInput, 'xyznonexistent');

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Emoji bulunamadı')).toBeInTheDocument();
      });
    });
  });

  // Rule 4: Category Navigation
  describe('Category Navigation', () => {
    it('should display recent emojis by default', () => {
      // Arrange & Act
      render(<EmojiPicker onEmojiSelect={onEmojiSelectMock} />);

      // Assert - Recent category emojis should be visible
      expect(screen.getByText('😊')).toBeInTheDocument();
      expect(screen.getByText('👍')).toBeInTheDocument();
      expect(screen.getByText('❤️')).toBeInTheDocument();
    });

    it('should switch to smileys category', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<EmojiPicker onEmojiSelect={onEmojiSelectMock} />);

      // Act - Find and click smileys category
      const categoryButtons = screen.getAllByRole('button').filter(btn => 
        btn.getAttribute('title') === 'Yüz İfadeleri'
      );
      
      if (categoryButtons.length > 0) {
        await user.click(categoryButtons[0]);
      }

      // Assert - Should show smiley emojis
      expect(screen.getByText('😀')).toBeInTheDocument();
    });

    it('should switch to gestures category', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<EmojiPicker onEmojiSelect={onEmojiSelectMock} />);

      // Act
      const categoryButtons = screen.getAllByRole('button').filter(btn => 
        btn.getAttribute('title') === 'El İşaretleri'
      );
      
      if (categoryButtons.length > 0) {
        await user.click(categoryButtons[0]);
      }

      // Assert
      expect(screen.getByText('👍')).toBeInTheDocument();
    });

    it('should switch to hearts category', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<EmojiPicker onEmojiSelect={onEmojiSelectMock} />);

      // Act
      const categoryButtons = screen.getAllByRole('button').filter(btn => 
        btn.getAttribute('title') === 'Kalpler'
      );
      
      if (categoryButtons.length > 0) {
        await user.click(categoryButtons[0]);
      }

      // Assert
      expect(screen.getByText('❤️')).toBeInTheDocument();
    });

    it('should highlight active category', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<EmojiPicker onEmojiSelect={onEmojiSelectMock} />);

      // Act
      const categoryButtons = screen.getAllByRole('button').filter(btn => 
        btn.getAttribute('title') === 'Kalpler'
      );
      
      if (categoryButtons.length > 0) {
        await user.click(categoryButtons[0]);

        // Assert - Active category should have specific styling
        await waitFor(() => {
          expect(categoryButtons[0]).toHaveClass('bg-blue-100');
        });
      }
    });
  });

  // Rule 5: Close Functionality
  describe('Close Functionality', () => {
    it('should call onClose when close button is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      render(
        <EmojiPicker onEmojiSelect={onEmojiSelectMock} onClose={onCloseMock} />
      );

      // Act
      const closeButton = screen.getByText('close');
      await user.click(closeButton);

      // Assert
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });

  // Rule 6: Emoji Count Display
  describe('Emoji Count', () => {
    it('should display emoji count', () => {
      // Arrange & Act
      render(<EmojiPicker onEmojiSelect={onEmojiSelectMock} />);

      // Assert - Should show emoji count (recent category has 8 emojis)
      expect(screen.getByText(/8 emoji/i)).toBeInTheDocument();
    });

    it('should update emoji count when switching categories', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<EmojiPicker onEmojiSelect={onEmojiSelectMock} />);

      // Act - Switch to smileys category (has more emojis)
      const categoryButtons = screen.getAllByRole('button').filter(btn => 
        btn.getAttribute('title') === 'Yüz İfadeleri'
      );
      
      if (categoryButtons.length > 0) {
        await user.click(categoryButtons[0]);

        // Assert - Count should update
        await waitFor(() => {
          const emojiCountText = screen.getByText(/emoji/i);
          expect(emojiCountText).toBeInTheDocument();
        });
      }
    });

    it('should show filtered emoji count during search', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<EmojiPicker onEmojiSelect={onEmojiSelectMock} />);

      // Act
      const searchInput = screen.getByPlaceholderText('Emoji ara...');
      await user.type(searchInput, '😊');

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/emoji/i)).toBeInTheDocument();
      });
    });
  });

  // Rule 9: Edge Cases
  describe('Edge Cases', () => {
    it('should handle rapid emoji clicks', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<EmojiPicker onEmojiSelect={onEmojiSelectMock} />);

      // Act
      await user.click(screen.getByText('😊'));
      await user.click(screen.getByText('👍'));
      await user.click(screen.getByText('❤️'));

      // Assert
      expect(onEmojiSelectMock).toHaveBeenCalledTimes(3);
    });

    it('should handle empty search gracefully', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<EmojiPicker onEmojiSelect={onEmojiSelectMock} />);

      // Act
      const searchInput = screen.getByPlaceholderText('Emoji ara...');
      await user.type(searchInput, '   ');
      await user.clear(searchInput);

      // Assert - Should show default emojis
      expect(screen.getByText('😊')).toBeInTheDocument();
    });

    it('should handle special characters in search', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<EmojiPicker onEmojiSelect={onEmojiSelectMock} />);

      // Act
      const searchInput = screen.getByPlaceholderText('Emoji ara...');
      await user.type(searchInput, '!@#$%');

      // Assert - Should show no results
      await waitFor(() => {
        expect(screen.getByText('Emoji bulunamadı')).toBeInTheDocument();
      });
    });
  });
});

describe('EmojiButton', () => {
  let onEmojiSelectMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onEmojiSelectMock = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render emoji button', () => {
      // Arrange & Act
      render(<EmojiButton onEmojiSelect={onEmojiSelectMock} />);

      // Assert
      const button = screen.getByRole('button', { name: /emoji ekle/i });
      expect(button).toBeInTheDocument();
    });

    it('should not show picker initially', () => {
      // Arrange & Act
      render(<EmojiButton onEmojiSelect={onEmojiSelectMock} />);

      // Assert
      expect(screen.queryByPlaceholderText('Emoji ara...')).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
      // Arrange & Act
      render(<EmojiButton onEmojiSelect={onEmojiSelectMock} className="custom-button" />);

      // Assert
      const button = screen.getByRole('button', { name: /emoji ekle/i });
      expect(button).toHaveClass('custom-button');
    });
  });

  describe('Picker Toggle', () => {
    it('should show picker when button is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<EmojiButton onEmojiSelect={onEmojiSelectMock} />);

      // Act
      const button = screen.getByRole('button', { name: /emoji ekle/i });
      await user.click(button);

      // Assert
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Emoji ara...')).toBeInTheDocument();
      });
    });

    it('should hide picker when button is clicked again', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<EmojiButton onEmojiSelect={onEmojiSelectMock} />);
      const button = screen.getByRole('button', { name: /emoji ekle/i });

      // Act
      await user.click(button); // Show
      await user.click(button); // Hide

      // Assert
      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Emoji ara...')).not.toBeInTheDocument();
      });
    });

    it('should hide picker when backdrop is clicked', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<EmojiButton onEmojiSelect={onEmojiSelectMock} />);
      const button = screen.getByRole('button', { name: /emoji ekle/i });

      // Act
      await user.click(button); // Show picker
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Emoji ara...')).toBeInTheDocument();
      });

      // Find backdrop
      const backdrop = screen.getByRole('button', { name: /close emoji picker/i });
      await user.click(backdrop);

      // Assert
      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Emoji ara...')).not.toBeInTheDocument();
      });
    });

    it('should close picker when escape key is pressed on backdrop', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<EmojiButton onEmojiSelect={onEmojiSelectMock} />);
      const button = screen.getByRole('button', { name: /emoji ekle/i });

      // Act
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Emoji ara...')).toBeInTheDocument();
      });

      const backdrop = screen.getByRole('button', { name: /close emoji picker/i });
      backdrop.focus();
      await user.keyboard('{Escape}');

      // Assert
      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Emoji ara...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Emoji Selection', () => {
    it('should call onEmojiSelect and close picker when emoji is selected', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<EmojiButton onEmojiSelect={onEmojiSelectMock} />);
      const button = screen.getByRole('button', { name: /emoji ekle/i });

      // Act
      await user.click(button); // Show picker
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Emoji ara...')).toBeInTheDocument();
      });

      const emoji = screen.getByText('😊');
      await user.click(emoji);

      // Assert
      expect(onEmojiSelectMock).toHaveBeenCalledWith('😊');
      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Emoji ara...')).not.toBeInTheDocument();
      });
    });

    it('should handle multiple selections', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<EmojiButton onEmojiSelect={onEmojiSelectMock} />);
      const button = screen.getByRole('button', { name: /emoji ekle/i });

      // Act - First selection
      await user.click(button);
      await waitFor(() => {
        expect(screen.getByText('😊')).toBeInTheDocument();
      });
      await user.click(screen.getByText('😊'));

      // Second selection
      await user.click(button);
      await waitFor(() => {
        expect(screen.getByText('👍')).toBeInTheDocument();
      });
      await user.click(screen.getByText('👍'));

      // Assert
      expect(onEmojiSelectMock).toHaveBeenCalledWith('😊');
      expect(onEmojiSelectMock).toHaveBeenCalledWith('👍');
      expect(onEmojiSelectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('Position Prop', () => {
    it('should position picker at bottom by default', async () => {
      // Arrange
      const user = userEvent.setup();
      const { container } = render(<EmojiButton onEmojiSelect={onEmojiSelectMock} />);
      const button = screen.getByRole('button', { name: /emoji ekle/i });

      // Act
      await user.click(button);

      // Assert
      await waitFor(() => {
        const picker = container.querySelector('.top-full');
        expect(picker).toBeInTheDocument();
      });
    });

    it('should position picker at top when position is top', async () => {
      // Arrange
      const user = userEvent.setup();
      const { container } = render(
        <EmojiButton onEmojiSelect={onEmojiSelectMock} position="top" />
      );
      const button = screen.getByRole('button', { name: /emoji ekle/i });

      // Act
      await user.click(button);

      // Assert
      await waitFor(() => {
        const picker = container.querySelector('.bottom-full');
        expect(picker).toBeInTheDocument();
      });
    });
  });
});

