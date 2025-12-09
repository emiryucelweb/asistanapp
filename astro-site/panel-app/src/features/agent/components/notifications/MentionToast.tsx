/**
 * Mention Toast - Real-time Mention Notification
 * 
 * Appears bottom-right for 5 seconds, navigates to team chat on click
 */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AtSign, X } from 'lucide-react';

interface MentionToastProps {
  channelId: string;
  messageId: string;
  channelName: string;
  mentionedBy: string;
  message: string;
  onDismiss: () => void;
}

const MentionToast: React.FC<MentionToastProps> = ({
  channelId,
  messageId,
  channelName,
  mentionedBy,
  message,
  onDismiss,
}) => {
  const { t } = useTranslation('agent');
  const navigate = useNavigate();

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleClick = () => {
    // Navigate to team chat with channel and message ID
    navigate(`/agent/team/chat?channelId=${channelId}&messageId=${messageId}`);
    onDismiss();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-slide-in-right">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border-2 border-orange-500 dark:border-orange-600 overflow-hidden max-w-sm">
        {/* Header */}
        <div className="bg-orange-500 dark:bg-orange-600 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <AtSign className="w-5 h-5" />
            <span className="font-bold text-sm">{t('notifications.mention')}</span>
          </div>
          <button
            onClick={onDismiss}
            className="text-white hover:bg-orange-600 dark:hover:bg-orange-700 rounded p-1 transition-colors"
            type="button"
            aria-label={t('common.close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content - Clickable */}
        <button
          onClick={handleClick}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          type="button"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                {mentionedBy} {t('notifications.mentionedYouIn')} #{channelName}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {message}
              </p>
            </div>
          </div>
          <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 font-medium">
            {t('notifications.clickToView')} →
          </div>
        </button>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-200 dark:bg-slate-700">
          <div className="h-full bg-orange-500 dark:bg-orange-600 animate-shrink-width" />
        </div>
      </div>
    </div>
  );
};

export default MentionToast;

