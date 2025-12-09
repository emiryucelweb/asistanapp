/**
 * Super Admin System Page - Sistem Yönetimi
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '@/shared/utils/logger';
import {
  Server,
  Database,
  Activity,
  HardDrive,
  Cpu,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  X,
  Filter,
  Search,
  Download,
  FileText,
} from 'lucide-react';
import { exportToCSV } from '@/shared/utils/export-helpers-v2';

const AdminSystem: React.FC = () => {
  const { t, i18n } = useTranslation('admin');
  const [showLogViewer, setShowLogViewer] = useState(false);
  const [logFilter, setLogFilter] = useState<'all' | 'info' | 'warning' | 'error'>('all');
  const [logSearch, setLogSearch] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const systemStatus = [
    {
      name: 'API Server',
      status: 'operational',
      uptime: '99.98%',
      responseTime: '45ms',
      requests: '2.1M/day',
      color: 'green',
    },
    {
      name: 'Database (PostgreSQL)',
      status: 'operational',
      uptime: '100%',
      responseTime: '12ms',
      connections: '145/500',
      color: 'green',
    },
    {
      name: 'Redis Cache',
      status: 'operational',
      uptime: '99.95%',
      memory: '2.3GB/8GB',
      hitRate: '94.2%',
      color: 'green',
    },
    {
      name: 'Storage (S3)',
      status: 'degraded',
      uptime: '95.2%',
      usage: '245GB/500GB',
      bandwidth: '12GB/day',
      color: 'yellow',
    },
    {
      name: 'WhatsApp API',
      status: 'operational',
      uptime: '99.5%',
      messages: '18K/day',
      queue: '0',
      color: 'green',
    },
    {
      name: 'OpenAI API',
      status: 'operational',
      uptime: '99.7%',
      tokens: '45M/day',
      cost: '$450/day',
      color: 'green',
    },
  ];

  // TODO: Replace with real API call to fetch system logs
  // Mock data removed - use backend API endpoints
  const recentLogs: Array<{
    id: number;
    level: 'info' | 'warning' | 'error';
    message: string;
    time: string;
    service: string;
  }> = [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t('system.title')}
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {t('system.subtitle')}
        </p>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('system.metrics.cpuUsage')}</p>
            <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">23%</p>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mt-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '23%' }} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('system.metrics.ramUsage')}</p>
            <HardDrive className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">67%</p>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mt-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '67%' }} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('system.metrics.diskUsage')}</p>
            <Database className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">49%</p>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mt-2">
            <div className="bg-orange-600 h-2 rounded-full" style={{ width: '49%' }} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('system.metrics.network')}</p>
            <Wifi className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">125MB/s</p>
          <div className="flex items-center gap-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span>↑ 45MB/s ↓ 80MB/s</span>
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {t('system.serviceStatus')}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {systemStatus.map((service) => (
            <div
              key={service.name}
              className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {service.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Uptime: {service.uptime}
                  </p>
                </div>
                <div
                  className={`p-2 rounded-lg ${
                    service.color === 'green'
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-yellow-100 dark:bg-yellow-900/30'
                  }`}
                >
                  {service.color === 'green' ? (
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  )}
                </div>
              </div>
              <div className="space-y-1">
                {Object.entries(service)
                  .filter(([key]) => !['name', 'status', 'uptime', 'color'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">
                        {value}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Logs */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {t('system.recentLogs')}
        </h2>
        <div className="space-y-3">
          {recentLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div
                className={`p-2 rounded-lg mt-0.5 ${
                  log.level === 'info'
                    ? 'bg-blue-100 dark:bg-blue-900/30'
                    : log.level === 'warning'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30'
                    : 'bg-red-100 dark:bg-red-900/30'
                }`}
              >
                {log.level === 'info' ? (
                  <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                ) : log.level === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-gray-100">{log.message}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {log.service}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    {log.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={() => setShowLogViewer(true)}
          className="mt-4 w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {t('system.viewAllLogs')}
        </button>
      </div>

      {/* Log Viewer Modal */}
      {showLogViewer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t('system.systemLogs')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('system.systemLogsDesc')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLogViewer(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    placeholder={t('system.searchLogs')}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {(['all', 'info', 'warning', 'error'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setLogFilter(level)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      logFilter === level
                        ? level === 'error'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : level === 'warning'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : level === 'info'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-gray-200 text-gray-900 dark:bg-slate-700 dark:text-gray-100'
                        : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {level === 'all' ? t('system.filterAll') : level === 'info' ? t('system.filterInfo') : level === 'warning' ? t('system.filterWarning') : t('system.filterError')}
                  </button>
                ))}
              </div>

              <button
                onClick={async () => {
                  setIsExporting(true);
                  try {
                    // TODO: Fetch from API
                    const allLogs = recentLogs
                      .filter((log) => logFilter === 'all' || log.level === logFilter)
                      .filter((log) => logSearch === '' || log.message.toLowerCase().includes(logSearch.toLowerCase()) || log.service.toLowerCase().includes(logSearch.toLowerCase()));

                    const exportData = {
                      config: {
                        title: t('system.systemLogs'),
                        subtitle: 'AsistanApp Super Admin',
                        description: `${t('system.filter')}: ${logFilter === 'all' ? t('system.filterAll') : logFilter}${logSearch ? ` - ${t('system.search')}: ${logSearch}` : ''}`,
                        dateRange: new Date().toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US'),
                      },
                      tables: [{
                        title: t('system.logRecords'),
                        headers: ['ID', t('system.level'), t('system.message'), t('system.service'), t('system.time')],
                        rows: allLogs.map(log => [
                          log.id.toString(),
                          log.level,
                          log.message,
                          log.service,
                          log.time,
                        ]),
                      }],
                    };

                    await exportToCSV(exportData);
                    logger.info('[AdminSystem] Logs exported successfully', { count: allLogs.length });
                  } catch (error) {
                    logger.error('[AdminSystem] Log export failed', { error });
                    alert(t('system.exportFailed'));
                  } finally {
                    setIsExporting(false);
                  }
                }}
                disabled={isExporting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isExporting ? t('system.exporting') : t('system.export')}
              </button>
            </div>

            {/* Logs */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {recentLogs
                .filter((log) => logFilter === 'all' || log.level === logFilter)
                .filter((log) => logSearch === '' || log.message.toLowerCase().includes(logSearch.toLowerCase()) || log.service.toLowerCase().includes(logSearch.toLowerCase()))
                .map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors border border-gray-200 dark:border-slate-700"
                  >
                    <div
                      className={`p-2 rounded-lg mt-0.5 flex-shrink-0 ${
                        log.level === 'info'
                          ? 'bg-blue-100 dark:bg-blue-900/30'
                          : log.level === 'warning'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30'
                          : 'bg-red-100 dark:bg-red-900/30'
                      }`}
                    >
                      {log.level === 'info' ? (
                        <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ) : log.level === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                          {log.message}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
                            log.level === 'info'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : log.level === 'warning'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {log.level.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                          {log.service}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                          <Clock className="w-3 h-3" />
                          {log.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('system.totalLogs')} {recentLogs
                  .filter((log) => logFilter === 'all' || log.level === logFilter)
                  .filter((log) => logSearch === '' || log.message.toLowerCase().includes(logSearch.toLowerCase()) || log.service.toLowerCase().includes(logSearch.toLowerCase()))
                  .length} {t('system.logsShowing')}
              </p>
              <button
                onClick={() => setShowLogViewer(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors font-medium"
              >
                {t('system.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSystem;



