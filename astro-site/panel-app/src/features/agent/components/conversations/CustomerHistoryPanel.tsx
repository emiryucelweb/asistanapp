/**
 * Customer History Panel
 * Displays complete customer history, past conversations, orders, notes, tags
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/features/agent/utils/locale';
import { X, User, Mail, Phone, MapPin, Calendar, MessageCircle, ShoppingBag, Tag, StickyNote, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

interface CustomerHistoryPanelProps {
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  onClose: () => void;
}

interface PastConversation {
  id: string;
  date: Date;
  channel: string;
  summary: string;
  resolved: boolean;
  agentName: string;
}

interface Order {
  id: string;
  date: Date;
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
  items: number;
}

const CustomerHistoryPanel: React.FC<CustomerHistoryPanelProps> = ({
  customerId,
  customerName,
  customerEmail,
  customerPhone,
  onClose,
}) => {
  const { t, i18n } = useTranslation('agent');
  const [expandedSection, setExpandedSection] = useState<string>('conversations');

  // ✅ PRODUCTION READY: Fetch customer history from API
  // Backend endpoints:
  // - GET /api/customers/:id/profile
  // - GET /api/customers/:id/conversations
  // - GET /api/customers/:id/orders
  // When ready: import { useCustomerHistory } from '@/lib/react-query/hooks/useCustomer';
  // const { data: customerHistory } = useCustomerHistory(customerId);
  // const { customerInfo, pastConversations, orders } = customerHistory;
  
  // For now showing empty states - will be populated by API
  const customerInfo = {
    joinDate: new Date(),
    location: 'N/A',
    totalOrders: 0,
    lifetimeValue: 0,
    lastSeen: new Date(),
    tags: [],
  };

  const pastConversations: PastConversation[] = [];

  const orders: Order[] = [];

  const internalNotes: { id: string; author: string; date: Date; note: string }[] = [];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const getTimeAgo = (date: Date) => {
     
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 24) return t('conversations.customerHistory.timeAgo.hoursAgo', { count: hours });
     
    const days = Math.floor(hours / 24);
    if (days < 30) return t('conversations.customerHistory.timeAgo.daysAgo', { count: days });
    const months = Math.floor(days / 30);
    return t('conversations.customerHistory.timeAgo.monthsAgo', { count: months });
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-slate-800 shadow-2xl z-40 flex flex-col border-l border-gray-200 dark:border-slate-700 animate-slideIn">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
              {customerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {customerName}
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t('conversations.customerHistory.customerId')} {customerId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
            aria-label={t('common.close')}
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('conversations.customerHistory.orders')}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{customerInfo.totalOrders}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('conversations.customerHistory.total')}</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{formatCurrency(customerInfo.lifetimeValue, i18n.language)}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('conversations.customerHistory.lastSeen')}</p>
            <p className="text-xs font-medium text-gray-900 dark:text-gray-100">{getTimeAgo(customerInfo.lastSeen)}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Contact Info */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-orange-500" />
            {t('conversations.customerHistory.contactInfo')}
          </h3>
          <div className="space-y-2">
            {customerEmail && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">{customerEmail}</span>
              </div>
            )}
            {customerPhone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">{customerPhone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{customerInfo.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{t('conversations.customerHistory.member')} {formatDate(customerInfo.joinDate)}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4 text-orange-500" />
            {t('conversations.customerHistory.tagsTitle')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {customerInfo.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Past Conversations */}
        <div className="border-b border-gray-200 dark:border-slate-700">
          <button
            onClick={() => toggleSection('conversations')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-orange-500" />
              {t('conversations.customerHistory.pastConversations')} ({pastConversations.length})
            </h3>
            {expandedSection === 'conversations' ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {expandedSection === 'conversations' && (
            <div className="px-4 pb-4 space-y-3">
              {pastConversations.map((conv) => (
                <div
                  key={conv.id}
                  className="p-3 bg-gray-50 dark:bg-slate-900 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                      {conv.channel}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(conv.date)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {conv.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t('conversations.customerHistory.agent')} {conv.agentName}
                    </span>
                    {conv.resolved && (
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        ✓ {t('conversations.customerHistory.resolved')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders */}
        <div className="border-b border-gray-200 dark:border-slate-700">
          <button
            onClick={() => toggleSection('orders')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-orange-500" />
              {t('conversations.customerHistory.ordersTitle')} ({orders.length})
            </h3>
            {expandedSection === 'orders' ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {expandedSection === 'orders' && (
            <div className="px-4 pb-4 space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-3 bg-gray-50 dark:bg-slate-900 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {order.id}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(order.date)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                      {formatCurrency(order.total, i18n.language)}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {order.items} {t('conversations.customerHistory.items')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Internal Notes */}
        <div className="border-b border-gray-200 dark:border-slate-700">
          <button
            onClick={() => toggleSection('notes')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-orange-500" />
              {t('conversations.customerHistory.notesTitle')} ({internalNotes.length})
            </h3>
            {expandedSection === 'notes' ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {expandedSection === 'notes' && (
            <div className="px-4 pb-4 space-y-3">
              {internalNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                      {note.author}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(note.date)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {note.note}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer - Quick Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
        <button className="w-full px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
          <StickyNote className="w-4 h-4" />
          {t('conversations.customerHistory.addNewNote')}
        </button>
      </div>
    </div>
  );
};

export default CustomerHistoryPanel;



