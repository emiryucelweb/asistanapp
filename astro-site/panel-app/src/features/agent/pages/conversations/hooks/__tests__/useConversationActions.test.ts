/**
 * useConversationActions Hook Tests
 * Enterprise-grade test suite for conversation business logic
 * 
 * ALTIN KURALLAR:
 * 1. Test GERÇEK senaryoları, sadece pass olmasın
 * 2. Her satır, her dal, her edge case kontrol edilmeli
 * 3. Mock'lar gerçek davranışı yansıtmalı
 * 4. Bağımlılıklar doğrulanmalı
 * 5. Maintainable ve okunaklı olmalı
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor, cleanup } from '@testing-library/react';
import { useConversationActions } from '../useConversationActions';
import { createMockConversation } from '@/test/utils/mock-factories';
import toast from 'react-hot-toast';
import type { Conversation } from '@/features/agent/types';

// Mock logger
vi.mock('@/shared/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock toast utilities
vi.mock('@/shared/utils/toast', () => ({
  showSuccess: vi.fn(),
  showError: vi.fn(),
}));

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      const translations: Record<string, string> = {
        'conversations.actions.conversationTakenOver': `Conversation taken over for ${options?.customerName}`,
        'conversations.actions.messageCopied': 'Message copied',
        'conversations.actions.copyFailed': 'Copy failed',
        'voiceCall.takeoverFailed': 'Takeover failed',
        'voiceCall.messageFileSent': '[File sent]',
        'voiceCall.messageSendFailed': 'Message send failed',
        'voiceCall.conversationClosed': 'Conversation closed',
        'voiceCall.conversationCloseFailed': 'Close failed',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock React Query mutations
const mockMutateAsync = vi.fn();
const mockMutate = vi.fn();

vi.mock('@/lib/react-query/hooks/useConversations', () => ({
  useSendMessage: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
  useAssignConversation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
  useResolveConversation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
  useMarkAsRead: () => ({
    mutate: mockMutate,
  }),
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});

describe('useConversationActions', () => {
  // Mock actions with all required methods for UseConversationStateReturn['actions']
  const mockActions = {
    selectConversation: vi.fn(),
    clearMessageInput: vi.fn(),
    setMessageInput: vi.fn(),
    addAttachment: vi.fn(),
    addAttachments: vi.fn(),
    removeAttachment: vi.fn(),
    clearAttachments: vi.fn(),
    setActiveTab: vi.fn(),
    toggleQuickReplies: vi.fn(),
    toggleNotes: vi.fn(),
    toggleTags: vi.fn(),
    toggleAdvancedFilters: vi.fn(),
    toggleAssignment: vi.fn(),
    toggleKeyboardHelp: vi.fn(),
    toggleCustomerHistory: vi.fn(),
    toggleEmojiPicker: vi.fn(),
    toggleFullscreen: vi.fn(),
    closeAllModals: vi.fn(),
    setNotes: vi.fn(),
    setSearchQuery: vi.fn(),
    setFilterStatus: vi.fn(),
    setAppliedFilters: vi.fn(),
    setTypingUsers: vi.fn(),
    addTypingUser: vi.fn(),
    removeTypingUser: vi.fn(),
    reset: vi.fn(),
  } as any; // Cast to any for test flexibility

  const defaultProps = {
    actions: mockActions,
    selectedConversation: createMockConversation({ id: 'conv-1', customerName: 'John Doe' }),
    messageInput: 'Test message',
    attachedFiles: [] as File[],
    userId: 'agent-123',
    currentAgentName: 'Agent Smith',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockMutateAsync.mockResolvedValue({});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('handleTakeOver', () => {
    it('should take over a conversation successfully', async () => {
      const { result } = renderHook(() => useConversationActions(defaultProps));
      
      const conversation = createMockConversation({ 
        id: 'conv-2', 
        customerName: 'Jane Doe',
        status: 'waiting',
      });

      await act(async () => {
        await result.current.handleTakeOver(conversation);
      });

      // Should update conversation optimistically
      expect(mockActions.selectConversation).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'conv-2',
          isLocked: true,
          lockedBy: 'agent-123',
          lockedByName: 'Agent Smith',
          assignedTo: 'agent-123',
          assignedToName: 'Agent Smith',
          status: 'assigned',
        })
      );

      // Should show success toast
      expect(toast.success).toHaveBeenCalledWith(
        'Conversation taken over for Jane Doe'
      );

      // Should call API
      expect(mockMutateAsync).toHaveBeenCalledWith({
        conversationId: 'conv-2',
        agentId: 'agent-123',
      });
    });

    it('should handle takeover failure gracefully', async () => {
      const { logger } = await import('@/shared/utils/logger');
      mockMutateAsync.mockRejectedValueOnce(new Error('API Error'));

      const { result } = renderHook(() => useConversationActions(defaultProps));
      
      const conversation = createMockConversation({ id: 'conv-fail' });

      await act(async () => {
        await result.current.handleTakeOver(conversation);
      });

      // Should log error
      expect(logger.error).toHaveBeenCalledWith(
        'Failed to take over conversation',
        expect.any(Error),
        expect.objectContaining({
          conversationId: 'conv-fail',
        })
      );

      // Should show error toast
      expect(toast.error).toHaveBeenCalledWith('Takeover failed');
    });

    it('should not call API if userId is missing', async () => {
      const propsWithoutUserId = {
        ...defaultProps,
        userId: undefined,
      };

      const { result } = renderHook(() => useConversationActions(propsWithoutUserId));
      
      const conversation = createMockConversation({ id: 'conv-3' });

      await act(async () => {
        await result.current.handleTakeOver(conversation);
      });

      // Should still update UI optimistically
      expect(mockActions.selectConversation).toHaveBeenCalled();

      // Should show toast
      expect(toast.success).toHaveBeenCalled();

      // Should NOT call API (no userId)
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it('should handle optimistic update correctly', async () => {
      const { result } = renderHook(() => useConversationActions(defaultProps));
      
      const conversation = createMockConversation({ 
        id: 'conv-optimistic',
        status: 'waiting',
        isLocked: false,
        assignedTo: null,
      });

      await act(async () => {
        await result.current.handleTakeOver(conversation);
      });

      const updatedConv = mockActions.selectConversation.mock.calls[0][0];
      
      // Verify all optimistic update fields
      expect(updatedConv.isLocked).toBe(true);
      expect(updatedConv.lockedBy).toBe('agent-123');
      expect(updatedConv.lockedByName).toBe('Agent Smith');
      expect(updatedConv.assignedTo).toBe('agent-123');
      expect(updatedConv.assignedToName).toBe('Agent Smith');
      expect(updatedConv.status).toBe('assigned');
    });
  });

  describe('handleSendMessage', () => {
    it('should send a text message successfully', async () => {
      const { result } = renderHook(() => useConversationActions(defaultProps));

      await act(async () => {
        await result.current.handleSendMessage();
      });

      // Should clear input immediately
      expect(mockActions.clearMessageInput).toHaveBeenCalled();

      // Should call API with message
      expect(mockMutateAsync).toHaveBeenCalledWith({
        conversationId: 'conv-1',
        content: 'Test message',
        attachments: [],
      });
    });

    it('should send a message with attachments', async () => {
      const mockFiles = [
        new File(['content'], 'file1.pdf', { type: 'application/pdf' }),
        new File(['content'], 'file2.jpg', { type: 'image/jpeg' }),
      ];

      const propsWithFiles = {
        ...defaultProps,
        attachedFiles: mockFiles,
      };

      const { result } = renderHook(() => useConversationActions(propsWithFiles));

      await act(async () => {
        await result.current.handleSendMessage();
      });

      // Should send files
      expect(mockMutateAsync).toHaveBeenCalledWith({
        conversationId: 'conv-1',
        content: 'Test message',
        attachments: mockFiles,
      });
    });

    it('should send files only (no text)', async () => {
      const mockFiles = [new File(['content'], 'file.pdf')];

      const propsFilesOnly = {
        ...defaultProps,
        messageInput: '',
        attachedFiles: mockFiles,
      };

      const { result } = renderHook(() => useConversationActions(propsFilesOnly));

      await act(async () => {
        await result.current.handleSendMessage();
      });

      // Should use default text for file-only message
      expect(mockMutateAsync).toHaveBeenCalledWith({
        conversationId: 'conv-1',
        content: '[File sent]',
        attachments: mockFiles,
      });
    });

    it('should not send if message is empty and no attachments', async () => {
      const propsEmpty = {
        ...defaultProps,
        messageInput: '   ',
        attachedFiles: [],
      };

      const { result } = renderHook(() => useConversationActions(propsEmpty));

      await act(async () => {
        await result.current.handleSendMessage();
      });

      // Should not call API
      expect(mockMutateAsync).not.toHaveBeenCalled();

      // Should not clear input
      expect(mockActions.clearMessageInput).not.toHaveBeenCalled();
    });

    it('should not send if no conversation is selected', async () => {
      const propsNoConv = {
        ...defaultProps,
        selectedConversation: null,
      };

      const { result } = renderHook(() => useConversationActions(propsNoConv));

      await act(async () => {
        await result.current.handleSendMessage();
      });

      // Should not call API
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it('should rollback on send failure', async () => {
      const { logger } = await import('@/shared/utils/logger');
      mockMutateAsync.mockRejectedValueOnce(new Error('Send failed'));

      const mockFiles = [new File(['content'], 'file.pdf')];
      const propsWithData = {
        ...defaultProps,
        messageInput: 'Important message',
        attachedFiles: mockFiles,
      };

      const { result } = renderHook(() => useConversationActions(propsWithData));

      await act(async () => {
        await result.current.handleSendMessage();
      });

      // Should log error
      expect(logger.error).toHaveBeenCalled();

      // Should show error toast
      expect(toast.error).toHaveBeenCalledWith('Message send failed');

      // Should restore message input
      expect(mockActions.setMessageInput).toHaveBeenCalledWith('Important message');

      // Should restore attachments
      expect(mockActions.addAttachments).toHaveBeenCalledWith(mockFiles);
    });

    it('should trim whitespace from message', async () => {
      const propsWithWhitespace = {
        ...defaultProps,
        messageInput: '  Test message with spaces  ',
      };

      const { result } = renderHook(() => useConversationActions(propsWithWhitespace));

      await act(async () => {
        await result.current.handleSendMessage();
      });

      // Should send trimmed message
      expect(mockMutateAsync).toHaveBeenCalledWith({
        conversationId: 'conv-1',
        content: 'Test message with spaces',
        attachments: [],
      });
    });
  });

  describe('handleResolve', () => {
    it('should resolve conversation successfully', async () => {
      vi.useFakeTimers();

      const { result } = renderHook(() => useConversationActions(defaultProps));

      await act(async () => {
        await result.current.handleResolve();
      });

      // Should update conversation optimistically
      expect(mockActions.selectConversation).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'resolved',
          isLocked: false,
        })
      );

      // Should show success toast
      expect(toast.success).toHaveBeenCalledWith('Conversation closed');

      // Should call API
      expect(mockMutateAsync).toHaveBeenCalledWith('conv-1');

      // Should clear selection after delay
      act(() => {
        vi.advanceTimersByTime(1500);
      });

      expect(mockActions.selectConversation).toHaveBeenCalledWith(null);

      vi.useRealTimers();
    });

    it('should not resolve if no conversation selected', async () => {
      const propsNoConv = {
        ...defaultProps,
        selectedConversation: null,
      };

      const { result } = renderHook(() => useConversationActions(propsNoConv));

      await act(async () => {
        await result.current.handleResolve();
      });

      // Should not call API
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it('should handle resolve failure gracefully', async () => {
      const { logger } = await import('@/shared/utils/logger');
      mockMutateAsync.mockRejectedValueOnce(new Error('Resolve failed'));

      const { result } = renderHook(() => useConversationActions(defaultProps));

      await act(async () => {
        await result.current.handleResolve();
      });

      // Should log error
      expect(logger.error).toHaveBeenCalledWith(
        'Failed to resolve conversation',
        expect.any(Error),
        expect.objectContaining({
          conversationId: 'conv-1',
        })
      );

      // Should show error toast
      expect(toast.error).toHaveBeenCalledWith('Close failed');
    });
  });

  describe('handleSelectConversation', () => {
    it('should select conversation', () => {
      const { result } = renderHook(() => useConversationActions(defaultProps));
      
      const conversation = createMockConversation({ id: 'conv-select' });

      act(() => {
        result.current.handleSelectConversation(conversation);
      });

      expect(mockActions.selectConversation).toHaveBeenCalledWith(conversation);
    });

    it('should mark as read when selecting conversation with unread messages', () => {
      const { result } = renderHook(() => useConversationActions(defaultProps));
      
      const conversationWithUnread = createMockConversation({ 
        id: 'conv-unread',
        unreadCount: 5,
      });

      act(() => {
        result.current.handleSelectConversation(conversationWithUnread);
      });

      // Should select
      expect(mockActions.selectConversation).toHaveBeenCalledWith(conversationWithUnread);

      // Should mark as read
      expect(mockMutate).toHaveBeenCalledWith('conv-unread');
    });

    it('should not mark as read if no unread messages', () => {
      const { result } = renderHook(() => useConversationActions(defaultProps));
      
      const conversationRead = createMockConversation({ 
        id: 'conv-read',
        unreadCount: 0,
      });

      act(() => {
        result.current.handleSelectConversation(conversationRead);
      });

      // Should select
      expect(mockActions.selectConversation).toHaveBeenCalledWith(conversationRead);

      // Should NOT mark as read (already read)
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('should allow deselection (null)', () => {
      const { result } = renderHook(() => useConversationActions(defaultProps));

      act(() => {
        result.current.handleSelectConversation(null);
      });

      expect(mockActions.selectConversation).toHaveBeenCalledWith(null);
    });
  });

  describe('handleCopyMessage', () => {
    it('should copy message to clipboard successfully', async () => {
      const { showSuccess } = await import('@/shared/utils/toast');

      const { result } = renderHook(() => useConversationActions(defaultProps));

      await act(async () => {
        await result.current.handleCopyMessage('msg-1', 'Hello World');
      });

      // Should call clipboard API
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Hello World');

      // Should show success toast
      await waitFor(() => {
        expect(showSuccess).toHaveBeenCalledWith('Message copied');
      });
    });

    it('should handle copy failure gracefully', async () => {
      const { logger } = await import('@/shared/utils/logger');
      const { showError } = await import('@/shared/utils/toast');
      
      const mockError = new Error('Clipboard error');
      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useConversationActions(defaultProps));

      await act(async () => {
        await result.current.handleCopyMessage('msg-fail', 'Text');
      });

      // Should log error
      await waitFor(() => {
        expect(logger.error).toHaveBeenCalledWith(
          'Failed to copy message',
          mockError
        );
      });

      // Should show error toast
      await waitFor(() => {
        expect(showError).toHaveBeenCalledWith('Copy failed');
      });
    });

    it('should copy empty string', async () => {
      const { result } = renderHook(() => useConversationActions(defaultProps));

      await act(async () => {
        await result.current.handleCopyMessage('msg-empty', '');
      });

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('');
    });

    it('should copy long messages', async () => {
      const longMessage = 'A'.repeat(10000);
      const { result } = renderHook(() => useConversationActions(defaultProps));

      await act(async () => {
        await result.current.handleCopyMessage('msg-long', longMessage);
      });

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(longMessage);
    });
  });

  describe('canSendMessage', () => {
    it('should allow sending if conversation is assigned to current user', () => {
      const propsAssigned = {
        ...defaultProps,
        selectedConversation: createMockConversation({
          assignedTo: 'agent-123' as any,
          isLocked: true,
        }),
        userId: 'agent-123',
      };

      const { result } = renderHook(() => useConversationActions(propsAssigned));

      expect(result.current.canSendMessage).toBe(true);
    });

    it('should allow sending if conversation is not locked', () => {
      const propsUnlocked = {
        ...defaultProps,
        selectedConversation: createMockConversation({
          assignedTo: 'other-agent' as any,
          isLocked: false,
        }),
        userId: 'agent-123',
      };

      const { result } = renderHook(() => useConversationActions(propsUnlocked));

      expect(result.current.canSendMessage).toBe(true);
    });

    it('should not allow sending if locked by another agent', () => {
      const propsLocked = {
        ...defaultProps,
        selectedConversation: createMockConversation({
          assignedTo: 'other-agent' as any,
          isLocked: true,
        }),
        userId: 'agent-123',
      };

      const { result } = renderHook(() => useConversationActions(propsLocked));

      expect(result.current.canSendMessage).toBe(false);
    });

    it('should not allow sending if no conversation selected', () => {
      const propsNoConv = {
        ...defaultProps,
        selectedConversation: null,
      };

      const { result } = renderHook(() => useConversationActions(propsNoConv));

      // When no conversation, canSendMessage is falsy (null)
      expect(result.current.canSendMessage).toBeFalsy();
    });
  });

  describe('Real-World Scenarios', () => {
    it('should handle complete agent workflow', async () => {
      vi.useFakeTimers();

      const { result, rerender } = renderHook(
        (props) => useConversationActions(props),
        { initialProps: defaultProps }
      );

      // 1. Agent takes over conversation
      const conversation = createMockConversation({ 
        id: 'workflow-conv',
        customerName: 'Customer',
        status: 'waiting',
      });

      await act(async () => {
        await result.current.handleTakeOver(conversation);
      });

      expect(toast.success).toHaveBeenCalledWith(
        'Conversation taken over for Customer'
      );

      // 2. Agent sends a message
      const propsWithMessage = {
        ...defaultProps,
        selectedConversation: createMockConversation({ id: 'workflow-conv' }),
        messageInput: 'Hello, how can I help?',
      };

      rerender(propsWithMessage);

      await act(async () => {
        await result.current.handleSendMessage();
      });

      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'Hello, how can I help?',
        })
      );

      // 3. Agent resolves conversation
      await act(async () => {
        await result.current.handleResolve();
      });

      expect(toast.success).toHaveBeenCalledWith('Conversation closed');

      // 4. Selection cleared after delay
      act(() => {
        vi.advanceTimersByTime(1500);
      });

      expect(mockActions.selectConversation).toHaveBeenCalledWith(null);

      vi.useRealTimers();
    });

    it('should handle rapid message sending', async () => {
      const { result } = renderHook(() => useConversationActions(defaultProps));

      // Send multiple messages rapidly
      await act(async () => {
        await result.current.handleSendMessage();
        await result.current.handleSendMessage();
        await result.current.handleSendMessage();
      });

      // Should clear input each time
      expect(mockActions.clearMessageInput).toHaveBeenCalledTimes(3);

      // Should send each message
      expect(mockMutateAsync).toHaveBeenCalledTimes(3);
    });

    it('should handle network errors gracefully', async () => {
      mockMutateAsync.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useConversationActions(defaultProps));

      // Try various actions
      await act(async () => {
        await result.current.handleTakeOver(createMockConversation());
      });

      await act(async () => {
        await result.current.handleSendMessage();
      });

      await act(async () => {
        await result.current.handleResolve();
      });

      // All should show error toasts
      expect(toast.error).toHaveBeenCalledTimes(3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long messages', async () => {
      const longMessage = 'A'.repeat(10000);
      const propsLong = {
        ...defaultProps,
        messageInput: longMessage,
      };

      const { result } = renderHook(() => useConversationActions(propsLong));

      await act(async () => {
        await result.current.handleSendMessage();
      });

      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: longMessage,
        })
      );
    });

    it('should handle special characters in messages', async () => {
      const specialMessage = '你好 👋 <script>alert("xss")</script> #test @user';
      const propsSpecial = {
        ...defaultProps,
        messageInput: specialMessage,
      };

      const { result } = renderHook(() => useConversationActions(propsSpecial));

      await act(async () => {
        await result.current.handleSendMessage();
      });

      // Should send as-is (sanitization happens elsewhere)
      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: specialMessage,
        })
      );
    });

    it('should handle many file attachments', async () => {
      const manyFiles = Array.from({ length: 10 }, (_, i) =>
        new File(['content'], `file${i}.pdf`)
      );

      const propsManyFiles = {
        ...defaultProps,
        attachedFiles: manyFiles,
      };

      const { result } = renderHook(() => useConversationActions(propsManyFiles));

      await act(async () => {
        await result.current.handleSendMessage();
      });

      expect(mockMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          attachments: manyFiles,
        })
      );
    });

    it('should handle undefined userId gracefully', async () => {
      const propsNoUser = {
        ...defaultProps,
        userId: undefined,
      };

      const { result } = renderHook(() => useConversationActions(propsNoUser));

      // canSendMessage logic: conversation && (assignedTo === userId || !isLocked)
      // When userId is undefined and conversation is not locked, it returns true
      // This is actually correct behavior - unlocked conversations can be messaged
      expect(result.current.canSendMessage).toBeTruthy();

      await act(async () => {
        await result.current.handleTakeOver(createMockConversation());
      });

      // Should show toast but not call API
      expect(toast.success).toHaveBeenCalled();
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });
  });
});

