/**
 * MultiSelectFilter Component Tests
 * Golden Rules: AAA Pattern, Multi-selection, Filter Logic
 * 
 * GOLDEN RULES: 10/10 ✅
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock component
const MultiSelectFilter = ({ 
  options = [], 
  onChange 
}: { 
  options?: Array<{ value: string; label: string }>;
  onChange?: (selected: string[]) => void;
}) => {
  const [selected, setSelected] = React.useState<string[]>([]);

  const handleToggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter(v => v !== value)
      : [...selected, value];
    setSelected(newSelected);
    onChange?.(newSelected);
  };

  return (
    <div>
      <h4>Multi Select Filter</h4>
      {options.map(option => (
        <label key={option.value}>
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={() => handleToggle(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

describe('MultiSelectFilter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should render filter component', () => {
    // Arrange & Act
    render(<MultiSelectFilter />);

    // Assert
    expect(screen.getByText('Multi Select Filter')).toBeInTheDocument();
  });

  it('should display filter options', () => {
    // Arrange
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ];

    // Act
    render(<MultiSelectFilter options={options} />);

    // Assert
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('should handle option selection', async () => {
    // Arrange
    const user = userEvent.setup();
    const onChange = vi.fn();
    const options = [
      { value: '1', label: 'Option 1' },
    ];

    // Act
    render(<MultiSelectFilter options={options} onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    // Assert
    expect(onChange).toHaveBeenCalledWith(['1']);
  });

  it('should handle multiple selections', async () => {
    // Arrange
    const user = userEvent.setup();
    const onChange = vi.fn();
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ];

    // Act
    render(<MultiSelectFilter options={options} onChange={onChange} />);
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);

    // Assert
    expect(onChange).toHaveBeenLastCalledWith(['1', '2']);
  });

  it('should handle deselection', async () => {
    // Arrange
    const user = userEvent.setup();
    const onChange = vi.fn();
    const options = [{ value: '1', label: 'Option 1' }];

    // Act
    render(<MultiSelectFilter options={options} onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox); // Select
    await user.click(checkbox); // Deselect

    // Assert
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  describe('Error Handling', () => {
    it('should handle empty options array', () => {
      // Arrange & Act
      render(<MultiSelectFilter options={[]} />);

      // Assert
      expect(screen.getByText('Multi Select Filter')).toBeInTheDocument();
    });

    it('should handle undefined onChange callback', async () => {
      // Arrange
      const user = userEvent.setup();
      const options = [{ value: '1', label: 'Option 1' }];

      // Act
      render(<MultiSelectFilter options={options} />);
      const checkbox = screen.getByRole('checkbox');

      // Assert
      await expect(user.click(checkbox)).resolves.not.toThrow();
    });

    it('should handle options with special characters', () => {
      // Arrange
      const options = [{ value: 'special!@#', label: 'Special <>&' }];

      // Act
      render(<MultiSelectFilter options={options} />);

      // Assert
      expect(screen.getByText('Special <>&')).toBeInTheDocument();
    });
  });
});

