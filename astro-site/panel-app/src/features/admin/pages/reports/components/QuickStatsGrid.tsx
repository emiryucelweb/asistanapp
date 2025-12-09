/**
 * QuickStatsGrid Component - Dashboard Statistics Grid
 * 
 * Enterprise-grade statistics display with cards
 * Implements responsive grid and accessibility
 * 
 * Features:
 * - Responsive grid layout (1-2-4 columns)
 * - Animated stat cards
 * - Change indicators (up/down)
 * - Color-coded icons
 * - Accessibility labels
 * 
 * @author Enterprise Team
 */
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { QuickStat } from '../hooks';

interface QuickStatsGridProps {
  /**
   * Array of statistics to display
   */
  stats: QuickStat[];
}

/**
 * QuickStatsGrid - Professional statistics grid
 * 
 * Implements:
 * - Responsive grid (mobile-first)
 * - Visual hierarchy
 * - ARIA labels for screen readers
 * - Smooth animations
 */
export function QuickStatsGrid(props: QuickStatsGridProps) {
  const { stats } = props;

  /**
   * Format change percentage for display
   */
  const formatChange = (change: number): string => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  /**
   * Get change indicator color class
   */
  const getChangeColorClass = (change: number): string => {
    return change >= 0 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-slate-700"
          role="article"
          aria-label={`${stat.label}: ${stat.value}`}
        >
          {/* Icon Badge */}
          <div className="flex items-start justify-between mb-3">
            <div 
              className={`${stat.color} rounded-lg p-2 sm:p-3`}
              aria-hidden="true"
            >
              <div className="text-white">
                {stat.icon}
              </div>
            </div>
            
            {/* Change Indicator */}
            <div 
              className={`flex items-center gap-1 text-xs sm:text-sm font-semibold ${getChangeColorClass(stat.change)}`}
              aria-label={`${formatChange(stat.change)} değişim`}
            >
              {stat.change >= 0 ? (
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
              ) : (
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
              )}
              <span>{formatChange(stat.change)}</span>
            </div>
          </div>

          {/* Stat Content */}
          <div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
              {stat.label}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

