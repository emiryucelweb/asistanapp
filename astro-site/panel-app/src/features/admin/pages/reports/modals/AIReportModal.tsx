/**
 * AIReportModal Component - AI Performance Report Modal
 * 
 * Enterprise-grade detailed AI performance analytics modal
 * Displays comprehensive AI assistant metrics and statistics
 * 
 * Features:
 * - AI success rate metrics
 * - Auto-response performance
 * - Learning curve analysis
 * - Intent recognition accuracy
 * - Response quality metrics
 * - Fallback statistics
 * 
 * @author Enterprise Team
 */
import React, { useEffect, useState } from 'react';
import { 
  X, 
  Activity, 
  TrendingUp, 
  Zap, 
  CheckCircle, 
  XCircle,
  Brain,
  MessageSquare,
  Target,
  AlertCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { mockAdminReportsApi } from '@/services/api/mock/admin-reports.mock';
import { isMockMode } from '@/services/api/config';
import { logger } from '@/shared/utils/logger';

interface AIReportModalProps {
  /**
   * Close callback
   */
  onClose: () => void;
}

/**
 * AIReportModal - Comprehensive AI performance analytics
 * 
 * Displays:
 * - Overall AI success rate
 * - Auto-response statistics
 * - Intent recognition accuracy
 * - Learning improvements
 * - Fallback patterns
 * - Response quality scores
 */
export function AIReportModal(props: AIReportModalProps) {
  const { onClose } = props;
  const { t, i18n } = useTranslation('admin');

  const [intentBreakdown, setIntentBreakdown] = useState<any[]>([]);
  const [performanceTrend, setPerformanceTrend] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Select API based on mock mode
  const reportsApi = isMockMode() ? mockAdminReportsApi : mockAdminReportsApi; // TODO: Replace with real API

  // Fetch AI report data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await reportsApi.getAIReport('30d');
        setIntentBreakdown(data.intentBreakdown || []);
        setPerformanceTrend(data.performanceTrend || []);
        logger.info('[AIReportModal] Data fetched', { mode: isMockMode() ? 'mock' : 'real' });
      } catch (error) {
        logger.error('[AIReportModal] Fetch failed', { error });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Handle backdrop click
   */
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Mock data - TODO: Replace with real API data
  const aiMetrics = {
    successRate: 87.5,
    totalInteractions: 15420,
    autoResolved: 13492,
    humanHandoff: 1928,
    intentAccuracy: 92.3,
    responseQuality: 4.6,
    learningImprovement: 12.8,
    avgConfidence: 89.2,
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-report-title"
    >
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500 rounded-lg p-3">
              <Activity className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="ai-report-title"
                className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
              >
                {t('reports.modals.ai.title')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('reports.modals.ai.subtitle')}
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

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Success Rate */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-900 dark:text-purple-300">
                {t('reports.modals.ai.successRate')}
              </span>
              <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
            </div>
            <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
              {aiMetrics.successRate}%
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600 dark:text-green-400">
              <TrendingUp className="w-3 h-3" aria-hidden="true" />
              <span>{t('reports.modals.ai.growthThisMonth', { rate: aiMetrics.learningImprovement })}</span>
            </div>
          </div>

          {/* Auto Resolved */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-900 dark:text-green-300">
                {t('reports.modals.ai.autoResolution')}
              </span>
              <Zap className="w-5 h-5 text-green-600 dark:text-green-400" aria-hidden="true" />
            </div>
            <p className="text-3xl font-bold text-green-900 dark:text-green-100">
              {aiMetrics.autoResolved.toLocaleString(i18n.language === 'tr' ? 'tr-TR' : 'en-US')}
            </p>
            <p className="text-xs text-green-700 dark:text-green-400 mt-2">
              {t('reports.modals.ai.automation', { rate: ((aiMetrics.autoResolved / aiMetrics.totalInteractions) * 100).toFixed(1) })}
            </p>
          </div>

          {/* Intent Accuracy */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                {t('reports.modals.ai.intentAccuracy')}
              </span>
              <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            </div>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              {aiMetrics.intentAccuracy}%
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
              {t('reports.modals.ai.intentRecognition')}
            </p>
          </div>

          {/* Response Quality */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-orange-900 dark:text-orange-300">
                {t('reports.modals.ai.responseQuality')}
              </span>
              <MessageSquare className="w-5 h-5 text-orange-600 dark:text-orange-400" aria-hidden="true" />
            </div>
            <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
              {aiMetrics.responseQuality}/5.0
            </p>
            <p className="text-xs text-orange-700 dark:text-orange-400 mt-2">
              {t('reports.modals.ai.userRating')}
            </p>
          </div>
        </div>

        {/* Intent Breakdown */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            {t('reports.modals.ai.intentCategoriesAnalysis')}
          </h3>
          <div className="space-y-3">
            {intentBreakdown.map((intent, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="text-purple-600 dark:text-purple-400">
                      {intent.icon}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {intent.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {intent.count.toLocaleString(i18n.language === 'tr' ? 'tr-TR' : 'en-US')} {t('reports.modals.ai.queries')}
                    </span>
                    <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                      {intent.accuracy}% {t('reports.modals.ai.accuracy')}
                    </span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-purple-600 dark:bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${intent.accuracy}%` }}
                    role="progressbar"
                    aria-valuenow={intent.accuracy}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${intent.name} ${t('reports.modals.ai.accuracy')}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Trend */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            {t('reports.modals.ai.learningCurve')}
          </h3>
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <div className="flex items-end justify-between h-48 gap-4">
              {performanceTrend.map((week, index) => (
                <div key={index} className="flex-1 flex flex-col items-center justify-end gap-2">
                  <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                    {week.success}%
                  </div>
                  <div
                    className="w-full bg-purple-600 dark:bg-purple-500 rounded-t-lg transition-all duration-500 hover:bg-purple-700 dark:hover:bg-purple-600"
                    style={{ height: `${(week.success / 100) * 100}%` }}
                    role="img"
                    aria-label={`${week.period}: ${week.success}%`}
                  />
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {week.period}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            {t('reports.modals.ai.insights')}
          </h4>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span>
                {t('reports.modals.ai.insight1')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span>
                {t('reports.modals.ai.insight2')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400">•</span>
              <span>
                {t('reports.modals.ai.insight3')}
              </span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('reports.lastUpdate')}: {new Date().toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US')}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
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
export default AIReportModal;
