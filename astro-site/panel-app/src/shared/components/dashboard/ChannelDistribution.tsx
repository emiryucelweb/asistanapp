/**
 * Channel Distribution - Enhanced Visualization
 * Modern bars with percentages and icons
 */
import React, { useMemo } from 'react';
import { MessageCircle, Instagram, Phone, Facebook, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ChannelDistributionProps {
  dateRange?: '24h' | '7d' | '30d' | '1y' | 'custom';
}

const ChannelDistribution: React.FC<ChannelDistributionProps> = ({ dateRange = '7d' }) => {
  const { t } = useTranslation('admin');
  
  const chartData = useMemo(() => {
    const multiplier = dateRange === '24h' ? 0.15 : dateRange === '7d' ? 1 : dateRange === '30d' ? 4 : 12;
    
    return [
      { name: 'WhatsApp', value: Math.round(450 * multiplier), color: '#10b981', icon: MessageCircle },
      { name: 'Instagram', value: Math.round(380 * multiplier), color: '#ec4899', icon: Instagram },
      { name: 'Facebook', value: Math.round(320 * multiplier), color: '#3b82f6', icon: Facebook },
      { name: 'Web Widget', value: Math.round(280 * multiplier), color: '#8b5cf6', icon: Globe },
      { name: t('dashboard.channels.phone'), value: Math.round(220 * multiplier), color: '#f59e0b', icon: Phone },
    ];
  }, [dateRange, t]);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex min-w-72 flex-1 flex-col gap-4 rounded-xl border border-[#d0d9e7] dark:border-slate-700 p-6 hover:shadow-md transition-shadow bg-white dark:bg-slate-800">
      <div>
        <p className="text-[#0e131b] dark:text-gray-100 text-base font-medium leading-normal">{t('dashboard.channelDistribution')}</p>
        <p className="text-[#0e131b] dark:text-gray-100 tracking-light text-[32px] font-bold leading-tight truncate">
          {total.toLocaleString('tr-TR')}
        </p>
        <div className="flex gap-1">
          <p className="text-[#4d6a99] dark:text-gray-400 text-base font-normal leading-normal">{t('dashboard.totalConversations')}</p>
          <p className="text-[#07883b] dark:text-green-400 text-base font-medium leading-normal">+12%</p>
        </div>
      </div>
      
      {/* Modern Bar Chart with Icons and Percentages */}
      <div className="space-y-3">
        {chartData.map((channel, index) => {
          const percentage = ((channel.value / total) * 100).toFixed(1);
          const Icon = channel.icon;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="p-1.5 rounded-lg"
                    style={{ backgroundColor: `${channel.color}15` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: channel.color }} />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{channel.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 dark:text-gray-400">{channel.value.toLocaleString('tr-TR')}</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[3rem] text-right">
                    {percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: channel.color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChannelDistribution;
