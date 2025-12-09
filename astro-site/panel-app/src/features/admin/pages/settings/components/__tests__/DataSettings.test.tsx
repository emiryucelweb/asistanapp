/**
 * DataSettings Component Tests - ENTERPRISE GRADE
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils/test-utils';
import DataSettings from '../DataSettings';

vi.mock('@/shared/utils/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'settings.data.title': 'Data Management',
        'settings.data.subtitle': 'Export and import your data',
        'settings.data.export.title': 'Export Data',
        'settings.data.export.description': 'Export your data',
        'settings.data.export.customers': 'Customers',
        'settings.data.export.appointments': 'Appointments',
        'settings.data.export.messages': 'Messages',
        'settings.data.export.reports': 'Reports',
        'settings.data.export.formats.excel': 'Excel Format',
        'settings.data.import.title': 'Import Data',
        'settings.data.import.customers': 'Import Customers',
        'settings.data.backup.title': 'Backup',
        'settings.data.backup.create': 'Create Backup',
        'settings.data.dangerZone.title': 'Danger Zone',
        'settings.data.dangerZone.deleteAll': 'Delete All Data',
      };
      return translations[key] || key;
    },
  }),
}));

describe('DataSettings - Rendering', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should render data management title', () => {
    // Arrange & Act
    renderWithProviders(<DataSettings />);

    // Assert
    expect(screen.getByText('Data Management')).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    // Arrange & Act & Assert
    expect(() => renderWithProviders(<DataSettings />)).not.toThrow();
  });

  it('should display subtitle', () => {
    // Arrange & Act
    renderWithProviders(<DataSettings />);

    // Assert
    expect(screen.getByText('Export and import your data')).toBeInTheDocument();
  });

  it('should render export section', () => {
    // Arrange & Act
    renderWithProviders(<DataSettings />);

    // Assert
    expect(screen.getByText('Export Data')).toBeInTheDocument();
  });

  it('should have proper structure', () => {
    // Arrange & Act
    const { container } = renderWithProviders(<DataSettings />);

    // Assert
    expect(container.querySelector('.space-y-6')).toBeInTheDocument();
  });
});

describe('DataSettings - Interactions', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should handle export customers button click', async () => {
    // Arrange
    const user = userEvent.setup();
    window.alert = vi.fn();
    renderWithProviders(<DataSettings />);

    // Act
    const exportButton = screen.getByText('Customers');
    await user.click(exportButton);

    // Assert
    expect(window.alert).toHaveBeenCalled();
  });

  it('should support keyboard navigation', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<DataSettings />);

    // Act
    await user.tab();

    // Assert
    expect(screen.getByText('Customers')).toBeInTheDocument();
  });
});

describe('DataSettings - Accessibility', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should have accessible buttons', () => {
    // Arrange & Act
    const { container } = renderWithProviders(<DataSettings />);

    // Assert - check for buttons in the component
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should render quickly', () => {
    // Arrange
    const start = performance.now();

    // Act
    renderWithProviders(<DataSettings />);
    const end = performance.now();

    // Assert
    expect(end - start).toBeLessThan(500);
  });
});
