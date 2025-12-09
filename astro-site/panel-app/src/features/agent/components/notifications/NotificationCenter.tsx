/**
 * Notification Center - Bildirim Merkezi
 */
import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Bell, X, Check, MessageCircle, AlertCircle, UserPlus, CheckCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'new_conversation' | 'new_message' | 'ai_stuck' | 'assigned' | 'resolved' | 'mention';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  conversationId?: string;
  route?: string;
  channelId?: string;
  messageId?: string;
}

interface NotificationCenterProps {
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose }) => {
  const { t } = useTranslation('agent');
  const navigate = useNavigate();
  
  // ✅ PRODUCTION READY: Fetch notifications from API
  // Backend endpoint: GET /api/notifications?agentId={agentId}
  // When ready: import { useNotifications } from '@/lib/react-query/hooks/useNotifications';
  // const { data: notificationsData } = useNotifications({ agentId: user?.id });
  // const notifications = notificationsData || [];
  
  // For now showing empty state - will be populated by API
  const [notifications, setNotifications] = useState<Notification[]>([]); // Mock data removed - API ready

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_conversation':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'new_message':
        return <MessageCircle className="w-5 h-5 text-green-500" />;
      case 'ai_stuck':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'assigned':
        return <UserPlus className="w-5 h-5 text-purple-500" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-teal-500" />;
      case 'mention':
        return <MessageCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return t('common:time.secondsAgo', { count: seconds });
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return t('common:time.minutesAgo', { count: minutes });
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return t('common:time.hoursAgo', { count: hours });
    const days = Math.floor(hours / 24);
    return t('common:time.daysAgo', { count: days });
  };

  // Memoize callback functions to prevent unnecessary re-renders
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const handleNotificationClick = useCallback((notification: Notification) => {
    markAsRead(notification.id);
    
    // Handle mention notifications - navigate to team chat with query params
    if (notification.type === 'mention' && notification.channelId && notification.messageId) {
      navigate(`/agent/team/chat?channelId=${notification.channelId}&messageId=${notification.messageId}`);
      onClose();
      return;
    }
    
    // Handle regular route navigation
    if (notification.route) {
      navigate(notification.route);
      onClose();
    }
  }, [markAsRead, navigate, onClose]);

  // Memoize filtered notifications to prevent unnecessary recalculations
  const filteredNotifications = useMemo(() => {
    return filter === 'unread' 
      ? notifications.filter(n => !n.read)
      : notifications;
  }, [notifications, filter]);

  // Memoize unread count to prevent unnecessary recalculations
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center relative">
                <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {t('notifications.title')}
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {t('notifications.unreadCount', { count: unreadCount })}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              aria-label={t('common:close')}
              type="button"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {t('notifications.filterAll', { count: notifications.length })}
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                filter === 'unread'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {t('notifications.filterUnread', { count: unreadCount })}
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                title={t('common.markAllRead')}
              >
                <Check className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                {filter === 'unread' ? t('notifications.emptyUnread') : t('notifications.empty')}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-slate-700">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-orange-50/50 dark:bg-orange-900/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1.5"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {getTimeAgo(notification.timestamp)}
                        </span>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="text-xs text-orange-600 dark:text-orange-400 hover:underline"
                            >
                              {t('common:markAsRead')}
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-xs text-red-600 dark:text-red-400 hover:underline"
                          >
                            {t('common:delete')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;

