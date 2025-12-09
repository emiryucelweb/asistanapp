 

/**
 * System Health Dashboard Component
 * Real-time monitoring dashboard for developers
 * 
 * @module shared/components/monitoring/SystemHealthDashboard
 */

import React, { useState, useEffect } from 'react';
import { X, Activity, Cpu, Wifi, AlertTriangle, CheckCircle, TrendingUp, Download } from 'lucide-react';
import { monitoring } from '@/shared/utils/monitoring';
import { advancedLogger } from '@/shared/utils/advanced-logger';
import type { SystemHealth } from '@/shared/utils/monitoring';

export interface SystemHealthDashboardProps {
  onClose: () => void;
}

/**
 * System Health Dashboard
 * Developer tool for monitoring app health
 * 
 * Usage (Dev mode only):
 * ```tsx
 * {import.meta.env.DEV && (
 *   <SystemHealthDashboard onClose={() => setShowDashboard(false)} />
 * )}
 * ```
 */
export const SystemHealthDashboard: React.FC<SystemHealthDashboardProps> = ({ onClose }) => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [apiMetrics, setApiMetrics] = useState<any>(null);
  const [healthReport, setHealthReport] = useState<any>(null);

  useEffect(() => {
    const updateHealth = () => {
      setHealth(monitoring.getSystemHealth());
      setApiMetrics(monitoring.getAPIMetrics());
      setHealthReport(monitoring.getHealthReport());
    };

    updateHealth();
    const interval = setInterval(updateHealth, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const handleDownloadLogs = () => {
    advancedLogger.downloadLogs();
  };

  const handleDownloadMonitoring = () => {
    const data = monitoring.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monitoring_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!health) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-orange-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                System Health Dashboard
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Real-time monitoring • Developer Mode
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Health Status */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              {healthReport?.healthy ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              )}
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {healthReport?.healthy ? 'System Healthy' : 'Issues Detected'}
              </h3>
            </div>

            {healthReport && !healthReport.healthy && (
              <div className="space-y-2">
                {healthReport.issues.map((issue: string, index: number) => (
                  <div key={index} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">{issue}</p>
                    {healthReport.recommendations[index] && (
                      <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                        💡 {healthReport.recommendations[index]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Memory */}
            <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-blue-500" />
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Memory</h4>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {health.memory.used} MB
                </p>
                {health.memory.percentage && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                      <span>{health.memory.percentage}%</span>
                      <span>{health.memory.total} MB total</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          health.memory.percentage > 90
                            ? 'bg-red-500'
                            : health.memory.percentage > 70
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${health.memory.percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Performance */}
            <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Performance</h4>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {health.performance.fps} FPS
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Load: {health.performance.loadTime}ms • TTFB: {health.performance.ttfb}ms
                </p>
              </div>
            </div>

            {/* Network */}
            <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="w-4 h-4 text-purple-500" />
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Network</h4>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {health.network.effectiveType?.toUpperCase() || 'Unknown'}
                </p>
                {health.network.downlink && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {health.network.downlink} Mbps • RTT: {health.network.rtt}ms
                  </p>
                )}
              </div>
            </div>

            {/* Errors */}
            <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Errors</h4>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {health.errors.last24h}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Last 24h • {health.errors.total} total
                </p>
              </div>
            </div>
          </div>

          {/* API Metrics */}
          {apiMetrics && (
            <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg mb-6">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                API Metrics
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total Calls</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {apiMetrics.total}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Avg Duration</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {apiMetrics.averageDuration}ms
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Success Rate</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {apiMetrics.successRate}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Slow Calls</p>
                  <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {apiMetrics.slowCalls}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleDownloadLogs}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Logs
            </button>
            <button
              onClick={handleDownloadMonitoring}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Monitoring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthDashboard;

