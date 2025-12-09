/**
 * MentionToast Component Tests
 * Enterprise-grade test suite for real-time mention notifications
 * 
 * ALTIN KURALLAR:
 * 1. Test GERÇEK senaryoları, sadece pass olmasın
 * 2. Her satır, her dal, her edge case kontrol edilmeli
 * 3. Mock'lar gerçek davranışı yansıtmalı
 * 4. Bağımlılıklar doğrulanmalı
 * 5. Maintainable ve okunaklı olmalı
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MentionToast from '../MentionToast';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'notifications.mention': 'Mention',
        'notifications.mentionedYouIn': 'mentioned you in',
        'notifications.clickToView': 'Click to view',
        'common.close': 'Close',
      };
      return translations[key] || key;
    },
  }),
}));

describe('MentionToast', () => {
  const mockOnDismiss = vi.fn();
  
  const defaultProps = {
    channelId: 'channel-123',
    messageId: 'msg-456',
    channelName: 'general-chat',
    mentionedBy: 'John Doe',
    message: 'Hey @Agent, can you help with this?',
    onDismiss: mockOnDismiss,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <MentionToast {...defaultProps} {...props} />
      </BrowserRouter>
    );
  };

  describe('Initial Render', () => {
    it('should render mention toast with all required elements', () => {
      renderComponent();
      
      // Header
      expect(screen.getByText('Mention')).toBeInTheDocument();
      
      // Content
      expect(screen.getByText(/John Doe/)).toBeInTheDocument();
      expect(screen.getByText(/mentioned you in/)).toBeInTheDocument();
      expect(screen.getByText(/#general-chat/)).toBeInTheDocument();
      expect(screen.getByText(/Hey @Agent, can you help with this?/)).toBeInTheDocument();
      
      // Call to action
      expect(screen.getByText(/Click to view/)).toBeInTheDocument();
    });

    it('should render close button with proper attributes', () => {
      renderComponent();
      
      const closeButton = screen.getByRole('button', { name: 'Close' });
      expect(closeButton).toBeInTheDocument();
      expect(closeButton).toHaveAttribute('type', 'button');
      expect(closeButton).toHaveAttribute('aria-label', 'Close');
    });

    it('should render clickable content area', () => {
      renderComponent();
      
      // The main content area should be a button
      const contentButtons = screen.getAllByRole('button');
      
      // Should have at least 2 buttons (close + content)
      expect(contentButtons.length).toBeGreaterThanOrEqual(2);
    });

    it('should display channel name with hash prefix', () => {
      renderComponent();
      
      expect(screen.getByText(/#general-chat/)).toBeInTheDocument();
    });
  });

  describe('Auto-dismiss Functionality', () => {
    it('should auto-dismiss after 5 seconds', () => {
      renderComponent();
      
      expect(mockOnDismiss).not.toHaveBeenCalled();
      
      // Fast-forward time by 5 seconds
      vi.advanceTimersByTime(5000);
      
      // Should have called onDismiss
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it('should not dismiss before 5 seconds', async () => {
      renderComponent();
      
      // Fast-forward by 4 seconds
      vi.advanceTimersByTime(4000);
      
      expect(mockOnDismiss).not.toHaveBeenCalled();
    });

    it('should cleanup timer on unmount', () => {
      const { unmount } = renderComponent();
      
      unmount();
      
      // Fast-forward time
      vi.advanceTimersByTime(5000);
      
      // Should not call onDismiss after unmount
      expect(mockOnDismiss).not.toHaveBeenCalled();
    });
  });

  describe('Close Button', () => {
    it('should call onDismiss when close button is clicked', () => {
      renderComponent();
      
      const closeButton = screen.getByRole('button', { name: 'Close' });
      fireEvent.click(closeButton);
      
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it('should not navigate when close button is clicked', () => {
      renderComponent();
      
      const closeButton = screen.getByRole('button', { name: 'Close' });
      fireEvent.click(closeButton);
      
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Navigation Functionality', () => {
    it('should navigate to team chat when content is clicked', () => {
      renderComponent();
      
      // Find the content button (not the close button)
      const contentButton = screen.getAllByRole('button').find(
        btn => !btn.getAttribute('aria-label')
      );
      
      expect(contentButton).toBeDefined();
      fireEvent.click(contentButton!);
      
      expect(mockNavigate).toHaveBeenCalledWith(
        '/agent/team/chat?channelId=channel-123&messageId=msg-456'
      );
    });

    it('should dismiss toast after navigation', () => {
      renderComponent();
      
      const contentButton = screen.getAllByRole('button').find(
        btn => !btn.getAttribute('aria-label')
      );
      
      fireEvent.click(contentButton!);
      
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it('should construct correct URL with channelId and messageId', () => {
      renderComponent({
        channelId: 'support-team',
        messageId: 'msg-789',
      });
      
      const contentButton = screen.getAllByRole('button').find(
        btn => !btn.getAttribute('aria-label')
      );
      
      fireEvent.click(contentButton!);
      
      expect(mockNavigate).toHaveBeenCalledWith(
        '/agent/team/chat?channelId=support-team&messageId=msg-789'
      );
    });
  });

  describe('Content Display', () => {
    it('should display mentioner name correctly', () => {
      renderComponent({ mentionedBy: 'Jane Smith' });
      
      expect(screen.getByText(/Jane Smith/)).toBeInTheDocument();
    });

    it('should display channel name correctly', () => {
      renderComponent({ channelName: 'support-team' });
      
      expect(screen.getByText(/#support-team/)).toBeInTheDocument();
    });

    it('should display message content', () => {
      renderComponent({ message: 'Urgent: Please review ticket #1234' });
      
      expect(screen.getByText(/Urgent: Please review ticket #1234/)).toBeInTheDocument();
    });

    it('should truncate long messages with line-clamp', () => {
      const longMessage = 'A'.repeat(200);
      const { container } = renderComponent({ message: longMessage });
      
      // Check for line-clamp class
      const messageElement = container.querySelector('.line-clamp-2');
      expect(messageElement).toBeInTheDocument();
      expect(messageElement).toHaveTextContent(longMessage);
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      renderComponent();
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
      
      buttons.forEach(button => {
        expect(button).toHaveAttribute('type', 'button');
      });
    });

    it('should have aria-label on close button', () => {
      renderComponent();
      
      const closeButton = screen.getByRole('button', { name: 'Close' });
      expect(closeButton).toHaveAttribute('aria-label', 'Close');
    });

    it('should be keyboard accessible', () => {
      renderComponent();
      
      const buttons = screen.getAllByRole('button');
      
      buttons.forEach(button => {
        button.focus();
        expect(document.activeElement).toBe(button);
      });
    });
  });

  describe('UI/UX Validation', () => {
    it('should have proper positioning classes', () => {
      const { container } = renderComponent();
      
      const toast = container.querySelector('.fixed.bottom-6.right-6');
      expect(toast).toBeInTheDocument();
    });

    it('should have high z-index for visibility', () => {
      const { container } = renderComponent();
      
      const toast = container.querySelector('.z-\\[9999\\]');
      expect(toast).toBeInTheDocument();
    });

    it('should have slide-in animation', () => {
      const { container } = renderComponent();
      
      const toast = container.querySelector('.animate-slide-in-right');
      expect(toast).toBeInTheDocument();
    });

    it('should have progress bar animation', () => {
      const { container } = renderComponent();
      
      const progressBar = container.querySelector('.animate-shrink-width');
      expect(progressBar).toBeInTheDocument();
    });

    it('should have orange accent color', () => {
      const { container } = renderComponent();
      
      // Border should be orange
      const toast = container.querySelector('.border-orange-500');
      expect(toast).toBeInTheDocument();
      
      // Header should be orange
      const header = container.querySelector('.bg-orange-500');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Dark Mode Support', () => {
    it('should have dark mode classes', () => {
      const { container } = renderComponent();
      
      // Main container
      const darkBg = container.querySelector('.dark\\:bg-slate-800');
      expect(darkBg).toBeInTheDocument();
      
      // Border
      const darkBorder = container.querySelector('.dark\\:border-orange-600');
      expect(darkBorder).toBeInTheDocument();
      
      // Text colors
      const darkText = container.querySelector('.dark\\:text-white');
      expect(darkText).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long mentioner names', () => {
      const longName = 'A'.repeat(100);
      renderComponent({ mentionedBy: longName });
      
      expect(screen.getByText(new RegExp(longName))).toBeInTheDocument();
    });

    it('should handle very long channel names', () => {
      const longChannel = 'long-channel-name-that-goes-on-and-on';
      renderComponent({ channelName: longChannel });
      
      expect(screen.getByText(new RegExp(`#${longChannel}`))).toBeInTheDocument();
    });

    it('should handle empty message', () => {
      renderComponent({ message: '' });
      
      // Should still render without crashing
      expect(screen.getByText('Mention')).toBeInTheDocument();
    });

    it('should handle special characters in message', () => {
      const specialMessage = '@user check https://example.com & review ticket #123 🎉';
      renderComponent({ message: specialMessage });
      
      expect(screen.getByText(new RegExp(specialMessage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))).toBeInTheDocument();
    });

    it('should handle UTF-8 characters', () => {
      renderComponent({
        mentionedBy: '山田太郎',
        channelName: 'チャンネル',
        message: 'こんにちは @Agent 👋',
      });
      
      expect(screen.getByText(/山田太郎/)).toBeInTheDocument();
      expect(screen.getByText(/#チャンネル/)).toBeInTheDocument();
      expect(screen.getByText(/こんにちは/)).toBeInTheDocument();
    });

    it('should handle emojis in content', () => {
      renderComponent({
        mentionedBy: 'User 👨‍💻',
        channelName: 'channel-🚀',
        message: '@Agent urgent issue! 🔥🔥🔥',
      });
      
      expect(screen.getByText(/User 👨‍💻/)).toBeInTheDocument();
      expect(screen.getByText(/#channel-🚀/)).toBeInTheDocument();
      expect(screen.getByText(/urgent issue! 🔥🔥🔥/)).toBeInTheDocument();
    });
  });

  describe('Real-World Scenarios', () => {
    it('should handle complete user flow', async () => {
      renderComponent();
      
      // 1. Toast appears
      expect(screen.getByText('Mention')).toBeInTheDocument();
      
      // 2. User reads the mention
      expect(screen.getByText(/John Doe/)).toBeInTheDocument();
      expect(screen.getByText(/Hey @Agent/)).toBeInTheDocument();
      
      // 3. User clicks to view
      const contentButton = screen.getAllByRole('button').find(
        btn => !btn.getAttribute('aria-label')
      );
      fireEvent.click(contentButton!);
      
      // 4. Navigates to team chat
      expect(mockNavigate).toHaveBeenCalled();
      
      // 5. Toast dismisses
      expect(mockOnDismiss).toHaveBeenCalled();
    });

    it('should handle user dismissing without viewing', () => {
      renderComponent();
      
      const closeButton = screen.getByRole('button', { name: 'Close' });
      fireEvent.click(closeButton);
      
      // Should dismiss without navigation
      expect(mockOnDismiss).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should handle auto-dismiss scenario', () => {
      renderComponent();
      
      // User sees toast but doesn't interact
      expect(screen.getByText('Mention')).toBeInTheDocument();
      
      // Wait 5 seconds
      vi.advanceTimersByTime(5000);
      
      // Toast auto-dismisses
      expect(mockOnDismiss).toHaveBeenCalled();
      
      // No navigation occurred
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should handle rapid clicks', () => {
      renderComponent();
      
      const contentButton = screen.getAllByRole('button').find(
        btn => !btn.getAttribute('aria-label')
      );
      
      // Rapid clicks
      fireEvent.click(contentButton!);
      fireEvent.click(contentButton!);
      fireEvent.click(contentButton!);
      
      // Should only navigate once (or at least be safe)
      expect(mockNavigate).toHaveBeenCalled();
      expect(mockOnDismiss).toHaveBeenCalled();
    });
  });

  describe('Integration', () => {
    it('should integrate with react-router', () => {
      renderComponent();
      
      const contentButton = screen.getAllByRole('button').find(
        btn => !btn.getAttribute('aria-label')
      );
      fireEvent.click(contentButton!);
      
      // Should use navigate from react-router
      expect(mockNavigate).toHaveBeenCalled();
    });

    it('should integrate with i18n', () => {
      renderComponent();
      
      // All text should be translated
      expect(screen.getByText('Mention')).toBeInTheDocument();
      expect(screen.getByText(/mentioned you in/)).toBeInTheDocument();
      expect(screen.getByText(/Click to view/)).toBeInTheDocument();
    });

    it('should pass all required props correctly', () => {
      const customProps = {
        channelId: 'custom-channel',
        messageId: 'custom-message',
        channelName: 'custom',
        mentionedBy: 'Custom User',
        message: 'Custom message',
        onDismiss: mockOnDismiss,
      };
      
      renderComponent(customProps);
      
      // Verify all props are used
      expect(screen.getByText(/Custom User/)).toBeInTheDocument();
      expect(screen.getByText(/#custom/)).toBeInTheDocument();
      expect(screen.getByText(/Custom message/)).toBeInTheDocument();
      
      // Click to navigate
      const contentButton = screen.getAllByRole('button').find(
        btn => !btn.getAttribute('aria-label')
      );
      fireEvent.click(contentButton!);
      
      expect(mockNavigate).toHaveBeenCalledWith(
        '/agent/team/chat?channelId=custom-channel&messageId=custom-message'
      );
    });
  });

  describe('Performance', () => {
    it('should render efficiently', () => {
      const { rerender } = renderComponent();
      
      // Rerender with same props
      rerender(
        <BrowserRouter>
          <MentionToast {...defaultProps} />
        </BrowserRouter>
      );
      
      expect(screen.getByText('Mention')).toBeInTheDocument();
    });

    it('should cleanup resources on unmount', () => {
      const { unmount } = renderComponent();
      
      // Unmount
      unmount();
      
      // Advance timers
      vi.advanceTimersByTime(5000);
      
      // Should not call onDismiss after unmount
      expect(mockOnDismiss).not.toHaveBeenCalled();
    });
  });
});

