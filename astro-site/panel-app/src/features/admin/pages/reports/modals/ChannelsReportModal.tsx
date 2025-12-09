/**
 * ChannelsReportModal Component - Channel Analytics Report Modal
 * 
 * Enterprise-grade channel performance comparison modal
 * Displays comprehensive multi-channel metrics and statistics
 * 
 * Features:
 * - WhatsApp performance
 * - Instagram metrics
 * - Web chat statistics
 * - Channel comparison
 * - Response time by channel
 * - Conversion rates
 * 
 * @author Enterprise Team
 */
import React, { useEffect, useState } from 'react';
import { 
  X, 
  MessageSquare, 
  TrendingUp,
  Clock,
  Users,
  CheckCircle,
  Globe,
  Facebook,
  MessageCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { mockAdminReportsApi } from '@/services/api/mock/admin-reports.mock';
import { isMockMode } from '@/services/api/config';
import { logger } from '@/shared/utils/logger';

interface ChannelsReportModalProps {
  /**
   * Close callback
   */
  onClose: () => void;
}

/**
 * ChannelsReportModal - Comprehensive channel analytics
 * 
 * Displays:
 * - Channel distribution
 * - Performance comparison
 * - Response times
 * - User engagement
 * - Conversion rates
 * - Peak hours by channel
 */
export function ChannelsReportModal(props: ChannelsReportModalProps) {
  const { onClose } = props;
  const { t, i18n } = useTranslation('admin');

  /**
   * Handle backdrop click
   */
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Mock data - TODO: Replace with real API data
  const channelData = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'bg-green-500',
      borderColor: 'border-green-500',
      bgLight: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      conversations: 8450,
      percentage: 54.8,
      avgResponseTime: '2m 15s',
      satisfaction: 4.7,
      conversionRate: 48.2,
      growth: +15.3,
    },
    {
      name: 'Instagram',
      icon: <Facebook className="w-6 h-6" />,
      color: 'bg-pink-500',
      borderColor: 'border-pink-500',
      bgLight: 'bg-pink-50 dark:bg-pink-900/20',
      textColor: 'text-pink-600 dark:text-pink-400',
      conversations: 4280,
      percentage: 27.8,
      avgResponseTime: '3m 45s',
      satisfaction: 4.5,
      conversionRate: 42.8,
      growth: +22.1,
    },
    {
      name: 'Web Chat',
      icon: <Globe className="w-6 h-6" />,
      color: 'bg-blue-500',
      borderColor: 'border-blue-500',
      bgLight: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      conversations: 2120,
      percentage: 13.8,
      avgResponseTime: '1m 50s',
      satisfaction: 4.8,
      conversionRate: 52.5,
      growth: +8.7,
    },
    {
      name: 'Email',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'bg-purple-500',
      borderColor: 'border-purple-500',
      bgLight: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      conversations: 570,
      percentage: 3.7,
      avgResponseTime: '4h 20m',
      satisfaction: 4.3,
      conversionRate: 38.5,
      growth: -2.3,
    },
  ];

  const totalConversations = channelData.reduce((sum, ch) => sum + ch.conversations, 0);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="channels-report-title"
    >
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 rounded-lg p-3">
              <MessageSquare className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="channels-report-title"
                className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
              >
                {t('reports.modals.channels.title')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('reports.modals.channels.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label={t('reports.close')}
            type="button"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                {t('reports.modals.channels.totalConversations')}
              </span>
            </div>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              {totalConversations.toLocaleString(i18n.language === 'tr' ? 'tr-TR' : 'en-US')}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-green-600 dark:text-green-400" aria-hidden="true" />
              <span className="text-sm font-medium text-green-900 dark:text-green-300">
                {t('reports.modals.channels.avgResponseTime')}
              </span>
            </div>
            <p className="text-3xl font-bold text-green-900 dark:text-green-100">
              2m 47s
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-300">
                {t('reports.modals.channels.avgConversion')}
              </span>
            </div>
            <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
              47.3%
            </p>
          </div>
        </div>

        {/* Channel Comparison */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            {t('reports.modals.channels.channelComparison')}
          </h3>
          <div className="space-y-4">
            {channelData.map((channel, index) => (
              <div
                key={index}
                className={`${channel.bgLight} rounded-lg p-5 border ${channel.borderColor}`}
              >
                {/* Channel Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`${channel.color} rounded-lg p-2 text-white`}>
                      {channel.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {channel.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {channel.conversations.toLocaleString(i18n.language === 'tr' ? 'tr-TR' : 'en-US')} {t('reports.modals.channels.conversations')} ({channel.percentage}%)
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    channel.growth >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    <TrendingUp className={`w-4 h-4 ${channel.growth < 0 ? 'rotate-180' : ''}`} aria-hidden="true" />
                    <span>{channel.growth >= 0 ? '+' : ''}{channel.growth}%</span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t('reports.modals.channels.responseTime')}
                    </p>
                    <p className={`font-semibold ${channel.textColor}`}>
                      {channel.avgResponseTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t('reports.modals.channels.satisfaction')}
                    </p>
                    <p className={`font-semibold ${channel.textColor}`}>
                      {channel.satisfaction}/5.0
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t('reports.modals.channels.conversion')}
                    </p>
                    <p className={`font-semibold ${channel.textColor}`}>
                      {channel.conversionRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t('reports.modals.channels.share')}
                    </p>
                    <p className={`font-semibold ${channel.textColor}`}>
                      {channel.percentage}%
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                    <div
                      className={`${channel.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${channel.percentage}%` }}
                      role="progressbar"
                      aria-valuenow={channel.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={t('reports.modals.channels.shareLabel', { channel: channel.name })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            {t('reports.modals.channels.analysis')}
          </h4>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span dangerouslySetInnerHTML={{ __html: t('reports.modals.channels.insight1') }} />
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span dangerouslySetInnerHTML={{ __html: t('reports.modals.channels.insight2') }} />
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span dangerouslySetInnerHTML={{ __html: t('reports.modals.channels.insight3') }} />
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span dangerouslySetInnerHTML={{ __html: t('reports.modals.channels.insight4') }} />
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('reports.modals.channels.dataSource')}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            type="button"
          >
            {t('reports.close')}
          </button>
        </div>
      </div>
    </div>
  );
}

// Default export for easier importing
export default ChannelsReportModal;
