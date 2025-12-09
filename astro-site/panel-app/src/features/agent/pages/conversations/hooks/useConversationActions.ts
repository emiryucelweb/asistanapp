/**
 * useConversationActions - Business Logic Hook
 * 
 * Enterprise-grade encapsulation of all conversation actions
 * Handles takeover, send message, resolve, copy, etc.
 * 
 * Features:
 * - Clean separation of business logic from UI
 * - API integration via React Query mutations
 * - Optimistic UI updates
 * - Error handling and rollback
 * - Toast notifications
 * - Logger integration
 * 
 * @author Enterprise Team
 */
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { logger } from '@/shared/utils/logger';
import { showSuccess, showError } from '@/shared/utils/toast';
import {
  useSendMessage,
  useAssignConversation,
  useResolveConversation,
  useMarkAsRead,
} from '@/lib/react-query/hooks/useConversations';
// Type imports
import type { Conversation } from '@/features/agent/types';
import type { UseConversationStateReturn } from '@/features/agent/hooks/useConversationState';

interface UseConversationActionsProps {
  actions: UseConversationStateReturn['actions'];
  selectedConversation: Conversation | null;
  messageInput: string;
  attachedFiles: File[];
  userId?: string;
  currentAgentName: string;
}

export const useConversationActions = (props: UseConversationActionsProps) => {
  const {
    actions,
    selectedConversation,
    messageInput,
    attachedFiles,
    userId,
    currentAgentName,
  } = props;

  // Translation
  const { t } = useTranslation('agent');

  // React Query Mutations
  const sendMessageMutation = useSendMessage();
  const assignConversationMutation = useAssignConversation();
  const resolveConversationMutation = useResolveConversation();
  const markAsReadMutation = useMarkAsRead();

  /**
   * Handle conversation takeover
   * Assigns conversation to current agent and locks it
   */
  const handleTakeOver = useCallback(
    async (conversation: Conversation) => {
      try {
        logger.debug('Taking over conversation', { conversationId: conversation.id });

        // Optimistic update
        const updatedConv: Conversation = {
          ...conversation,
          isLocked: true,
          lockedBy: userId as any, // ✅ ACCEPTABLE: User ID brand type compatibility
          lockedByName: currentAgentName,
          assignedTo: userId as any, // ✅ ACCEPTABLE: Agent ID brand type compatibility
          assignedToName: currentAgentName,
          status: 'assigned' as const,
        };

        actions.selectConversation(updatedConv);

        toast.success(t('conversations.actions.conversationTakenOver', { customerName: conversation.customerName }));

        // API call
        if (userId) {
          await assignConversationMutation.mutateAsync({
            conversationId: conversation.id,
            agentId: userId,
          });
        }
      } catch (error) {
        logger.error('Failed to take over conversation', error as Error, {
          conversationId: conversation.id,
        });
        toast.error(t('voiceCall.takeoverFailed'));
      }
    },
    [userId, currentAgentName, actions, assignConversationMutation, t]
  );

  /**
   * Handle sending a message
   * Supports text + file attachments
   */
  const handleSendMessage = useCallback(async () => {
    if ((!messageInput.trim() && attachedFiles.length === 0) || !selectedConversation) {
      return;
    }

    const messageContent = messageInput.trim();
    const conversationId = selectedConversation.id;
    const filesToSend = [...attachedFiles];

    // Clear input immediately for better UX
    actions.clearMessageInput();

    try {
      await sendMessageMutation.mutateAsync({
        conversationId,
        content: messageContent || t('voiceCall.messageFileSent'),
        attachments: filesToSend,
      });

      logger.debug('Message sent successfully', {
        conversationId,
        filesCount: filesToSend.length,
      });
    } catch (error) {
      logger.error('Failed to send message', error as Error, { conversationId });
      toast.error(t('voiceCall.messageSendFailed'));

      // Rollback on error
      actions.setMessageInput(messageContent);
      actions.addAttachments(filesToSend);
    }
  }, [
    messageInput,
    attachedFiles,
    selectedConversation,
    actions,
    sendMessageMutation,
    t,
  ]);

  /**
   * Handle resolving/closing a conversation
   * Marks conversation as resolved and unlocks it
   */
  const handleResolve = useCallback(async () => {
    if (!selectedConversation) return;

    const conversationId = selectedConversation.id;

    try {
      logger.debug('Resolving conversation', { conversationId });

      // Optimistic update
      actions.selectConversation({
        ...selectedConversation,
        status: 'resolved',
        isLocked: false,
      });

      toast.success(t('voiceCall.conversationClosed'));

      // API call
      await resolveConversationMutation.mutateAsync(conversationId);

      // Clear selection after a delay
      setTimeout(() => {
        actions.selectConversation(null);
      }, 1500);
    } catch (error) {
      logger.error('Failed to resolve conversation', error as Error, {
        conversationId,
      });
      toast.error(t('voiceCall.conversationCloseFailed'));
    }
  }, [selectedConversation, actions, resolveConversationMutation, t]);

  /**
   * Handle conversation selection with mark-as-read
   */
  const handleSelectConversation = useCallback(
    (conversation: Conversation | null) => {
      actions.selectConversation(conversation);

      // Mark as read if has unread messages
      if (conversation && conversation.unreadCount > 0) {
        markAsReadMutation.mutate(conversation.id as string);
      }
    },
    [actions, markAsReadMutation]
  );

  /**
   * Handle copying a message to clipboard
   */
  const handleCopyMessage = useCallback((messageId: string, text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showSuccess(t('conversations.actions.messageCopied'));
      })
      .catch((err) => {
        logger.error('Failed to copy message', err as Error);
        showError(t('conversations.actions.copyFailed'));
      });
  }, [t]);

  /**
   * Check if current user can send messages
   */
  const canSendMessage =
    selectedConversation &&
    (selectedConversation.assignedTo === userId || !selectedConversation.isLocked);

  return {
    handleTakeOver,
    handleSendMessage,
    handleResolve,
    handleSelectConversation,
    handleCopyMessage,
    canSendMessage,
  };
};

