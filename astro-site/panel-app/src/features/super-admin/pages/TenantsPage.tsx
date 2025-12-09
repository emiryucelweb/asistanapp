 

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '@/shared/utils/logger';
import {
  Building2,
  Plus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  Ban,
  PlayCircle,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { TenantBilling, TenantSubscription } from '@/types';
import CreateTenantModal, { TenantFormData } from '@/features/super-admin/components/CreateTenantModal';
import { exportToExcel, exportToCSV } from '@/shared/utils/export-helpers-v2';
import { superAdminTenantsApi } from '@/services/api';
import { mockSuperAdminTenantsApi } from '@/services/api/mock/super-admin-tenants.mock';
import { isMockMode } from '@/services/api/config';

const TenantsPage: React.FC = () => {
  const { t } = useTranslation('super-admin');
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<TenantBilling[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'trial' | 'past_due'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Select API based on mock mode
  const tenantsApi = isMockMode() ? mockSuperAdminTenantsApi : superAdminTenantsApi;

  // Fetch tenants on mount and when filters change
  useEffect(() => {
    const fetchTenants = async () => {
      setIsLoading(true);
      try {
        const response = await tenantsApi.getTenants({
          search: searchQuery,
          status: filterStatus === 'all' ? undefined : filterStatus,
        });
        
        setTenants(response.data);
        logger.info('[TenantsPage] Tenants fetched', { 
          count: response.data.length,
          mode: isMockMode() ? 'mock' : 'real',
        });
      } catch (error) {
        logger.error('[TenantsPage] Fetch failed', { error });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenants();
  }, [searchQuery, filterStatus]);

  // Calculate summary stats
  const totalRevenue = tenants.reduce((sum, t) => sum + t.monthlyRevenue, 0);
  const totalCosts = tenants.reduce((sum, t) => sum + t.apiCosts.totalMonthlyCost, 0);
  const totalProfit = totalRevenue - totalCosts;
  const avgProfitMargin = tenants.length > 0 
    ? tenants.reduce((sum, t) => sum + t.profitMargin, 0) / tenants.length 
    : 0;

  const getStatusBadge = (status: TenantSubscription['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      trial: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      past_due: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      canceled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    };
    const labels = {
      active: t('tenants.status.active'),
      trial: t('tenants.status.trial'),
      past_due: t('tenants.status.past_due'),
      canceled: t('tenants.status.canceled'),
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  // Export tenants data
  const handleExport = async (format: 'excel' | 'csv') => {
    setIsExporting(true);
    try {
      const exportData = {
        config: {
          title: 'Firma Listesi',
          subtitle: 'AsistanApp Super Admin',
          description: 'Tüm müşteri firmaları ve finansal bilgileri',
          dateRange: new Date().toLocaleDateString('tr-TR'),
        },
        tables: [{
          title: 'Firmalar',
          headers: ['Firma Adı', 'Plan', 'Durum', 'Aylık Gelir', 'API Maliyeti', 'Kar Marjı', 'Ödeme Durumu'],
          rows: tenants.map(t => [
            t.tenantName,
            t.subscription.plan,
            t.subscription.status,
            `$${t.monthlyRevenue}`,
            `$${t.apiCosts.totalMonthlyCost}`,
            `${t.profitMargin.toFixed(1)}%`,
            t.paymentStatus,
          ]),
        }],
      };

      if (format === 'excel') {
        await exportToExcel(exportData);
      } else {
        await exportToCSV(exportData);
      }

      logger.info(`[TenantsPage] Exported ${tenants.length} tenants as ${format}`);
    } catch (error) {
      logger.error('[TenantsPage] Export failed', { error });
      alert(t('superAdmin.tenants.messages.exportFailed'));
    } finally {
      setIsExporting(false);
    }
  };

  // Tenant actions
  const handleSuspendTenant = async (tenantId: string) => {
    const reason = prompt(t('superAdmin.tenants.messages.suspendReasonPrompt'));
    if (!reason || !confirm(t('superAdmin.tenants.messages.confirmSuspend'))) return;
    try {
      await tenantsApi.suspendTenant(tenantId, reason);
      setTenants(prev => prev.map(t => 
        t.tenantId === tenantId 
          ? { ...t, subscription: { ...t.subscription, status: 'canceled' as const } }
          : t
      ));
      logger.info(`[TenantsPage] Tenant ${tenantId} suspended`, { reason });
    } catch (error) {
      logger.error('[TenantsPage] Suspend failed', { error });
      alert(t('superAdmin.tenants.messages.actionFailed'));
    }
    setShowActionsMenu(null);
  };

  const handleActivateTenant = async (tenantId: string) => {
    try {
      await tenantsApi.activateTenant(tenantId);
      setTenants(prev => prev.map(t => 
        t.tenantId === tenantId 
          ? { ...t, subscription: { ...t.subscription, status: 'active' as const } }
          : t
      ));
      logger.info(`[TenantsPage] Tenant ${tenantId} activated`);
    } catch (error) {
      logger.error('[TenantsPage] Activate failed', { error });
      alert(t('superAdmin.tenants.messages.actionFailed'));
    }
    setShowActionsMenu(null);
  };

  const handleDeleteTenant = async (tenantId: string) => {
    if (!confirm(t('superAdmin.tenants.messages.confirmDelete'))) return;
    try {
      await tenantsApi.deleteTenant(tenantId);
      setTenants(prev => prev.filter(t => t.tenantId !== tenantId));
      logger.info(`[TenantsPage] Tenant ${tenantId} deleted`);
    } catch (error) {
      logger.error('[TenantsPage] Delete failed', { error });
      alert(t('superAdmin.tenants.messages.actionFailed'));
    }
    setShowActionsMenu(null);
  };

  const getPlanBadge = (plan: TenantSubscription['plan']) => {
    const styles = {
      free: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      starter: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      professional: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      enterprise: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    };
    const labels = {
      free: 'Ücretsiz',
      starter: 'Başlangıç',
      professional: 'Profesyonel',
      enterprise: 'Kurumsal',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-lg ${styles[plan]}`}>
        {labels[plan]}
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Firma Yönetimi
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Tüm müşteri firmalarınızı ve finansal durumlarını yönetin
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Yeni Firma Ekle</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Gelir</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-600 dark:text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span>+12.5% bu ay</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Maliyet</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                ${totalCosts.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span>API + Altyapı</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Net Kar</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                ${totalProfit.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-blue-600 dark:text-blue-400">
            <span>{avgProfitMargin.toFixed(1)}% kar marjı</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('tenants.stats.activeTenants')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {tenants.filter(t => t.subscription.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span>/{tenants.length} toplam</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('superAdmin.tenants.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              <option value="all">{t('tenants.status.all')}</option>
              <option value="active">{t('tenants.status.active')}</option>
              <option value="trial">{t('tenants.status.trial')}</option>
              <option value="past_due">{t('tenants.status.past_due')}</option>
            </select>
          </div>

          {/* Export Button */}
          <div className="relative">
            <button
              onClick={() => setShowActionsMenu(showActionsMenu === 'export' ? null : 'export')}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50"
            >
            <Download className="w-5 h-5" />
              <span className="hidden sm:inline">{isExporting ? t('tenants.export.exporting') : t('tenants.export.button')}</span>
            </button>
            {showActionsMenu === 'export' && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
                <button
                  onClick={() => { handleExport('excel'); setShowActionsMenu(null); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-t-lg"
                >
                  {t('tenants.export.excel')}
                </button>
                <button
                  onClick={() => { handleExport('csv'); setShowActionsMenu(null); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-b-lg"
                >
                  {t('tenants.export.csv')}
          </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Firma
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Aylık Gelir
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  API Maliyeti
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Kar Marjı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ödeme
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center justify-center gap-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                            style={{
                              animationDelay: `${i * 0.15}s`,
                              animationDuration: '0.6s',
                            }}
                          />
                        ))}
                      </div>
                      <span className="ml-3 text-gray-600 dark:text-gray-400">Yükleniyor...</span>
                    </div>
                  </td>
                </tr>
              ) : tenants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Firma bulunamadı</p>
                  </td>
                </tr>
              ) : tenants.map((tenant) => (
                <tr
                  key={tenant.tenantId}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {tenant.tenantName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {tenant.tenantId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPlanBadge(tenant.subscription.plan)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(tenant.subscription.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      ${tenant.monthlyRevenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ${tenant.totalRevenue.toLocaleString()} toplam
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      ${tenant.apiCosts.totalMonthlyCost.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {tenant.apiCosts.llm.provider}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div
                      className={`text-sm font-medium ${
                        tenant.profitMargin > 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {tenant.profitMargin > 0 ? '+' : ''}
                      {tenant.profitMargin.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {tenant.paymentStatus === 'paid' && (
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      )}
                      {tenant.paymentStatus === 'pending' && (
                        <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      )}
                      {tenant.paymentStatus === 'overdue' && (
                        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      )}
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {tenant.paymentStatus === 'paid' && t('tenants.payment.paid')}
                        {tenant.paymentStatus === 'pending' && t('tenants.payment.pending')}
                        {tenant.paymentStatus === 'overdue' && t('tenants.payment.overdue')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2 relative">
                      <Link
                        to={`/asistansuper/tenants/${tenant.tenantId}`}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
                        title={t('superAdmin.tenants.viewDetails')}
                      >
                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </Link>
                      <button
                        onClick={() => navigate(`/asistansuper/tenants/${tenant.tenantId}/edit`)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
                        title={t('superAdmin.tenants.edit')}
                      >
                        <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={() => setShowActionsMenu(showActionsMenu === tenant.tenantId ? null : tenant.tenantId)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
                        title={t('superAdmin.tenants.moreActions')}
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      
                      {/* Actions Dropdown */}
                      {showActionsMenu === tenant.tenantId && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
                          {tenant.subscription.status === 'active' ? (
                            <button
                              onClick={() => handleSuspendTenant(tenant.tenantId)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-t-lg flex items-center gap-2 text-yellow-600 dark:text-yellow-400"
                            >
                              <Ban className="w-4 h-4" />
                              Askıya Al
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivateTenant(tenant.tenantId)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-t-lg flex items-center gap-2 text-green-600 dark:text-green-400"
                            >
                              <PlayCircle className="w-4 h-4" />
                              {t('tenants.actions.activate')}
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteTenant(tenant.tenantId)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-b-lg flex items-center gap-2 text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                            Sil
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Tenant Modal */}
      <CreateTenantModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={(data: TenantFormData) => {
          logger.debug('New tenant data:', data);
          // TODO: Backend'e gönder
          alert(t('superAdmin.tenants.messages.tenantCreated'));
        }}
      />
    </div>
  );
};

export default TenantsPage;

