/**
 * Agent AI Chat Page - AI Assistant for Agents
 * Enterprise-ready AI assistant for agents
 * 
 * Features:
 * - Customer information queries
 * - Internal status inquiries
 * - Real-time AI responses
 * - Suggestion system
 * - Full i18n support
 * - Dynamic locale support
 * - Backend integration ready
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { formatTime } from '@/features/agent/utils/locale';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/shared/stores/auth-store';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

const AgentAIChatPage: React.FC = () => {
  const { t, i18n } = useTranslation('agent');
  const { user } = useAuthStore();
  
  // Initial welcome message with i18n
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: t('aiChat.welcome.message', { 
        name: user?.name || t('aiChat.welcome.defaultName')
      }),
      timestamp: new Date().toISOString(),
      suggestions: [
        t('aiChat.suggestions.todayStats'),
        t('aiChat.suggestions.frequentQuestions'),
        t('aiChat.suggestions.waitingCustomers'),
        t('aiChat.suggestions.teamStatus'),
      ],
    },
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // TODO: Replace with real AI Chat API call
    // Example:
    // try {
    //   const response = await aiChatService.sendMessage({
    //     message: userMessage.content,
    //     userId: user?.id,
    //     context: 'agent-assistant',
    //   });
    //   
    //   const aiResponse: ChatMessage = {
    //     id: response.id,
    //     role: 'assistant',
    //     content: response.content,
    //     timestamp: response.timestamp,
    //     suggestions: response.suggestions,
    //   };
    //   
    //   setMessages((prev) => [...prev, aiResponse]);
    // } catch (error) {
    //   console.error('[AI Chat] Failed to send message:', error);
    //   // Handle error with user-friendly message
    // } finally {
    //   setIsLoading(false);
    // }

    // Temporary: Simulate API response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t('aiChat.responses.processing'),
        timestamp: new Date().toISOString(),
        suggestions: [
          t('aiChat.suggestions.todayStats'),
          t('aiChat.suggestions.waitingCustomers'),
          t('aiChat.suggestions.performance'),
        ],
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  }, [inputValue, isLoading, t, user?.id]);

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const formatMessageTime = (timestamp: string) => {
    return formatTime(new Date(timestamp), i18n.language, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-blue-600 dark:from-purple-600 dark:to-blue-700 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
              {t('aiChat.header.title')}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
              {t('aiChat.header.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-2 sm:gap-3 md:gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'assistant' && (
                <div className="hidden sm:flex w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-blue-600 dark:from-purple-600 dark:to-blue-700 rounded-lg items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              )}

              <div className={`flex-1 max-w-full sm:max-w-2xl ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                <div
                  className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 dark:bg-blue-700 text-white'
                      : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700'
                  }`}
                >
                  <p className={`whitespace-pre-wrap ${message.role === 'assistant' ? 'text-gray-900 dark:text-white' : ''}`}>
                    {message.content}
                  </p>
                  <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {formatMessageTime(message.timestamp)}
                  </p>

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('aiChat.suggestions.title')}
                      </p>
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left px-3 py-2 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm transition-colors"
                          type="button"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="hidden sm:flex w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 dark:bg-blue-700 rounded-lg items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 dark:from-purple-600 dark:to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 max-w-2xl">
                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 sm:gap-3">
            <div className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg sm:rounded-xl focus-within:border-purple-500 dark:focus-within:border-purple-400 transition-colors">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={t('aiChat.askQuestion')}
                rows={2}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-700 dark:to-blue-800 dark:hover:from-purple-800 dark:hover:to-blue-900 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm sm:text-base font-medium rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2"
              type="button"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{t('aiChat.send')}</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center hidden sm:block">
            {t('aiChat.disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgentAIChatPage;
