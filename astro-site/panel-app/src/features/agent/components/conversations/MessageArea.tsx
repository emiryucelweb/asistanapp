/**
 * MessageArea Component
 * 
 * Displays conversation messages with actions and typing indicators
 * 
 * Features:
 * - Message rendering (customer, AI, agent, system)
 * - Message actions (copy)
 * - Typing indicator
 * - Auto-scroll to bottom
 * - Time display
 * - Sender badges
 * - Optimized with React.memo
 * 
 * @module agent/components/MessageArea
 */

import React, { memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { formatTime } from '@/features/agent/utils/locale';
import { Bot, User, Copy, Check, Info } from 'lucide-react';

// Types
export interface Message {
  id: string;
  sender: 'customer' | 'ai' | 'agent' | 'system';
  text: string;
  timestamp: Date | string;
  agentName?: string;
}

interface MessageAreaProps {
  // Data
  messages: Message[];
  
  // UI State
  isCustomerTyping: boolean;
  copiedMessageId: string | null;
  
  // Callbacks
  onCopyMessage: (messageId: string, text: string) => void;
  
  // Config
  agentName?: string;
}

/**
 * MessageArea Component
 * Memoized for performance - only re-renders when props change
 */
const MessageArea: React.FC<MessageAreaProps> = memo(({
  messages,
  isCustomerTyping,
  copiedMessageId,
  onCopyMessage,
  agentName = 'Agent',
}) => {
  const { t, i18n } = useTranslation('agent');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Format timestamp for messages
  const formatMessageTime = (timestamp: Date | string): string => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return formatTime(date, i18n.language, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        // System message (assignment notification)
        if (message.sender === 'system') {
          return (
            <div key={message.id} className="flex justify-center my-4">
              <div className="max-w-md w-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-300">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span>{message.text}</span>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 ml-6">
                  {formatMessageTime(message.timestamp)}
                </p>
              </div>
            </div>
          );
        }

        // Customer message (left side)
        if (message.sender === 'customer') {
          return (
            <div key={message.id} className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="flex-1 max-w-[70%]">
                <div className="bg-white dark:bg-slate-700 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-slate-600">
                  <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
                    {message.text}
                  </p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatMessageTime(message.timestamp)}
                </p>
              </div>
            </div>
          );
        }

        // AI message (left side, with AI badge)
        if (message.sender === 'ai') {
          return (
            <div key={message.id} className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 max-w-[70%]">
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                      {t('conversations.messageArea.aiAssistant')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words">
                    {message.text}
                  </p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatMessageTime(message.timestamp)}
                </p>
              </div>
            </div>
          );
        }

        // Agent message (right side)
        if (message.sender === 'agent') {
          return (
            <div key={message.id} className="flex items-start gap-2 justify-end">
              <div className="flex-1 max-w-[70%] flex flex-col items-end">
                <div className="bg-orange-500 text-white rounded-lg p-3 shadow-sm">
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.text}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {message.agentName || agentName} • {formatMessageTime(message.timestamp)}
                  </p>
                  <button
                    onClick={() => onCopyMessage(message.id, message.text)}
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    title={t('common.copyMessage')}
                    aria-label={t('common.copyMessage')}
                  >
                    {copiedMessageId === message.id ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          );
        }

        return null;
      })}

      {/* Typing Indicator */}
      {isCustomerTyping && (
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="flex-1 max-w-[70%]">
            <div className="bg-white dark:bg-slate-700 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-slate-600">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t('conversations.messageArea.typing')}
            </p>
          </div>
        </div>
      )}

      {/* Auto-scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
});

MessageArea.displayName = 'MessageArea';

export default MessageArea;

