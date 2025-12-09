/**
 * Dashboard Page - Ana Sayfa
 * Stitch AI Design Pattern
 * Müşteri Paneli
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '@/shared/utils/logger';
import { Calendar, ChevronDown } from 'lucide-react';
import KPICards from '@/shared/components/dashboard/KPICards';
import TrendChart from '@/shared/components/dashboard/TrendChart';
import AIPerformance from '@/shared/components/dashboard/AIPerformance';
import AlertList from '@/shared/components/dashboard/AlertList';
import ChannelDistribution from '@/shared/components/dashboard/ChannelDistribution';
import TeamPerformance from '@/shared/components/dashboard/TeamPerformance';
import { DashboardLoadingState } from '@/shared/ui/loading';

type DateRangeType = '24h' | '7d' | '30d' | '1y' | 'custom';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation('admin');
  logger.debug('📈 DashboardPage rendering...');
  
  const [dateRange, setDateRange] = useState<DateRangeType>('7d');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Simulate API call

    return () => clearTimeout(timer);
  }, [dateRange]);

  const dateRangeOptions = [
    { value: '24h', label: t('dashboard.dateRanges.24h') },
    { value: '7d', label: t('dashboard.dateRanges.7d') },
    { value: '30d', label: t('dashboard.dateRanges.30d') },
    { value: '1y', label: t('dashboard.dateRanges.1y') },
    { value: 'custom', label: t('dashboard.dateRanges.custom') }
  ];

  const getDateRangeLabel = () => {
    if (dateRange === 'custom' && customStartDate && customEndDate) {
      return `${customStartDate} - ${customEndDate}`;
    }
    return dateRangeOptions.find(opt => opt.value === dateRange)?.label || t('dashboard.dateRanges.7d');
  };

  const getDateRangeDescription = () => {
    switch (dateRange) {
      case '24h': return t('dashboard.dateRangeDescriptions.24h');
      case '7d': return t('dashboard.dateRangeDescriptions.7d');
      case '30d': return t('dashboard.dateRangeDescriptions.30d');
      case '1y': return t('dashboard.dateRangeDescriptions.1y');
      case 'custom': return t('dashboard.dateRangeDescriptions.custom');
      default: return t('dashboard.dateRangeDescriptions.7d');
    }
  };

  // Calculate dynamic values based on date range
  const getMultiplier = () => {
    switch (dateRange) {
      case '24h': return 0.15;
      case '7d': return 1;
      case '30d': return 4;
      case '1y': return 50;
      case 'custom': return 2;
      default: return 1;
    }
  };

  const multiplier = getMultiplier();
  const baseConversations = 125;
  const baseRevenue = 15000;

  const currentConversations = Math.round(baseConversations * multiplier);
  const currentRevenue = Math.round(baseRevenue * multiplier);

  // Show skeleton while loading
  if (isLoading) {
    return (
      <div className="flex flex-col w-full overflow-x-hidden p-4 sm:p-6">
        <DashboardLoadingState />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Page Header with Date Range Filter */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-between gap-3 p-2 sm:p-4">
        <div className="flex flex-col gap-2 sm:gap-3 min-w-0">
          <p className="text-[#0e131b] dark:text-gray-100 tracking-light text-2xl sm:text-[32px] font-bold leading-tight">{t('dashboard.pageTitle')}</p>
          <p className="text-[#4d6a99] dark:text-gray-400 text-xs sm:text-sm font-normal leading-normal">{getDateRangeDescription()}</p>
        </div>
        
        {/* Date Range Selector */}
        <div className="relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="font-medium text-gray-900 dark:text-gray-100">{getDateRangeLabel()}</span>
            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Date Range Dropdown */}
          {showDatePicker && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg z-10">
              <div className="p-2">
                {dateRangeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setDateRange(option.value as DateRangeType);
                      if (option.value !== 'custom') {
                        setShowDatePicker(false);
                      }
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors ${
                      dateRange === option.value
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Custom Date Range Picker */}
              {dateRange === 'custom' && (
                <div className="border-t border-gray-200 dark:border-slate-600 p-4 space-y-3">
                  <div>
                    <label htmlFor="admin-dashboard-start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('dashboard.startDate')}
                    </label>
                    <input
                      id="admin-dashboard-start-date"
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="admin-dashboard-end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('dashboard.endDate')}
                    </label>
                    <input
                      id="admin-dashboard-end-date"
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (customStartDate && customEndDate) {
                        setShowDatePicker(false);
                      } else {
                        alert(t('dashboard.selectDates'));
                      }
                    }}
                    className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
                  >
                    {t('dashboard.apply')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <KPICards dateRange={dateRange} />

      {/* Metrikler Section */}
      <h2 className="text-[#0e131b] dark:text-gray-100 text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        {t('dashboard.metrics')}
      </h2>
      
      {/* Trend Charts */}
      <div className="flex flex-wrap gap-4 px-4 py-6">
        <TrendChart
          title={t('dashboard.revenueTrends')}
          value={`₺${currentRevenue.toLocaleString('tr-TR')}`}
          subtitle={getDateRangeLabel()}
          change="+8%"
          dateRange={dateRange}
          type="revenue"
        />
        <TrendChart
          title={t('dashboard.conversationTrends')}
          value={currentConversations.toLocaleString('tr-TR')}
          subtitle={getDateRangeLabel()}
          change="+10%"
          dateRange={dateRange}
          type="conversation"
        />
      </div>

      {/* AI Performance */}
      <div className="flex flex-wrap gap-4 px-4 py-6">
        <AIPerformance dateRange={dateRange} />
      </div>

      {/* Son Uyarılar */}
      <h2 className="text-[#0e131b] dark:text-gray-100 text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        {t('dashboard.recentAlerts')}
      </h2>
      <AlertList dateRange={dateRange} />

      {/* Kanal Dağılımı */}
      <h2 className="text-[#0e131b] dark:text-gray-100 text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        {t('dashboard.channelDistribution')}
      </h2>
      <div className="flex flex-wrap gap-4 px-4 py-6">
        <ChannelDistribution dateRange={dateRange} />
      </div>

      {/* Ekip Performansı */}
      <h2 className="text-[#0e131b] dark:text-gray-100 text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        {t('dashboard.teamPerformance')}
      </h2>
      <TeamPerformance dateRange={dateRange} />
    </div>
  );
};

export default DashboardPage;
