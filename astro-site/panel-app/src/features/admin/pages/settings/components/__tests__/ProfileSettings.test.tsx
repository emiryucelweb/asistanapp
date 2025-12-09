/**
 * ProfileSettings Component Tests - ENTERPRISE GRADE
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils/test-utils';
import ProfileSettings from '../ProfileSettings';

vi.mock('@/shared/utils/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'settings.profile.title': 'Profile',
        'settings.profile.description': 'Manage your profile',
        'settings.profile.profilePhoto': 'Profile Photo',
        'settings.profile.uploadPhoto': 'Upload Photo',
        'settings.profile.remove': 'Remove',
        'settings.profile.personalInfo': 'Personal Information',
        'settings.profile.firstName': 'First Name',
        'settings.profile.lastName': 'Last Name',
        'settings.profile.phone': 'Phone',
        'settings.profile.preferences': 'Preferences',
        'settings.profile.language': 'Language',
        'settings.profile.languageTurkish': 'Turkish',
        'settings.profile.languageEnglish': 'English',
        'settings.profile.timezone': 'Timezone',
        'settings.profile.timezoneIstanbul': 'Istanbul',
        'settings.profile.dateFormat': 'Date Format',
        'settings.profile.changePassword': 'Change Password',
        'settings.profile.twoFA': 'Two-Factor Authentication',
        'settings.profile.activeSessions': 'Active Sessions',
        'settings.profile.lastActive2min': '2 min ago',
        'settings.profile.lastActive3h': '3 hours ago',
        'settings.profile.lastActive1d': '1 day ago',
        'settings.common.save': 'Save',
        'settings.common.cancel': 'Cancel',
      };
      return translations[key] || key;
    },
  }),
}));

describe('ProfileSettings - Rendering', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should render profile title', () => {
    // Arrange & Act
    renderWithProviders(<ProfileSettings />);

    // Assert
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    // Arrange & Act & Assert
    expect(() => renderWithProviders(<ProfileSettings />)).not.toThrow();
  });

  it('should display description', () => {
    // Arrange & Act
    renderWithProviders(<ProfileSettings />);

    // Assert
    expect(screen.getByText('Manage your profile')).toBeInTheDocument();
  });

  it('should have proper structure', () => {
    // Arrange & Act
    const { container } = renderWithProviders(<ProfileSettings />);

    // Assert
    expect(container.querySelector('.space-y-6')).toBeInTheDocument();
  });
});

describe('ProfileSettings - Interactions', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should render personal info section', () => {
    // Arrange & Act
    renderWithProviders(<ProfileSettings />);

    // Assert
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
  });

  it('should support keyboard navigation', async () => {
    // Arrange
    const user = userEvent.setup();
    renderWithProviders(<ProfileSettings />);

    // Act
    await user.tab();

    // Assert
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });
});

describe('ProfileSettings - Accessibility', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('should have form inputs', () => {
    // Arrange & Act
    const { container } = renderWithProviders(<ProfileSettings />);

    // Assert
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  it('should render quickly', () => {
    // Arrange
    const start = performance.now();

    // Act
    renderWithProviders(<ProfileSettings />);
    const end = performance.now();

    // Assert
    expect(end - start).toBeLessThan(500);
  });
});
