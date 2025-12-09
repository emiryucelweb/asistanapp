/**
 * Agent Conversations Tests - ENTERPRISE GRADE (Post-Refactor)
 * 
 * Tests for the refactored modular conversation component
 * Matches the ACTUAL component API (v2.0.0)
 * 
 * @group agent
 * @group conversations
 * 
 * ALTIN KURALLAR:
 * ✅ AAA Pattern (Arrange-Act-Assert)
 * ✅ beforeEach/afterEach her describe bloğunda
 * ✅ cleanup() ve vi.restoreAllMocks() afterEach'de
 * ✅ Error handling testleri
 */

import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import AgentConversations from '../pages/conversations/AgentConversations';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        'conversations.title': 'Konuşmalar',
        'conversations.count': `${options?.count || 0} konuşma`,
        'conversations.tabs.all': 'Tümü',
        'conversations.tabs.my': 'Benim',
        'conversations.tabs.waiting': 'Bekleyen',
        'conversations.tabs.assigned': 'Atanmış',
        'conversations.filters.filters': 'Filtreler',
        'conversations.searchWithShortcut': 'Konuşmalarda ara',
        'conversations.selectConversation': 'Bir konuşma seçin',
        'conversations.notes.title': 'Notlar',
        'conversations.addNotesPlaceholder': 'Not ekle...',
        'conversations.notes.saved': 'Not kaydedildi',
        'conversations.filters.applied': 'Filtreler uygulandı',
        'conversations.assignment.success': 'Atama başarılı',
        'conversations.assignment.successWithReason': `Atama başarılı: ${options?.reason || ''}`,
      };
      return translations[key] || key;
    },
    i18n: { language: 'tr' },
  }),
}));

// Mock stores
vi.mock('@/shared/stores/auth-store', () => ({
  useAuthStore: () => ({
    user: { id: 'agent-1', name: 'Test Agent', role: 'agent' },
  }),
}));

// Mock hooks - POST-REFACTOR API
vi.mock('@/lib/react-query/hooks/useConversations', () => ({
  useConversations: () => ({
    data: [],
    isLoading: false,
  }),
  useSendMessage: () => ({
    mutate: vi.fn(),
    isLoading: false,
  }),
  useAssignConversation: () => ({
    mutate: vi.fn(),
    isLoading: false,
  }),
  useResolveConversation: () => ({
    mutate: vi.fn(),
    isLoading: false,
  }),
  useMarkAsRead: () => ({
    mutate: vi.fn(),
    isLoading: false,
  }),
}));

// Mock conversation state hook
vi.mock('@/features/agent/hooks/useConversationState', () => ({
  useConversationState: () => ({
    state: {
      data: {
        selectedConversation: null,
        messageInput: '',
        attachedFiles: [],
        replyingTo: null,
      },
      ui: {
        activeTab: 'all',
        showAdvancedFilters: false,
        showQuickReplies: false,
        showTags: false,
        showCustomerHistory: false,
        showEmojiPicker: null,
        isFullscreen: false,
        showAssignmentModal: false,
        showKeyboardHelp: false,
      },
      filters: {
        searchQuery: '',
        filterStatus: 'all',
        filterPriority: 'all',
        filterChannel: 'all',
        filterSentiment: 'all',
        tags: [],
      },
    },
    actions: {
      selectConversation: vi.fn(),
      setMessageInput: vi.fn(),
      setSearchQuery: vi.fn(),
      setActiveTab: vi.fn(),
      toggleAdvancedFilters: vi.fn(),
      toggleQuickReplies: vi.fn(),
      toggleTags: vi.fn(),
      toggleCustomerHistory: vi.fn(),
      toggleEmojiPicker: vi.fn(),
      toggleFullscreen: vi.fn(),
      toggleAssignmentModal: vi.fn(),
      toggleKeyboardHelp: vi.fn(),
      setFilterStatus: vi.fn(),
      setFilterPriority: vi.fn(),
      setFilterChannel: vi.fn(),
      setFilterSentiment: vi.fn(),
      addAttachedFile: vi.fn(),
      removeAttachedFile: vi.fn(),
      setReplyingTo: vi.fn(),
      closeAllModals: vi.fn(),
    },
  }),
}));

// Mock conversation actions hook
vi.mock('../pages/conversations/hooks', () => ({
  useConversationActions: () => ({
    handleTakeOver: vi.fn(),
    handleSendMessage: vi.fn(),
    handleResolve: vi.fn(),
    handleSelectConversation: vi.fn(),
    handleCopyMessage: vi.fn(),
  }),
  useConversationDraft: vi.fn(),
  useConversationKeyboard: vi.fn(),
}));

// Mock components
vi.mock('@/features/agent/components/conversations/ConversationHeader', () => ({
  default: () => <div data-testid="conversation-header">Header</div>,
}));

vi.mock('@/features/agent/components/conversations/ConversationList', () => ({
  default: () => <div data-testid="conversation-list">List</div>,
}));

vi.mock('@/features/agent/components/conversations/MessageArea', () => ({
  default: () => <div data-testid="message-area">Messages</div>,
}));

vi.mock('@/features/agent/components/conversations/MessageInput', () => ({
  default: () => <div data-testid="message-input">Input</div>,
}));

// Test wrapper
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('AgentConversations - Post-Refactor (v2.0.0)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Rendering - Basic Structure', () => {
    it('should render main page title', () => {
      // Arrange
      const wrapper = createWrapper();

      // Act
      render(<AgentConversations />, { wrapper });

      // Assert
      expect(screen.getByText('Konuşmalar')).toBeInTheDocument();
    });

    it('should render conversation count', () => {
      // Arrange
      const wrapper = createWrapper();

      // Act
      render(<AgentConversations />, { wrapper });

      // Assert
      expect(screen.getByText(/0 konuşma/i)).toBeInTheDocument();
    });

    it('should render tab navigation with correct labels', () => {
      // Arrange
      const wrapper = createWrapper();

      // Act
      render(<AgentConversations />, { wrapper });
      
      // Assert - Post-refactor tab labels
      expect(screen.getByText('Tümü')).toBeInTheDocument();
      expect(screen.getByText('Benim')).toBeInTheDocument();
      expect(screen.getByText('Bekleyen')).toBeInTheDocument();
      expect(screen.getByText('Atanmış')).toBeInTheDocument();
    });

    it('should render search input', () => {
      // Arrange
      const wrapper = createWrapper();

      // Act
      render(<AgentConversations />, { wrapper });

      // Assert
      expect(screen.getByPlaceholderText(/konuşmalarda ara/i)).toBeInTheDocument();
    });

    it('should render conversation list (mocked)', () => {
      // Arrange
      const wrapper = createWrapper();

      // Act
      render(<AgentConversations />, { wrapper });

      // Assert - ConversationList component is mocked
      expect(screen.getByTestId('conversation-list')).toBeInTheDocument();
    });

    it('should render placeholder when no conversation selected', () => {
      // Arrange
      const wrapper = createWrapper();

      // Act
      render(<AgentConversations />, { wrapper });

      // Assert
      expect(screen.getByText(/bir konuşma seçin/i)).toBeInTheDocument();
    });
  });

  describe('Component Composition - Modular Architecture', () => {
    it('should render all modular components', () => {
      // Arrange
      const wrapper = createWrapper();

      // Act
      render(<AgentConversations />, { wrapper });
      
      // Assert - These are mocked, but verify they're composed correctly
      expect(screen.queryByTestId('conversation-header')).not.toBeInTheDocument(); // Only shows when conversation selected
      expect(screen.getByTestId('conversation-list')).toBeInTheDocument();
      expect(screen.queryByTestId('message-area')).not.toBeInTheDocument(); // Only shows when conversation selected
      expect(screen.queryByTestId('message-input')).not.toBeInTheDocument(); // Only shows when conversation selected
    });
  });

  describe('Error Handling', () => {
    it('should render without crashing when user is null', () => {
      // Arrange - Mock user as null
      vi.mocked(vi.importActual('@/shared/stores/auth-store')).useAuthStore = () => ({
        user: null,
      });
      const wrapper = createWrapper();

      // Act & Assert - Should not throw
      expect(() => render(<AgentConversations />, { wrapper })).not.toThrow();
    });

    it('should handle empty conversations gracefully', () => {
      // Arrange
      const wrapper = createWrapper();

      // Act
      render(<AgentConversations />, { wrapper });

      // Assert - Should show placeholder, not error
      expect(screen.getByText(/bir konuşma seçin/i)).toBeInTheDocument();
    });

    it('should render when hooks return undefined data', () => {
      // Arrange - useConversations returns undefined data
      vi.mocked(vi.importActual('@/lib/react-query/hooks/useConversations')).useConversations = () => ({
        data: undefined,
        isLoading: false,
      });
      const wrapper = createWrapper();

      // Act & Assert - Should not throw
      expect(() => render(<AgentConversations />, { wrapper })).not.toThrow();
    });
  });
});
