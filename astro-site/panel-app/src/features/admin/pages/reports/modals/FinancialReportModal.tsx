/**
 * FinancialReportModal - Financial Analytics
 * Enterprise-grade financial metrics and ROI analysis
 */
import React from 'react';
import { X, DollarSign, TrendingUp, PieChart, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FinancialReportModalProps {
  onClose: () => void;
}

export function FinancialReportModal(props: FinancialReportModalProps) {
  const { onClose } = props;
  const { t, i18n } = useTranslation('admin');

  const financials = {
    revenue: 487250,
    cost: 142800,
    profit: 344450,
    roi: 241,
    avgOrderValue: 485,
    monthlyGrowth: 15.3,
  };

  const breakdown = [
    { category: t('reports.modals.financial.categories.productSales'), amount: 385200, percentage: 79.1, color: 'bg-green-500' },
    { category: t('reports.modals.financial.categories.serviceFees'), amount: 68400, percentage: 14.0, color: 'bg-blue-500' },
    { category: t('reports.modals.financial.categories.subscriptions'), amount: 33650, percentage: 6.9, color: 'bg-purple-500' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 rounded-lg p-3"><DollarSign className="w-6 h-6 text-white" /></div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('reports.modals.financial.title')}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('reports.modals.financial.subtitle')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg" type="button"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: t('reports.financial.totalRevenue'), value: `₺${(financials.revenue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'emerald' },
            { label: t('reports.financial.netProfit'), value: `₺${(financials.profit / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'green' },
            { label: t('reports.financial.roi'), value: `${financials.roi}%`, icon: BarChart3, color: 'blue' },
            { label: t('reports.financial.monthlyGrowth'), value: `+${financials.monthlyGrowth}%`, icon: PieChart, color: 'purple' },
          ].map((m, i) => (
            <div key={i} className={`bg-${m.color}-50 dark:bg-${m.color}-900/20 rounded-lg p-4 border border-${m.color}-200`}>
              <m.icon className={`w-5 h-5 text-${m.color}-600 mb-2`} />
              <p className={`text-2xl font-bold text-${m.color}-900 dark:text-${m.color}-100`}>{m.value}</p>
              <p className={`text-xs text-${m.color}-700`}>{m.label}</p>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-bold mb-4">{t('reports.modals.financial.revenueDistribution')}</h3>
        <div className="space-y-3 mb-6">
          {breakdown.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium">{item.category}</div>
              <div className="flex-1">
                <div className="flex justify-between mb-1 text-sm">
                  <span>₺{item.amount.toLocaleString(i18n.language === 'tr' ? 'tr-TR' : 'en-US')}</span>
                  <span className="font-semibold">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 rounded-lg p-4">
          <h4 className="font-semibold text-emerald-900 mb-2">{t('reports.modals.financial.insights')}</h4>
          <ul className="space-y-1 text-sm text-emerald-800 dark:text-emerald-300">
            <li>• {t('reports.modals.financial.insight1')}</li>
            <li>• {t('reports.modals.financial.insight2')}</li>
            <li>• {t('reports.modals.financial.insight3')}</li>
          </ul>
        </div>

        <div className="mt-6 pt-4 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium" type="button">{t('reports.close')}</button>
        </div>
      </div>
    </div>
  );
}


// Default export for easier importing
export default FinancialReportModal;
