/**
 * TrendsReportModal - Trends & Predictions
 * Enterprise-grade trend analysis and forecasting
 */
import React from 'react';
import { X, TrendingUp, Activity, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TrendsReportModalProps {
  onClose: () => void;
}

export function TrendsReportModal(props: TrendsReportModalProps) {
  const { onClose } = props;
  const { t, i18n } = useTranslation('admin');

  const trends = [
    { metric: t('reports.modals.trends.conversationVolume'), current: 2744, predicted: 3420, growth: 24.6, trend: 'up' },
    { metric: t('reports.modals.trends.aiSuccessRate'), current: 87.5, predicted: 92.3, growth: 5.5, trend: 'up' },
    { metric: t('reports.modals.trends.avgResponseTime'), current: 135, predicted: 118, growth: -12.6, trend: 'down' },
    { metric: t('reports.modals.trends.conversionRate'), current: 4.7, predicted: 5.8, growth: 23.4, trend: 'up' },
  ];

  const predictions = [
    { period: t('reports.modals.trends.nextMonth'), conversations: 3420, confidence: 94 },
    { period: t('reports.modals.trends.threeMonths'), conversations: 4280, confidence: 87 },
    { period: t('reports.modals.trends.sixMonths'), conversations: 5840, confidence: 76 },
    { period: t('reports.modals.trends.oneYear'), conversations: 8920, confidence: 62 },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-pink-500 rounded-lg p-3"><TrendingUp className="w-6 h-6 text-white" /></div>
            <div>
              <h2 className="text-xl font-bold">{t('reports.modals.trends.title')}</h2>
              <p className="text-sm text-gray-500">{t('reports.modals.trends.subtitle')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg" type="button"><X className="w-5 h-5" /></button>
        </div>

        <h3 className="text-lg font-bold mb-4">📈 {t('reports.modals.trends.trendAnalysis')}</h3>
        <div className="space-y-3 mb-6">
          {trends.map((trend, i) => (
            <div key={i} className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{trend.metric}</span>
                <div className={`flex items-center gap-1 text-sm font-semibold ${trend.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingUp className={`w-4 h-4 ${trend.growth < 0 ? 'rotate-180' : ''}`} />
                  <span>{trend.growth > 0 ? '+' : ''}{trend.growth.toFixed(1)}%</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <p className="text-gray-600">{t('reports.modals.trends.current')}</p>
                  <p className="font-bold text-gray-900 dark:text-white">{trend.current}</p>
                </div>
                <div className="flex-1 flex items-center">
                  <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded" />
                  <Zap className="w-4 h-4 text-purple-600 mx-2" />
                </div>
                <div>
                  <p className="text-gray-600">{t('reports.modals.trends.prediction')}</p>
                  <p className="font-bold text-purple-600">{trend.predicted}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-bold mb-4">🔮 {t('reports.modals.trends.futureProjections')}</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {predictions.map((p, i) => (
            <div key={i} className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-pink-200">
              <p className="text-xs text-pink-700 mb-1">{p.period}</p>
              <p className="text-2xl font-bold text-pink-900 dark:text-pink-100">{p.conversations.toLocaleString(i18n.language === 'tr' ? 'tr-TR' : 'en-US')}</p>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-pink-700">{t('reports.modals.trends.confidence')}</span>
                  <span className="font-semibold text-pink-900">{p.confidence}%</span>
                </div>
                <div className="w-full bg-pink-200 rounded-full h-1">
                  <div className="bg-pink-600 h-1 rounded-full" style={{ width: `${p.confidence}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 rounded-lg p-4">
          <h4 className="font-semibold text-pink-900 mb-2">🎯 {t('reports.modals.trends.predictionNotes')}</h4>
          <ul className="space-y-1 text-sm text-pink-800 dark:text-pink-300">
            <li>• {t('reports.modals.trends.insight1')}</li>
            <li>• {t('reports.modals.trends.insight2')}</li>
            <li>• {t('reports.modals.trends.insight3')}</li>
          </ul>
        </div>

        <div className="mt-6 pt-4 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium" type="button">{t('reports.close')}</button>
        </div>
      </div>
    </div>
  );
}


// Default export for easier importing
export default TrendsReportModal;
