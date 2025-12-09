/**
 * SLAReportModal - SLA & Emergency Response
 * Enterprise-grade SLA compliance and emergency metrics
 */
import React from 'react';
import { X, AlertCircle, Clock, CheckCircle, XCircle, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SLAReportModalProps {
  onClose: () => void;
}

export function SLAReportModal(props: SLAReportModalProps) {
  const { onClose } = props;
  const { t, i18n } = useTranslation('admin');

  const slaMetrics = {
    overall: 94.3,
    tier1: 97.2, // < 5 min
    tier2: 93.8, // < 15 min
    tier3: 88.5, // < 1 hour
    emergency: 98.7,
  };

  const urgencyLevels = [
    { level: t('reports.modals.sla.priority.critical'), target: '5 dk', actual: '3m 45s', compliance: 98.7, total: 142, met: 140, color: 'red' },
    { level: t('reports.modals.sla.priority.high'), target: '15 dk', actual: '11m 20s', compliance: 95.3, total: 580, met: 553, color: 'orange' },
    { level: t('reports.modals.sla.priority.normal'), target: '1 saat', actual: '42m 15s', compliance: 92.1, total: 1840, met: 1695, color: 'yellow' },
    { level: t('reports.modals.sla.priority.low'), target: '4 saat', actual: '2h 18m', compliance: 89.8, total: 680, met: 611, color: 'green' },
  ];

  const violations = [
    { date: '2024-10-15', type: t('reports.modals.sla.priority.high'), delay: '8 dk', reason: t('reports.modals.sla.violationReasons.capacityExceeded') },
    { date: '2024-10-18', type: t('reports.modals.sla.priority.normal'), delay: '22 dk', reason: t('reports.modals.sla.violationReasons.technicalIssue') },
    { date: '2024-10-22', type: t('reports.modals.sla.priority.critical'), delay: '2 dk', reason: t('reports.modals.sla.violationReasons.systemSlowness') },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 rounded-lg p-3"><AlertCircle className="w-6 h-6 text-white" /></div>
            <div>
              <h2 className="text-xl font-bold">{t('reports.modals.sla.title')}</h2>
              <p className="text-sm text-gray-500">{t('reports.modals.sla.subtitle')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg" type="button"><X className="w-5 h-5" /></button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[
            { label: t('reports.modals.sla.overallSLA'), value: `${slaMetrics.overall}%`, icon: CheckCircle, color: 'green' },
            { label: t('reports.modals.sla.tier1'), value: `${slaMetrics.tier1}%`, icon: Zap, color: 'red' },
            { label: t('reports.modals.sla.tier2'), value: `${slaMetrics.tier2}%`, icon: Clock, color: 'orange' },
            { label: t('reports.modals.sla.tier3'), value: `${slaMetrics.tier3}%`, icon: Clock, color: 'yellow' },
            { label: t('reports.modals.sla.emergency'), value: `${slaMetrics.emergency}%`, icon: AlertCircle, color: 'red' },
          ].map((m, i) => (
            <div key={i} className={`bg-${m.color}-50 dark:bg-${m.color}-900/20 rounded-lg p-4 border border-${m.color}-200`}>
              <m.icon className={`w-5 h-5 text-${m.color}-600 mb-2`} />
              <p className={`text-2xl font-bold text-${m.color}-900 dark:text-${m.color}-100`}>{m.value}</p>
              <p className={`text-xs text-${m.color}-700`}>{m.label}</p>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-bold mb-4">{t('reports.modals.sla.priorityCompliance')}</h3>
        <div className="space-y-3 mb-6">
          {urgencyLevels.map((u, i) => (
            <div key={i} className={`bg-${u.color}-50 dark:bg-${u.color}-900/20 rounded-lg p-4 border border-${u.color}-200`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <AlertCircle className={`w-5 h-5 text-${u.color}-600`} />
                  <div>
                    <p className="font-bold">{u.level}</p>
                    <p className="text-sm text-gray-600">{t('reports.modals.sla.target')}: {u.target} • {t('reports.modals.sla.actual')}: {u.actual}</p>
                  </div>
                </div>
                <div className={`text-right ${u.compliance >= 95 ? 'text-green-600' : u.compliance >= 90 ? 'text-yellow-600' : 'text-red-600'}`}>
                  <p className="text-2xl font-bold">{u.compliance}%</p>
                  <p className="text-xs">{t('reports.modals.sla.successful', { met: u.met, total: u.total })}</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`bg-${u.color}-600 h-2 rounded-full`} style={{ width: `${u.compliance}%` }} />
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-bold mb-4">{t('reports.modals.sla.recentViolations')}</h3>
        <div className="bg-gray-50 dark:bg-slate-700 rounded-lg overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-slate-600">
              <tr>
                <th className="text-left p-3">{t('reports.modals.sla.table.date')}</th>
                <th className="text-left p-3">{t('reports.modals.sla.table.type')}</th>
                <th className="text-left p-3">{t('reports.modals.sla.table.delay')}</th>
                <th className="text-left p-3">{t('reports.modals.sla.table.reason')}</th>
              </tr>
            </thead>
            <tbody>
              {violations.map((v, i) => (
                <tr key={i} className="border-t border-gray-200 dark:border-slate-600">
                  <td className="p-3">{v.date}</td>
                  <td className="p-3"><span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">{v.type}</span></td>
                  <td className="p-3 font-semibold text-red-600">{v.delay}</td>
                  <td className="p-3 text-gray-600">{v.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-900 mb-2">{t('reports.modals.sla.insights')}</h4>
          <ul className="space-y-1 text-sm text-red-800 dark:text-red-300">
            <li>• {t('reports.modals.sla.insight1')}</li>
            <li>• {t('reports.modals.sla.insight2')}</li>
            <li>• {t('reports.modals.sla.insight3')}</li>
            <li>• {t('reports.modals.sla.insight4')}</li>
          </ul>
        </div>

        <div className="mt-6 pt-4 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium" type="button">{t('reports.close')}</button>
        </div>
      </div>
    </div>
  );
}


// Default export for easier importing
export default SLAReportModal;
