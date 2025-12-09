/**
 * TimeReportModal Component - Time Analytics Report Modal
 * 
 * Enterprise-grade time-based performance analytics modal
 * Displays response times, resolution times, and time distribution analysis
 * 
 * Features:
 * - Average response time metrics
 * - First response time (FRT)
 * - Average resolution time
 * - Time of day distribution
 * - Peak hours analysis
 * - SLA compliance times
 * 
 * @author Enterprise Team
 */
import React from 'react';
import { 
  X, 
  Clock,
  TrendingUp,
  Zap,
  CheckCircle,
  AlertCircle,
  Sun,
  Moon,
  Activity
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TimeReportModalProps {
  onClose: () => void;
}

export function TimeReportModal(props: TimeReportModalProps) {
  const { onClose } = props;
  const { t, i18n } = useTranslation('admin');

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Mock data
  const timeMetrics = {
    avgResponseTime: '2m 15s',
    avgResponseSeconds: 135,
    firstResponseTime: '45s',
    avgResolutionTime: '12m 30s',
    avgResolutionSeconds: 750,
    slaCompliance: 94.3,
    peakHour: '14:00-15:00',
    slowestHour: '09:00-10:00',
  };

  const hourlyDistribution = [
    { hour: '00-03', conversations: 45, avgTime: 180, color: 'bg-blue-900' },
    { hour: '03-06', conversations: 28, avgTime: 210, color: 'bg-blue-800' },
    { hour: '06-09', conversations: 340, avgTime: 165, color: 'bg-blue-600' },
    { hour: '09-12', conversations: 1240, avgTime: 190, color: 'bg-purple-600' },
    { hour: '12-15', conversations: 1580, avgTime: 145, color: 'bg-green-500' },
    { hour: '15-18', conversations: 1320, avgTime: 155, color: 'bg-green-600' },
    { hour: '18-21', conversations: 680, avgTime: 170, color: 'bg-blue-700' },
    { hour: '21-24', conversations: 180, avgTime: 200, color: 'bg-blue-800' },
  ];

  const responseTimeBreakdown = [
    { range: t('reports.modals.time.lessThan1Min'), count: 3840, percentage: 62.1, color: 'bg-green-500' },
    { range: t('reports.modals.time.between1And3Min'), count: 1520, percentage: 24.6, color: 'bg-lime-500' },
    { range: t('reports.modals.time.between3And5Min'), count: 520, percentage: 8.4, color: 'bg-yellow-500' },
    { range: t('reports.modals.time.between5And10Min'), count: 220, percentage: 3.6, color: 'bg-orange-500' },
    { range: t('reports.modals.time.moreThan10Min'), count: 80, percentage: 1.3, color: 'bg-red-500' },
  ];

  const weekdayPerformance = [
    { day: t('reports.modals.time.weekdays.monday'), avgTime: 142, performance: 'excellent' },
    { day: t('reports.modals.time.weekdays.tuesday'), avgTime: 138, performance: 'excellent' },
    { day: t('reports.modals.time.weekdays.wednesday'), avgTime: 145, performance: 'excellent' },
    { day: t('reports.modals.time.weekdays.thursday'), avgTime: 152, performance: 'good' },
    { day: t('reports.modals.time.weekdays.friday'), avgTime: 168, performance: 'good' },
    { day: t('reports.modals.time.weekdays.saturday'), avgTime: 135, performance: 'excellent' },
    { day: t('reports.modals.time.weekdays.sunday'), avgTime: 128, performance: 'excellent' },
  ];

  const maxConversations = Math.max(...hourlyDistribution.map(h => h.conversations));

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="time-report-title"
    >
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500 rounded-lg p-3">
              <Clock className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 id="time-report-title" className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {t('reports.modals.time.title')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('reports.modals.time.subtitle')}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors" aria-label={t('reports.close')} type="button">
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Key Time Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-lg p-4 border border-teal-200 dark:border-teal-800">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
              <span className="text-sm font-medium text-teal-900 dark:text-teal-300">{t('reports.modals.time.firstResponse')}</span>
            </div>
            <p className="text-3xl font-bold text-teal-900 dark:text-teal-100">{timeMetrics.firstResponseTime}</p>
            <p className="text-xs text-teal-700 dark:text-teal-400 mt-1">{t('reports.modals.time.firstResponseLabel')}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-300">{t('reports.modals.time.avgResponse')}</span>
            </div>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{timeMetrics.avgResponseTime}</p>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">{t('reports.modals.time.avgResponseLabel')}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
              <span className="text-sm font-medium text-purple-900 dark:text-purple-300">{t('reports.modals.time.avgResolution')}</span>
            </div>
            <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{timeMetrics.avgResolutionTime}</p>
            <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">{t('reports.modals.time.avgResolutionLabel')}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-green-600 dark:text-green-400" aria-hidden="true" />
              <span className="text-sm font-medium text-green-900 dark:text-green-300">{t('reports.modals.time.slaCompliance')}</span>
            </div>
            <p className="text-3xl font-bold text-green-900 dark:text-green-100">{timeMetrics.slaCompliance}%</p>
            <div className="flex items-center gap-1 text-xs text-green-700 dark:text-green-400 mt-1">
              <TrendingUp className="w-3 h-3" aria-hidden="true" />
              <span>{t('reports.time.excellentLevel')}</span>
            </div>
          </div>
        </div>

        {/* Hourly Distribution */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('reports.modals.time.hourlyDistribution')}</h3>
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6">
            <div className="flex items-end justify-between h-64 gap-2">
              {hourlyDistribution.map((hour, index) => (
                <div key={index} className="flex-1 flex flex-col items-center justify-end gap-2">
                  <div className="text-xs font-semibold text-gray-900 dark:text-white">{hour.conversations}</div>
                  <div
                    className={`w-full ${hour.color} rounded-t-lg transition-all duration-500 hover:opacity-80 relative group`}
                    style={{ height: `${(hour.conversations / maxConversations) * 100}%` }}
                    role="img"
                    aria-label={t('reports.modals.time.hourlyLabel', { hour: hour.hour, conversations: hour.conversations, avgTime: hour.avgTime })}
                  >
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {t('reports.modals.time.avgLabel')}: {Math.floor(hour.avgTime / 60)}m {hour.avgTime % 60}s
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">{hour.hour}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                <span className="text-gray-600 dark:text-gray-400">{t('reports.modals.time.night')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
                <span className="text-gray-600 dark:text-gray-400">{t('reports.modals.time.daytime')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                <span className="text-gray-600 dark:text-gray-400">{t('reports.modals.time.evening')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Response Time Breakdown */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('reports.modals.time.responseTimeBreakdown')}</h3>
          <div className="space-y-3">
            {responseTimeBreakdown.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-28 text-sm font-medium text-gray-900 dark:text-white">{item.range}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.count.toLocaleString(i18n.language === 'tr' ? 'tr-TR' : 'en-US')} {t('reports.modals.channels.conversations')}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full transition-all duration-500`} style={{ width: `${item.percentage}%` }} role="progressbar" aria-valuenow={item.percentage} aria-valuemin={0} aria-valuemax={100} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekday Performance */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('reports.modals.time.weeklyPerformance')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {weekdayPerformance.map((day, index) => (
              <div key={index} className={`rounded-lg p-3 text-center ${day.performance === 'excellent' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'}`}>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{day.day}</p>
                <p className={`text-xl font-bold ${day.performance === 'excellent' ? 'text-green-900 dark:text-green-100' : 'text-yellow-900 dark:text-yellow-100'}`}>
                  {Math.floor(day.avgTime / 60)}m {day.avgTime % 60}s
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
          <h4 className="font-semibold text-teal-900 dark:text-teal-300 mb-2">{t('reports.modals.time.insights')}</h4>
          <ul className="space-y-2 text-sm text-teal-800 dark:text-teal-300">
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400">•</span>
              <span dangerouslySetInnerHTML={{ __html: t('reports.modals.time.insight1') }} />
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400">•</span>
              <span dangerouslySetInnerHTML={{ __html: t('reports.modals.time.insight2') }} />
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400">•</span>
              <span dangerouslySetInnerHTML={{ __html: t('reports.modals.time.insight3') }} />
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 dark:text-teal-400">•</span>
              <span dangerouslySetInnerHTML={{ __html: t('reports.modals.time.insight4') }} />
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
              <span>{t('reports.modals.time.peak')}: {timeMetrics.peakHour}</span>
            </div>
          </div>
          <button onClick={onClose} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors font-medium" type="button">
            {t('reports.close')}
          </button>
        </div>
      </div>
    </div>
  );
}


// Default export for easier importing
export default TimeReportModal;
