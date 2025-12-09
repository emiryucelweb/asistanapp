/**
 * Bar Chart Component
 * Reusable vertical/horizontal bar chart
 */
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';

interface BarChartData {
  name: string;
  value: number;
  color?: string;
}

interface BarChartComponentProps {
  data: BarChartData[];
  title: string;
  subtitle?: string;
  layout?: 'vertical' | 'horizontal';
  showGrid?: boolean;
  showLegend?: boolean;
  height?: number;
  colors?: string[];
  valueFormatter?: (value: number) => string;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  title,
  subtitle,
  layout = 'vertical',
  showGrid = true,
  showLegend = false,
  height = 300,
  colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'],
  valueFormatter = (value) => value.toLocaleString('tr-TR'),
}) => {
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; name?: string; color?: string; fill?: string; payload?: Record<string, unknown> }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      if (!item || !item.payload) return null;
      
      return (
        <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-600">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {String(item.payload.name || '')}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium" style={{ color: item.fill || item.color }}>
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
        <BarChart
          data={data}
          layout={layout}
          margin={{ top: 5, right: 5, left: layout === 'horizontal' ? 20 : 0, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              horizontal={layout === 'vertical'}
              vertical={layout === 'horizontal'}
            />
          )}
          {layout === 'vertical' ? (
            <>
              <XAxis
                dataKey="name"
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={valueFormatter}
              />
            </>
          ) : (
            <>
              <XAxis
                type="number"
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={valueFormatter}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={100}
              />
            </>
          )}
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
          {showLegend && <Legend />}
          <Bar
            dataKey="value"
            radius={layout === 'vertical' ? [8, 8, 0, 0] : [0, 8, 8, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;

