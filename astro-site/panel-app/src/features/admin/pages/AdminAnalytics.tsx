/**
 * Super Admin Analytics Page - Platform Analitiği
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  MessageSquare,
  DollarSign,
  Globe,
  Zap,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AdminAnalytics: React.FC = () => {
  const { t } = useTranslation('admin');
  
  // Mock data for conversation trend chart
  const conversationTrendData = [
    { date: '01 Oca', whatsapp: 650, instagram: 420, web: 320, facebook: 180 },
    { date: '05 Oca', whatsapp: 720, instagram: 480, web: 350, facebook: 200 },
    { date: '10 Oca', whatsapp: 800, instagram: 520, web: 390, facebook: 220 },
    { date: '15 Oca', whatsapp: 850, instagram: 550, web: 410, facebook: 240 },
    { date: '20 Oca', whatsapp: 920, instagram: 590, web: 440, facebook: 260 },
    { date: '25 Oca', whatsapp: 980, instagram: 620, web: 480, facebook: 280 },
    { date: '30 Oca', whatsapp: 1050, instagram: 680, web: 510, facebook: 310 },
  ];

  // Mock data for channel distribution pie chart
  const channelDistributionData = [
    { name: 'WhatsApp', value: 18500, color: '#10b981' },
    { name: 'Instagram', value: 12300, color: '#ec4899' },
    { name: 'Web', value: 8900, color: '#3b82f6' },
    { name: 'Facebook', value: 5500, color: '#1877f2' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t('analytics.title')}
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {t('analytics.subtitle')}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('analytics.metrics.totalConversations')}</p>
            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">45.2K</p>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-600 dark:text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span>+12.5%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('analytics.metrics.activeUsers')}</p>
            <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">1,284</p>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-600 dark:text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span>+8.2%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('analytics.metrics.apiCalls')}</p>
            <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">2.1M</p>
          <div className="flex items-center gap-1 mt-2 text-sm text-red-600 dark:text-red-400">
            <TrendingDown className="w-4 h-4" />
            <span>-2.1%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('analytics.metrics.avgResponse')}</p>
            <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">2.3s</p>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-600 dark:text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span>{t('analytics.metrics.faster')}</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversation Trend Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {t('analytics.charts.conversationTrend')}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={conversationTrendData}>
              <defs>
                <linearGradient id="colorWhatsapp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorInstagram" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorWeb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-slate-700" />
              <XAxis 
                dataKey="date" 
                className="text-xs text-gray-600 dark:text-gray-400"
                stroke="#9ca3af"
              />
              <YAxis 
                className="text-xs text-gray-600 dark:text-gray-400"
                stroke="#9ca3af"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
                itemStyle={{ color: '#374151' }}
                labelStyle={{ color: '#111827', fontWeight: 600, marginBottom: '4px' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Area 
                type="monotone" 
                dataKey="whatsapp" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorWhatsapp)"
                name="WhatsApp"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="instagram" 
                stroke="#ec4899" 
                fillOpacity={1} 
                fill="url(#colorInstagram)"
                name="Instagram"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="web" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorWeb)"
                name="Web"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Channel Distribution Pie Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {t('analytics.charts.channelDistribution')}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={channelDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {channelDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
                itemStyle={{ color: '#374151' }}
                formatter={(value: number) => t('analytics.conversationCount', { count: value })}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Channel Performance */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Kanal Performansı
        </h2>
        <div className="space-y-4">
          {[
            { channel: 'WhatsApp', count: 18500, percentage: 41, color: 'green' },
            { channel: 'Instagram', count: 12300, percentage: 27, color: 'pink' },
            { channel: 'Web', count: 8900, percentage: 20, color: 'blue' },
            { channel: 'Facebook', count: 5500, percentage: 12, color: 'blue' },
          ].map((item) => (
            <div key={item.channel}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.channel}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.count.toLocaleString()} konuşma
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    item.color === 'green'
                      ? 'bg-green-600'
                      : item.color === 'pink'
                      ? 'bg-pink-600'
                      : 'bg-blue-600'
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;



