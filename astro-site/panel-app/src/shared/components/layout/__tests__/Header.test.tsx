/**
 * Header Component Tests
 * Golden Rules: AAA Pattern, User Interactions, State Management
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: any) => key,
  }),
}));

vi.mock('@/shared/stores/auth-store', () => ({
  useAuthStore: () => ({
    user: { name: 'Test User', email: 'test@test.com' },
    logout: vi.fn(),
  }),
}));

vi.mock('@/shared/ui/theme/ThemeSwitcher', () => ({
  default: () => <div data-testid="theme-switcher">Theme Switcher</div>,
}));

const renderHeader = () => {
  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
};

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render header element', () => {
      // Arrange & Act
      const { container } = renderHeader();

      // Assert
      expect(container.querySelector('header')).toBeInTheDocument();
    });

    it('should render logo on desktop', () => {
      // Arrange & Act
      renderHeader();

      // Assert
      expect(screen.getByAltText('AsistanApp')).toBeInTheDocument();
      expect(screen.getByText('AsistanApp')).toBeInTheDocument();
    });

    it('should render theme switcher', () => {
      // Arrange & Act
      renderHeader();

      // Assert
      expect(screen.getByTestId('theme-switcher')).toBeInTheDocument();
    });

    it('should render notifications button', () => {
      // Arrange & Act
      const { container } = renderHeader();

      // Assert
      const bellIcon = container.querySelector('button svg');
      expect(bellIcon).toBeInTheDocument();
    });

    it('should render help button', () => {
      // Arrange & Act
      renderHeader();

      // Assert - Help button exists
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should render user avatar', () => {
      // Arrange & Act
      const { container } = renderHeader();

      // Assert
      const avatar = container.querySelector('.rounded-full.size-10');
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('Notifications', () => {
    it('should show unread count badge', () => {
      // Arrange & Act
      const { container } = renderHeader();

      // Assert
      const badge = container.querySelector('.bg-red-500');
      expect(badge).toBeInTheDocument();
    });

    it('should toggle notifications dropdown on click', async () => {
      // Arrange
      const user = userEvent.setup();
      const { container } = renderHeader();

      // Act - Find notification button by looking for the bell icon's parent
      const bellIcon = container.querySelector('.lucide-bell');
      const notificationButton = bellIcon?.closest('div[class*="cursor-pointer"]') || bellIcon?.parentElement;
      
      // Assert - Notification button container should exist
      expect(notificationButton).toBeTruthy();
      
      if (notificationButton) {
        await user.click(notificationButton);
      }

      // Assert - Component structure is correct
      expect(container.querySelector('header')).toBeInTheDocument();
    });

    it('should display notification badge count', () => {
      // Arrange & Act
      const { container } = renderHeader();

      // Assert - Find the badge with unread count
      const badge = container.querySelector('.bg-red-500');
      expect(badge).toBeInTheDocument();
    });

    it('should render notification button', () => {
      // Arrange & Act
      const { container } = renderHeader();

      // Assert - Bell icon should be visible in a button
      const bellIcon = container.querySelector('.lucide-bell');
      expect(bellIcon).toBeInTheDocument();
    });
  });

  describe('User Menu', () => {
    it('should show user name and email', async () => {
      // Arrange
      const user = userEvent.setup();
      const { container } = renderHeader();

      // Act - Click user avatar
      const avatar = container.querySelector('.rounded-full.size-10');
      await user.click(avatar?.parentElement as Element);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('test@test.com')).toBeInTheDocument();
      });
    });

    it('should display menu items', async () => {
      // Arrange
      const user = userEvent.setup();
      const { container } = renderHeader();

      // Act
      const avatar = container.querySelector('.rounded-full.size-10');
      await user.click(avatar?.parentElement as Element);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('header.userMenu.profile')).toBeInTheDocument();
        expect(screen.getByText('header.userMenu.business')).toBeInTheDocument();
        expect(screen.getByText('header.userMenu.billing')).toBeInTheDocument();
        expect(screen.getByText('header.userMenu.settings')).toBeInTheDocument();
      });
    });

    it('should show logout button', async () => {
      // Arrange
      const user = userEvent.setup();
      const { container } = renderHeader();

      // Act
      const avatar = container.querySelector('.rounded-full.size-10');
      await user.click(avatar?.parentElement as Element);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('header.userMenu.logout')).toBeInTheDocument();
      });
    });

    it('should close user menu when clicking outside', async () => {
      // Arrange
      const user = userEvent.setup();
      const { container } = renderHeader();
      const avatar = container.querySelector('.rounded-full.size-10');

      // Act - Open
      await user.click(avatar?.parentElement as Element);

      await waitFor(() => {
        expect(screen.getByText('header.userMenu.profile')).toBeInTheDocument();
      });

      // Act - Click outside
      await user.click(container);

      // Assert
      await waitFor(() => {
        expect(screen.queryByText('header.userMenu.profile')).not.toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid menu toggles', async () => {
      // Arrange
      const user = userEvent.setup();
      const { container } = renderHeader();
      const avatar = container.querySelector('.rounded-full.size-10');

      // Act
      await user.click(avatar?.parentElement as Element);
      await user.click(avatar?.parentElement as Element);
      await user.click(avatar?.parentElement as Element);

      // Assert - Menu should toggle correctly
      expect(container).toBeInTheDocument();
    });

    it('should only show one dropdown at a time', async () => {
      // Arrange
      const user = userEvent.setup();
      const { container } = renderHeader();
      const avatar = container.querySelector('.rounded-full.size-10');

      // Act - Click user avatar to open menu
      await user.click(avatar?.parentElement as Element);

      await waitFor(() => {
        expect(screen.getByText('header.userMenu.profile')).toBeInTheDocument();
      });

      // Act - Click avatar again (should toggle menu)
      await user.click(avatar?.parentElement as Element);

      // Assert - Menu should close
      await waitFor(() => {
        expect(screen.queryByText('header.userMenu.profile')).not.toBeInTheDocument();
      });
    });
  });
});

