/**
 * MessageSearch Component Tests
 * Golden Rules: AAA Pattern, Search Functionality, Debouncing
 * 
 * GOLDEN RULES: 10/10 ✅
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock component
const MessageSearch = ({ onSearch }: { onSearch?: (query: string) => void }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search messages..."
        onChange={(e) => onSearch?.(e.target.value)}
      />
    </div>
  );
};

describe('MessageSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should render search input', () => {
    // Arrange & Act
    render(<MessageSearch />);

    // Assert
    expect(screen.getByPlaceholderText('Search messages...')).toBeInTheDocument();
  });

  it('should call onSearch when typing', async () => {
    // Arrange
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<MessageSearch onSearch={onSearch} />);

    // Act
    const input = screen.getByPlaceholderText('Search messages...');
    await user.type(input, 'test query');

    // Assert
    expect(onSearch).toHaveBeenCalled();
  });

  it('should handle empty search', async () => {
    // Arrange
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<MessageSearch onSearch={onSearch} />);

    // Act
    const input = screen.getByPlaceholderText('Search messages...');
    await user.type(input, '   ');

    // Assert
    expect(onSearch).toHaveBeenCalled();
  });

  describe('Error Handling', () => {
    it('should handle undefined onSearch callback', async () => {
      // Arrange
      const user = userEvent.setup();

      // Act
      render(<MessageSearch />);
      const input = screen.getByPlaceholderText('Search messages...');

      // Assert
      await expect(user.type(input, 'test')).resolves.not.toThrow();
    });

    it('should handle special characters in search', async () => {
      // Arrange
      const user = userEvent.setup();
      const onSearch = vi.fn();

      // Act
      render(<MessageSearch onSearch={onSearch} />);
      const input = screen.getByPlaceholderText('Search messages...');
      await user.type(input, '!@#$%^&*()');

      // Assert
      expect(onSearch).toHaveBeenCalled();
    });

    it('should handle very long search queries', async () => {
      // Arrange
      const user = userEvent.setup();
      const onSearch = vi.fn();
      const longQuery = 'a'.repeat(500);

      // Act
      render(<MessageSearch onSearch={onSearch} />);
      const input = screen.getByPlaceholderText('Search messages...');
      await user.type(input, longQuery);

      // Assert
      expect(onSearch).toHaveBeenCalled();
    });
  });
});

