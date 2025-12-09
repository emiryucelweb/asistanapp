/**
 * FormInput Component Tests
 * Coverage Target: 14% → 70%
 * Golden Rules: AAA Pattern, User Interactions, Validation, Edge Cases
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormInput, FormTextarea, FormSelect } from '../FormInput';

describe('FormInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Rule 1: Component Rendering
  describe('Rendering', () => {
    it('should render basic input', () => {
      // Arrange & Act
      render(<FormInput placeholder="Enter text" />);

      // Assert
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should render with label', () => {
      // Arrange & Act
      render(<FormInput label="Username" />);

      // Assert
      expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('should render with required indicator', () => {
      // Arrange & Act
      render(<FormInput label="Email" required />);

      // Assert
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should render with icon', () => {
      // Arrange
      const icon = <span data-testid="icon">🔍</span>;

      // Act
      render(<FormInput icon={icon} />);

      // Assert
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('should apply icon padding class', () => {
      // Arrange
      const icon = <span>🔍</span>;

      // Act
      render(<FormInput icon={icon} data-testid="input" />);

      // Assert
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('pl-10');
    });
  });

  // Rule 2: User Interactions
  describe('User Interactions', () => {
    it('should handle text input', async () => {
      // Arrange
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<FormInput onChange={onChange} />);

      // Act
      const input = screen.getByRole('textbox');
      await user.type(input, 'Hello World');

      // Assert
      expect(input).toHaveValue('Hello World');
      expect(onChange).toHaveBeenCalled();
    });

    it('should handle clear and retype', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FormInput defaultValue="Initial" />);

      // Act
      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'New Value');

      // Assert
      expect(input).toHaveValue('New Value');
    });

    it('should be disabled when disabled prop is true', () => {
      // Arrange & Act
      render(<FormInput disabled />);

      // Assert
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('should not accept input when disabled', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FormInput disabled defaultValue="Locked" />);

      // Act
      const input = screen.getByRole('textbox');
      await user.type(input, 'Try to type');

      // Assert
      expect(input).toHaveValue('Locked');
    });

    it('should handle blur event', async () => {
      // Arrange
      const user = userEvent.setup();
      const onBlur = vi.fn();
      render(<FormInput onBlur={onBlur} />);

      // Act
      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab();

      // Assert
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('should handle focus event', async () => {
      // Arrange
      const user = userEvent.setup();
      const onFocus = vi.fn();
      render(<FormInput onFocus={onFocus} />);

      // Act
      const input = screen.getByRole('textbox');
      await user.click(input);

      // Assert
      expect(onFocus).toHaveBeenCalledTimes(1);
    });
  });

  // Rule 4: Error Handling
  describe('Error State', () => {
    it('should display error message', () => {
      // Arrange & Act
      render(<FormInput error="This field is required" />);

      // Assert
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should show error icon when error is present', () => {
      // Arrange & Act
      const { container } = render(<FormInput error="Invalid input" />);

      // Assert
      expect(screen.getByText('Invalid input')).toBeInTheDocument();
      const errorIcon = container.querySelector('.text-red-500');
      expect(errorIcon).toBeInTheDocument();
    });

    it('should apply error border class', () => {
      // Arrange & Act
      render(<FormInput error="Error" data-testid="input" />);

      // Assert
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('border-red-300');
    });

    it('should not show helperText when error is present', () => {
      // Arrange & Act
      render(<FormInput error="Error message" helperText="Helper text" />);

      // Assert
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });
  });

  // Rule 4: Success State
  describe('Success State', () => {
    it('should display success message', () => {
      // Arrange & Act
      render(<FormInput success="Valid email" />);

      // Assert
      expect(screen.getByText('Valid email')).toBeInTheDocument();
    });

    it('should show success icon when success is present', () => {
      // Arrange & Act
      const { container } = render(<FormInput success="Valid" />);

      // Assert
      const successIcon = container.querySelector('.text-green-500');
      expect(successIcon).toBeInTheDocument();
    });

    it('should apply success border class', () => {
      // Arrange & Act
      render(<FormInput success="Success" data-testid="input" />);

      // Assert
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('border-green-300');
    });

    it('should not show helperText when success is present', () => {
      // Arrange & Act
      render(<FormInput success="Success message" helperText="Helper text" />);

      // Assert
      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });
  });

  // Helper Text
  describe('Helper Text', () => {
    it('should display helper text', () => {
      // Arrange & Act
      render(<FormInput helperText="Enter your email address" />);

      // Assert
      expect(screen.getByText('Enter your email address')).toBeInTheDocument();
    });

    it('should show helper text when no error or success', () => {
      // Arrange & Act
      render(<FormInput helperText="Format: name@example.com" />);

      // Assert
      expect(screen.getByText('Format: name@example.com')).toBeInTheDocument();
    });
  });

  // Rule 9: Edge Cases
  describe('Edge Cases', () => {
    it('should handle empty input', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FormInput />);

      // Act
      const input = screen.getByRole('textbox');
      await user.type(input, '   ');
      await user.clear(input);

      // Assert
      expect(input).toHaveValue('');
    });

    it('should handle very long input', async () => {
      // Arrange
      const user = userEvent.setup();
      const longText = 'a'.repeat(1000);
      render(<FormInput />);

      // Act
      const input = screen.getByRole('textbox');
      await user.type(input, longText);

      // Assert
      expect(input).toHaveValue(longText);
    });

    it('should handle special characters', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FormInput />);

      // Act
      const input = screen.getByRole('textbox');
      await user.type(input, '!@#$%^&*()_+');

      // Assert
      expect(input).toHaveValue('!@#$%^&*()_+');
    });

    it('should handle rapid typing', async () => {
      // Arrange
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<FormInput onChange={onChange} />);

      // Act
      const input = screen.getByRole('textbox');
      await user.type(input, 'Fast typing test', { delay: 1 });

      // Assert
      expect(input).toHaveValue('Fast typing test');
      expect(onChange).toHaveBeenCalled();
    });

    it('should apply custom className', () => {
      // Arrange & Act
      render(<FormInput className="custom-class" data-testid="input" />);

      // Assert
      const input = screen.getByTestId('input');
      expect(input).toHaveClass('custom-class');
    });

    it('should pass through HTML input attributes', () => {
      // Arrange & Act
      render(
        <FormInput
          type="email"
          placeholder="email@example.com"
          maxLength={50}
          data-testid="input"
        />
      );

      // Assert
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('placeholder', 'email@example.com');
      expect(input).toHaveAttribute('maxLength', '50');
    });
  });
});

describe('FormTextarea', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render textarea', () => {
      // Arrange & Act
      render(<FormTextarea placeholder="Enter description" />);

      // Assert
      expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
    });

    it('should render with label', () => {
      // Arrange & Act
      render(<FormTextarea label="Description" />);

      // Assert
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('should render with required indicator', () => {
      // Arrange & Act
      render(<FormTextarea label="Message" required />);

      // Assert
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle text input', async () => {
      // Arrange
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<FormTextarea onChange={onChange} />);

      // Act
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Multi-line\ntext input');

      // Assert
      expect(textarea).toHaveValue('Multi-line\ntext input');
      expect(onChange).toHaveBeenCalled();
    });

    it('should be disabled when disabled prop is true', () => {
      // Arrange & Act
      render(<FormTextarea disabled />);

      // Assert
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeDisabled();
    });
  });

  describe('Validation States', () => {
    it('should display error message', () => {
      // Arrange & Act
      render(<FormTextarea error="Description is required" />);

      // Assert
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });

    it('should display success message', () => {
      // Arrange & Act
      render(<FormTextarea success="Looks good!" />);

      // Assert
      expect(screen.getByText('Looks good!')).toBeInTheDocument();
    });

    it('should display helper text', () => {
      // Arrange & Act
      render(<FormTextarea helperText="Maximum 500 characters" />);

      // Assert
      expect(screen.getByText('Maximum 500 characters')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiline input', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FormTextarea />);

      // Act
      const textarea = screen.getByRole('textbox');
      await user.type(textarea, 'Line 1{Enter}Line 2{Enter}Line 3');

      // Assert
      expect(textarea.value).toContain('Line 1');
      expect(textarea.value).toContain('Line 2');
      expect(textarea.value).toContain('Line 3');
    });

    it('should apply custom className', () => {
      // Arrange & Act
      render(<FormTextarea className="custom-textarea" data-testid="textarea" />);

      // Assert
      const textarea = screen.getByTestId('textarea');
      expect(textarea).toHaveClass('custom-textarea');
    });
  });
});

describe('FormSelect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render select with options', () => {
      // Arrange & Act
      render(
        <FormSelect>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </FormSelect>
      );

      // Assert
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('should render with label', () => {
      // Arrange & Act
      render(
        <FormSelect label="Choose option">
          <option value="">Select...</option>
        </FormSelect>
      );

      // Assert
      expect(screen.getByText('Choose option')).toBeInTheDocument();
    });

    it('should render with required indicator', () => {
      // Arrange & Act
      render(
        <FormSelect label="Category" required>
          <option value="">Select...</option>
        </FormSelect>
      );

      // Assert
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle option selection', async () => {
      // Arrange
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <FormSelect onChange={onChange}>
          <option value="">Select...</option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </FormSelect>
      );

      // Act
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, '2');

      // Assert
      expect(select).toHaveValue('2');
      expect(onChange).toHaveBeenCalled();
    });

    it('should be disabled when disabled prop is true', () => {
      // Arrange & Act
      render(
        <FormSelect disabled>
          <option value="">Select...</option>
        </FormSelect>
      );

      // Assert
      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
    });

    it('should handle default value', () => {
      // Arrange & Act
      render(
        <FormSelect defaultValue="2">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </FormSelect>
      );

      // Assert
      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('2');
    });
  });

  describe('Validation States', () => {
    it('should display error message', () => {
      // Arrange & Act
      render(
        <FormSelect error="Please select an option">
          <option value="">Select...</option>
        </FormSelect>
      );

      // Assert
      expect(screen.getByText('Please select an option')).toBeInTheDocument();
    });

    it('should display success message', () => {
      // Arrange & Act
      render(
        <FormSelect success="Valid selection">
          <option value="1">Option 1</option>
        </FormSelect>
      );

      // Assert
      expect(screen.getByText('Valid selection')).toBeInTheDocument();
    });

    it('should display helper text', () => {
      // Arrange & Act
      render(
        <FormSelect helperText="Choose your preferred option">
          <option value="">Select...</option>
        </FormSelect>
      );

      // Assert
      expect(screen.getByText('Choose your preferred option')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple options', async () => {
      // Arrange
      const user = userEvent.setup();
      render(
        <FormSelect>
          {Array.from({ length: 50 }, (_, i) => (
            <option key={i} value={i.toString()}>
              Option {i}
            </option>
          ))}
        </FormSelect>
      );

      // Act
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, '25');

      // Assert
      expect(select).toHaveValue('25');
    });

    it('should apply custom className', () => {
      // Arrange & Act
      render(
        <FormSelect className="custom-select" data-testid="select">
          <option value="">Select...</option>
        </FormSelect>
      );

      // Assert
      const select = screen.getByTestId('select');
      expect(select).toHaveClass('custom-select');
    });
  });
});

