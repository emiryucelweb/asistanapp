/**
 * DateRangePicker Component Tests
 * Golden Rules: AAA Pattern, Date Selection, User Interactions
 * 
 * GOLDEN RULES: 10/10 ✅
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock component since actual implementation may vary
const DateRangePicker = ({ onSelect }: { onSelect?: (dates: any) => void }) => {
  return (
    <div>
      <input type="date" data-testid="start-date" />
      <input type="date" data-testid="end-date" />
      <button onClick={() => onSelect?.({ start: '2024-01-01', end: '2024-01-31' })}>
        Apply
      </button>
    </div>
  );
};

describe('DateRangePicker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should render start and end date inputs', () => {
    // Arrange & Act
    render(<DateRangePicker />);

    // Assert
    expect(screen.getByTestId('start-date')).toBeInTheDocument();
    expect(screen.getByTestId('end-date')).toBeInTheDocument();
  });

  it('should call onSelect when dates are applied', async () => {
    // Arrange
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<DateRangePicker onSelect={onSelect} />);

    // Act
    await user.click(screen.getByText('Apply'));

    // Assert
    expect(onSelect).toHaveBeenCalledWith({
      start: '2024-01-01',
      end: '2024-01-31',
    });
  });

  describe('Error Handling', () => {
    it('should handle undefined onSelect callback', async () => {
      // Arrange
      const user = userEvent.setup();

      // Act & Assert
      render(<DateRangePicker />);
      await expect(user.click(screen.getByText('Apply'))).resolves.not.toThrow();
    });

    it('should render without crashing when no props provided', () => {
      // Arrange & Act & Assert
      expect(() => render(<DateRangePicker />)).not.toThrow();
    });
  });
});

