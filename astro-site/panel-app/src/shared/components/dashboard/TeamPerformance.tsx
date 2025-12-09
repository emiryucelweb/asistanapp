/**
 * Team Performance - Table
 * Now with dynamic data based on date range
 */
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface _TeamMember {
  name: string;
  resolved: number;
  avgTime: string;
  satisfaction: number;
}

interface TeamPerformanceProps {
  dateRange?: '24h' | '7d' | '30d' | '1y' | 'custom';
}

const TeamPerformance: React.FC<TeamPerformanceProps> = ({ dateRange = '7d' }) => {
  const { t } = useTranslation('admin');
  
  const teamData = useMemo(() => {
    const multiplier = dateRange === '24h' ? 0.15 : dateRange === '7d' ? 1 : dateRange === '30d' ? 4 : 12;
    
    return [
      { name: t('dashboard.teamPerformanceTable.mockNames.member1'), resolved: Math.round(50 * multiplier), avgTime: t('dashboard.teamPerformanceTable.mockTimes.hours', { count: 2 }), satisfaction: 85 },
      { name: t('dashboard.teamPerformanceTable.mockNames.member2'), resolved: Math.round(45 * multiplier), avgTime: t('dashboard.teamPerformanceTable.mockTimes.hours', { count: 2.5 }), satisfaction: 90 },
      { name: t('dashboard.teamPerformanceTable.mockNames.member3'), resolved: Math.round(40 * multiplier), avgTime: t('dashboard.teamPerformanceTable.mockTimes.hours', { count: 3 }), satisfaction: 80 },
    ];
  }, [dateRange, t]);
  return (
    <div className="px-4 py-3">
      <div className="flex overflow-hidden rounded-xl border border-[#d0d9e7] dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <table className="flex-1">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-700">
              <th className="px-4 py-3 text-left text-[#0e131b] dark:text-gray-100 w-[400px] text-sm font-medium leading-normal">
                {t('dashboard.teamPerformanceTable.teamMember')}
              </th>
              <th className="px-4 py-3 text-left text-[#0e131b] dark:text-gray-100 w-[400px] text-sm font-medium leading-normal">
                {t('dashboard.teamPerformanceTable.resolvedConversations')}
              </th>
              <th className="px-4 py-3 text-left text-[#0e131b] dark:text-gray-100 w-[400px] text-sm font-medium leading-normal">
                {t('dashboard.teamPerformanceTable.avgResponseTime')}
              </th>
              <th className="px-4 py-3 text-left text-[#0e131b] dark:text-gray-100 w-[400px] text-sm font-medium leading-normal">
                {t('dashboard.teamPerformanceTable.satisfactionRate')}
              </th>
            </tr>
          </thead>
          <tbody>
            {teamData.map((member, index) => (
              <tr key={index} className="border-t border-t-[#d0d9e7] dark:border-t-slate-600 hover:bg-[#e7ecf3]/30 dark:hover:bg-slate-700/30 transition-colors">
                <td className="h-[72px] px-4 py-2 w-[400px] text-[#0e131b] dark:text-gray-100 text-sm font-normal leading-normal">
                  {member.name}
                </td>
                <td className="h-[72px] px-4 py-2 w-[400px] text-[#4d6a99] dark:text-gray-400 text-sm font-normal leading-normal">
                  {member.resolved}
                </td>
                <td className="h-[72px] px-4 py-2 w-[400px] text-[#4d6a99] dark:text-gray-400 text-sm font-normal leading-normal">
                  {member.avgTime}
                </td>
                <td className="h-[72px] px-4 py-2 w-[400px] text-sm font-normal leading-normal">
                  <div className="flex items-center gap-3">
                    <div className="w-[88px] overflow-hidden rounded-sm bg-[#d0d9e7] dark:bg-slate-600">
                      <div className="h-1 rounded-full bg-[#2a74ea] dark:bg-blue-500" style={{ width: `${member.satisfaction}%` }} />
                    </div>
                    <p className="text-[#0e131b] dark:text-gray-100 text-sm font-medium leading-normal">{member.satisfaction}</p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamPerformance;
