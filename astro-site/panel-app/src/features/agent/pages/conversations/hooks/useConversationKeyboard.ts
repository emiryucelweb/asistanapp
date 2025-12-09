/**
 * useConversationKeyboard - Keyboard Shortcuts Hook
 * 
 * Enterprise-grade keyboard shortcuts for conversation management
 * Comprehensive keyboard navigation and actions
 * 
 * Features:
 * - 12+ keyboard shortcuts
 * - Context-aware activation
 * - Fullscreen support (F11, Esc)
 * - Navigation shortcuts (Ctrl+N/P)
 * - Action shortcuts (Ctrl+R, Ctrl+K, etc.)
 * - Help modal (?)
 * 
 * @author Enterprise Team
 */
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useKeyboardShortcuts } from '@/features/agent/hooks/useKeyboardShortcuts';
import { toBoolean } from '@/shared/utils/type-helpers';
// Type imports
import type { Conversation } from '@/features/agent/types';
import type { UseConversationStateReturn } from '@/features/agent/hooks/useConversationState';

interface UseConversationKeyboardProps {
  actions: UseConversationStateReturn['actions'];
  selectedConversation: Conversation | null;
  messageInput: string;
  isFullscreen: boolean | null;
  canSendMessage: boolean;
  filteredConversations: Conversation[];
  searchInputRef: React.RefObject<HTMLInputElement>;
  messageInputRef: React.RefObject<HTMLInputElement>;
  showQuickReplies: boolean;
  showTags: boolean;
  showAdvancedFilters: boolean;
  showAssignment: boolean;
  showKeyboardHelp: boolean;
  onSendMessage: () => void;
  onResolve: () => void;
}

/**
 * Manages keyboard shortcuts for conversations
 * 
 * @param props - Hook configuration
 * @returns void (side effects only)
 */
export const useConversationKeyboard = (props: UseConversationKeyboardProps) => {
  const { t } = useTranslation('agent');
  
  const {
    actions,
    selectedConversation,
    messageInput,
    isFullscreen,
    canSendMessage,
    filteredConversations,
    searchInputRef,
    messageInputRef,
    showQuickReplies,
    showTags,
    showAdvancedFilters,
    showAssignment,
    showKeyboardHelp,
    onSendMessage,
    onResolve,
  } = props;

  /**
   * Fullscreen and Escape key handling
   * Separate from useKeyboardShortcuts for priority handling
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape: Exit fullscreen or close conversation
      if (e.key === 'Escape') {
        if (toBoolean(isFullscreen)) {
          actions.toggleFullscreen();
        } else if (selectedConversation) {
          actions.selectConversation(null);
        }
      }

      // F11: Toggle fullscreen (if conversation is open)
      if (e.key === 'F11' && selectedConversation) {
        e.preventDefault();
        actions.toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, selectedConversation, actions]);

  /**
   * Application keyboard shortcuts
   * Only active when modals are closed
   */
  const isShortcutsActive =
    !showQuickReplies &&
    !showTags &&
    !showAdvancedFilters &&
    !showAssignment &&
    !showKeyboardHelp;

  useKeyboardShortcuts(
    [
      // Ctrl+K: Focus search
      {
        key: 'k',
        ctrl: true,
        description: t('keyboard.focusSearch'),
        action: () => searchInputRef.current?.focus(),
      },

      // Ctrl+Enter: Send message
      {
        key: 'Enter',
        ctrl: true,
        description: t('keyboard.sendMessage'),
        action: () => {
          if (canSendMessage && messageInput.trim()) {
            onSendMessage();
          }
        },
      },

      // /: Open quick replies (when in message input)
      {
        key: '/',
        description: t('keyboard.quickReplies'),
        action: () => {
          const activeElement = document.activeElement;
          if (activeElement === messageInputRef.current) {
            actions.toggleQuickReplies();
          }
        },
        preventDefault: true,
      },

      // Esc: Close modals
      {
        key: 'Escape',
        description: t('keyboard.closeModals'),
        action: () => {
          actions.closeAllModals();
        },
        preventDefault: false,
      },

      // Ctrl+N: Next conversation
      {
        key: 'n',
        ctrl: true,
        description: t('keyboard.nextConversation'),
        action: () => {
          if (!selectedConversation) return;
          const currentIndex = filteredConversations.findIndex(
            (c) => c.id === selectedConversation.id
          );
          if (currentIndex < filteredConversations.length - 1) {
            actions.selectConversation(filteredConversations[currentIndex + 1]);
          }
        },
      },

      // Ctrl+P: Previous conversation
      {
        key: 'p',
        ctrl: true,
        description: t('keyboard.previousConversation'),
        action: () => {
          if (!selectedConversation) return;
          const currentIndex = filteredConversations.findIndex(
            (c) => c.id === selectedConversation.id
          );
          if (currentIndex > 0) {
            actions.selectConversation(filteredConversations[currentIndex - 1]);
          }
        },
      },

      // Ctrl+R: Resolve conversation
      {
        key: 'r',
        ctrl: true,
        description: t('keyboard.resolveConversation'),
        action: () => {
          if (selectedConversation && canSendMessage) {
            onResolve();
          }
        },
      },

      // ?: Show keyboard help
      {
        key: '?',
        description: t('keyboard.showShortcuts'),
        action: () => actions.toggleKeyboardHelp(),
        preventDefault: true,
      },

      // Ctrl+Shift+T: Add tag
      {
        key: 't',
        ctrl: true,
        shift: true,
        description: t('keyboard.addTags'),
        action: () => {
          if (selectedConversation) {
            actions.toggleTags();
          }
        },
      },
    ],
    isShortcutsActive
  );
};

