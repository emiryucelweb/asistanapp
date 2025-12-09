/**
 * Typing Indicator - Real-time Typing Status
 * 
 * Shows when customer or agent is typing
 */
import React from 'react';
import { useTranslation } from 'react-i18next';

interface TypingIndicatorProps {
  name?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ name }) => {
  const { t } = useTranslation('agent');
  const displayName = name || t('typingIndicator.defaultName');
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        {displayName.charAt(0)}
      </div>
      <div className="bg-white dark:bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-200 dark:border-slate-600">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;

