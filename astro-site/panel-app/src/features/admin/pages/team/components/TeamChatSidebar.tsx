/**
 * TeamChatSidebar Component - Channel Navigation
 * 
 * Enterprise-grade sidebar with channel list and search
 * Implements responsive design and keyboard navigation
 * 
 * Features:
 * - Channel categorization (channels vs direct messages)
 * - Real-time search filtering
 * - Active channel highlighting
 * - Unread badge indicators
 * - Create channel CTA (permission-based)
 * - Pin/unpin channels
 * 
 * @see https://www.nngroup.com/articles/navigation-sidebar/
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Hash, Lock, Plus, Search, MessageSquare } from 'lucide-react';
import type { TeamChannel } from '@/types';

interface TeamChatSidebarProps {
  /**
   * List of all channels
   */
  channels: TeamChannel[];
  
  /**
   * Currently selected channel
   */
  selectedChannel: TeamChannel | null;
  
  /**
   * Search query for filtering channels
   */
  searchQuery: string;
  
  /**
   * Whether current user can manage channels
   */
  canManageChannels: boolean;
  
  /**
   * State setters
   */
  setSearchQuery: (query: string) => void;
  setShowCreateChannelModal: (show: boolean) => void;
  setShowNewDMModal: (show: boolean) => void;
  
  /**
   * Callbacks
   */
  onChannelSelect: (channel: TeamChannel) => void;
}

/**
 * TeamChatSidebar - Channel navigation component
 * 
 * Implements:
 * - Responsive design (hidden on mobile, visible on md+)
 * - Channel filtering by name
 * - Channel type icons (public/private/direct)
 * - Unread count badges
 * - Pinned channels priority
 */
export function TeamChatSidebar(props: TeamChatSidebarProps) {
  const { t } = useTranslation('admin');
  const {
    channels,
    selectedChannel,
    searchQuery,
    canManageChannels,
    setSearchQuery,
    setShowCreateChannelModal,
    setShowNewDMModal,
    onChannelSelect,
  } = props;

  /**
   * Filter channels by search query
   */
  const filterChannels = (channelList: TeamChannel[]) => {
    if (!searchQuery.trim()) {
      return channelList;
    }
    
    const query = searchQuery.toLowerCase();
    return channelList.filter(channel =>
      channel.name.toLowerCase().includes(query)
    );
  };

  /**
   * Get channels by type (excluding direct messages)
   */
  const publicChannels = filterChannels(
    channels.filter(ch => ch.type !== 'direct')
  );

  /**
   * Get direct messages
   */
  const directMessages = filterChannels(
    channels.filter(ch => ch.type === 'direct')
  );

  /**
   * Sort channels: pinned first, then by name
   */
  const sortChannels = (channelList: TeamChannel[]) => {
    return [...channelList].sort((a, b) => {
      // Pinned channels first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // Then alphabetically
      return a.name.localeCompare(b.name);
    });
  };

  /**
   * Render channel icon based on type
   */
  const renderChannelIcon = (channel: TeamChannel) => {
    if (channel.type === 'direct') {
      return (
        <img
          src={channel.metadata?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${channel.id}`}
          alt={channel.name}
          className="w-5 h-5 rounded flex-shrink-0"
        />
      );
    }
    
    if (channel.type === 'private') {
      return (
        <Lock 
          className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" 
          aria-label={t('teamChat.sidebar.privateChannel')}
        />
      );
    }
    
    return (
      <Hash 
        className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0"
        aria-label={t('teamChat.sidebar.publicChannel')}
      />
    );
  };

  /**
   * Render channel list item
   */
  const renderChannelItem = (channel: TeamChannel) => {
    const isSelected = selectedChannel?.id === channel.id;
    const hasUnread = (channel.unreadCount || 0) > 0;
    
    return (
      <button
        key={channel.id}
        onClick={() => onChannelSelect(channel)}
        className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded text-sm mb-1 transition-colors ${
          isSelected
            ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
            : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300'
        }`}
        aria-label={`${channel.name}${hasUnread ? `, ${t('teamChat.sidebar.unreadMessages', { count: channel.unreadCount })}` : ''}`}
        aria-current={isSelected ? 'page' : undefined}
        type="button"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {renderChannelIcon(channel)}
          
          <span className={`truncate ${hasUnread ? 'font-semibold' : ''}`}>
            {channel.name}
          </span>
        </div>
        
        {/* Unread badge */}
        {hasUnread && (
          <span 
            className="flex-shrink-0 px-1.5 py-0.5 bg-purple-600 dark:bg-purple-500 text-white text-xs rounded-full min-w-[20px] text-center"
            aria-label={t('teamChat.sidebar.unread', { count: channel.unreadCount })}
          >
            {channel.unreadCount! > 99 ? '99+' : channel.unreadCount}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="hidden md:flex md:w-64 lg:w-72 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex-col">
      {/* Sidebar Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {t('teamChat.sidebar.channels')}
          </h2>
          
          {canManageChannels && (
            <button 
              onClick={() => setShowCreateChannelModal(true)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
              aria-label={t('teamChat.sidebar.createChannel')}
              title={t('teamChat.sidebar.createChannelAdmin')}
              type="button"
            >
              <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" aria-hidden="true" />
            </button>
          )}
        </div>
        
        {/* Search Input */}
        <div className="relative">
          <Search 
            className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" 
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('teamChat.sidebar.searchChannels')}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-100 dark:bg-slate-700 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
            aria-label={t('teamChat.sidebar.searchChannelsAria')}
          />
        </div>
      </div>

      {/* Channel Lists */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* Public/Private Channels Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              {t('teamChat.sidebar.channelsSection')}
            </p>
            {publicChannels.length > 0 && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {publicChannels.length}
              </span>
            )}
          </div>
          
          {sortChannels(publicChannels).map(renderChannelItem)}
          
          {publicChannels.length === 0 && (
            <p className="px-2 py-4 text-xs text-gray-500 dark:text-gray-400 text-center">
              {searchQuery ? t('teamChat.sidebar.noChannelsFound') : t('teamChat.sidebar.noChannelsYet')}
            </p>
          )}
        </div>

        {/* Direct Messages Section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              {t('teamChat.sidebar.directMessages')}
            </p>
            <button
              onClick={() => setShowNewDMModal(true)}
              className="p-0.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
              aria-label={t('teamChat.sidebar.newDirectMessage')}
              type="button"
            >
              <Plus className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            </button>
          </div>
          
          {sortChannels(directMessages).map(renderChannelItem)}
          
          {directMessages.length === 0 && (
            <p className="px-2 py-4 text-xs text-gray-500 dark:text-gray-400 text-center">
              {searchQuery ? t('teamChat.sidebar.noUsersFound') : t('teamChat.sidebar.noDirectMessagesYet')}
            </p>
          )}
        </div>
      </div>

      {/* Sidebar Footer (Optional) */}
      <div className="p-3 border-t border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <MessageSquare className="w-4 h-4" aria-hidden="true" />
          <span>
            {t('teamChat.sidebar.channelCount', { count: channels.length })}
          </span>
        </div>
      </div>
    </div>
  );
}

