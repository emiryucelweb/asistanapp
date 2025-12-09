/**
 * StatCard Component
 * 
 * A reusable statistics display card for admin dashboard.
 * Displays a title, value, icon, and optional trend indicator.
 * 
 * @example
 * ```tsx
 * <StatCard
 *   title="Total Users"
 *   value="1,234"
 *   icon={Users}
 *   trend={{ value: 12.5, isPositive: true }}
 *   color="blue"
 * />
 * ```
 */

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export type StatCardColor = 'blue' | 'green' | 'orange' | 'purple';

export interface StatCardTrend {
  value: number;
  isPositive: boolean;
}

export interface StatCardProps {
  /** Card title displayed above the value */
  title: string;
  /** Main value to display (can be formatted string or number) */
  value: string | number;
  /** Lucide icon component to display */
  icon: React.ComponentType<{ className?: string }>;
  /** Optional trend indicator */
  trend?: StatCardTrend;
  /** Color theme for the icon container */
  color?: StatCardColor;
  /** Optional data-testid for testing */
  'data-testid'?: string;
}

// ============================================================================
// COLOR MAPPINGS
// ============================================================================

const colorClasses: Record<StatCardColor, string> = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
};

// ============================================================================
// COMPONENT
// ============================================================================

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  'data-testid': dataTestId,
}) => {
  // Validate color prop and fallback to default
  const validColor = colorClasses[color] ? color : 'blue';

  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700"
      data-testid={dataTestId}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <div 
          className={`p-2 rounded-lg ${colorClasses[validColor]}`} 
          data-testid="icon-container"
        >
          <Icon className="w-5 h-5" data-testid="icon" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p 
          className="text-2xl font-bold text-gray-900 dark:text-gray-100" 
          data-testid="value"
        >
          {value ?? ''}
        </p>
        {trend && (
          <div
            className={`flex items-center text-sm ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
            data-testid="trend"
          >
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4 mr-1" data-testid="trend-up" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" data-testid="trend-down" />
            )}
            <span data-testid="trend-value">{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

