/**
 * ReportDetailModal Component - Generic Report Detail Modal
 * 
 * Enterprise-grade modal for displaying detailed reports
 * This is a placeholder that can be extended for each category
 * 
 * Features:
 * - Responsive modal design
 * - Close on Esc/backdrop
 * - Category-specific content placeholder
 * - Future: Individual modals for each category
 * 
 * @author Enterprise Team
 */
import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ReportCategory } from '../hooks';

interface ReportDetailModalProps {
  /**
   * Category to display
   */
  category: ReportCategory;
  
  /**
   * Category label
   */
  categoryLabel: string;
  
  /**
   * Close callback
   */
  onClose: () => void;
}

/**
 * ReportDetailModal - Generic modal for report details
 * 
 * TODO: Create individual modals for each category:
 * - AIReportModal.tsx
 * - ChannelsReportModal.tsx
 * - SatisfactionReportModal.tsx
 * - TimeReportModal.tsx
 * - TeamReportModal.tsx
 * - ConversionReportModal.tsx
 * - FinancialReportModal.tsx
 * - TrendsReportModal.tsx
 * - SLAReportModal.tsx
 */
export function ReportDetailModal(props: ReportDetailModalProps) {
  const { category, categoryLabel, onClose } = props;
  const { t } = useTranslation('admin');

  /**
   * Handle backdrop click
   */
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-slate-700">
          <h2
            id="report-modal-title"
            className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
          >
            {categoryLabel}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label={t('reports.close')}
            type="button"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content Placeholder */}
        <div className="space-y-6">
          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong className="font-semibold">ℹ️ Placeholder Modal</strong>
              <br />
              Bu modal, <strong>{categoryLabel}</strong> için detaylı rapor içeriğini gösterecek.
              <br />
              <br />
              <strong>TODO:</strong> Kategori bazında özel modal component'leri oluşturulacak:
              <br />
              • Grafik ve chart'lar
              <br />
              • Tablo ve listeler
              <br />
              • Filtreleme seçenekleri
              <br />
              • Export fonksiyonları
            </p>
          </div>

          {/* Sample Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Örnek Metrik 1
              </h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                87.5%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Son 30 günlük ortalama
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Örnek Metrik 2
              </h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                +12.3%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Önceki döneme göre
              </p>
            </div>
          </div>

          {/* Category ID for development */}
          <div className="text-xs text-gray-400 dark:text-gray-600 font-mono bg-gray-100 dark:bg-slate-900 rounded p-2">
            Category ID: <strong>{category}</strong>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors font-medium"
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
export default ReportDetailModal;
