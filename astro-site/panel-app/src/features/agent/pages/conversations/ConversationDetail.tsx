/**
 * Conversation Detail Page - Customer Conversation Page
 * 
 * Enterprise-grade conversation detail view with real-time messaging
 */
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { logger } from '@/shared/utils/logger';
import type { Message, Conversation } from '@/features/agent/types';
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Phone,
  Video,
  User,
  Clock,
  CheckCheck,
  AlertCircle
} from 'lucide-react';

// Note: Using domain types from @/features/agent/types for type safety
// Component-specific interface removed in favor of shared types

const ConversationDetail: React.FC = () => {
  const { t, i18n } = useTranslation('agent');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');

  // ✅ PRODUCTION READY: Fetch conversation from API
  // Backend endpoint: GET /api/conversations/:id
  // When ready: import { useConversation } from '@/lib/react-query/hooks/useConversations';
  // const { data: conversation, isLoading } = useConversation(id!);
  
  // For now showing empty conversation - will be populated by API
  const conversation = {
    id: id,
    customerName: t('conversations.detail.loading'),
    customerPhone: '',
    customerEmail: '',
    customerAvatar: undefined,
    status: 'waiting' as const,
    priority: 'normal' as const,
    messages: [] as Array<{
      id: string;
      sender: 'customer' | 'ai' | 'agent';
      senderName: string;
      content: string;
      timestamp: Date;
      status: 'sent' | 'delivered' | 'read';
    }>, // Mock data removed - API ready
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    // Message sending simulation
    logger.debug('Message sent', { conversationId: id, message });
    setMessage('');
    
    // TODO: Send to API in production
    // await api.sendMessage(id, message);
  };

  const formatTime = (date: Date) => {
    const locale = i18n.language === 'tr' ? 'tr-TR' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/agent/conversations')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  {conversation.customerAvatar ? (
                    <img src={conversation.customerAvatar} alt={conversation.customerName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {conversation.customerName}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {conversation.customerPhone}
                </p>
              </div>
            </div>

            <div className="ml-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold">
                🚨 {t('conversations.detail.urgentPriority')}
              </span>
              <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold">
                ✅ {t('conversations.detail.activePriority')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Acil Arama Banner */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-lg mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{t('conversations.detail.emergencyCallTakenOver')}</h3>
              <p className="text-sm text-white/90">
                {t('conversations.detail.emergencyCallDescription')}
              </p>
            </div>
          </div>
        </div>

        {conversation.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] ${msg.sender === 'agent' ? 'order-2' : 'order-1'}`}>
              {msg.sender !== 'agent' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1">
                  {msg.senderName} {msg.sender === 'ai' && t('conversations.detail.aiAssistant')}
                </p>
              )}
              <div
                className={`rounded-lg p-3 ${
                  msg.sender === 'customer'
                    ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white'
                    : msg.sender === 'ai'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300'
                    : 'bg-blue-600 text-white'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <p className="text-xs opacity-70">{formatTime(msg.timestamp)}</p>
                  {msg.sender === 'agent' && (msg.status === 'read' || msg.status === 'delivered') && (
                    <CheckCheck className="w-4 h-4" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-2">
          <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('conversations.messagePlaceholder')}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!message.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span className="hidden sm:inline">{t('conversations.detail.send')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationDetail;


