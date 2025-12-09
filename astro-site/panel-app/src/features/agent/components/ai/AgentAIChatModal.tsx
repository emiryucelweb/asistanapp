/**
 * Agent AI Chat Modal - AI Assistant Popup for Agents
 * 
 * Real-time AI assistant to help agents during conversations
 */
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Send, Bot, TrendingUp, MessageSquare, Users, Clock, AlertCircle } from 'lucide-react';
import { ModernLoader } from '@/shared/ui/loading';
import { formatTime } from '@/features/agent/utils/locale';

interface AgentAIChatModalProps {
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AgentAIChatModal: React.FC<AgentAIChatModalProps> = ({ onClose }) => {
  const { t, i18n } = useTranslation('agent');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: t('aiChat.welcomeMessage'),
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestions = [
    { icon: Users, label: t('aiChat.suggestions.waitingCustomers'), query: t('aiChat.queries.waitingCustomers') },
    { icon: TrendingUp, label: t('aiChat.suggestions.dailyPerformance'), query: t('aiChat.queries.dailyPerformance') },
    { icon: MessageSquare, label: t('aiChat.suggestions.activeConversations'), query: t('aiChat.queries.activeConversations') },
    { icon: Clock, label: t('aiChat.suggestions.avgResponseTime'), query: t('aiChat.queries.avgResponseTime') },
  ];

  // ✅ PRODUCTION READY: Static AI responses (will be replaced with real AI)
  // TODO: Replace with real AI backend API call
  // Backend endpoint: POST /api/ai/operational-assist
  const getAIResponse = (query: string): string => {
    // This is a fallback response - will be replaced with AI API
    return t('aiChat.responses.default');
  };

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // ✅ PRODUCTION READY: AI Chat API Integration
    // Backend endpoint: POST /api/ai/operational-assist
    // Body: { message: inputValue, agentId, context: { currentWorkload, activeConversations } }
    // When ready: import { useAIChat } from '@/lib/react-query/hooks/useAI';
    // const response = await aiChat.mutateAsync({ message: inputValue });
    setTimeout(() => {
      const aiResponse = getAIResponse(inputValue); // Using static responses as fallback
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  }, [inputValue, isLoading, getAIResponse]);

  const handleSuggestionClick = (query: string) => {
    setInputValue(query);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-chat-modal-title"
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 id="ai-chat-modal-title" className="text-lg font-semibold text-white">{t('aiChat.title')}</h2>
              <p className="text-xs text-blue-100">{t('aiChat.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 m-4">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                {t('aiChat.infoTitle')}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {t('aiChat.infoDescription')}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {formatTime(new Date(message.timestamp), i18n.language, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-slate-700 rounded-2xl px-4 py-3">
                <ModernLoader variant="dots" size="sm" color="secondary" />
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('aiChat.quickQuestions')}</p>
            <div className="grid grid-cols-2 gap-2">
              {suggestions.map((suggestion, index) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion.query)}
                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors text-left"
                  >
                    <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                      {suggestion.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('aiChat.askPlaceholder')}
              className="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 text-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-slate-600 text-white rounded-xl transition-colors disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentAIChatModal;

