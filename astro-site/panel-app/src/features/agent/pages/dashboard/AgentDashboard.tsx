 

/**
 * Agent Dashboard - Çalışan Ana Sayfa
 * Production-ready with full API integration
 */
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Clock, CheckCircle, AlertCircle, TrendingUp, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardLoadingState } from '@/shared/ui/loading';
import { useMyAgentProfile, useAgentMetrics } from '@/lib/react-query/hooks';
import { useConversations } from '@/lib/react-query/hooks/useConversations';
import { useAuthStore } from '@/shared/stores/auth-store';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale'; // Turkish locale for date-fns
import type { Conversation } from '@/features/agent/types';
import { CHANNEL_ICONS, PRIORITY_COLORS, PRIORITY_WEIGHTS } from '@/features/agent/constants';

const AgentDashboard: React.FC = () => {
  const { t, i18n } = useTranslation('agent');
  const { user } = useAuthStore();
  
  // Get current date range (today)
  // ⚠️ CRITICAL FIX: Create separate Date objects to prevent mutation
  const todayStart = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
  const todayEnd = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();

  // Fetch agent profile
  const { data: profileData, isLoading: isProfileLoading } = useMyAgentProfile();
  const profile = profileData; // Already unwrapped by useMyAgentProfile

  // Fetch today's metrics
  const { data: metricsData, isLoading: isMetricsLoading, refetch: refetchMetrics } = useAgentMetrics(
    user?.id || '',
    { from: todayStart, to: todayEnd }
  );
  const metrics = metricsData; // Already unwrapped by useAgentMetrics

  // Fetch assigned conversations
  const { data: conversationsData, isLoading: isConversationsLoading } = useConversations({
    status: 'assigned',
    assignedTo: user?.id,
    limit: 10,
  });
  // ✅ ACCEPTABLE: API response type conversion - structural compatibility
  const conversations = (conversationsData || []) as unknown as Conversation[];

  const isLoading = isProfileLoading || isMetricsLoading || isConversationsLoading;

  // Helper: Format response time (seconds to minutes)
  const formatResponseTime = (seconds?: number) => {
    if (!seconds) return `0 ${t('common:units.minutes')}`;
    const minutes = Math.round(seconds / 60);
    return `${minutes} ${t('common:units.minutes')}`;
  };

  // Helper: Format satisfaction score
  const formatSatisfaction = (score?: number) => {
    const formattedScore = score ? score.toFixed(1) : '0.0';
    return t('dashboard.satisfactionScore', { score: formattedScore, max: '5' });
  };

  // Use centralized constants from @/features/agent/constants
  const channelIcons = CHANNEL_ICONS;
  const priorityColors = PRIORITY_COLORS;

  // Helper: Format priority label
  const formatPriority = (priority: string) => {
    return t(`priority.${priority}`, { defaultValue: priority });
  };

  // Helper: Sort conversations by priority and time (using centralized PRIORITY_WEIGHTS)
  // Memoized to prevent unnecessary sorting on every render
  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const priorityDiff = (PRIORITY_WEIGHTS[b.priority] || 1) - (PRIORITY_WEIGHTS[a.priority] || 1);
      if (priorityDiff !== 0) return priorityDiff;
      
      const aTime = new Date(a.lastMessageTime || a.updatedAt || 0).getTime();
      const bTime = new Date(b.lastMessageTime || b.updatedAt || 0).getTime();
      return bTime - aTime; // Most recent first
    });
  }, [conversations]);

  // Calculate stats from data
  const stats = {
    resolved: metrics?.conversations?.resolved || 0,
    pending: profile?.stats?.activeConversations || 0,
    avgResponseTime: formatResponseTime(metrics?.performance?.averageResponseTime),
    satisfaction: formatSatisfaction(metrics?.performance?.satisfactionScore),
  };

  // Count unread conversations
  const unreadCount = conversations.filter(c => c.unreadCount && c.unreadCount > 0).length;

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <DashboardLoadingState />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('dashboard.title')}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('dashboard.welcomeWithName', { name: profile?.name || user?.name || 'Agent' })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetchMetrics()}
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          title={t('common:common.refresh')}
        >
          <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Resolved Today */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.today')}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.resolved}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('dashboard.resolvedConversations')}</p>
          {metrics?.conversations?.total ? (
            <div className="mt-3 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <TrendingUp className="w-3 h-3" />
              <span>{t('dashboard.resolutionRate', { rate: Math.round((stats.resolved / metrics.conversations.total) * 100) })}</span>
            </div>
          ) : (
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              {t('dashboard.greatJob')}
            </div>
          )}
        </div>

        {/* Pending Conversations */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.now')}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.pending}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('dashboard.pendingConversations')}</p>
          <Link 
            to="/agent/conversations" 
            className="mt-3 text-xs text-orange-600 dark:text-orange-400 hover:underline inline-block"
          >
            {t('dashboard.replyNow')}
          </Link>
        </div>

        {/* Average Response Time */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{t('common:labels.average')}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.avgResponseTime}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('dashboard.responseTime')}</p>
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            {t('dashboard.targetResponseTime')}
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.satisfaction')}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.satisfaction}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('dashboard.customerScore')}</p>
          <div className="mt-3 text-xs text-green-600 dark:text-green-400">
            {metrics?.performance?.satisfactionScore && metrics.performance.satisfactionScore >= 4.5 
              ? t('dashboard.feedback.excellent')
              : metrics?.performance?.satisfactionScore && metrics.performance.satisfactionScore >= 4.0
              ? t('dashboard.feedback.good')
              : t('dashboard.feedback.keepGoing')}
          </div>
        </div>
      </div>

      {/* Assigned Conversations */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {t('dashboard.pendingConversationsList')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {unreadCount > 0 ? t('dashboard.newMessages', { count: unreadCount }) : t('dashboard.allMessagesRead')}
              </p>
            </div>
            <Link
              to="/agent/conversations"
              className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              {t('common:labels.viewAll')}
            </Link>
          </div>
        </div>

        {sortedConversations.length === 0 ? (
          <div className="p-12 text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {t('dashboard.noAssignedConversations')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              {t('dashboard.autoAssignMessage')}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            {sortedConversations.slice(0, 10).map((conversation) => (
              <Link
                key={conversation.id}
                to={`/agent/conversations?openConversation=${conversation.id}`}
                className="block p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="text-3xl flex-shrink-0">
                      {channelIcons[conversation.channel] || '💬'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {conversation.customerName}
                        </h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          priorityColors[conversation.priority] || priorityColors.medium
                        }`}>
                          {formatPriority(conversation.priority)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {conversation.lastMessageTime 
                          ? formatDistanceToNow(new Date(conversation.lastMessageTime), {
                              addSuffix: true,
                              locale: i18n.language === 'tr' ? tr : undefined,
                            })
                          : t('dashboard.justNow')
                        }
                      </p>
                    </div>
                  </div>
                  {conversation.unreadCount && conversation.unreadCount > 0 && (
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full">
                        {conversation.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
