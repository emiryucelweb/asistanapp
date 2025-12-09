/**
 * ConversationHeader Component Tests - ENTERPRISE GRADE
 * 
 * @group component
 * @group agent
 * @group conversation
 * 
 * ALTIN KURALLAR:
 * ✅ React Component Testing
 * ✅ AAA Pattern
 * ✅ User interactions
 * ✅ Conditional rendering
 * ✅ Accessibility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConversationHeader from '../ConversationHeader';

// ============================================================================
// MOCKS
// ============================================================================

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'conversations.header.close': 'Kapat',
        'conversations.header.closeEsc': 'Kapat (ESC)',
        'conversations.header.back': 'Geri',
        'conversations.header.addNote': 'Not Ekle',
        'conversations.header.exitFullscreen': 'Tam Ekrandan Çık',
        'conversations.header.fullscreen': 'Tam Ekran',
        'conversations.header.tags': 'Etiketler',
        'conversations.header.takeOver': 'Devral',
        'conversations.header.resolve': 'Çöz',
      };
      return translations[key] || key;
    },
  }),
}));

// ============================================================================
// TEST UTILITIES
// ============================================================================

const defaultProps = {
  customerName: 'Test Customer',
  channel: 'whatsapp' as const,
  isFullscreen: false,
  isMobile: false,
  canSendMessage: true,
  isAssignedToCurrentUser: true,
  isLocked: false,
  status: 'assigned' as const,
  onClose: vi.fn(),
  onBack: vi.fn(),
  onToggleFullscreen: vi.fn(),
  onToggleNotes: vi.fn(),
  onToggleTags: vi.fn(),
  onResolve: vi.fn(),
  onTakeOver: vi.fn(),
};

// ============================================================================
// TESTS
// ============================================================================

describe('ConversationHeader - Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should render customer name', () => {
    // Arrange & Act
    render(<ConversationHeader {...defaultProps} />);

    // Assert
    expect(screen.getByText('Test Customer')).toBeInTheDocument();
  });

  it('should render channel name', () => {
    // Arrange & Act
    render(<ConversationHeader {...defaultProps} />);

    // Assert
    expect(screen.getByText('whatsapp')).toBeInTheDocument();
  });

  it('should render all action buttons when assigned', () => {
    // Arrange & Act
    render(<ConversationHeader {...defaultProps} />);

    // Assert
    expect(screen.getByTitle('Tam Ekran')).toBeInTheDocument();
    expect(screen.getByTitle('Etiketler')).toBeInTheDocument();
    expect(screen.getByTitle('Çöz')).toBeInTheDocument();
    expect(screen.getByTitle('Not Ekle')).toBeInTheDocument();
  });

  it('should render channel icon', () => {
    // Arrange & Act
    const { container } = render(<ConversationHeader {...defaultProps} />);

    // Assert - Channel icon container should exist
    const channelIcon = container.querySelector('.rounded-full');
    expect(channelIcon).toBeInTheDocument();
  });
});

describe('ConversationHeader - Channel Variations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    ['whatsapp'],
    ['instagram'],
    ['web'],
    ['phone'],
  ])('should render %s channel correctly', (channel) => {
    // Arrange & Act
    render(
      <ConversationHeader 
        {...defaultProps} 
        channel={channel as any}
      />
    );

    // Assert
    expect(screen.getByText(channel)).toBeInTheDocument();
  });
});

describe('ConversationHeader - Fullscreen State', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show close button when fullscreen', () => {
    // Arrange & Act
    render(
      <ConversationHeader 
        {...defaultProps} 
        isFullscreen={true}
      />
    );

    // Assert
    expect(screen.getByTitle('Kapat (ESC)')).toBeInTheDocument();
  });

  it('should show back button when not fullscreen on mobile', () => {
    // Arrange & Act
    render(
      <ConversationHeader 
        {...defaultProps} 
        isFullscreen={false}
        isMobile={true}
      />
    );

    // Assert
    expect(screen.getByLabelText('Geri')).toBeInTheDocument();
  });

  it('should show minimize icon when fullscreen', () => {
    // Arrange & Act
    render(
      <ConversationHeader 
        {...defaultProps} 
        isFullscreen={true}
      />
    );

    // Assert
    expect(screen.getByTitle('Tam Ekrandan Çık')).toBeInTheDocument();
  });

  it('should show maximize icon when not fullscreen', () => {
    // Arrange & Act
    render(
      <ConversationHeader 
        {...defaultProps} 
        isFullscreen={false}
      />
    );

    // Assert
    expect(screen.getByTitle('Tam Ekran')).toBeInTheDocument();
  });
});

describe('ConversationHeader - User Interactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call onClose when close button clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <ConversationHeader 
        {...defaultProps} 
        onClose={onClose}
        isFullscreen={true}
      />
    );

    // Act
    const closeButton = screen.getByTitle('Kapat (ESC)');
    await user.click(closeButton);

    // Assert
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onBack when back button clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onBack = vi.fn();

    render(
      <ConversationHeader 
        {...defaultProps} 
        onBack={onBack}
        isMobile={true}
      />
    );

    // Act
    const backButton = screen.getByLabelText('Geri');
    await user.click(backButton);

    // Assert
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('should call onToggleFullscreen when fullscreen button clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onToggleFullscreen = vi.fn();

    render(
      <ConversationHeader 
        {...defaultProps} 
        onToggleFullscreen={onToggleFullscreen}
      />
    );

    // Act
    const fullscreenButton = screen.getByTitle('Tam Ekran');
    await user.click(fullscreenButton);

    // Assert
    expect(onToggleFullscreen).toHaveBeenCalledTimes(1);
  });

  it('should call onToggleNotes when notes button clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onToggleNotes = vi.fn();

    render(
      <ConversationHeader 
        {...defaultProps} 
        onToggleNotes={onToggleNotes}
      />
    );

    // Act
    const notesButton = screen.getByTitle('Not Ekle');
    await user.click(notesButton);

    // Assert
    expect(onToggleNotes).toHaveBeenCalledTimes(1);
  });

  it('should call onToggleTags when tags button clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onToggleTags = vi.fn();

    render(
      <ConversationHeader 
        {...defaultProps} 
        onToggleTags={onToggleTags}
      />
    );

    // Act
    const tagsButton = screen.getByTitle('Etiketler');
    await user.click(tagsButton);

    // Assert
    expect(onToggleTags).toHaveBeenCalledTimes(1);
  });

  it('should call onResolve when resolve button clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onResolve = vi.fn();

    render(
      <ConversationHeader 
        {...defaultProps} 
        onResolve={onResolve}
        isAssignedToCurrentUser={true}
        status="assigned"
      />
    );

    // Act
    const resolveButton = screen.getByTitle('Çöz');
    await user.click(resolveButton);

    // Assert
    expect(onResolve).toHaveBeenCalledTimes(1);
  });

  it('should call onTakeOver when take over button clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    const onTakeOver = vi.fn();

    render(
      <ConversationHeader 
        {...defaultProps} 
        onTakeOver={onTakeOver}
        isAssignedToCurrentUser={false}
        isLocked={false}
      />
    );

    // Act
    const takeOverButton = screen.getByTitle('Devral');
    await user.click(takeOverButton);

    // Assert
    expect(onTakeOver).toHaveBeenCalledTimes(1);
  });
});

describe('ConversationHeader - Conditional Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show resolve button when assigned to current user', () => {
    // Arrange & Act
    render(
      <ConversationHeader 
        {...defaultProps} 
        isAssignedToCurrentUser={true}
        status="assigned"
      />
    );

    // Assert
    expect(screen.getByTitle('Çöz')).toBeInTheDocument();
  });

  it('should not show resolve button when not assigned', () => {
    // Arrange & Act
    render(
      <ConversationHeader 
        {...defaultProps} 
        isAssignedToCurrentUser={false}
      />
    );

    // Assert
    expect(screen.queryByTitle('Çöz')).not.toBeInTheDocument();
  });

  it('should not show resolve button when status is resolved', () => {
    // Arrange & Act
    render(
      <ConversationHeader 
        {...defaultProps} 
        isAssignedToCurrentUser={true}
        status="resolved"
      />
    );

    // Assert
    expect(screen.queryByTitle('Çöz')).not.toBeInTheDocument();
  });

  it('should show take over button when not assigned and not locked', () => {
    // Arrange & Act
    render(
      <ConversationHeader 
        {...defaultProps} 
        isAssignedToCurrentUser={false}
        isLocked={false}
      />
    );

    // Assert
    expect(screen.getByTitle('Devral')).toBeInTheDocument();
  });

  it('should not show take over button when locked', () => {
    // Arrange & Act
    render(
      <ConversationHeader 
        {...defaultProps} 
        isAssignedToCurrentUser={false}
        isLocked={true}
      />
    );

    // Assert
    expect(screen.queryByTitle('Devral')).not.toBeInTheDocument();
  });

  it('should not show both resolve and take over buttons simultaneously', () => {
    // Arrange & Act
    render(
      <ConversationHeader 
        {...defaultProps} 
        isAssignedToCurrentUser={true}
        status="assigned"
      />
    );

    // Assert
    expect(screen.getByTitle('Çöz')).toBeInTheDocument();
    expect(screen.queryByTitle('Devral')).not.toBeInTheDocument();
  });
});

describe('ConversationHeader - Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have aria-label for close button', () => {
    // Arrange & Act
    render(
      <ConversationHeader 
        {...defaultProps} 
        isFullscreen={true}
      />
    );

    // Assert
    const closeButton = screen.getByLabelText('Kapat');
    expect(closeButton).toBeInTheDocument();
  });

  it('should have aria-label for back button', () => {
    // Arrange & Act
    render(
      <ConversationHeader 
        {...defaultProps} 
        isMobile={true}
      />
    );

    // Assert
    const backButton = screen.getByLabelText('Geri');
    expect(backButton).toBeInTheDocument();
  });

  it('should have aria-label for fullscreen button', () => {
    // Arrange & Act
    render(
      <ConversationHeader 
        {...defaultProps} 
        isFullscreen={false}
      />
    );

    // Assert
    const fullscreenButton = screen.getByLabelText('Tam Ekran');
    expect(fullscreenButton).toBeInTheDocument();
  });

  it('should have title attributes for all buttons', () => {
    // Arrange & Act
    render(
      <ConversationHeader 
        {...defaultProps} 
        isAssignedToCurrentUser={true}
        status="assigned"
      />
    );

    // Assert
    expect(screen.getByTitle('Tam Ekran')).toBeInTheDocument();
    expect(screen.getByTitle('Etiketler')).toBeInTheDocument();
    expect(screen.getByTitle('Çöz')).toBeInTheDocument();
    expect(screen.getByTitle('Not Ekle')).toBeInTheDocument();
  });
});

describe('ConversationHeader - Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle very long customer names', () => {
    // Arrange & Act
    render(
      <ConversationHeader 
        {...defaultProps} 
        customerName="Very Long Customer Name That Should Be Truncated For Better UX"
      />
    );

    // Assert
    const nameElement = screen.getByText(/Very Long Customer Name/);
    expect(nameElement).toBeInTheDocument();
    expect(nameElement.closest('h2')).toHaveClass('truncate');
  });

  it('should handle empty customer name', () => {
    // Arrange & Act
    render(
      <ConversationHeader 
        {...defaultProps} 
        customerName=""
      />
    );

    // Assert - Component should still render
    expect(screen.getByText('whatsapp')).toBeInTheDocument();
  });

  it('should handle all status values', () => {
    // Arrange - Test all status values
    const statuses: Array<'waiting' | 'assigned' | 'resolved'> = ['waiting', 'assigned', 'resolved'];

    statuses.forEach(status => {
      const { unmount } = render(
        <ConversationHeader 
          {...defaultProps} 
          status={status}
          isAssignedToCurrentUser={true}
        />
      );

      // Assert - Component renders without error
      expect(screen.getByText('Test Customer')).toBeInTheDocument();
      unmount();
    });
  });
});

describe('ConversationHeader - Real-World Scenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle agent taking over unassigned conversation', async () => {
    // Arrange
    const user = userEvent.setup();
    const onTakeOver = vi.fn();

    render(
      <ConversationHeader 
        {...defaultProps} 
        isAssignedToCurrentUser={false}
        isLocked={false}
        onTakeOver={onTakeOver}
        status="waiting"
      />
    );

    // Act
    const takeOverButton = screen.getByTitle('Devral');
    await user.click(takeOverButton);

    // Assert
    expect(onTakeOver).toHaveBeenCalledTimes(1);
    expect(screen.queryByTitle('Çöz')).not.toBeInTheDocument();
  });

  it('should handle agent resolving their conversation', async () => {
    // Arrange
    const user = userEvent.setup();
    const onResolve = vi.fn();

    render(
      <ConversationHeader 
        {...defaultProps} 
        isAssignedToCurrentUser={true}
        status="assigned"
        onResolve={onResolve}
      />
    );

    // Act
    const resolveButton = screen.getByTitle('Çöz');
    await user.click(resolveButton);

    // Assert
    expect(onResolve).toHaveBeenCalledTimes(1);
  });

  it('should handle fullscreen workflow', async () => {
    // Arrange
    const user = userEvent.setup();
    const onToggleFullscreen = vi.fn();

    const { rerender } = render(
      <ConversationHeader 
        {...defaultProps} 
        isFullscreen={false}
        onToggleFullscreen={onToggleFullscreen}
      />
    );

    // Act - Enter fullscreen
    await user.click(screen.getByTitle('Tam Ekran'));
    expect(onToggleFullscreen).toHaveBeenCalledTimes(1);

    // Rerender with fullscreen
    rerender(
      <ConversationHeader 
        {...defaultProps} 
        isFullscreen={true}
        onToggleFullscreen={onToggleFullscreen}
      />
    );

    // Assert - Exit fullscreen button appears
    expect(screen.getByTitle('Tam Ekrandan Çık')).toBeInTheDocument();
  });

  it('should handle mobile navigation', async () => {
    // Arrange
    const user = userEvent.setup();
    const onBack = vi.fn();

    render(
      <ConversationHeader 
        {...defaultProps} 
        isMobile={true}
        onBack={onBack}
      />
    );

    // Act
    const backButton = screen.getByLabelText('Geri');
    await user.click(backButton);

    // Assert
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});

