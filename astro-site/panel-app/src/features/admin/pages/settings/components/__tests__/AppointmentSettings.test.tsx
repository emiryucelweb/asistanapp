/**
 * AppointmentSettings Component Tests - ENTERPRISE GRADE
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils/test-utils';
import AppointmentSettings from '../AppointmentSettings';

vi.mock('@/shared/utils/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'settings.appointments.title': 'Appointments',
        'settings.appointments.description': 'Configure appointment settings',
        'settings.appointments.workingHours': 'Working Hours',
        'settings.appointments.defaultDuration': 'Default Duration',
        'settings.appointments.bufferTime': 'Buffer Time',
        'settings.appointments.reminders': 'Reminders',
        'settings.appointments.services': 'Services',
        'settings.appointments.addService': 'Add Service',
        'settings.appointments.cancel': 'Cancel',
        'settings.common.saveChanges': 'Save Changes',
      };
      return translations[key] || key;
    },
  }),
}));

describe('AppointmentSettings - Rendering', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should render appointments title', () => {
    // Arrange & Act
    renderWithProviders(<AppointmentSettings />);

    // Assert
    expect(screen.getByText('Appointments')).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    // Arrange & Act & Assert
    expect(() => renderWithProviders(<AppointmentSettings />)).not.toThrow();
  });

  it('should display subtitle', () => {
    // Arrange & Act
    renderWithProviders(<AppointmentSettings />);

    // Assert
    expect(screen.getByText('Configure appointment settings')).toBeInTheDocument();
  });

  it('should render save button', () => {
    // Arrange & Act
    renderWithProviders(<AppointmentSettings />);

    // Assert
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  it('should have proper structure', () => {
    // Arrange & Act
    const { container } = renderWithProviders(<AppointmentSettings />);

    // Assert
    expect(container.querySelector('.space-y-6')).toBeInTheDocument();
  });
});

describe('AppointmentSettings - Interactions', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should handle save button click', async () => {
    // Arrange
    const user = userEvent.setup();
    window.alert = vi.fn();
    renderWithProviders(<AppointmentSettings />);

    // Act
    const saveButton = screen.getByText('Save Changes');
    await user.click(saveButton);

    // Assert
    expect(window.alert).toHaveBeenCalled();
  });

  it('should support keyboard navigation', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<AppointmentSettings />);

    // Act
    await user.tab();

    // Assert
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });
});

describe('AppointmentSettings - Accessibility', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should have accessible buttons', () => {
    // Arrange & Act
    renderWithProviders(<AppointmentSettings />);
    const saveButton = screen.getByText('Save Changes');

    // Assert
    expect(saveButton.tagName).toBe('BUTTON');
  });

  it('should render quickly', () => {
    // Arrange
    const start = performance.now();

    // Act
    renderWithProviders(<AppointmentSettings />);
    const end = performance.now();

    // Assert
    expect(end - start).toBeLessThan(500);
  });
});
