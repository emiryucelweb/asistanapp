/**
 * TeamReportModal Component - Team Performance Report Modal
 * 
 * Enterprise-grade team analytics modal
 * Displays agent performance, workload distribution, and team metrics
 * 
 * Features:
 * - Agent performance comparison
 * - Workload distribution
 * - Individual KPIs
 * - Top performers
 * - Team efficiency metrics
 * - Productivity analysis
 * 
 * @author Enterprise Team
 */
import React from 'react';
import { X, Users, Trophy, Target, TrendingUp, Clock, MessageSquare, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TeamReportModalProps {
  onClose: () => void;
}

export function TeamReportModal(props: TeamReportModalProps) {
  const { onClose } = props;
  const { t } = useTranslation('admin');

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Mock data
  const teamMembers = [
    { name: t('reports.mockData.teamMembers.name1') || 'John Smith', role: 'Senior Agent', conversations: 420, avgTime: '2m 10s', satisfaction: 4.8, resolved: 95, badge: 'gold' },
    { name: t('reports.mockData.teamMembers.name2') || 'Jane Doe', role: 'Agent', conversations: 385, avgTime: '2m 25s', satisfaction: 4.7, resolved: 93, badge: 'gold' },
    { name: 'Michael Brown', role: 'Agent', conversations: 360, avgTime: '2m 40s', satisfaction: 4.6, resolved: 91, badge: 'silver' },
    { name: t('reports.mockData.teamMembers.name3') || 'Sarah Johnson', role: 'Agent', conversations: 340, avgTime: '2m 50s', satisfaction: 4.5, resolved: 89, badge: 'silver' },
    { name: t('reports.mockData.teamMembers.name4') || 'David Wilson', role: 'Junior Agent', conversations: 280, avgTime: '3m 15s', satisfaction: 4.3, resolved: 85, badge: 'bronze' },
  ];

  const teamMetrics = {
    totalAgents: 12,
    activeAgents: 8,
    totalConversations: 4280,
    avgPerAgent: 357,
    teamSatisfaction: 4.6,
    teamEfficiency: 91.2,
  };

  const workloadDistribution = [
    { range: '0-200', agents: 2, percentage: 16.7 },
    { range: '200-350', agents: 4, percentage: 33.3 },
    { range: '350-500', agents: 5, percentage: 41.7 },
    { range: '500+', agents: 1, percentage: 8.3 },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-labelledby="team-report-title">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500 rounded-lg p-3">
              <Users className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 id="team-report-title" className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t('reports.modals.team.title')}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('reports.modals.team.subtitle')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors" aria-label={t('reports.close')} type="button">
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Team Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-800">
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mb-1" aria-hidden="true" />
            <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{teamMetrics.totalAgents}</p>
            <p className="text-xs text-indigo-700 dark:text-indigo-400">{t('reports.modals.team.totalAgents')}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <Target className="w-4 h-4 text-green-600 dark:text-green-400 mb-1" aria-hidden="true" />
            <p className="text-2xl font-bold text-green-900 dark:text-green-100">{teamMetrics.activeAgents}</p>
            <p className="text-xs text-green-700 dark:text-green-400">{t('reports.modals.team.activeAgents')}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1" aria-hidden="true" />
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{teamMetrics.totalConversations}</p>
            <p className="text-xs text-blue-700 dark:text-blue-400">{t('reports.modals.team.conversations')}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400 mb-1" aria-hidden="true" />
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{teamMetrics.avgPerAgent}</p>
            <p className="text-xs text-purple-700 dark:text-purple-400">{t('reports.modals.team.avgPerAgent')}</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
            <Star className="w-4 h-4 text-orange-600 dark:text-orange-400 mb-1" aria-hidden="true" />
            <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{teamMetrics.teamSatisfaction}</p>
            <p className="text-xs text-orange-700 dark:text-orange-400">{t('reports.modals.team.satisfaction')}</p>
          </div>
          <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-3 border border-teal-200 dark:border-teal-800">
            <Trophy className="w-4 h-4 text-teal-600 dark:text-teal-400 mb-1" aria-hidden="true" />
            <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">{teamMetrics.teamEfficiency}%</p>
            <p className="text-xs text-teal-700 dark:text-teal-400">{t('reports.modals.team.efficiency')}</p>
          </div>
        </div>

        {/* Top Performers */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🏆 {t('reports.modals.team.topPerformers')}</h3>
          <div className="space-y-3">
            {teamMembers.map((member, index) => (
              <div key={index} className={`rounded-lg p-4 ${member.badge === 'gold' ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800' : member.badge === 'silver' ? 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 border border-gray-200 dark:border-gray-700' : 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-slate-700 font-bold text-gray-900 dark:text-white">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{member.name}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{member.role}</p>
                    </div>
                  </div>
                  <Trophy className={`w-6 h-6 ${member.badge === 'gold' ? 'text-yellow-500' : member.badge === 'silver' ? 'text-gray-400' : 'text-amber-600'}`} aria-hidden="true" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('reports.modals.team.conversations')}</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{member.conversations}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('reports.modals.team.avgTime')}</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{member.avgTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('reports.modals.team.satisfaction')}</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{member.satisfaction}/5.0</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('reports.modals.team.resolved')}</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{member.resolved}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t('reports.modals.team.ranking')}</p>
                    <p className="font-semibold text-gray-900 dark:text-white">#{index + 1}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workload Distribution */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('reports.modals.team.workloadDistribution')}</h3>
          <div className="space-y-3">
            {workloadDistribution.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-gray-900 dark:text-white">{item.range}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t('reports.modals.team.agentCount', { count: item.agents })}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                    <div className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${item.percentage}%` }} role="progressbar" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
          <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2">👥 {t('reports.modals.team.teamAnalysis')}</h4>
          <ul className="space-y-2 text-sm text-indigo-800 dark:text-indigo-300">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 dark:text-indigo-400">•</span>
              <span><strong>Ahmet Yılmaz</strong> en yüksek performansı gösteriyor: 420 konuşma, 4.8/5.0 memnuniyet, %95 çözüm oranı.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 dark:text-indigo-400">•</span>
              <span>İş yükü dengeli dağılmış: %75 agent 200-500 konuşma aralığında. Sağlıklı dağılım.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 dark:text-indigo-400">•</span>
              <span>Junior agent'lar için mentorluk programı önerilebilir. Can Öztürk 3m 15s ile ekip ortalamasının üzerinde.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 dark:text-indigo-400">•</span>
              <span>Ekip memnuniyet skoru 4.6/5.0 ile mükemmel seviyede. Ekip moral ve motivasyonu yüksek görünüyor.</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('reports.modals.team.footerStats', { agents: teamMetrics.totalAgents, conversations: teamMetrics.totalConversations })}</p>
          <button onClick={onClose} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium" type="button">{t('reports.close')}</button>
        </div>
      </div>
    </div>
  );
}


// Default export for easier importing
export default TeamReportModal;
