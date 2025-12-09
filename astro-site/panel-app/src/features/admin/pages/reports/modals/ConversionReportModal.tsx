/**
 * ConversionReportModal - Conversion Analytics
 * Enterprise-grade conversion funnel and rate analytics
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Target, TrendingUp, Zap, DollarSign } from 'lucide-react';

interface ConversionReportModalProps {
  onClose: () => void;
}

export function ConversionReportModal(props: ConversionReportModalProps) {
  const { onClose } = props;
  const { t } = useTranslation('admin');

  const funnelStages = [
    { stage: t('reports.modals.conversion.visitor'), count: 15420, percentage: 100, dropoff: 0 },
    { stage: t('reports.modals.conversion.chatStarted'), count: 8240, percentage: 53.4, dropoff: 46.6 },
    { stage: t('reports.modals.conversion.productInterest'), count: 4280, percentage: 27.8, dropoff: 25.6 },
    { stage: t('reports.modals.conversion.addToCart'), count: 2140, percentage: 13.9, dropoff: 13.9 },
    { stage: t('reports.modals.conversion.checkoutPage'), count: 1280, percentage: 8.3, dropoff: 5.6 },
    { stage: t('reports.modals.conversion.purchased'), count: 730, percentage: 4.7, dropoff: 3.6 },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 rounded-lg p-3"><Target className="w-6 h-6 text-white" /></div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('reports.modals.conversion.title')}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('reports.modals.conversion.subtitle')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg" type="button"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: t('reports.modals.conversion.generalConversion'), value: '4.7%', icon: Target, color: 'green' },
            { label: t('reports.modals.conversion.cartConversion'), value: '34.1%', icon: Zap, color: 'blue' },
            { label: t('reports.modals.conversion.avgOrder'), value: '₺485', icon: DollarSign, color: 'purple' },
            { label: t('reports.modals.conversion.growth'), value: '+12.8%', icon: TrendingUp, color: 'orange' },
          ].map((metric, i) => (
            <div key={i} className={`bg-${metric.color}-50 dark:bg-${metric.color}-900/20 rounded-lg p-4 border border-${metric.color}-200`}>
              <metric.icon className={`w-5 h-5 text-${metric.color}-600 mb-2`} />
              <p className={`text-2xl font-bold text-${metric.color}-900 dark:text-${metric.color}-100`}>{metric.value}</p>
              <p className={`text-xs text-${metric.color}-700`}>{metric.label}</p>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📊 {t('reports.modals.conversion.salesFunnel')}</h3>
        <div className="space-y-3 mb-6">
          {funnelStages.map((stage, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium text-gray-900 dark:text-white">{stage.stage}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{t('reports.modals.conversion.peopleCount', { count: stage.count })}</span>
                  <span className="text-sm font-semibold">{stage.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full transition-all" style={{ width: `${stage.percentage}%` }} />
                </div>
                {stage.dropoff > 0 && <p className="text-xs text-red-600 mt-1">↓ {t('reports.modals.conversion.loss', { percentage: stage.dropoff })}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">💡 {t('reports.modals.conversion.optimizationSuggestions')}</h4>
          <ul className="space-y-1 text-sm text-green-800 dark:text-green-300">
            <li>• {t('reports.modals.conversion.suggestion1')}</li>
            <li>• {t('reports.modals.conversion.suggestion2')}</li>
            <li>• {t('reports.modals.conversion.suggestion3')}</li>
          </ul>
        </div>

        <div className="mt-6 pt-4 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium" type="button">{t('reports.close')}</button>
        </div>
      </div>
    </div>
  );
}


// Default export for easier importing
export default ConversionReportModal;
