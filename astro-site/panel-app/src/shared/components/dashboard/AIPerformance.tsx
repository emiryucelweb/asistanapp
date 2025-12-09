/**
 * AI Performance Summary - Donut Chart
 * Now using Recharts for dynamic visualization
 */
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PieChartComponent from '@/shared/ui/charts/PieChartComponent';

interface AIPerformanceProps {
  dateRange?: '24h' | '7d' | '30d' | '1y' | 'custom';
}

const AIPerformance: React.FC<AIPerformanceProps> = ({ dateRange = '7d' }) => {
  const { t } = useTranslation('admin');
  
  const chartData = useMemo(() => {
    // Generate dynamic data based on date range
    const multiplier = dateRange === '24h' ? 0.15 : dateRange === '7d' ? 1 : dateRange === '30d' ? 4 : 12;
    
    return [
      { name: t('dashboard.aiPerformance.aiResolved'), value: Math.round(850 * multiplier), color: '#10b981' },
      { name: t('dashboard.aiPerformance.handedToAgent'), value: Math.round(320 * multiplier), color: '#f59e0b' },
      { name: t('dashboard.aiPerformance.pending'), value: Math.round(180 * multiplier), color: '#ef4444' },
    ];
  }, [dateRange, t]);

  const totalResolved = chartData[0].value;
  const totalConversations = chartData.reduce((sum, item) => sum + item.value, 0);
  const resolutionRate = Math.round((totalResolved / totalConversations) * 100);

  return (
    <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#d0d9e7] dark:border-slate-700 p-6 hover:shadow-md transition-shadow bg-white dark:bg-slate-800">
      <p className="text-[#0e131b] dark:text-gray-100 text-base font-medium leading-normal">{t('dashboard.aiPerformance.title')}</p>
      <p className="text-[#0e131b] dark:text-gray-100 tracking-light text-[32px] font-bold leading-tight truncate">{resolutionRate}%</p>
      <div className="flex gap-1">
        <p className="text-[#4d6a99] dark:text-gray-400 text-base font-normal leading-normal">{t('dashboard.aiPerformance.resolutionRate')}</p>
        <p className="text-[#07883b] dark:text-green-400 text-base font-medium leading-normal">+5%</p>
      </div>
      
      <PieChartComponent
        data={chartData}
        title=""
        type="donut"
        showLegend={true}
        height={250}
      />
    </div>
  );
};

export default AIPerformance;

