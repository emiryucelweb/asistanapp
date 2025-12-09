/**
 * Trend Chart - Revenue/Conversation Trends
 * Now using Recharts for dynamic data visualization
 */
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import TrendLineChart from '@/shared/ui/charts/TrendLineChart';
import { formatCurrency, formatNumber } from '@/shared/utils/formatters';

interface TrendChartProps {
  title: string;
  value: string;
  subtitle: string;
  change: string;
  positive?: boolean;
  dateRange?: '24h' | '7d' | '30d' | '1y' | 'custom';
  type?: 'revenue' | 'conversation';
}

const TrendChart: React.FC<TrendChartProps> = ({ 
  title, 
  value, 
  subtitle, 
  change, 
  positive = true,
  dateRange = '7d',
  type = 'conversation'
}) => {
  const { i18n } = useTranslation();
  
  // Generate mock data based on date range
  const chartData = useMemo(() => {
    // Get locale from i18n
    const locale = i18n.language === 'tr' ? 'tr-TR' : 'en-US';
    const getDataPoints = () => {
      switch (dateRange) {
        case '24h': return 24;
        case '7d': return 7;
        case '30d': return 30;
        case '1y': return 12;
        case 'custom': return 14;
        default: return 7;
      }
    };

    const dataPoints = getDataPoints();
    const data = [];
    const now = new Date();

    for (let i = dataPoints - 1; i >= 0; i--) {
      const date = new Date(now);
      let dateLabel = '';

      if (dateRange === '24h') {
        date.setHours(date.getHours() - i);
        dateLabel = `${date.getHours()}:00`;
      } else if (dateRange === '1y') {
        date.setMonth(date.getMonth() - i);
        dateLabel = date.toLocaleDateString(locale, { month: 'short' });
      } else {
        date.setDate(date.getDate() - i);
        dateLabel = `${date.getDate()} ${date.toLocaleDateString(locale, { month: 'short' })}`;
      }

      // Generate realistic trending data
      const baseValue = type === 'revenue' ? 15000 : 125;
      const trend = 1 + (dataPoints - i) * 0.02; // Upward trend
       
      const variance = 0.8 + Math.random() * 0.4; // Random variance
      const value = Math.round(baseValue * trend * variance);

       
      data.push({
        date: dateLabel,
        value: value,
      });
    }

    return data;
  }, [dateRange, type, i18n.language]);

  const color = type === 'revenue' ? '#10b981' : '#3b82f6';
  const valueFormatter = type === 'revenue' 
    ? (value: number) => formatCurrency(value)
    : (value: number) => formatNumber(value);

  return (
    <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#d0d9e7] dark:border-slate-700 p-6 hover:shadow-md transition-shadow bg-white dark:bg-slate-800">
      <p className="text-[#0e131b] dark:text-gray-100 text-base font-medium leading-normal">{title}</p>
      <p className="text-[#0e131b] dark:text-gray-100 tracking-light text-[32px] font-bold leading-tight truncate">{value}</p>
      <div className="flex gap-1">
        <p className="text-[#4d6a99] dark:text-gray-400 text-base font-normal leading-normal">{subtitle}</p>
        <p className={`text-base font-medium leading-normal ${positive ? 'text-[#07883b] dark:text-green-400' : 'text-[#ef4444] dark:text-red-400'}`}>
          {change}
        </p>
      </div>
      
      {/* Recharts Area Chart */}
      <div className="mt-2">
        <TrendLineChart
          data={chartData}
          title=""
          color={color}
          type="area"
          showGrid={true}
          height={160}
          valueFormatter={valueFormatter}
        />
      </div>
    </div>
  );
};

export default TrendChart;

