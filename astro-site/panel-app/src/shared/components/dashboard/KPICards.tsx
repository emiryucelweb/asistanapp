/**
 * KPI Cards - 4 Metric Cards
 * Stitch AI Design Pattern
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatNumber, formatCurrency } from '@/shared/utils/formatters';

interface KPICard {
  title: string;
  value: string | number;
  change: string;
  positive: boolean;
}

interface KPICardsProps {
  data?: KPICard[];
  dateRange?: '24h' | '7d' | '30d' | '1y' | 'custom';
}

const KPICards: React.FC<KPICardsProps> = ({ dateRange = '7d' }) => {
  const { t } = useTranslation('admin');
  
  // Calculate multiplier based on date range
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
  
  // Base values for 7 days
  const baseConversations = 125;
  const baseAIResolution = 65;
  const baseSatisfaction = 92;
  const baseRevenue = 15000;

  const data: KPICard[] = [
    { 
      title: t('dashboard.kpi.activeConversations'), 
      value: formatNumber(Math.round(baseConversations * multiplier)), 
      change: '+10%', 
      positive: true 
    },
    { 
      title: t('dashboard.kpi.aiResolutionRate'), 
      value: `${baseAIResolution}%`, 
      change: '+5%', 
      positive: true 
    },
    { 
      title: t('dashboard.kpi.customerSatisfaction'), 
      value: `${baseSatisfaction}%`, 
      change: '+3%', 
      positive: true 
    },
    { 
      title: t('dashboard.kpi.revenue'), 
      value: formatCurrency(baseRevenue * multiplier), 
      change: '+8%', 
      positive: true 
    },
  ];

  return (
    <div className="flex flex-wrap gap-4 p-4">
      {data.map((card, index) => (
          <div
            key={index}
            className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#d0d9e7] dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md transition-shadow"
          >
            <p className="text-[#0e131b] dark:text-gray-100 text-base font-medium leading-normal">{card.title}</p>
            <p className="text-[#0e131b] dark:text-gray-100 tracking-light text-2xl font-bold leading-tight">{card.value}</p>
            <p className={`text-base font-medium leading-normal ${card.positive ? 'text-[#07883b] dark:text-green-400' : 'text-[#ef4444] dark:text-red-400'}`}>
            {card.change}
          </p>
        </div>
      ))}
    </div>
  );
};

export default KPICards;

