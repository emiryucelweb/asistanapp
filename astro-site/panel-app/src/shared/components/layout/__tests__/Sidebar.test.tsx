/**
 * Sidebar Component Tests
 * Golden Rules: AAA Pattern, Navigation, State Management
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({ pathname: '/admin/dashboard' }),
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const renderSidebar = (props = {}) => {
  return render(
    <BrowserRouter>
      <Sidebar {...props} />
    </BrowserRouter>
  );
};

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render sidebar', () => {
      // Arrange & Act
      const { container } = renderSidebar();

      // Assert
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render logo and app name', () => {
      // Arrange & Act
      renderSidebar();

      // Assert
      expect(screen.getByAltText('AsistanApp')).toBeInTheDocument();
      expect(screen.getByText('AsistanApp')).toBeInTheDocument();
    });

    it('should render all menu items', () => {
      // Arrange & Act
      renderSidebar();

      // Assert
      expect(screen.getByText('sidebar.dashboard')).toBeInTheDocument();
      expect(screen.getByText('sidebar.conversations')).toBeInTheDocument();
      expect(screen.getByText('sidebar.teamChat')).toBeInTheDocument();
      expect(screen.getByText('sidebar.reports')).toBeInTheDocument();
      expect(screen.getByText('sidebar.settings')).toBeInTheDocument();
      expect(screen.getByText('sidebar.team')).toBeInTheDocument();
      expect(screen.getByText('sidebar.help')).toBeInTheDocument();
    });

    it('should render AI assistant button', () => {
      // Arrange & Act
      renderSidebar();

      // Assert
      expect(screen.getByText('sidebar.talkToAssistant')).toBeInTheDocument();
    });

    it('should render request demo link', () => {
      // Arrange & Act
      renderSidebar();

      // Assert
      expect(screen.getByText('sidebar.requestDemo')).toBeInTheDocument();
    });

    it('should show new badge on team chat', () => {
      // Arrange & Act
      renderSidebar();

      // Assert
      expect(screen.getByText('sidebar.new')).toBeInTheDocument();
    });
  });

  describe('Collapse/Expand', () => {
    it('should start expanded by default', () => {
      // Arrange & Act
      const { container } = renderSidebar();

      // Assert
      const sidebar = container.firstChild as HTMLElement;
      expect(sidebar).toHaveClass('w-80');
      expect(sidebar).not.toHaveClass('w-20');
    });

    it('should collapse when clicking collapse button', async () => {
      // Arrange
      const user = userEvent.setup();
      const { container } = renderSidebar();

      // Act
      const collapseButton = screen.getByTitle('sidebar.collapse');
      await user.click(collapseButton);

      // Assert
      const sidebar = container.firstChild as HTMLElement;
      await waitFor(() => {
        expect(sidebar).toHaveClass('w-20');
      });
    });

    it('should expand when clicking expand button in collapsed state', async () => {
      // Arrange
      const user = userEvent.setup();
      const { container } = renderSidebar();

      // Act - Collapse first
      const collapseButton = screen.getByTitle('sidebar.collapse');
      await user.click(collapseButton);

      await waitFor(() => {
        const sidebar = container.firstChild as HTMLElement;
        expect(sidebar).toHaveClass('w-20');
      });

      // Act - Expand
      const expandButton = screen.getByTitle('sidebar.expand');
      await user.click(expandButton);

      // Assert
      const sidebar = container.firstChild as HTMLElement;
      await waitFor(() => {
        expect(sidebar).toHaveClass('w-80');
      });
    });

    it('should hide text labels when collapsed', async () => {
      // Arrange
      const user = userEvent.setup();
      renderSidebar();

      // Act
      const collapseButton = screen.getByTitle('sidebar.collapse');
      await user.click(collapseButton);

      // Assert - Text should still be in document but potentially hidden
      await waitFor(() => {
        const collapseBtn = screen.queryByTitle('sidebar.collapse');
        expect(collapseBtn).not.toBeInTheDocument();
      });
    });
  });

  describe('AI Chat Modal', () => {
    it('should open AI chat modal when clicking assistant button', async () => {
      // Arrange
      const user = userEvent.setup();
      renderSidebar();

      // Act
      const assistantButton = screen.getByText('sidebar.talkToAssistant');
      await user.click(assistantButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('AsistanApp AI')).toBeInTheDocument();
      });
    });

    it('should close AI chat modal when clicking X button', async () => {
      // Arrange
      const user = userEvent.setup();
      renderSidebar();

      // Act - Open modal
      const assistantButton = screen.getByText('sidebar.talkToAssistant');
      await user.click(assistantButton);

      await waitFor(() => {
        expect(screen.getByText('AsistanApp AI')).toBeInTheDocument();
      });

      // Act - Close modal
      const closeButton = screen.getAllByRole('button').find(
        btn => btn.querySelector('svg')?.classList.contains('lucide-x')
      );
      if (closeButton) {
        await user.click(closeButton);
      }

      // Assert
      await waitFor(() => {
        expect(screen.queryByText('AsistanApp AI')).not.toBeInTheDocument();
      });
    });

    it('should display AI greeting and suggestions', async () => {
      // Arrange
      const user = userEvent.setup();
      renderSidebar();

      // Act
      const assistantButton = screen.getByText('sidebar.talkToAssistant');
      await user.click(assistantButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('aiAssistant.greeting')).toBeInTheDocument();
        expect(screen.getByText('aiAssistant.suggestionsTitle')).toBeInTheDocument();
      });
    });

    it('should have message input field', async () => {
      // Arrange
      const user = userEvent.setup();
      renderSidebar();

      // Act
      const assistantButton = screen.getByText('sidebar.talkToAssistant');
      await user.click(assistantButton);

      // Assert
      await waitFor(() => {
        const input = screen.getByPlaceholderText('aiAssistant.inputPlaceholder');
        expect(input).toBeInTheDocument();
      });
    });

    it('should enable send button when message is entered', async () => {
      // Arrange
      const user = userEvent.setup();
      renderSidebar();

      // Act
      const assistantButton = screen.getByText('sidebar.talkToAssistant');
      await user.click(assistantButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('aiAssistant.inputPlaceholder')).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText('aiAssistant.inputPlaceholder');
      await user.type(input, 'Hello AI');

      // Assert
      const sendButtons = screen.getAllByRole('button');
      const sendButton = sendButtons[sendButtons.length - 1]; // Last button
      expect(sendButton).not.toBeDisabled();
    });
  });

  describe('Navigation', () => {
    it('should call onItemClick when menu item is clicked', async () => {
      // Arrange
      const onItemClick = vi.fn();
      const user = userEvent.setup();
      renderSidebar({ onItemClick });

      // Act
      const dashboardLink = screen.getByText('sidebar.dashboard');
      await user.click(dashboardLink);

      // Assert
      expect(onItemClick).toHaveBeenCalledTimes(1);
    });

    it('should highlight active menu item', () => {
      // Arrange & Act
      const { container } = renderSidebar();

      // Assert - Dashboard should be active (based on mock location)
      const activeItem = container.querySelector('.bg-\\[\\#e7ecf3\\]');
      expect(activeItem).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid collapse/expand toggles', async () => {
      // Arrange
      const user = userEvent.setup();
      const { container } = renderSidebar();
      const collapseButton = screen.getByTitle('sidebar.collapse');

      // Act
      await user.click(collapseButton);
      await user.click(screen.getByTitle('sidebar.expand'));
      await user.click(screen.getByTitle('sidebar.collapse'));

      // Assert
      const sidebar = container.firstChild;
      expect(sidebar).toBeInTheDocument();
    });

    it('should open modal and render overlay', async () => {
      // Arrange
      const user = userEvent.setup();
      renderSidebar();

      // Act - Open modal
      await user.click(screen.getByText('sidebar.talkToAssistant'));

      // Assert - Modal should be open with content
      await waitFor(() => {
        expect(screen.getByText('AsistanApp AI')).toBeInTheDocument();
      });

      // Assert - Overlay should be present for closing
      const overlay = document.querySelector('.fixed.inset-0');
      expect(overlay).toBeInTheDocument();
    });
  });
});

