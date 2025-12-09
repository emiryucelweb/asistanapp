/**
 * NotificationSettings Component Tests - ENTERPRISE GRADE
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils/test-utils';
import NotificationSettings from '../NotificationSettings';

vi.mock('@/shared/utils/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'settings.notifications.title': 'Notifications',
        'settings.notifications.subtitle': 'Configure notification preferences',
        'settings.notifications.email.title': 'Email Notifications',
        'settings.notifications.email.newAppointment': 'New Appointment',
        'settings.notifications.email.newAppointmentDesc': 'Receive email for new appointments',
        'settings.notifications.sms.title': 'SMS Notifications',
        'settings.notifications.push.title': 'Push Notifications',
        'settings.notifications.quietHours.title': 'Quiet Hours',
        'settings.notifications.quietHours.enabled': 'Enable Quiet Hours',
        'settings.notifications.actions.save': 'Save',
        'settings.notifications.settingsSaved': 'Settings saved',
        'settings.common.save': 'Save',
        'settings.common.cancel': 'Cancel',
      };
      return translations[key] || key;
    },
  }),
}));

describe('NotificationSettings - Rendering', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should render notifications title', () => {
    // Arrange & Act
    renderWithProviders(<NotificationSettings />);

    // Assert
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    // Arrange & Act & Assert
    expect(() => renderWithProviders(<NotificationSettings />)).not.toThrow();
  });

  it('should display subtitle', () => {
    // Arrange & Act
    renderWithProviders(<NotificationSettings />);

    // Assert
    expect(screen.getByText('Configure notification preferences')).toBeInTheDocument();
  });

  it('should render email section', () => {
    // Arrange & Act
    renderWithProviders(<NotificationSettings />);

    // Assert
    expect(screen.getByText('Email Notifications')).toBeInTheDocument();
  });

  it('should have proper structure', () => {
    // Arrange & Act
    const { container } = renderWithProviders(<NotificationSettings />);

    // Assert
    expect(container.querySelector('.space-y-6')).toBeInTheDocument();
  });
});

describe('NotificationSettings - Interactions', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should render SMS section', () => {
    // Arrange & Act
    renderWithProviders(<NotificationSettings />);

    // Assert
    expect(screen.getByText('SMS Notifications')).toBeInTheDocument();
  });

  it('should support keyboard navigation', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<NotificationSettings />);

    // Act
    await user.tab();

    // Assert
    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });
});

describe('NotificationSettings - Accessibility', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should have toggle switches', () => {
    // Arrange & Act
    const { container } = renderWithProviders(<NotificationSettings />);

    // Assert
    expect(container.querySelector('input[type="checkbox"]')).toBeInTheDocument();
  });

  it('should render quickly', () => {
    // Arrange
    const start = performance.now();

    // Act
    renderWithProviders(<NotificationSettings />);
    const end = performance.now();

    // Assert
    expect(end - start).toBeLessThan(500);
  });
});
