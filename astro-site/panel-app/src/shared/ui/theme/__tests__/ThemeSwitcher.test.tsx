/**
 * ThemeSwitcher Component Tests
 * 
 * @group ui
 * @group theme
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import ThemeSwitcher from '../ThemeSwitcher';
import { useThemeStore } from '@/shared/stores/theme-store';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'theme.switchToLight': 'Açık Temaya Geç',
        'theme.switchToDark': 'Koyu Temaya Geç',
      };
      return translations[key] || key;
    },
    i18n: { language: 'tr' },
  }),
}));

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset theme store before each test
    useThemeStore.setState({ theme: 'light' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('renders correctly', () => {
    render(<ThemeSwitcher />);
    const button = screen.getByRole('switch');
    expect(button).toBeInTheDocument();
  });

  it('shows correct icon for light theme', () => {
    render(<ThemeSwitcher />);
    const button = screen.getByLabelText('Koyu Temaya Geç');
    expect(button).toBeInTheDocument();
  });

  it('toggles theme on click', () => {
    render(<ThemeSwitcher />);
    const button = screen.getByRole('switch');
    
    // Initial state: light
    expect(useThemeStore.getState().theme).toBe('light');
    
    // Click to toggle
    fireEvent.click(button);
    
    // Should be dark now
    expect(useThemeStore.getState().theme).toBe('dark');
  });

  it('has correct ARIA attributes', () => {
    render(<ThemeSwitcher />);
    const button = screen.getByRole('switch');
    
    expect(button).toHaveAttribute('aria-label');
    expect(button).toHaveAttribute('aria-pressed');
  });

  // Error Handling Tests
  describe('Error Handling', () => {
    it('should handle rapid theme toggles', () => {
      // Arrange
      render(<ThemeSwitcher />);
      const button = screen.getByRole('switch');
      
      // Act - Rapid clicks
      for (let i = 0; i < 10; i++) {
        fireEvent.click(button);
      }
      
      // Assert - Should not crash
      expect(button).toBeInTheDocument();
    });

    it('should maintain button state after toggle', () => {
      // Arrange
      render(<ThemeSwitcher />);
      const button = screen.getByRole('switch');
      
      // Act
      fireEvent.click(button);
      
      // Assert
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    it('should be keyboard accessible', () => {
      // Arrange
      render(<ThemeSwitcher />);
      const button = screen.getByRole('switch');
      
      // Act - Focus the button
      button.focus();
      expect(button).toHaveFocus();
      
      // Assert - Button should be focusable and clickable (role="switch" indicates toggleable)
      expect(button).toHaveAttribute('role', 'switch');
    });

    it('should have visible focus indicator', () => {
      // Arrange
      render(<ThemeSwitcher />);
      const button = screen.getByRole('switch');
      
      // Act
      button.focus();
      
      // Assert
      expect(button).toHaveFocus();
    });
  });
});

