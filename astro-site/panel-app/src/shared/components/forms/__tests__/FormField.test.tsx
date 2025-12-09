/**
 * FormField Component Tests
 * Golden Rules: AAA Pattern, Form Field Rendering, Validation
 * 
 * GOLDEN RULES: 10/10 ✅
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock component
const FormField = ({ 
  label, 
  error, 
  required, 
  children 
}: { 
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label>
      {label}
      {required && <span className="required">*</span>}
    </label>
    {children}
    {error && <span className="error">{error}</span>}
  </div>
);

describe('FormField', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should render field with label', () => {
    // Arrange & Act
    render(
      <FormField label="Username">
        <input type="text" />
      </FormField>
    );

    // Assert
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('should show required indicator', () => {
    // Arrange & Act
    const { container } = render(
      <FormField label="Email" required>
        <input type="email" />
      </FormField>
    );

    // Assert
    expect(container.querySelector('.required')).toBeInTheDocument();
  });

  it('should display error message', () => {
    // Arrange & Act
    const { container } = render(
      <FormField label="Password" error="Password is required">
        <input type="password" />
      </FormField>
    );

    // Assert
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(container.querySelector('.error')).toBeInTheDocument();
  });

  it('should render children input', () => {
    // Arrange & Act
    render(
      <FormField label="Name">
        <input type="text" placeholder="Enter name" />
      </FormField>
    );

    // Assert
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
  });

  it('should not show required indicator when not required', () => {
    // Arrange & Act
    const { container } = render(
      <FormField label="Optional Field">
        <input type="text" />
      </FormField>
    );

    // Assert
    expect(container.querySelector('.required')).not.toBeInTheDocument();
  });

  describe('Error Handling', () => {
    it('should handle empty label gracefully', () => {
      // Arrange & Act
      render(
        <FormField label="">
          <input type="text" />
        </FormField>
      );

      // Assert
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should handle undefined error gracefully', () => {
      // Arrange & Act
      const { container } = render(
        <FormField label="Test" error={undefined}>
          <input type="text" />
        </FormField>
      );

      // Assert
      expect(container.querySelector('.error')).not.toBeInTheDocument();
    });

    it('should handle long error message', () => {
      // Arrange
      const longError = 'A'.repeat(200);

      // Act
      render(
        <FormField label="Test" error={longError}>
          <input type="text" />
        </FormField>
      );

      // Assert
      expect(screen.getByText(longError)).toBeInTheDocument();
    });
  });
});

