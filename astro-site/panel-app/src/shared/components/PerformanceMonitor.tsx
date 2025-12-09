/**
 * Performance Monitor Component
 * 
 * Visual dashboard for real-time performance metrics
 * Shows Core Web Vitals and component render performance
 * Only visible in development mode
 * 
 * @module shared/components/PerformanceMonitor
 */

import { useState, useEffect } from 'react';
import { logger } from '@/shared/utils/logger';
import { 
  getWebVitalsSnapshot, 
  calculatePerformanceScore,
  formatMetricValue,
  getPerformanceRating,
  WEB_VITALS_THRESHOLDS,
} from '@/shared/utils/performance/webVitals';
import { XMarkIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export interface PerformanceMonitorProps {
  /** Show monitor by default */
  defaultOpen?: boolean;
}

/**
 * Performance Monitor Dashboard
 * 
 * Displays real-time performance metrics in development
 * Can be toggled with keyboard shortcut: Ctrl+Shift+P
 */
export function PerformanceMonitor({ defaultOpen = false }: PerformanceMonitorProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [score, setScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load metrics
  useEffect(() => {
    if (!isOpen) return;

    const loadMetrics = async () => {
      setIsLoading(true);
      try {
        const vitals = await getWebVitalsSnapshot();
        setMetrics(vitals);
        setScore(calculatePerformanceScore(vitals));
      } catch (error) {
        logger.error('Failed to load metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();

    // Refresh every 5 seconds
    const interval = setInterval(loadMetrics, 5000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Keyboard shortcut: Ctrl+Shift+P
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors"
        title="Open Performance Monitor (Ctrl+Shift+P)"
        aria-label="Open performance monitor"
      >
        <ChartBarIcon className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <ChartBarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Performance Monitor
          </h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          aria-label="Close performance monitor"
        >
          <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Overall Score */}
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            {isLoading ? '...' : score}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Performance Score
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  score >= 90
                    ? 'bg-green-500'
                    : score >= 50
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Core Web Vitals */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
            Core Web Vitals
          </h4>
          
          {Object.entries(metrics).map(([name, value]) => {
            const rating = getPerformanceRating(name, value);
            const formatted = formatMetricValue(name, value);
            const threshold = WEB_VITALS_THRESHOLDS[name as keyof typeof WEB_VITALS_THRESHOLDS];

            return (
              <div key={name} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      rating === 'good'
                        ? 'bg-green-500'
                        : rating === 'needs-improvement'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono text-gray-900 dark:text-gray-100">
                    {formatted}
                  </div>
                  {threshold && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Target: {formatMetricValue(name, threshold.good)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {Object.keys(metrics).length === 0 && !isLoading && (
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              Metrics collecting...
              <br />
              <span className="text-xs">Interact with the page to generate metrics</span>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Good</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span>Needs Improvement</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>Poor</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
            Press <kbd className="px-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+Shift+P</kbd> to toggle
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceMonitor;

