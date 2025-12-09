 

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  BarChart3,
  PieChart,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TenantFinancialSummary } from '@/types';
import { exportToExcel, exportToPDF } from '@/shared/utils/export-helpers-v2';
import { superAdminFinancialApi } from '@/services/api';
import { mockSuperAdminFinancialApi } from '@/services/api/mock/super-admin-financial.mock';
import { isMockMode } from '@/services/api/config';
import { logger } from '@/shared/utils/logger';

const FinancialReportsPage: React.FC = () => {
  const { t } = useTranslation('super-admin');
  const [summary, setSummary] = useState<TenantFinancialSummary | null>(null);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
  const [planDist, setPlanDist] = useState<any[]>([]);
  const [topTenantsData, setTopTenantsData] = useState<any[]>([]);
  const [costBreakdownData, setCostBreakdownData] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'30d' | '90d' | '1y'>('30d');
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const profitMargin = summary ? (summary.totalProfit / summary.totalMonthlyRevenue) * 100 : 0;

  // Select API based on mock mode
  const financialApi = isMockMode() ? mockSuperAdminFinancialApi : superAdminFinancialApi;

  // Fetch all financial data when period changes
  useEffect(() => {
    const fetchFinancialData = async () => {
      setIsLoading(true);
      try {
        const [summaryData, trendData, planData, tenantsData, costsData] = await Promise.all([
          financialApi.getFinancialSummary(selectedPeriod),
          financialApi.getMonthlyTrend(selectedPeriod),
          financialApi.getPlanDistribution(),
          financialApi.getTopTenants(5),
          financialApi.getCostBreakdown(selectedPeriod),
        ]);

        setSummary(summaryData);
        setMonthlyTrend(trendData);
        setPlanDist(planData);
        setTopTenantsData(tenantsData);
        setCostBreakdownData(costsData);

        logger.info('[FinancialReports] All data fetched', { 
          period: selectedPeriod,
          mode: isMockMode() ? 'mock' : 'real',
        });
      } catch (error) {
        logger.error('[FinancialReports] Fetch failed', { error });
        // Error handling - keep previous data or show error state
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinancialData();
  }, [selectedPeriod]);

  // Export handler
  const handleExport = async (format: 'excel' | 'pdf') => {
    if (!summary) {
      alert(t('financial.messages.noDataYet'));
      return;
    }

    setIsExporting(true);
    try {
      const exportData = {
        config: {
          title: t('financial.title'),
          subtitle: 'AsistanApp Super Admin',
          description: `${t('financial.subtitle')} - ${t(`super-admin.financial.periods.${selectedPeriod}`)}`,
          dateRange: new Date().toLocaleDateString('tr-TR'),
          metadata: {
            generatedBy: 'Super Admin',
            generatedAt: new Date().toISOString(),
            company: 'AsistanApp',
          },
        },
        stats: {
          title: 'Genel Özet',
          items: [
            { label: 'Toplam Gelir', value: `$${summary.totalMonthlyRevenue.toLocaleString()}` },
            { label: 'Toplam Maliyet', value: `$${summary.totalMonthlyCosts.toLocaleString()}` },
            { label: 'Net Kar', value: `$${summary.totalProfit.toLocaleString()}` },
            { label: 'Kar Marjı', value: `${profitMargin.toFixed(1)}%` },
            { label: 'Aktif Firma', value: summary.activeTenants.toString() },
            { label: 'Ort. Gelir/Firma', value: `$${summary.averageRevenuePerTenant.toLocaleString()}` },
          ],
        },
        tables: [
          {
            title: 'Aylık Trend',
            headers: ['Ay', 'Gelir', 'Maliyet', 'Kar'],
            rows: monthlyTrend.map(m => [m.month, `$${m.revenue}`, `$${m.costs}`, `$${m.profit}`]),
          },
          {
            title: 'Plan Dağılımı',
            headers: ['Plan', 'Firma Sayısı', 'Gelir', 'Oran'],
            rows: planDist.map(p => [p.plan, p.count.toString(), `$${p.revenue}`, `${p.percentage}%`]),
          },
          {
            title: 'En Karlı Firmalar',
            headers: ['Firma', 'Gelir', 'Kar', 'Büyüme'],
            rows: topTenantsData.map(t => [t.name, `$${t.revenue}`, `$${t.profit}`, `${t.growth > 0 ? '+' : ''}${t.growth}%`]),
          },
          {
            title: 'Maliyet Dağılımı',
            headers: ['Kategori', 'Tutar', 'Oran'],
            rows: costBreakdownData.map(c => [c.category, `$${c.amount}`, `${c.percentage}%`]),
          },
        ],
      };

      if (format === 'excel') {
        await exportToExcel(exportData);
        logger.info('[FinancialReports] Excel export successful');
      } else {
        await exportToPDF(exportData);
        logger.info('[FinancialReports] PDF export successful');
      }
    } catch (error) {
      logger.error('[FinancialReports] Export failed', { error });
      alert(t('financial.messages.exportFailed'));
    } finally {
      setIsExporting(false);
    }
  };

  // Loading state
  if (isLoading && !summary) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full bg-blue-500 animate-bounce"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.6s',
                }}
              />
            ))}
          </div>
          <p className="text-gray-600 dark:text-gray-400">{t('financial.messages.loading')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!summary) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">{t('financial.messages.loadFailed')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('financial.title')}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t('financial.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          >
            <option value="30d">{t('financial.periods.30d')}</option>
            <option value="90d">{t('financial.periods.90d')}</option>
            <option value="1y">{t('financial.periods.1y')}</option>
          </select>
          <div className="relative">
            <button 
              onClick={() => handleExport('excel')}
              disabled={isExporting || isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">
                {isExporting ? t('financial.export.exporting') : isLoading ? t('financial.export.loading') : t('financial.export.button')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Toplam Gelir</p>
            <DollarSign className="w-5 h-5 opacity-90" />
          </div>
          <p className="text-3xl font-bold">${summary.totalMonthlyRevenue.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+{summary.growthRate}% büyüme</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Toplam Maliyet</p>
            <TrendingDown className="w-5 h-5 opacity-90" />
          </div>
          <p className="text-3xl font-bold">${summary.totalMonthlyCosts.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2 text-sm">
            <span>{((summary.totalMonthlyCosts / summary.totalMonthlyRevenue) * 100).toFixed(1)}% of revenue</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Net Kar</p>
            <TrendingUp className="w-5 h-5 opacity-90" />
          </div>
          <p className="text-3xl font-bold">${summary.totalProfit.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-2 text-sm">
            <span>{profitMargin.toFixed(1)}% kar marjı</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Aktif Firmalar</p>
            <Users className="w-5 h-5 opacity-90" />
          </div>
          <p className="text-3xl font-bold">{summary.activeTenants}</p>
          <div className="flex items-center gap-1 mt-2 text-sm">
            <span>/{summary.totalTenants} toplam firma</span>
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Gelir Trendi
        </h2>
        <div className="space-y-4">
          {monthlyTrend.map((data, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {data.month}
                </span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-600 dark:text-green-400">
                    ${data.revenue.toLocaleString()}
                  </span>
                  <span className="text-red-600 dark:text-red-400">
                    ${data.costs.toLocaleString()}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    ${data.profit.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-1 h-8">
                <div
                  className="bg-green-500 dark:bg-green-600 rounded"
                  style={{ width: `${(data.revenue / 50000) * 100}%` }}
                  title={`Gelir: $${data.revenue}`}
                />
                <div
                  className="bg-red-500 dark:bg-red-600 rounded"
                  style={{ width: `${(data.costs / 50000) * 100}%` }}
                  title={`Maliyet: $${data.costs}`}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Gelir</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Maliyet</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Kar</span>
          </div>
        </div>
      </div>

      {/* Plan Distribution & Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Plan Dağılımı
          </h2>
          <div className="space-y-4">
            {planDist.map((plan, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {plan.plan}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({plan.count} firma)
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      ${plan.revenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {plan.percentage}%
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all"
                    style={{ width: `${plan.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Maliyet Dağılımı
          </h2>
          <div className="space-y-4">
            {costBreakdownData.map((cost, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {cost.category}
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      ${cost.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {cost.percentage}%
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-orange-600 dark:bg-orange-400 h-2 rounded-full transition-all"
                    style={{ width: `${cost.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Tenants */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          En İyi Performans Gösteren Firmalar
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Sıra
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Firma
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Aylık Gelir
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Net Kar
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Büyüme
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {topTenantsData.map((tenant, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {tenant.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      ${tenant.revenue.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      ${tenant.profit.toLocaleString()}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                Güçlü Büyüme
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                Son 30 günde %{summary.growthRate} büyüme kaydedildi
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-900 dark:text-green-300">
                Sağlıklı Kar Marjı
              </p>
              <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                %{profitMargin.toFixed(1)} kar marjı ile hedefin üzerinde
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-900 dark:text-purple-300">
                {t('financial.insights.lowChurn')}
              </p>
              <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
                {t('financial.insights.lowChurnDesc', { rate: summary.churnRate })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReportsPage;



