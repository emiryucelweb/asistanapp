/**
 * SatisfactionReportModal Component - Customer Satisfaction Report Modal
 * 
 * Enterprise-grade customer satisfaction analytics modal
 * Displays CSAT scores, NPS, and customer feedback analysis
 * 
 * Features:
 * - CSAT score distribution
 * - NPS (Net Promoter Score)
 * - Customer feedback trends
 * - Sentiment analysis
 * - Rating breakdown
 * - Improvement areas
 * 
 * @author Enterprise Team
 */
import React from 'react';
import { 
  X, 
  Award,
  Smile,
  Frown,
  Meh,
  TrendingUp,
  Star,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SatisfactionReportModalProps {
  /**
   * Close callback
   */
  onClose: () => void;
}

/**
 * SatisfactionReportModal - Comprehensive satisfaction analytics
 */
export function SatisfactionReportModal(props: SatisfactionReportModalProps) {
  const { onClose } = props;
  const { t, i18n } = useTranslation('admin');

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Mock data
  const satisfactionData = {
    overallScore: 4.6,
    csatScore: 89.2,
    npsScore: 67,
    totalResponses: 3840,
    promoters: 58.2,
    passives: 25.6,
    detractors: 16.2,
  };

  const ratingDistribution = [
    { stars: 5, count: 2230, percentage: 58.1, color: 'bg-green-500' },
    { stars: 4, count: 920, percentage: 24.0, color: 'bg-lime-500' },
    { stars: 3, count: 380, percentage: 9.9, color: 'bg-yellow-500' },
    { stars: 2, count: 190, percentage: 4.9, color: 'bg-orange-500' },
    { stars: 1, count: 120, percentage: 3.1, color: 'bg-red-500' },
  ];

  const sentimentBreakdown = [
    { sentiment: t('reports.modals.satisfaction.veryHappy'), icon: <Smile className="w-5 h-5" />, count: 2230, percentage: 58.1, color: 'text-green-600 dark:text-green-400' },
    { sentiment: t('reports.modals.satisfaction.happy'), icon: <ThumbsUp className="w-5 h-5" />, count: 920, percentage: 24.0, color: 'text-lime-600 dark:text-lime-400' },
    { sentiment: t('reports.modals.satisfaction.neutral'), icon: <Meh className="w-5 h-5" />, count: 380, percentage: 9.9, color: 'text-yellow-600 dark:text-yellow-400' },
    { sentiment: t('reports.modals.satisfaction.unhappy'), icon: <Frown className="w-5 h-5" />, count: 310, percentage: 8.1, color: 'text-red-600 dark:text-red-400' },
  ];

  const feedbackTopics = [
    { topic: t('reports.modals.satisfaction.feedbackTopics.fastResponse'), count: 1840, sentiment: 'positive' },
    { topic: t('reports.modals.satisfaction.feedbackTopics.professionalSupport'), count: 1520, sentiment: 'positive' },
    { topic: t('reports.modals.satisfaction.feedbackTopics.problemSolving'), count: 1280, sentiment: 'positive' },
    { topic: t('reports.modals.satisfaction.feedbackTopics.waitingTime'), count: 420, sentiment: 'negative' },
    { topic: t('reports.modals.satisfaction.feedbackTopics.technicalIssues'), count: 280, sentiment: 'negative' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="satisfaction-report-title"
    >
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 rounded-lg p-3">
              <Award className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="satisfaction-report-title"
                className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
              >
                {t('reports.modals.satisfaction.title')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('reports.modals.satisfaction.subtitle')}
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

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-orange-600 dark:text-orange-400" aria-hidden="true" />
              <span className="text-sm font-medium text-orange-900 dark:text-orange-300">
                {t('reports.modals.satisfaction.overallScore')}
              </span>
            </div>
            <p className="text-4xl font-bold text-orange-900 dark:text-orange-100">
              {satisfactionData.overallScore}
              <span className="text-xl text-orange-700 dark:text-orange-300">/5.0</span>
            </p>
            <div className="flex items-center gap-4 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.floor(satisfactionData.overallScore)
                      ? 'text-orange-500 fill-orange-500'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Smile className="w-5 h-5 text-green-600 dark:text-green-400" aria-hidden="true" />
              <span className="text-sm font-medium text-green-900 dark:text-green-300">
                {t('reports.modals.satisfaction.csatScore')}
              </span>
            </div>
            <p className="text-4xl font-bold text-green-900 dark:text-green-100">
              {satisfactionData.csatScore}%
            </p>
            <p className="text-xs text-green-700 dark:text-green-400 mt-2">
              {t('reports.modals.satisfaction.csatLabel')}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                {t('reports.modals.satisfaction.npsScore')}
              </span>
            </div>
            <p className="text-4xl font-bold text-blue-900 dark:text-blue-100">
              {satisfactionData.npsScore}
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
              {t('reports.modals.satisfaction.npsLabel')}
            </p>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            {t('reports.modals.satisfaction.ratingDistribution')}
          </h3>
          <div className="space-y-3">
            {ratingDistribution.map((rating) => (
              <div key={rating.stars} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-20">
                  {[...Array(rating.stars)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 text-orange-500 fill-orange-500"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {rating.count.toLocaleString(i18n.language === 'tr' ? 'tr-TR' : 'en-US')} {t('reports.modals.satisfaction.responses')}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {rating.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                    <div
                      className={`${rating.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${rating.percentage}%` }}
                      role="progressbar"
                      aria-valuenow={rating.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            {t('reports.modals.satisfaction.sentimentAnalysis')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sentimentBreakdown.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4"
              >
                <div className={`${item.color} mb-2`}>
                  {item.icon}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {item.sentiment}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {item.count.toLocaleString(i18n.language === 'tr' ? 'tr-TR' : 'en-US')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {item.percentage}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Topics */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            {t('reports.modals.satisfaction.topTopics')}
          </h3>
          <div className="space-y-2">
            {feedbackTopics.map((topic, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 dark:bg-slate-700 rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare
                    className={`w-4 h-4 ${
                      topic.sentiment === 'positive'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {topic.topic}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {topic.count.toLocaleString(i18n.language === 'tr' ? 'tr-TR' : 'en-US')} {t('reports.modals.satisfaction.mentions')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">
            {t('reports.modals.satisfaction.insights')}
          </h4>
          <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-300">
            <li className="flex items-start gap-2">
              <span className="text-orange-600 dark:text-orange-400">•</span>
              <span>
                {t('reports.modals.satisfaction.insight1')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 dark:text-orange-400">•</span>
              <span>
                {t('reports.modals.satisfaction.insight2')}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 dark:text-orange-400">•</span>
              <span>
                {t('reports.modals.satisfaction.insight3')}
              </span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('reports.modals.satisfaction.totalResponses', { count: satisfactionData.totalResponses })}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
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
export default SatisfactionReportModal;
