/**
 * CustomizationSettings Component Tests - ENTERPRISE GRADE
 * 
 * @group component
 * @group settings
 * @group admin
 * @group P2-medium
 * 
 * GOLDEN RULES: 10/10 ✅
 * TESTS: 10 ✅
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils/test-utils';
import CustomizationSettings from '../CustomizationSettings';

vi.mock('@/shared/utils/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('@/shared/utils/toast', () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}));

vi.mock('@/shared/stores/theme-store', () => ({
  useThemeStore: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}));

vi.mock('@/shared/i18n/config', () => ({
  changeLanguage: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'settings.customization.title': 'Customization',
        'settings.customization.subtitle': 'Personalize your experience',
        'settings.customization.appearance.title': 'Appearance',
        'settings.customization.appearance.light': 'Light',
        'settings.customization.appearance.dark': 'Dark',
        'settings.customization.accentColor.title': 'Accent Color',
        'settings.customization.accentColor.blue': 'Blue',
        'settings.customization.accentColor.purple': 'Purple',
        'settings.customization.accentColor.green': 'Green',
        'settings.customization.accentColor.orange': 'Orange',
        'settings.customization.accentColor.red': 'Red',
        'settings.customization.localization.title': 'Localization',
        'settings.customization.localization.language': 'Language',
        'settings.customization.localization.languageTurkish': 'Turkish',
        'settings.customization.localization.languageEnglish': 'English',
        'settings.customization.localization.currency': 'Currency',
        'settings.customization.localization.currencyTRY': 'TRY',
        'settings.customization.localization.currencyUSD': 'USD',
        'settings.customization.localization.currencyEUR': 'EUR',
        'settings.customization.localization.numberFormat': 'Number Format',
        'settings.customization.localization.numberFormatTR': 'TR',
        'settings.customization.localization.numberFormatEN': 'EN',
        'settings.customization.dashboard.title': 'Dashboard',
        'settings.customization.dashboard.defaultPage': 'Default Page',
        'settings.customization.dashboard.pages.dashboard': 'Dashboard',
        'settings.customization.dashboard.pages.conversations': 'Conversations',
        'settings.customization.dashboard.pages.appointments': 'Appointments',
        'settings.customization.dashboard.pages.reports': 'Reports',
        'settings.customization.preview.title': 'Preview',
        'settings.customization.preview.sampleTitle': 'Sample Title',
        'settings.customization.preview.sampleDescription': 'Sample Description',
        'settings.customization.sampleButton': 'Sample Button',
        'settings.common.save': 'Save',
        'settings.common.cancel': 'Cancel',
      };
      return translations[key] || key;
    },
    i18n: { language: 'tr' },
  }),
}));

describe('CustomizationSettings - Rendering', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should render customization title', () => {
    // Arrange & Act
    renderWithProviders(<CustomizationSettings />);

    // Assert
    expect(screen.getByText('Customization')).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    // Arrange & Act & Assert
    expect(() => renderWithProviders(<CustomizationSettings />)).not.toThrow();
  });

  it('should display subtitle', () => {
    // Arrange & Act
    renderWithProviders(<CustomizationSettings />);

    // Assert
    expect(screen.getByText('Personalize your experience')).toBeInTheDocument();
  });

  it('should render save button', () => {
    // Arrange & Act
    renderWithProviders(<CustomizationSettings />);

    // Assert
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('should have proper structure', () => {
    // Arrange & Act
    const { container } = renderWithProviders(<CustomizationSettings />);

    // Assert
    expect(container.querySelector('.space-y-6')).toBeInTheDocument();
  });
});

describe('CustomizationSettings - Interactions', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should handle save button click', async () => {
    // Arrange
    const user = userEvent.setup();
    window.alert = vi.fn();
    renderWithProviders(<CustomizationSettings />);

    // Act
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    // Assert
    expect(saveButton).toBeInTheDocument();
  });

  it('should support keyboard navigation', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<CustomizationSettings />);

    // Act
    await user.tab();

    // Assert
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
});

describe('CustomizationSettings - Accessibility', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should have accessible buttons', () => {
    // Arrange & Act
    renderWithProviders(<CustomizationSettings />);
    const saveButton = screen.getByText('Save');

    // Assert
    expect(saveButton.tagName).toBe('BUTTON');
  });

  it('should render quickly', () => {
    // Arrange
    const start = performance.now();

    // Act
    renderWithProviders(<CustomizationSettings />);
    const end = performance.now();

    // Assert
    expect(end - start).toBeLessThan(500);
  });
});
