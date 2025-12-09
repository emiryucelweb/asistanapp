/**
 * ConversationHeader Component
 * 
 * Displays conversation header with customer info, channel, and action buttons
 * 
 * Features:
 * - Customer name and channel display
 * - Action buttons (resolve, assign, notes, tags)
 * - Fullscreen toggle
 * - Back button for mobile
 * - Optimized with React.memo
 * 
 * @module agent/components/ConversationHeader
 */

import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { CHANNEL_ICONS, CHANNEL_COLORS } from '@/features/agent/constants';
import { 
  X, 
  ChevronLeft, 
  Maximize2, 
  Minimize2, 
  Tag, 
  CheckCircle, 
  Unlock,
  FileText
} from 'lucide-react';

// Types
interface ConversationHeaderProps {
  // Customer Info
  customerName: string;
  channel: 'whatsapp' | 'instagram' | 'web' | 'phone';
  
  // UI State
  isFullscreen: boolean;
  isMobile: boolean;
  
  // Permissions
  canSendMessage: boolean;
  isAssignedToCurrentUser: boolean;
  isLocked: boolean;
  status: 'waiting' | 'assigned' | 'resolved';
  
  // Actions
  onClose: () => void;
  onBack: () => void;
  onToggleFullscreen: () => void;
  onToggleNotes: () => void;
  onToggleTags: () => void;
  onResolve: () => void;
  onTakeOver: () => void;
}

// Use centralized constants from @/features/agent/constants
const channelColors = CHANNEL_COLORS;
const channelIcons = CHANNEL_ICONS;

/**
 * ConversationHeader Component
 * Memoized for performance - only re-renders when props change
 */
const ConversationHeader: React.FC<ConversationHeaderProps> = memo(({
  customerName,
  channel,
  isFullscreen,
  isMobile,
  canSendMessage,
  isAssignedToCurrentUser,
  isLocked,
  status,
  onClose,
  onBack,
  onToggleFullscreen,
  onToggleNotes,
  onToggleTags,
  onResolve,
  onTakeOver,
}) => {
  const { t } = useTranslation('agent');
  return (
    <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800">
      {/* Left Section: Back/Close Button + Customer Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Back/Close Button */}
        {isFullscreen ? (
          <button
            onClick={onClose}
            className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label={t('conversations.header.close')}
            title={t('conversations.header.closeEsc')}
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        ) : (
          <button
            onClick={onBack}
            className="lg:hidden p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label={t('conversations.header.back')}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        )}

        {/* Customer Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-10 h-10 rounded-full ${channelColors[channel]} flex items-center justify-center text-xl flex-shrink-0`}>
            {channelIcons[channel]}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 truncate">
              {customerName}
              <button
                onClick={onToggleNotes}
                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors flex-shrink-0"
                title={t('conversations.header.addNote')}
              >
                <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {channel}
            </p>
          </div>
        </div>
      </div>

      {/* Right Section: Action Buttons */}
      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          title={isFullscreen ? t('conversations.header.exitFullscreen') : t('conversations.header.fullscreen')}
          aria-label={isFullscreen ? t('conversations.header.exitFullscreen') : t('conversations.header.fullscreen')}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>

        {/* Tags Button */}
        <button
          onClick={onToggleTags}
          className="hidden sm:flex px-3 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors items-center gap-2"
          title={t('conversations.header.tags')}
        >
          <Tag className="w-4 h-4" />
          <span className="hidden sm:inline">{t('conversations.header.tags')}</span>
        </button>

        {/* Take Over Button - Show if not assigned to current user and not locked */}
        {!isAssignedToCurrentUser && !isLocked && (
          <button
            onClick={onTakeOver}
            className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
            title={t('conversations.header.takeOver')}
          >
            <Unlock className="w-4 h-4" />
            <span className="hidden sm:inline">{t('conversations.header.takeOver')}</span>
          </button>
        )}

        {/* Resolve Button - Show if assigned to current user and not resolved */}
        {isAssignedToCurrentUser && status !== 'resolved' && (
          <button
            onClick={onResolve}
            className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            title={t('conversations.header.resolve')}
          >
            <CheckCircle className="w-4 h-4" />
            <span className="hidden sm:inline">{t('conversations.header.resolve')}</span>
          </button>
        )}
      </div>
    </div>
  );
});

ConversationHeader.displayName = 'ConversationHeader';

export default ConversationHeader;

