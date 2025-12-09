 

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Database,
  Zap,
  Phone,
  Mail,
  Calendar,
  Edit,
  Download,
  AlertCircle,
  CheckCircle,
  Activity,
  BarChart3,
} from 'lucide-react';
import { TenantBilling, TenantUsageMetrics } from '@/types';
import { superAdminTenantsApi } from '@/services/api';
import { mockSuperAdminTenantsApi } from '@/services/api/mock/super-admin-tenants.mock';
import { isMockMode } from '@/services/api/config';
import { logger } from '@/shared/utils/logger';

const TenantDetailPage: React.FC = () => {
  const { t } = useTranslation('super-admin');
  const { tenantId } = useParams<{ tenantId: string }>();
  const [tenant, setTenant] = useState<TenantBilling | null>(null);
  const [metrics, setMetrics] = useState<TenantUsageMetrics | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  // Select API based on mock mode
  const tenantsApi = isMockMode() ? mockSuperAdminTenantsApi : superAdminTenantsApi;

  // Fetch tenant and usage data
  useEffect(() => {
    const fetchTenantData = async () => {
      if (!tenantId) return;

      setIsLoading(true);
      try {
        const [tenantData, usageData] = await Promise.all([
          tenantsApi.getTenant(tenantId),
          tenantsApi.getTenantUsage(tenantId, selectedPeriod),
        ]);

        setTenant(tenantData);
        setMetrics(usageData);
        logger.info('[TenantDetailPage] Data fetched', { 
          tenantId,
          mode: isMockMode() ? 'mock' : 'real',
        });
      } catch (error) {
        logger.error('[TenantDetailPage] Fetch failed', { error });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenantData();
  }, [tenantId, selectedPeriod]);

  // Loading state
  if (isLoading) {
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
          <p className="text-gray-600 dark:text-gray-400">Firma bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!tenant || !metrics) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{t('tenantDetail.notFound')}</p>
          <Link
            to="/asistansuper/tenants"
            className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Firmalara Dön
          </Link>
        </div>
      </div>
    );
  }

  const netProfit = tenant.monthlyRevenue - tenant.apiCosts.totalMonthlyCost;
  const usagePercentage = (tenant.subscription.usage.conversations / tenant.subscription.limits.conversations) * 100;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/asistansuper/tenants"
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {tenant.tenantName}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">ID: {tenant.tenantId}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition-colors">
            <Download className="w-5 h-5" />
            <span>Rapor İndir</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Edit className="w-5 h-5" />
            <span>Düzenle</span>
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-gray-400" />
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
        >
          <option value="7d">Son 7 Gün</option>
          <option value="30d">Son 30 Gün</option>
          <option value="90d">Son 90 Gün</option>
        </select>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Aylık Gelir</p>
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ${tenant.monthlyRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            ${tenant.totalRevenue.toLocaleString()} toplam gelir
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">API Maliyeti</p>
            <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ${tenant.apiCosts.totalMonthlyCost.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {tenant.apiCosts.llm.provider.toUpperCase()} + {tenant.apiCosts.voice.provider}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Net Kar</p>
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ${netProfit.toLocaleString()}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            {tenant.profitMargin.toFixed(1)}% kar marjı
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Ödeme Durumu</p>
            {tenant.paymentStatus === 'paid' ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {tenant.paymentStatus === 'paid' ? 'Ödendi' : 'Bekliyor'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Sonraki: {new Date(tenant.nextBillingDate).toLocaleDateString('tr-TR')}
          </p>
        </div>
      </div>

      {/* API Costs Breakdown */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          API Maliyet Dağılımı
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* LLM Costs */}
          <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                LLM ({tenant.apiCosts.llm.provider.toUpperCase()})
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                ${tenant.apiCosts.llm.totalCost}
              </span>
            </div>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>GPT-4: {tenant.apiCosts.llm.breakdown.gpt4.calls.toLocaleString()} calls</span>
                <span>${tenant.apiCosts.llm.breakdown.gpt4.cost}</span>
              </div>
              <div className="flex justify-between">
                <span>GPT-3.5: {tenant.apiCosts.llm.breakdown.gpt35.calls.toLocaleString()} calls</span>
                <span>${tenant.apiCosts.llm.breakdown.gpt35.cost}</span>
              </div>
              <div className="flex justify-between">
                <span>Embedding: {tenant.apiCosts.llm.breakdown.embedding.calls.toLocaleString()} calls</span>
                <span>${tenant.apiCosts.llm.breakdown.embedding.cost}</span>
              </div>
            </div>
          </div>

          {/* Voice Costs */}
          <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sesli Asistan
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                ${tenant.apiCosts.voice.totalCost}
              </span>
            </div>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Provider:</span>
                <span>{tenant.apiCosts.voice.provider}</span>
              </div>
              <div className="flex justify-between">
                <span>Toplam Dakika:</span>
                <span>{tenant.apiCosts.voice.totalMinutes}</span>
              </div>
              <div className="flex justify-between">
                <span>Dakika Başı:</span>
                <span>${(tenant.apiCosts.voice.totalCost / tenant.apiCosts.voice.totalMinutes).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Costs */}
          <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                WhatsApp
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                ${tenant.apiCosts.whatsapp.totalCost}
              </span>
            </div>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Toplam Mesaj:</span>
                <span>{tenant.apiCosts.whatsapp.totalMessages.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Mesaj Başı:</span>
                <span>${(tenant.apiCosts.whatsapp.totalCost / tenant.apiCosts.whatsapp.totalMessages).toFixed(4)}</span>
              </div>
            </div>
          </div>

          {/* Storage Costs */}
          <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Depolama
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                ${tenant.apiCosts.storage.totalCost}
              </span>
            </div>
            <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Toplam:</span>
                <span>{tenant.apiCosts.storage.totalGB} GB</span>
              </div>
              <div className="flex justify-between">
                <span>GB Başı:</span>
                <span>${(tenant.apiCosts.storage.totalCost / tenant.apiCosts.storage.totalGB).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Other Costs */}
          {tenant.apiCosts.other.map((cost, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {cost.description}
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  ${cost.totalCost}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversations */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Konuşma İstatistikleri
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Kullanım</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {tenant.subscription.usage.conversations.toLocaleString()} / {tenant.subscription.limits.conversations.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all"
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {usagePercentage.toFixed(1)}% kullanıldı
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Toplam Mesaj</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {metrics.messages.total.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Ort. Süre</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {Math.floor(metrics.conversations.avgDuration / 60)}m {metrics.conversations.avgDuration % 60}s
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">AI Yanıtları</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {metrics.messages.aiGenerated.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Agent Yanıtları</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {metrics.messages.agentHandled.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Users & Storage */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Kullanım & Kaynaklar
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Aktif Kullanıcılar
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {tenant.subscription.usage.users} / {tenant.subscription.limits.users}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-green-600 dark:bg-green-400 h-2 rounded-full"
                  style={{ width: `${(tenant.subscription.usage.users / tenant.subscription.limits.users) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Depolama
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {tenant.subscription.usage.storage} GB / {tenant.subscription.limits.storage} GB
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-purple-600 dark:bg-purple-400 h-2 rounded-full"
                  style={{ width: `${(tenant.subscription.usage.storage / tenant.subscription.limits.storage) * 100}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Dosya Sayısı</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {metrics.storage.files.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Medya Dosyası</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {metrics.storage.media.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Fatura Bilgileri
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Şirket</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {tenant.billingAddress?.company}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">E-posta</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {tenant.billingEmail}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Adres</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {tenant.billingAddress?.street}<br />
                {tenant.billingAddress?.city}, {tenant.billingAddress?.state} {tenant.billingAddress?.postalCode}<br />
                {tenant.billingAddress?.country}
              </p>
            </div>
            {tenant.billingAddress?.taxId && (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Vergi No</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {tenant.billingAddress.taxId}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDetailPage;

