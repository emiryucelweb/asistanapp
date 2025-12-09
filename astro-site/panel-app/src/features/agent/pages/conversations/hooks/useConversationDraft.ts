/**
 * useConversationDraft - Draft Auto-Save Hook
 * 
 * Enterprise-grade draft message management
 * Automatically saves and loads draft messages from localStorage
 * 
 * Features:
 * - Auto-load draft on conversation change
 * - Auto-save with debounce (2s delay)
 * - Per-conversation draft storage
 * - Cleanup on unmount
 * - TypeScript type safety
 * 
 * @author Enterprise Team
 */
import { useEffect } from 'react';
// Type imports
import type { Conversation } from '@/features/agent/types';
import type { UseConversationStateReturn } from '@/features/agent/hooks/useConversationState';

interface UseConversationDraftProps {
  selectedConversation: Conversation | null;
  messageInput: string;
  actions: UseConversationStateReturn['actions'];
}

/**
 * Manages draft message persistence for conversations
 * 
 * @param props - Hook configuration
 * @returns void (side effects only)
 */
export const useConversationDraft = (props: UseConversationDraftProps) => {
  const { selectedConversation, messageInput, actions } = props;

  /**
   * Auto-load draft when conversation changes
   * Loads saved draft from localStorage or clears input
   */
  useEffect(() => {
    if (!selectedConversation) {
      return;
    }

    const draftKey = `draft_${selectedConversation.id as string}`;
    const savedDraft = localStorage.getItem(draftKey);

    if (savedDraft) {
      actions.setMessageInput(savedDraft);
    } else {
      actions.setMessageInput('');
    }
  }, [selectedConversation, actions]);

  /**
   * Auto-save draft periodically (debounced)
   * Saves to localStorage after 2 seconds of inactivity
   */
  useEffect(() => {
    if (!selectedConversation || !messageInput.trim()) {
      return;
    }

    const draftKey = `draft_${selectedConversation.id as string}`;
    const timer = setTimeout(() => {
      localStorage.setItem(draftKey, messageInput);
    }, 2000);

    return () => clearTimeout(timer);
  }, [messageInput, selectedConversation]);
};

