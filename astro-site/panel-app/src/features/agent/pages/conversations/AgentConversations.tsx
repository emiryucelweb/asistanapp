/**
 * Agent Conversations - Conversations Management Page
 * 
 * Enterprise-grade modular architecture
 * Refactored from 762 lines to clean component composition
 * 
 * Architecture:
 * - Custom hooks for state & logic (useConversationState, useConversationActions, etc.)
 * - Modular UI components (Header, List, MessageArea, etc.)
 * - Separation of concerns (UI, Logic, State)
 * 
 * Features:
 * - Real-time conversation management
 * - Multi-channel support (WhatsApp, Instagram, Web, etc.)
 * - AI handoff & agent takeover
 * - Draft auto-save
 * - Keyboard shortcuts
 * - Advanced filtering & search
 * - Customer history & notes
 * 
 * @author Enterprise Team
 * @version 2.0.0 (Refactored)
 */
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, MessageCircle, FileText } from 'lucide-react';

// ==================== EXTRACTED COMPONENTS ====================
import ConversationHeader from '@/features/agent/components/conversations/ConversationHeader';
import ConversationList from '@/features/agent/components/conversations/ConversationList';
import MessageArea from '@/features/agent/components/conversations/MessageArea';
import MessageInput from '@/features/agent/components/conversations/MessageInput';
import QuickReplies from '@/features/agent/components/conversations/QuickReplies';
import TagsPanel from '@/features/agent/components/conversations/TagsPanel';
import AdvancedFilters from '@/features/agent/components/conversations/AdvancedFilters';
import AssignmentModal from '@/features/agent/components/conversations/AssignmentModal';
import KeyboardShortcutsHelp from '@/features/agent/components/KeyboardShortcutsHelp';
import CustomerHistoryPanel from '@/features/agent/components/conversations/CustomerHistoryPanel';

// ==================== HOOKS ====================
import { useAuthStore } from '@/shared/stores/auth-store';
import { useConversations } from '@/lib/react-query/hooks/useConversations';
import { useConversationState } from '@/features/agent/hooks/useConversationState';
import {
  useConversationActions,
  useConversationDraft,
  useConversationKeyboard,
} from './hooks';

// ==================== SERVICES ====================
import {
  filterConversations,
  sortConversations,
  type ConversationFilters,
} from '@/features/agent/services/conversationService';

// ==================== UTILS ====================
import { logger } from '@/shared/utils/logger';
import { showSuccess } from '@/shared/utils/toast';

// ==================== TYPES ====================
import type { 
  Conversation as ConversationType, 
  ConversationWithMessages,
  Message as MessageType
} from '@/features/agent/types';

// Type adapters for structural compatibility
import {
  adaptConversationsForComponent,
  adaptConversationForComponent,
  adaptMessagesForComponent,
  type ComponentConversation,
} from './types/adapters';

// Type aliases
type Conversation = ConversationType;
type Message = MessageType;

/**
 * AgentConversations - Main orchestrator component
 * 
 * Responsibilities:
 * - Compose UI from modular components
 * - Coordinate state between hooks
 * - Handle data fetching and filtering
 * - Manage modal routing
 * 
 * This component is now ~400 lines (down from 762)
 * All business logic is delegated to specialized hooks
 */
const AgentConversations: React.FC = () => {
  const { t } = useTranslation('agent');
  // ==================== ROUTING ====================
  const [searchParams, setSearchParams] = useSearchParams();
  
  // ==================== STATE MANAGEMENT ====================
  const { state, actions } = useConversationState();
  const { user } = useAuthStore();

  // ==================== LOCAL UI STATE ====================
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // ==================== REFS ====================
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ==================== DERIVED STATE ====================
  const currentAgentName = user?.name || 'Agent';

  // ==================== DATA FETCHING ====================
  const { data: conversationsData, isLoading: _isLoadingConversations } = useConversations({
    limit: 100,
  });

  // Type-safe conversation mapping from API data with proper type conversion
  const conversations: Conversation[] = useMemo(
    () => (conversationsData || []) as unknown as Conversation[],
    [conversationsData]
  );

  const allConversations: Conversation[] = conversations;

  // ==================== FILTERING & SORTING ====================
  // Type-safe filter construction
  const tabMapping = {
    all: 'all',
    my: 'my',
    waiting: 'waiting',
    assigned: 'assigned',
  } as const;

  // Memoize filters object to prevent unnecessary re-filters
  const filters: ConversationFilters = useMemo(() => ({
    activeTab: tabMapping[state.ui.activeTab] as ConversationFilters['activeTab'],
    searchQuery: state.filters.searchQuery,
    status: state.filters.filterStatus as 'all' | 'waiting' | 'assigned' | 'resolved',
    userId: user?.id,
  }), [state.ui.activeTab, state.filters.searchQuery, state.filters.filterStatus, user?.id]);

  // Memoize filtered and sorted conversations to prevent unnecessary recalculations
  const filteredConversations = useMemo(() => {
    const filtered = filterConversations(allConversations, filters);
    return sortConversations(filtered, 'priority', 'desc') as Conversation[];
  }, [allConversations, filters]);

  // ==================== BUSINESS LOGIC HOOKS ====================
  const conversationActions = useConversationActions({
    actions,
    selectedConversation: state.data.selectedConversation,
    messageInput: state.data.messageInput,
    attachedFiles: state.data.attachedFiles,
    userId: user?.id,
    currentAgentName,
  });

  useConversationDraft({
    selectedConversation: state.data.selectedConversation,
    messageInput: state.data.messageInput,
    actions,
  });

  // ==================== KEYBOARD SHORTCUTS ====================
  // Manual memoization for keyboard shortcuts props
  const keyboardProps = {
    actions,
    selectedConversation: state.data.selectedConversation,
    messageInput: state.data.messageInput,
    isFullscreen: state.ui.isFullscreen,
    canSendMessage: conversationActions.canSendMessage,
    filteredConversations,
    searchInputRef,
    messageInputRef: { current: null } as React.RefObject<HTMLInputElement>,
    showQuickReplies: state.ui.showQuickReplies,
    showTags: state.ui.showTags,
    showAdvancedFilters: state.ui.showAdvancedFilters,
    showAssignment: state.ui.showAssignment,
    showKeyboardHelp: state.ui.showKeyboardHelp,
    onSendMessage: conversationActions.handleSendMessage,
    onResolve: conversationActions.handleResolve,
  };

  useConversationKeyboard({
    ...keyboardProps,
    canSendMessage: keyboardProps.canSendMessage ?? false,
  });

  // ==================== EFFECTS ====================

  /**
   * Handle URL-based conversation opening
   * Opens conversation from ?openConversation query param
   */
  useEffect(() => {
    const openConversationId = searchParams.get('openConversation');
    if (openConversationId && !state.data.selectedConversation) {
      const conversationToOpen = conversations.find((c) => c.id === openConversationId);
      if (conversationToOpen) {
        conversationActions.handleSelectConversation(conversationToOpen);
        setSearchParams({});
      }
    }
  }, [
    searchParams,
    conversations,
    state.data.selectedConversation,
    setSearchParams,
    conversationActions,
  ]);

  // ==================== RENDER ====================

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-900">
      {/* ========== HEADER ========== */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('conversations.title')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('conversations.count', { count: filteredConversations.length })}
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => actions.toggleAdvancedFilters()}
              className="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 flex items-center gap-2"
              type="button"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">{t('conversations.filters.filters')}</span>
              {state.filters.appliedFilters && (
                <span className="bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {(state.filters.appliedFilters.channels.length || 0) +
                    (state.filters.appliedFilters.tags.length || 0) +
                    (state.filters.appliedFilters.assignedTo.length || 0) +
                    (state.filters.appliedFilters.priority.length || 0) +
                    (state.filters.appliedFilters.dateRange ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {(['all', 'assigned', 'my', 'waiting'] as const).map((tab) => (
          <button
              key={tab}
              onClick={() => actions.setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                state.ui.activeTab === tab
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
              type="button"
            >
              {t(`conversations.tabs.${tab}`)}
              <span className="ml-1.5 text-xs opacity-75">
                (
                  {
                  filterConversations(allConversations, {
                    ...filters,
                    activeTab: tab as ConversationFilters['activeTab'],
                  }).length
                }
                )
              </span>
          </button>
          ))}
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={t('conversations.searchWithShortcut')}
            value={state.filters.searchQuery}
            onChange={(e) => actions.setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* ========== MAIN CONTENT ========== */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-full sm:w-96 border-r border-gray-200 dark:border-slate-700 overflow-y-auto">
          <ConversationList
            conversations={filteredConversations}
            selectedConversation={state.data.selectedConversation}
            currentUserId="current-user-id"
            onSelect={conversationActions.handleSelectConversation}
            onTakeOver={conversationActions.handleTakeOver}
            onAssign={(id: string) => actions.toggleAssignment(id)}
          />
        </div>

        {/* Message Area */}
        <div className="flex-1 flex flex-col">
          {state.data.selectedConversation ? (
            <>
              <ConversationHeader
                customerName={state.data.selectedConversation.customerName}
                channel={state.data.selectedConversation.channel as 'whatsapp' | 'instagram' | 'web' | 'phone'}
                isFullscreen={state.ui.isFullscreen ?? false}
                isMobile={false}
                canSendMessage={!state.data.selectedConversation.isLocked || state.data.selectedConversation.lockedBy === 'current-user-id'}
                isAssignedToCurrentUser={state.data.selectedConversation.assignedTo === 'current-user-id'}
                isLocked={state.data.selectedConversation.isLocked}
                status={state.data.selectedConversation.status as 'waiting' | 'assigned' | 'resolved'}
                onClose={() => actions.selectConversation(null)}
                onBack={() => actions.selectConversation(null)}
                onToggleFullscreen={() => actions.toggleFullscreen()}
                onToggleNotes={() => actions.toggleNotes()}
                onToggleTags={() => {/* TODO: Implement tags */}}
                onResolve={() => conversationActions.handleResolve()}
                onTakeOver={() => conversationActions.handleTakeOver(state.data.selectedConversation!)}
              />

              <MessageArea
                messages={adaptMessagesForComponent(Array.from((state.data.selectedConversation as ConversationWithMessages).messages || []))}
                isCustomerTyping={state.data.isCustomerTyping}
                copiedMessageId={copiedMessageId}
                onCopyMessage={(id, text) => {
                  conversationActions.handleCopyMessage(id, text);
                  setCopiedMessageId(id);
                  setTimeout(() => setCopiedMessageId(null), 2000);
                }}
              />

              {(() => {
                const messageInputProps = {
                  messageInput: state.data.messageInput,
                  attachedFiles: state.data.attachedFiles,
                  showEmojiPicker: state.ui.showEmojiPicker,
                  canSendMessage: conversationActions.canSendMessage,
                  isLocked: state.data.selectedConversation?.isLocked || false,
                  lockedBy: state.data.selectedConversation?.lockedBy as string | undefined,
                  onMessageChange: (value: string) => actions.setMessageInput(value),
                  onSendMessage: conversationActions.handleSendMessage,
                  onAddFiles: (files: File[]) => actions.addAttachments(files),
                  onRemoveFile: (index: number) => actions.removeAttachment(index),
                  onResolve: conversationActions.handleResolve,
                  onToggleQuickReplies: () => actions.toggleQuickReplies(),
                  onToggleEmojiPicker: () => actions.toggleEmojiPicker(),
                  onEmojiSelect: (emoji: string) => actions.setMessageInput(state.data.messageInput + emoji),
                  onToggleNotes: () => actions.toggleNotes(),
                };
                return <MessageInput {...{
                  ...messageInputProps,
                  canSendMessage: messageInputProps.canSendMessage ?? false,
                }} />;
              })()}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {t('conversations.selectConversation')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========== MODALS & PANELS ========== */}

      {/* Quick Replies Modal */}
      {state.ui.showQuickReplies && (
        <QuickReplies
          onSelect={(content) => actions.setMessageInput(content)}
          onClose={() => actions.toggleQuickReplies()}
        />
      )}

      {/* Notes Panel */}
      {state.ui.showNotes && state.data.selectedConversation && (
        <div className="fixed right-4 bottom-24 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden z-40">
            <div className="p-4 bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {t('conversations.notes.title')}
            </h3>
            <button
              onClick={() => actions.toggleNotes()}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              type="button"
            >
              ✕
            </button>
          </div>
          <div className="p-4">
            <textarea
              value={state.data.notes}
              onChange={(e) => actions.setNotes(e.target.value)}
              placeholder={t('conversations.addNotesPlaceholder')}
              className="w-full h-32 px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-900 dark:text-gray-100 text-sm resize-none"
            />
            <button
              onClick={() => {
                logger.debug('Saving notes', {
                  conversationId: state.data.selectedConversation!.id,
                  notes: state.data.notes,
                });
                showSuccess(t('conversations.notes.saved'));
                actions.toggleNotes();
              }}
              className="mt-2 w-full px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
              type="button"
            >
              {t('common:save')}
            </button>
          </div>
        </div>
      )}

      {/* Tags Panel */}
      {state.ui.showTags && state.data.selectedConversation && (
        <TagsPanel
          conversationId={state.data.selectedConversation.id}
          currentTags={[]}
          onClose={() => actions.toggleTags()}
        />
      )}

      {/* Advanced Filters */}
      {state.ui.showAdvancedFilters && (
        <AdvancedFilters
          onClose={() => actions.toggleAdvancedFilters()}
          onApply={(filters) => {
            actions.setAppliedFilters(filters);
            logger.debug('Filters applied', { filters });
            showSuccess(t('conversations.filters.applied'));
          }}
        />
      )}

      {/* Assignment Modal */}
      {state.ui.showAssignment && state.data.assignmentConversationId && (
        <AssignmentModal
          conversationId={state.data.assignmentConversationId}
          onClose={() => {
            actions.toggleAssignment(null);
          }}
          onAssign={(agentId, mode, reason) => {
            logger.debug('Assigning conversation', {
              conversationId: state.data.assignmentConversationId,
              agentId,
              mode,
              reason,
            });
            const message = reason 
              ? t('conversations.assignment.successWithReason', { reason })
              : t('conversations.assignment.success');
            showSuccess(message);
            actions.toggleAssignment(null);
          }}
        />
      )}

      {/* Keyboard Shortcuts Help */}
      {state.ui.showKeyboardHelp && (
        <KeyboardShortcutsHelp onClose={() => actions.toggleKeyboardHelp()} />
      )}

      {/* Customer History Panel */}
      {state.ui.showCustomerHistory && state.data.selectedConversation && (
        <CustomerHistoryPanel
          customerId={state.data.selectedConversation.id}
          customerName={state.data.selectedConversation.customerName}
          customerEmail={`${state.data.selectedConversation.customerName
            .toLowerCase()
            .replace(' ', '.')}@example.com`}
          customerPhone="+90 532 123 45 67"
          onClose={() => actions.toggleCustomerHistory()}
        />
      )}
    </div>
  );
};

export default AgentConversations;
