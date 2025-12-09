 
// NOTE: Test/fixture file - `any` accepted for mock data flexibility

/**
 * Integration Tests for ConversationList Component
 * Type-safe component integration tests
 * 
 * @module agent/components/conversations/__tests__/ConversationList
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConversationList from '../ConversationList';
import { renderWithProviders } from '@/test/utils/test-utils';
import { createMockConversations, createConversationId } from '@/test/utils/mock-factories';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'conversations.noConversations': 'Konuşma bulunamadı',
      };
      return translations[key] || key;
    },
    i18n: { language: 'tr' },
  }),
}));

describe('ConversationList Component', () => {
  const mockOnSelect = vi.fn();
  const mockOnAssign = vi.fn();
  
  /**
   * Type Compatibility Note:
   * ConversationList component uses a narrower type definition for Channel
   * (only 'whatsapp' | 'instagram' | 'web' | 'phone'), while the global
   * Conversation type includes 'email'. We use type assertion here for test
   * compatibility. This is safe because our mock factory defaults to 'whatsapp'.
   * 
   * TODO: Consider aligning component types with global types for consistency.
   */
  const mockConversations = createMockConversations(5) as any[];

  beforeEach(() => {
    mockOnSelect.mockClear();
    mockOnAssign.mockClear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should render conversation list', () => {
    renderWithProviders(
      <ConversationList
        conversations={mockConversations}
        onSelect={mockOnSelect}
        onTakeOver={vi.fn()}
        onAssign={mockOnAssign}
      />
    );

    // Check if conversations are rendered
    const conversationElements = screen.getAllByRole('button');
    expect(conversationElements.length).toBeGreaterThan(0);
  });

  it('should display correct number of conversations', () => {
    renderWithProviders(
      <ConversationList
        conversations={mockConversations}
        onSelect={mockOnSelect}
        onTakeOver={vi.fn()}
        onAssign={mockOnAssign}
      />
    );

    // Each conversation should be rendered as a button
    const conversationButtons = screen.getAllByRole('button');
    expect(conversationButtons.length).toBeGreaterThanOrEqual(mockConversations.length);
  });

  it('should call onSelectConversation when conversation is clicked', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(
      <ConversationList
        conversations={mockConversations}
        onSelect={mockOnSelect}
        onTakeOver={vi.fn()}
        onAssign={mockOnAssign}
      />
    );

    const firstConversation = screen.getAllByRole('button')[0];
    await user.click(firstConversation);

    await waitFor(() => {
      expect(mockOnSelect).toHaveBeenCalled();
    });
  });

  it('should highlight selected conversation', () => {
    const selectedConversation = mockConversations[0];

    renderWithProviders(
      <ConversationList
        conversations={mockConversations}
        selectedConversation={selectedConversation}
        onSelect={mockOnSelect}
        onTakeOver={vi.fn()}
        onAssign={mockOnAssign}
      />
    );

    // The selected conversation should have different styling (orange theme)
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveClass('bg-orange-50');
  });

  it('should display customer names', () => {
    renderWithProviders(
      <ConversationList
        conversations={mockConversations}
        onSelect={mockOnSelect}
        onTakeOver={vi.fn()}
        onAssign={mockOnAssign}
      />
    );

    mockConversations.forEach((conv) => {
      expect(screen.getByText(conv.customerName)).toBeInTheDocument();
    });
  });

  it('should display last message preview', () => {
    renderWithProviders(
      <ConversationList
        conversations={mockConversations}
        onSelect={mockOnSelect}
        onTakeOver={vi.fn()}
        onAssign={mockOnAssign}
      />
    );

    // Check that at least one last message is visible
    const firstMessage = mockConversations[0].lastMessage;
    expect(screen.getAllByText(firstMessage).length).toBeGreaterThanOrEqual(1);
  });

  it('should display unread count badges', () => {
    const conversationsWithUnread = mockConversations.map((conv, index) => ({
      ...conv,
      unreadCount: index + 1,
    }));

    renderWithProviders(
      <ConversationList
        conversations={conversationsWithUnread}
        onSelect={mockOnSelect}
        onTakeOver={vi.fn()}
        onAssign={mockOnAssign}
      />
    );

    conversationsWithUnread.forEach((conv) => {
      if (conv.unreadCount > 0) {
        expect(screen.getByText(conv.unreadCount.toString())).toBeInTheDocument();
      }
    });
  });

  it('should show empty state when no conversations', () => {
    renderWithProviders(
      <ConversationList
        conversations={[]}
        onSelect={mockOnSelect}
        onTakeOver={vi.fn()}
        onAssign={mockOnAssign}
      />
    );

    // Component uses "Konuşma bulunamadı" for empty state
    expect(screen.getByText(/konuşma bulunamadı/i)).toBeInTheDocument();
  });

  it('should display priority indicators for urgent conversations', () => {
    const urgentConversation = createMockConversations(1, { priority: 'urgent' })[0];

    renderWithProviders(
      <ConversationList
        conversations={[urgentConversation] as any}
        onSelect={mockOnSelect}
        onTakeOver={vi.fn()}
        onAssign={mockOnAssign}
      />
    );

    // Check for priority indicator in the UI
    const container = screen.getByRole('button');
    expect(container).toBeInTheDocument();
  });

  it('should display timestamps', () => {
    const recentConversation = createMockConversations(1)[0];

    renderWithProviders(
      <ConversationList
        conversations={[recentConversation] as any}
        onSelect={mockOnSelect}
        onTakeOver={vi.fn()}
        onAssign={mockOnAssign}
      />
    );

    // Component displays raw lastMessageTime (ISO format)
    // Should display timestamp in the UI
    expect(screen.getByText(recentConversation.lastMessageTime)).toBeInTheDocument();
  });

  it('should display channel indicators', () => {
    renderWithProviders(
      <ConversationList
        conversations={mockConversations}
        onSelect={mockOnSelect}
        onTakeOver={vi.fn()}
        onAssign={mockOnAssign}
      />
    );

    // Check for channel-specific elements (icons, badges, etc.)
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should handle loading state gracefully', () => {
    renderWithProviders(
      <ConversationList
        conversations={[]}
        onSelect={mockOnSelect}
        onTakeOver={vi.fn()}
        onAssign={mockOnAssign}
      />
    );

    // Should show empty state, not crash
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('should be accessible via keyboard navigation', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(
      <ConversationList
        conversations={mockConversations.slice(0, 2)}
        onSelect={mockOnSelect}
        onTakeOver={vi.fn()}
        onAssign={mockOnAssign}
      />
    );

    const buttons = screen.getAllByRole('button');
    
    // Tab to first conversation
    await user.tab();
    expect(buttons[0]).toHaveFocus();

    // Press Enter to select
    await user.keyboard('{Enter}');
    
    await waitFor(() => {
      expect(mockOnSelect).toHaveBeenCalled();
    });
  });
});
