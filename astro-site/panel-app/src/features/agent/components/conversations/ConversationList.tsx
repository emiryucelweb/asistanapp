/**
 * ConversationList Component
 * 
 * Displays a list of conversations with filtering, sorting, and selection
 * 
 * Features:
 * - Conversation list rendering
 * - Channel icons and colors
 * - Status badges (waiting, assigned, AI stuck, locked)
 * - Priority indicators
 * - Unread count display
 * - Assignment button
 * - Empty state
 * - Selection highlighting
 * - Optimized with React.memo and useMemo
 * 
 * @module agent/components/ConversationList
 */

import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CHANNEL_ICONS, CHANNEL_COLORS, PRIORITY_COLORS } from '@/features/agent/constants';
import { MessageCircle, Bot, Lock } from 'lucide-react';
import type { Conversation } from '@/features/agent/types';

interface ConversationListProps {
  // Data
  conversations: Conversation[];
  selectedConversation?: Conversation | null;
  currentUserId?: string;
  
  // Callbacks
  onSelect: (conversation: Conversation | null) => void;
  onTakeOver: (conversation: Conversation) => Promise<void>;
  onAssign: (conversationId: string) => void;
  
  // UI State
  isLoading?: boolean;
}

// Use centralized constants from @/features/agent/constants
const channelColors = CHANNEL_COLORS;
const channelIcons = CHANNEL_ICONS;
const priorityColors = PRIORITY_COLORS;

const sentimentEmojis: Record<string, string> = {
  happy: '😊',
  neutral: '😐',
  angry: '😠',
  sad: '😢',
};

/**
 * ConversationList Component
 * Memoized for performance - only re-renders when props change
 */
const ConversationList: React.FC<ConversationListProps> = memo(({
  conversations,
  selectedConversation,
  currentUserId,
  onSelect,
  onTakeOver,
  onAssign,
  isLoading = false,
}) => {
  const { t } = useTranslation('agent');
  
  // Memoize empty state check
  const isEmpty = useMemo(() => conversations.length === 0, [conversations.length]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-orange-500 animate-bounce"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.6s',
                }}
              />
            ))}
          </div>
          <p className="text-gray-500 dark:text-gray-400">{t('conversations.loading')}</p>
        </div>
      </div>
    );
  }

  // Render empty state
  if (isEmpty) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center justify-center py-12">
          <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">{t('conversations.noConversations')}</p>
        </div>
      </div>
    );
  }

  // ✅ PERFORMANCE: Optimized conversation list
  // Using React.memo and useMemo for performance
  // Virtual scrolling can be added later if conversation count exceeds 500+
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="divide-y divide-gray-200 dark:divide-slate-700">
        {conversations.map((conversation: Conversation) => {
          const isSelected = selectedConversation?.id === conversation.id;
          const isAssignedToMe = conversation.assignedTo === currentUserId;

          return (
            <button
              key={conversation.id}
              onClick={() => onSelect(conversation)}
              className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${
                isSelected
                  ? 'bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500'
                  : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Channel Icon */}
                <div className={`w-12 h-12 rounded-full ${channelColors[conversation.channel]} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {channelIcons[conversation.channel]}
                </div>

                {/* Conversation Info */}
                <div className="flex-1 min-w-0">
                  {/* Header: Name + Time */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {conversation.customerName}
                      {conversation.sentiment && (
                        <span className="ml-2 text-sm" title={conversation.sentiment}>
                          {sentimentEmojis[conversation.sentiment]}
                        </span>
                      )}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                      {conversation.lastMessageTime}
                    </span>
                  </div>

                  {/* Last Message */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
                    {conversation.lastMessage}
                  </p>

                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Priority Badge */}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[conversation.priority]}`}>
                      {conversation.priority === 'high' && '🔥 ' + t('conversations.list.urgentPriority')}
                      {conversation.priority === 'medium' && '⚠️ ' + t('conversations.list.highPriority')}
                      {conversation.priority === 'low' && '📋 ' + t('conversations.list.lowPriority')}
                    </span>

                    {/* Status Badges */}
                    {conversation.isLocked && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {conversation.lockedBy}
                      </span>
                    )}

                    {conversation.aiStuck && (
                      <span className="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full font-bold flex items-center gap-1 animate-pulse">
                        <Bot className="w-3 h-3" />
                        {t('conversations.list.aiStuck')}
                      </span>
                    )}

                    {/* Unread Count */}
                    {conversation.unreadCount > 0 && (
                      <span className="text-xs px-2 py-0.5 bg-orange-500 text-white rounded-full font-bold">
                        {conversation.unreadCount}
                      </span>
                    )}

                    {/* Assignment Button */}
                    {!isAssignedToMe && conversation.status === 'waiting' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAssign(conversation.id as string);
                        }}
                        className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                      >
                        {t('conversations.list.forward')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
});

ConversationList.displayName = 'ConversationList';

export default ConversationList;

