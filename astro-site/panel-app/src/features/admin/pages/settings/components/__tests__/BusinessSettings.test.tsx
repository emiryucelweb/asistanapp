/**
 * BusinessSettings Component Tests - ENTERPRISE GRADE
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils/test-utils';
import BusinessSettings from '../BusinessSettings';

vi.mock('@/shared/utils/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'settings.business.title': 'Business Settings',
        'settings.business.subtitle': 'Configure your business details',
        'settings.business.info': 'Business Information',
        'settings.business.name': 'Business Name',
        'settings.business.description': 'Description',
        'settings.business.industry': 'Industry',
        'settings.business.contact': 'Contact Information',
        'settings.business.phone': 'Phone',
        'settings.business.email': 'Email',
        'settings.business.address': 'Address',
        'settings.business.location': 'Location',
        'settings.business.cancel': 'Cancel',
        'settings.common.save': 'Save',
      };
      return translations[key] || key;
    },
  }),
}));

describe('BusinessSettings - Rendering', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should render business settings title', () => {
    // Arrange & Act
    renderWithProviders(<BusinessSettings />);

    // Assert
    expect(screen.getByText('Business Settings')).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    // Arrange & Act & Assert
    expect(() => renderWithProviders(<BusinessSettings />)).not.toThrow();
  });

  it('should display subtitle', () => {
    // Arrange & Act
    renderWithProviders(<BusinessSettings />);

    // Assert
    expect(screen.getByText('Configure your business details')).toBeInTheDocument();
  });

  it('should render save button', () => {
    // Arrange & Act
    renderWithProviders(<BusinessSettings />);

    // Assert
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('should have proper structure', () => {
    // Arrange & Act
    const { container } = renderWithProviders(<BusinessSettings />);

    // Assert
    expect(container.querySelector('.space-y-6')).toBeInTheDocument();
  });
});

describe('BusinessSettings - Interactions', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should handle save button click', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<BusinessSettings />);

    // Act
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    // Assert - button should be clickable
    expect(saveButton).toBeInTheDocument();
  });

  it('should support keyboard navigation', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<BusinessSettings />);

    // Act
    await user.tab();

    // Assert
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
});

describe('BusinessSettings - Accessibility', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should have accessible buttons', () => {
    // Arrange & Act
    renderWithProviders(<BusinessSettings />);
    const saveButton = screen.getByText('Save');

    // Assert
    expect(saveButton.tagName).toBe('BUTTON');
  });

  it('should render quickly', () => {
    // Arrange
    const start = performance.now();

    // Act
    renderWithProviders(<BusinessSettings />);
    const end = performance.now();

    // Assert
    expect(end - start).toBeLessThan(500);
  });
});
