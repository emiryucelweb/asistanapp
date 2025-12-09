/**
 * Super Admin Dashboard - AsistanApp Genel Bakış
 */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  DollarSign,
  TrendingUp,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Search,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { superAdminDashboardApi } from '@/services/api';
import { mockSuperAdminDashboardApi } from '@/services/api/mock/super-admin-dashboard.mock';
import { isMockMode } from '@/services/api/config';
import { logger } from '@/shared/utils/logger';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation('admin');
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [topTenants, setTopTenants] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [systemHealth, setSystemHealth] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Select API based on mock mode
  const dashboardApi = isMockMode() ? mockSuperAdminDashboardApi : superAdminDashboardApi;

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [activityData, tenantsData, statsData, healthData] = await Promise.all([
          dashboardApi.getRecentActivity(),
          dashboardApi.getTopTenants(5),
          dashboardApi.getStats(),
          dashboardApi.getSystemHealth(),
        ]);

        setRecentActivity(activityData);
        setTopTenants(tenantsData);
        setStats(statsData);
        setSystemHealth(healthData);
        logger.info('[AdminDashboard] Data fetched', { 
          mode: isMockMode() ? 'mock' : 'real',
        });
      } catch (error) {
        logger.error('[AdminDashboard] Fetch failed', { error });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Global search handler
  const handleGlobalSearch = async (query: string) => {
    setGlobalSearch(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await superAdminDashboardApi.globalSearch(query);
      setSearchResults(results);
    } catch (error) {
      logger.error('Global search error', error as Error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Navigate to search result
  const handleResultClick = (result: any) => {
    if (result.type === 'tenant') {
      navigate(`/asistansuper/tenants/${result.id}`);
    } else if (result.type === 'user') {
      navigate(`/asistansuper/users?search=${result.id}`);
    }
    setGlobalSearch('');
    setSearchResults([]);
  };

  // Handle notification/activity click
  const handleActivityClick = async (activity: typeof recentActivity[0]) => {
    // Mark notification as read (if it's a notification)
    try {
      if (activity.type === 'warning' || activity.type === 'api') {
        await superAdminDashboardApi.markNotificationRead(activity.id.toString());
      }
    } catch (error) {
      logger.error('Failed to mark notification as read', error as Error);
    }

    // Navigate based on type
    if (activity.type === 'payment') {
      navigate(`/asistansuper/tenants/${activity.tenantId}?tab=billing`);
    } else if (activity.type === 'warning') {
      navigate(`/asistansuper/tenants/${activity.tenantId}?tab=billing`);
    } else if (activity.type === 'api') {
      navigate(`/asistansuper/tenants/${activity.tenantId}?tab=usage`);
    } else {
      navigate(`/asistansuper/tenants/${activity.tenantId}`);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header with Global Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('dashboard.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Global Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('dashboard.searchPlaceholder')}
            value={globalSearch}
            onChange={(e) => handleGlobalSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {/* Search Results Dropdown */}
          {globalSearch && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">{t('dashboard.searching')}</div>
              ) : searchResults?.length > 0 ? (
                <div className="p-2">
                  {searchResults.map((result, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleResultClick(result)}
                      className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">{result.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{result.subtitle}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">{t('dashboard.noResults')}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      {isLoading || !stats ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-blue-600 animate-bounce"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.6s',
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm opacity-90">{t('dashboard.stats.totalTenants')}</p>
              <Building2 className="w-5 h-5 opacity-90" />
            </div>
            <p className="text-3xl font-bold">{stats.totalTenants || 0}</p>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <span className="px-2 py-0.5 bg-white/20 rounded-full">{t('dashboard.stats.active', { count: stats.activeTenants || 0 })}</span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full">{t('dashboard.stats.trial', { count: stats.trialTenants || 0 })}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm opacity-90">{t('dashboard.stats.monthlyRevenue')}</p>
              <DollarSign className="w-5 h-5 opacity-90" />
            </div>
            <p className="text-3xl font-bold">${(stats.totalMonthlyRevenue || 0).toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>{t('dashboard.stats.growthThisMonth', { rate: stats.growthRate || 0 })}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm opacity-90">{t('dashboard.stats.netProfit')}</p>
              <TrendingUp className="w-5 h-5 opacity-90" />
            </div>
            <p className="text-3xl font-bold">${(stats.totalProfit || 0).toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span>{t('dashboard.stats.profitMargin', { margin: stats.profitMargin || 0 })}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm opacity-90">{t('dashboard.systemHealth')}</p>
              <Activity className="w-5 h-5 opacity-90" />
            </div>
            <p className="text-3xl font-bold">99.8%</p>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>{t('dashboard.allSystemsOperational')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {t('dashboard.recentActivity')}
          </h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
                    style={{
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: '0.6s',
                    }}
                  />
                ))}
              </div>
            </div>
          ) : !recentActivity || recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {t('dashboard.noActivity')}
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
              <button
                key={activity.id}
                onClick={() => handleActivityClick(activity)}
                className="w-full flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer text-left"
              >
                <div
                  className={`p-2 rounded-lg ${
                    activity.color === 'green'
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : activity.color === 'blue'
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : activity.color === 'purple'
                      ? 'bg-purple-100 dark:bg-purple-900/30'
                      : activity.color === 'red'
                      ? 'bg-red-100 dark:bg-red-900/30'
                      : 'bg-yellow-100 dark:bg-yellow-900/30'
                  }`}
                >
                  {activity.type === 'new' && <Building2 className="w-4 h-4 text-green-600 dark:text-green-400" />}
                  {activity.type === 'payment' && <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  {activity.type === 'upgrade' && <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                  {activity.type === 'warning' && <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />}
                  {activity.type === 'api' && <Activity className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {activity.tenant}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {activity.action}
                  </p>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activity.time}
                </div>
              </button>
            ))}
            </div>
          )}
        </div>

        {/* System Health */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {t('dashboard.systemStatus')}
          </h2>
          <div className="space-y-4">
            {systemHealth?.map((system) => (
              <div key={system.name} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {system.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Uptime: {system.uptime}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    system.color === 'green'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}
                >
                  {system.status === 'operational' ? t('dashboard.operational') : t('dashboard.slow')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Tenants */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('dashboard.topTenants')}
          </h2>
          <Link
            to="/asistansuper/financial-reports"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t('dashboard.allReports')}
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {t('dashboard.table.tenant')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {t('dashboard.table.plan')}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {t('dashboard.table.monthlyRevenue')}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {t('dashboard.table.growth')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center justify-center gap-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce"
                            style={{
                              animationDelay: `${i * 0.15}s`,
                              animationDuration: '0.6s',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : !topTenants || topTenants.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    {t('dashboard.noTenants')}
                  </td>
                </tr>
              ) : (
                topTenants.map((tenant, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {tenant.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {tenant.plan}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      ${tenant.revenue.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      {tenant.growth > 0 ? (
                        <>
                          <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                            +{tenant.growth}%
                          </span>
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                          <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                            {tenant.growth}%
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/asistansuper/tenants"
          className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-lg transition-shadow"
        >
          <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('dashboard.quickActions.tenantsManagement')}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{t('dashboard.quickActions.viewAllTenants')}</p>
        </Link>

        <Link
          to="/asistansuper/financial-reports"
          className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-lg transition-shadow"
        >
          <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('dashboard.quickActions.financialReports')}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{t('dashboard.quickActions.revenueAnalysis')}</p>
        </Link>

        <Link
          to="/asistansuper/analytics"
          className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-lg transition-shadow"
        >
          <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('dashboard.quickActions.analytics')}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{t('dashboard.quickActions.detailedStats')}</p>
        </Link>

        <Link
          to="/asistansuper/system"
          className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-lg transition-shadow"
        >
          <CheckCircle className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-2" />
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('dashboard.quickActions.system')}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{t('dashboard.quickActions.systemStatus')}</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;



