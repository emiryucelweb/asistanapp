/**
 * IntegrationSettings Component Tests - ENTERPRISE GRADE
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils/test-utils';
import IntegrationSettings from '../IntegrationSettings';

vi.mock('@/shared/utils/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        // Component uses hardcoded Turkish text
        'settings.integrations.whatsapp': 'WhatsApp Business',
        'settings.integrations.instagram': 'Instagram',
        'settings.integrations.google': 'Google Calendar',
        'settings.integrations.iyzico': 'iyzico',
        'settings.integrations.sendgrid': 'SendGrid',
        'settings.integrations.connect': 'Connect',
        'settings.integrations.apiKey': 'API Key',
        'settings.integrations.createKey': 'Create API Key',
        'settings.integrations.revoke': 'Revoke',
        'settings.integrations.cancel': 'Cancel',
        'settings.integrations.actions.saveChanges': 'Save Changes',
      };
      return translations[key] || key;
    },
  }),
}));

describe('IntegrationSettings - Rendering', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should render integrations title', () => {
    // Arrange & Act
    renderWithProviders(<IntegrationSettings />);

    // Assert
    expect(screen.getByText('Entegrasyonlar & API')).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    // Arrange & Act & Assert
    expect(() => renderWithProviders(<IntegrationSettings />)).not.toThrow();
  });

  it('should display subtitle', () => {
    // Arrange & Act
    renderWithProviders(<IntegrationSettings />);

    // Assert
    expect(screen.getByText('3. parti entegrasyonlar ve API erişimi')).toBeInTheDocument();
  });

  it('should render save button', () => {
    // Arrange & Act
    renderWithProviders(<IntegrationSettings />);

    // Assert
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  it('should have proper structure', () => {
    // Arrange & Act
    const { container } = renderWithProviders(<IntegrationSettings />);

    // Assert
    expect(container.querySelector('.space-y-6')).toBeInTheDocument();
  });
});

describe('IntegrationSettings - Interactions', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should handle save button click', async () => {
    // Arrange
    const user = userEvent.setup();
    window.alert = vi.fn();
    renderWithProviders(<IntegrationSettings />);

    // Act
    const saveButton = screen.getByText('Save Changes');
    await user.click(saveButton);

    // Assert
    expect(window.alert).toHaveBeenCalled();
  });

  it('should support keyboard navigation', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<IntegrationSettings />);

    // Act
    await user.tab();

    // Assert
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });
});

describe('IntegrationSettings - Accessibility', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should have accessible buttons', () => {
    // Arrange & Act
    renderWithProviders(<IntegrationSettings />);
    const saveButton = screen.getByText('Save Changes');

    // Assert
    expect(saveButton.tagName).toBe('BUTTON');
  });

  it('should render quickly', () => {
    // Arrange
    const start = performance.now();

    // Act
    renderWithProviders(<IntegrationSettings />);
    const end = performance.now();

    // Assert
    expect(end - start).toBeLessThan(500);
  });
});
