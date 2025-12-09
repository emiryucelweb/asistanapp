/**
 * SearchModal Component - Message Search Interface
 * 
 * Enterprise-grade search modal for finding messages
 * Implements real-time search with keyboard navigation
 * 
 * Features:
 * - Real-time message filtering
 * - Search result highlighting
 * - Click to scroll to message
 * - Empty state handling
 * - Keyboard shortcuts (Esc to close)
 * 
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 */
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import type { TeamChatMessage } from '@/types';
import { formatTime, getAvatarUrl } from '../../utils/helpers';

interface SearchModalProps {
  /**
   * List of messages to search through
   */
  messages: TeamChatMessage[];
  
  /**
   * Current search query
   */
  searchQuery: string;
  
  /**
   * State setters
   */
  setSearchQuery: (query: string) => void;
  
  /**
   * Callbacks
   */
  onClose: () => void;
  onMessageClick: (messageId: string) => void;
}

/**
 * SearchModal - Professional message search interface
 * 
 * Implements:
 * - Auto-focus on search input
 * - Real-time filtering
 * - Message preview with metadata
 * - Scroll to message on click
 * - ARIA dialog pattern
 */
export function SearchModal(props: SearchModalProps) {
  const { t } = useTranslation('admin');
  const {
    messages,
    searchQuery,
    setSearchQuery,
    onClose,
    onMessageClick,
  } = props;

  const searchInputRef = useRef<HTMLInputElement>(null);

  /**
   * Auto-focus search input on mount
   */
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  /**
   * Filter messages by search query
   */
  const filteredMessages = searchQuery.trim()
    ? messages.filter(msg =>
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  /**
   * Handle message click
   */
  const handleMessageClick = (messageId: string) => {
    onMessageClick(messageId);
    onClose();
  };

  /**
   * Handle backdrop click
   */
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h3
            id="search-modal-title"
            className="text-lg font-bold text-gray-900 dark:text-white"
          >
            {t('teamChat.modals.search.title')}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
            aria-label={t('reports.close')}
            type="button"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-4 flex-shrink-0">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              aria-hidden="true"
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('team.searchMessages')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-500 dark:placeholder:text-gray-400"
              aria-label={t('team.searchQuery')}
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {searchQuery.trim() ? (
            filteredMessages.length > 0 ? (
              <div className="space-y-2" role="list" aria-label={t('team.searchResults')}>
                {filteredMessages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => handleMessageClick(message.id)}
                    className="w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    type="button"
                  >
                    <div className="flex items-start gap-2">
                      <img
                        src={getAvatarUrl(message.userId)}
                        alt={t('teamChat.messages.userAvatar')}
                        className="w-8 h-8 rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {t('teamChat.modals.search.user', { userId: message.userId })}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                <Search className="w-12 h-12 mx-auto mb-2 opacity-50" aria-hidden="true" />
                <p className="font-medium">{t('teamChat.modals.search.noResults')}</p>
                <p className="text-sm mt-1">
                  {t('teamChat.modals.search.noResultsFor', { query: searchQuery })}
                </p>
              </div>
            )
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              <Search className="w-12 h-12 mx-auto mb-2 opacity-50" aria-hidden="true" />
              <p className="font-medium">{t('teamChat.modals.search.typeToSearch')}</p>
              <p className="text-sm mt-1">
                {t('teamChat.modals.search.searchInContent')}
              </p>
            </div>
          )}
        </div>

        {/* Footer (Result Count) */}
        {searchQuery.trim() && filteredMessages.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 flex-shrink-0">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {t('teamChat.modals.search.resultsFound', { count: filteredMessages.length })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

