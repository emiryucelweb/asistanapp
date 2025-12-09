/**
 * Alert List - AI Alerts
 * Now with dynamic data based on date range
 */
import React, { useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Alert {
  title: string;
  time: string;
  type: 'warning' | 'error' | 'info';
}

interface AlertListProps {
  dateRange?: '24h' | '7d' | '30d' | '1y' | 'custom';
}

const AlertList: React.FC<AlertListProps> = ({ dateRange = '7d' }) => {
  const { t } = useTranslation('admin');
  
  const alerts = useMemo(() => {
    const allAlerts: Alert[] = [
      { title: t('dashboard.alerts.highConversationVolume'), time: t('dashboard.alerts.time.hoursAgo', { count: 1 }), type: 'warning' },
      { title: t('dashboard.alerts.lowSatisfactionRate'), time: t('dashboard.alerts.time.hoursAgo', { count: 2 }), type: 'error' },
      { title: t('dashboard.alerts.aiResponseTimeIncreased'), time: t('dashboard.alerts.time.hoursAgo', { count: 3 }), type: 'warning' },
      { title: t('dashboard.alerts.pendingConversationIncrease'), time: t('dashboard.alerts.time.hoursAgo', { count: 5 }), type: 'warning' },
    ];

    // Show more alerts for longer time ranges
    const limit = dateRange === '24h' ? 2 : dateRange === '7d' ? 2 : dateRange === '30d' ? 3 : 4;
    return allAlerts.slice(0, limit);
  }, [dateRange, t]);
  return (
    <div className="flex flex-col">
      {alerts.map((alert, index) => (
        <div key={index} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 px-4 min-h-[72px] py-2 hover:bg-[#e7ecf3]/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
          <div className="text-[#0e131b] dark:text-gray-100 flex items-center justify-center rounded-lg bg-[#e7ecf3] dark:bg-slate-700 shrink-0 size-12">
            <AlertTriangle size={24} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[#0e131b] dark:text-gray-100 text-base font-medium leading-normal line-clamp-1">{alert.title}</p>
            <p className="text-[#4d6a99] dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">{alert.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertList;

