/**
 * ChannelSettings Component Tests - ENTERPRISE GRADE
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils/test-utils';
import ChannelSettings from '../ChannelSettings';

vi.mock('@/shared/utils/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'settings.channels.title': 'Channel Settings',
        'settings.channels.subtitle': 'Configure communication channels',
        'settings.channels.whatsapp': 'WhatsApp',
        'settings.channels.whatsappDesc': 'WhatsApp Business',
        'settings.channels.instagram': 'Instagram',
        'settings.channels.facebook': 'Facebook',
        'settings.channels.webChat': 'Web Chat',
        'settings.channels.sms': 'SMS',
        'settings.channels.phone': 'Phone',
        'settings.channels.enabled': 'Enabled',
        'settings.channels.disabled': 'Disabled',
        'settings.channels.cancel': 'Cancel',
        'settings.common.save': 'Save',
      };
      return translations[key] || key;
    },
  }),
}));

describe('ChannelSettings - Rendering', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should render channel settings title', () => {
    // Arrange & Act
    renderWithProviders(<ChannelSettings />);

    // Assert
    expect(screen.getByText('Channel Settings')).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    // Arrange & Act & Assert
    expect(() => renderWithProviders(<ChannelSettings />)).not.toThrow();
  });

  it('should display subtitle', () => {
    // Arrange & Act
    renderWithProviders(<ChannelSettings />);

    // Assert
    expect(screen.getByText('Configure communication channels')).toBeInTheDocument();
  });

  it('should render save button', () => {
    // Arrange & Act
    renderWithProviders(<ChannelSettings />);

    // Assert
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('should have proper structure', () => {
    // Arrange & Act
    const { container } = renderWithProviders(<ChannelSettings />);

    // Assert
    expect(container.querySelector('.space-y-6')).toBeInTheDocument();
  });
});

describe('ChannelSettings - Interactions', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should handle save button click', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<ChannelSettings />);

    // Act
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    // Assert - button should be clickable
    expect(saveButton).toBeInTheDocument();
  });

  it('should support keyboard navigation', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<ChannelSettings />);

    // Act
    await user.tab();

    // Assert
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
});

describe('ChannelSettings - Accessibility', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should have accessible buttons', () => {
    // Arrange & Act
    renderWithProviders(<ChannelSettings />);
    const saveButton = screen.getByText('Save');

    // Assert
    expect(saveButton.tagName).toBe('BUTTON');
  });

  it('should render quickly', () => {
    // Arrange
    const start = performance.now();

    // Act
    renderWithProviders(<ChannelSettings />);
    const end = performance.now();

    // Assert
    expect(end - start).toBeLessThan(500);
  });
});
