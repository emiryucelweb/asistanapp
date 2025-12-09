/**
 * Pie/Donut Chart Component
 * Reusable pie and donut charts
 */
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

interface PieChartComponentProps {
  data: PieChartData[];
  title: string;
  subtitle?: string;
  type?: 'pie' | 'donut';
  showLegend?: boolean;
  height?: number;
  colors?: string[];
  valueFormatter?: (value: number) => string;
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({
  data,
  title,
  subtitle,
  type = 'donut',
  showLegend = true,
  height = 300,
  colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'],
  valueFormatter = (value) => value.toLocaleString('tr-TR'),
}) => {
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; name?: string; color?: string; fill?: string; payload?: Record<string, unknown> }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      if (!item) return null;
      
      const total = data.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((item.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-600">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {item.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium" style={{ color: item.fill || item.color }}>
              {valueFormatter(item.value)}
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">({percentage}%)</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: { payload?: Array<{ value: string; color: string }> }) => {
    if (!payload) return null;
    
    return (
      <div className="flex flex-wrap gap-3 justify-center mt-4">
        {payload.map((entry: { value: string; color: string }, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{entry.value}</span>
          </div>
        ))}
      </div>
    );
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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={type === 'donut' ? '60%' : 0}
            outerRadius="80%"
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || colors[index % colors.length]}
                stroke="white"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend content={<CustomLegend />} />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;

