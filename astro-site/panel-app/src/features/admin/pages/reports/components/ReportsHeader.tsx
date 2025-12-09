/**
 * ReportsHeader Component - Reports Page Header
 * 
 * Enterprise-grade header with title, filters, and export actions
 * Implements responsive design and accessibility
 * 
 * Features:
 * - Page title and description
 * - Date range filter
 * - Export buttons (PDF, Excel, CSV)
 * - Loading states
 * - Responsive layout
 * 
 * @author Enterprise Team
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Calendar } from 'lucide-react';
import type { DateRange } from '../hooks';

interface ReportsHeaderProps {
  /**
   * Current date range selection
   */
  dateRange: DateRange;
  
  /**
   * Export state
   */
  isExporting: boolean;
  exportFormat: 'pdf' | 'excel' | 'csv' | null;
  
  /**
   * Callbacks
   */
  onDateRangeChange: (range: DateRange) => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
  onExportCSV: () => void;
}

/**
 * ReportsHeader - Professional reports page header
 * 
 * Implements:
 * - Responsive design (mobile-first)
 * - Loading states for export buttons
 * - ARIA labels
 * - Keyboard navigation
 */
export function ReportsHeader(props: ReportsHeaderProps) {
  const { t } = useTranslation('admin');
  const {
    dateRange,
    isExporting,
    exportFormat,
    onDateRangeChange,
    onExportPDF,
    onExportExcel,
    onExportCSV,
  } = props;

  // Generate labels from i18n
  const dateRangeLabels: Record<DateRange, string> = {
    '24h': t('reports.dateRanges.24h'),
    '7d': t('reports.dateRanges.7d'),
    '30d': t('reports.dateRanges.30d'),
    '90d': t('reports.dateRanges.90d'),
    'custom': t('reports.dateRanges.custom'),
  };

  /**
   * Check if specific export format is loading
   */
  const isExportingFormat = (format: 'pdf' | 'excel' | 'csv'): boolean => {
    return isExporting && exportFormat === format;
  };

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          {/* Title Section */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('reports.title')}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('reports.subtitle')}
            </p>
          </div>

          {/* Actions Section */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Date Range Filter */}
            <div className="relative flex-1 sm:flex-initial">
              <Calendar 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" 
                aria-hidden="true"
              />
              <select
                value={dateRange}
                onChange={(e) => onDateRangeChange(e.target.value as DateRange)}
                className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors appearance-none cursor-pointer focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                aria-label={t('reports.dateRangeSelect')}
              >
                {Object.entries(dateRangeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Export Buttons */}
            <div className="flex items-center gap-2">
              {/* PDF Export */}
              <button 
                onClick={onExportPDF}
                disabled={isExporting}
                className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={t('reports.downloadPDF')}
                type="button"
              >
                <Download 
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${isExportingFormat('pdf') ? 'animate-bounce' : ''}`}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">
                  {isExportingFormat('pdf') ? t('reports.exporting') : 'PDF'}
                </span>
              </button>

              {/* Excel Export */}
              <button 
                onClick={onExportExcel}
                disabled={isExporting}
                className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={t('reports.downloadExcel')}
                type="button"
              >
                <Download 
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${isExportingFormat('excel') ? 'animate-bounce' : ''}`}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">
                  {isExportingFormat('excel') ? t('reports.exporting') : 'Excel'}
                </span>
              </button>

              {/* CSV Export */}
              <button 
                onClick={onExportCSV}
                disabled={isExporting}
                className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={t('reports.downloadCSV')}
                type="button"
              >
                <Download 
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${isExportingFormat('csv') ? 'animate-bounce' : ''}`}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">
                  {isExportingFormat('csv') ? t('reports.exporting') : 'CSV'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

