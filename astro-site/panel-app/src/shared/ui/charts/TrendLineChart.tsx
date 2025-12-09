/**
 * Trend Line Chart Component
 * Reusable line/area chart for trends
 */
import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface TrendLineChartProps {
  data: Array<{ date: string; value: number; label?: string }>;
  title: string;
  subtitle?: string;
  color?: string;
  type?: 'line' | 'area';
  showGrid?: boolean;
  showLegend?: boolean;
  height?: number;
  valueFormatter?: (value: number) => string;
}

const TrendLineChart: React.FC<TrendLineChartProps> = ({
  data,
  title,
  subtitle,
  color = '#3b82f6',
  type = 'area',
  showGrid = true,
  showLegend = false,
  height = 300,
  valueFormatter = (value) => value.toLocaleString('tr-TR'),
}) => {
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; name?: string; color?: string; payload?: Record<string, unknown> }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      if (!item || !item.payload) return null;
      
      return (
        <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-600">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {String(item.payload.date || '')}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium" style={{ color }}>
              {valueFormatter(item.value)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-[#d0d9e7] dark:border-slate-700 p-6 hover:shadow-md transition-shadow bg-white dark:bg-slate-800">
      <div className="mb-4">
        <p className="text-[#0e131b] dark:text-gray-100 text-base font-medium leading-normal">{title}</p>
        {subtitle && (
          <p className="text-[#4d6a99] dark:text-gray-400 text-sm font-normal leading-normal mt-1">{subtitle}</p>
        )}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        {type === 'area' ? (
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />}
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              className="dark:stroke-gray-500"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9ca3af"
              className="dark:stroke-gray-500"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={valueFormatter}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: color, strokeWidth: 1 }} />
            {showLegend && <Legend />}
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={color}
              fillOpacity={0.2}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />}
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              className="dark:stroke-gray-500"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9ca3af"
              className="dark:stroke-gray-500"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={valueFormatter}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: color, strokeWidth: 1 }} />
            {showLegend && <Legend />}
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default TrendLineChart;

