/**
 * Tenant API Settings - Firma Bazlı API Ayarları
 * Her firma kendi API key'lerini ve limitlerini yönetir
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '@/shared/utils/logger';
import { Key, Copy, RefreshCw, Eye, EyeOff, AlertCircle, CheckCircle, TrendingUp, Lock, Zap, X } from 'lucide-react';
import { useAuthStore } from '@/shared/stores/auth-store';

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  status: 'active' | 'inactive';
}

interface APILimit {
  requests: { used: number; limit: number };
  messages: { used: number; limit: number };
  aiTokens: { used: number; limit: number };
}

const TenantAPISettings: React.FC = () => {
  const { t } = useTranslation('admin');
  const { user } = useAuthStore();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // External API Configurations
  const [externalAPIs, setExternalAPIs] = useState({
    openaiKey: 'sk-proj-***************************',
    anthropicKey: 'sk-ant-***************************',
    webhookUrl: 'https://yourdomain.com/webhook/asistanapp',
    webhookSecret: 'whsec_***************************'
  });
  const [showExternalKeys, setShowExternalKeys] = useState({
    openai: false,
    anthropic: false,
    webhookSecret: false
  });

  // Mock data - gerçek API'den gelecek
  const [apiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production API Key',
      key: 'astn_live_abc123xyz789def456ghi012jkl345mno678pqr901stu234',
      createdAt: '2024-01-15',
      lastUsed: t('system.mockData.time.2hours'),
      status: 'active',
    },
    {
      id: '2',
      name: 'Development API Key',
      key: 'astn_dev_xyz987wvu654tsr321qpo098nml765kji432hgf109edc876',
      createdAt: '2024-01-10',
      lastUsed: t('system.mockData.time.1day'),
      status: 'active',
    },
  ]);

  const [apiLimits] = useState<APILimit>({
    requests: { used: 4230, limit: 10000 },
    messages: { used: 1845, limit: 5000 },
    aiTokens: { used: 125000, limit: 500000 },
  });

  // Paket bilgileri
  const currentPlan = {
    name: t('settings.api.plans.professional'),
    price: 299,
    nextTier: t('settings.api.plans.enterprise'),
    nextPrice: 999,
  };

  const handleCopyKey = (keyId: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRegenerateKey = (keyId: string) => {
    if (confirm(t('settings.api.confirmRefresh'))) {
      // TODO: API call to regenerate key
      logger.debug('Regenerating key:', { keyId });
    }
  };

  const calculatePercentage = (used: number, limit: number) => {
    return Math.round((used / limit) * 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 dark:text-red-400';
    if (percentage >= 70) return 'text-orange-600 dark:text-orange-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getBarColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('settings.api.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('settings.api.subtitle')}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('settings.api.currentPlan')}</div>
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{currentPlan.name}</div>
        </div>
      </div>

      {/* Usage Limits */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.api.usageLimits')}</h3>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            {t('settings.api.upgradePlan')}
          </button>
        </div>

        <div className="space-y-6">
          {/* API Requests */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('settings.api.usage.apiRequests')}
              </span>
              <span className={`text-sm font-bold ${getUsageColor(calculatePercentage(apiLimits.requests.used, apiLimits.requests.limit))}`}>
                {apiLimits.requests.used.toLocaleString()} / {apiLimits.requests.limit.toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${getBarColor(calculatePercentage(apiLimits.requests.used, apiLimits.requests.limit))} transition-all`}
                style={{ width: `${calculatePercentage(apiLimits.requests.used, apiLimits.requests.limit)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              %{calculatePercentage(apiLimits.requests.used, apiLimits.requests.limit)} {t('settings.api.usage.used')}
            </p>
          </div>

          {/* Messages */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('settings.api.usage.messages')}
              </span>
              <span className={`text-sm font-bold ${getUsageColor(calculatePercentage(apiLimits.messages.used, apiLimits.messages.limit))}`}>
                {apiLimits.messages.used.toLocaleString()} / {apiLimits.messages.limit.toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${getBarColor(calculatePercentage(apiLimits.messages.used, apiLimits.messages.limit))} transition-all`}
                style={{ width: `${calculatePercentage(apiLimits.messages.used, apiLimits.messages.limit)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              %{calculatePercentage(apiLimits.messages.used, apiLimits.messages.limit)} {t('settings.api.usage.used')}
            </p>
          </div>

          {/* AI Tokens */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('settings.api.usage.aiTokens')}
              </span>
              <span className={`text-sm font-bold ${getUsageColor(calculatePercentage(apiLimits.aiTokens.used, apiLimits.aiTokens.limit))}`}>
                {apiLimits.aiTokens.used.toLocaleString()} / {apiLimits.aiTokens.limit.toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${getBarColor(calculatePercentage(apiLimits.aiTokens.used, apiLimits.aiTokens.limit))} transition-all`}
                style={{ width: `${calculatePercentage(apiLimits.aiTokens.used, apiLimits.aiTokens.limit)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              %{calculatePercentage(apiLimits.aiTokens.used, apiLimits.aiTokens.limit)} {t('settings.api.usage.used')}
            </p>
          </div>
        </div>

        {/* Warning if approaching limit */}
        {(calculatePercentage(apiLimits.requests.used, apiLimits.requests.limit) >= 80 ||
          calculatePercentage(apiLimits.messages.used, apiLimits.messages.limit) >= 80 ||
          calculatePercentage(apiLimits.aiTokens.used, apiLimits.aiTokens.limit) >= 80) && (
          <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/50 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">
                {t('settings.api.limitWarning')}
              </p>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                {t('settings.api.limitWarningDesc')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* API Keys */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.api.apiKeys')}</h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Key className="w-4 h-4" />
            {t('settings.api.createNewKey')}
          </button>
        </div>

        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{apiKey.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t('settings.api.created')}: {apiKey.createdAt} • {t('settings.api.lastUsed')}: {apiKey.lastUsed}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    apiKey.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-500/10 dark:text-gray-400'
                  }`}
                >
                  {apiKey.status === 'active' ? t('settings.api.status.active') : t('settings.api.status.inactive')}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 font-mono text-sm bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded px-3 py-2 text-gray-900 dark:text-white">
                  {showKeys[apiKey.id] ? apiKey.key : '••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                </div>
                <button
                  onClick={() => setShowKeys({ ...showKeys, [apiKey.id]: !showKeys[apiKey.id] })}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-800 rounded transition-colors"
                  title={showKeys[apiKey.id] ? t('settings.api.hide') : t('settings.api.show')}
                >
                  {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyKey(apiKey.id, apiKey.key)}
                  className="px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                >
                  {copiedKey === apiKey.id ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {t('settings.api.copied')}
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      {t('settings.api.copy')}
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleRegenerateKey(apiKey.id)}
                  className="px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  {t('settings.api.regenerate')}
                </button>
                <button className="px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  {t('settings.api.revoke')}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/50 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>{t('settings.api.securityNote')}:</strong> {t('settings.api.securityNoteDesc')}
          </p>
        </div>
      </div>

      {/* External API Integrations */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.api.externalIntegrations')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('settings.api.externalIntegrationsDesc')}
          </p>
        </div>

        <div className="space-y-6">
          {/* OpenAI API Key */}
          <div>
            <label htmlFor="openai-api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              OpenAI API Key
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  id="openai-api-key"
                  type={showExternalKeys.openai ? 'text' : 'password'}
                  value={externalAPIs.openaiKey}
                  onChange={(e) => setExternalAPIs({ ...externalAPIs, openaiKey: e.target.value })}
                  className="w-full px-4 py-3 pr-10 font-mono text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                  placeholder={t('settings.api.placeholders.openaiKey')}
                />
              </div>
              <button
                onClick={() => setShowExternalKeys({ ...showExternalKeys, openai: !showExternalKeys.openai })}
                className="p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title={showExternalKeys.openai ? (t('common.hide') || 'Hide') : (t('common.show') || 'Show')}
              >
                {showExternalKeys.openai ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t('settings.api.openaiDesc')}
            </p>
          </div>

          {/* Anthropic API Key */}
          <div>
            <label htmlFor="anthropic-api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('settings.api.anthropicKey')}
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  id="anthropic-api-key"
                  type={showExternalKeys.anthropic ? 'text' : 'password'}
                  value={externalAPIs.anthropicKey}
                  onChange={(e) => setExternalAPIs({ ...externalAPIs, anthropicKey: e.target.value })}
                  className="w-full px-4 py-3 pr-10 font-mono text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                  placeholder={t('settings.api.placeholders.anthropicKey')}
                />
              </div>
              <button
                onClick={() => setShowExternalKeys({ ...showExternalKeys, anthropic: !showExternalKeys.anthropic })}
                className="p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title={showExternalKeys.anthropic ? t('settings.api.hide') : t('settings.api.show')}
              >
                {showExternalKeys.anthropic ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t('settings.api.anthropicDesc')}
            </p>
          </div>

          {/* Webhook URL */}
          <div>
            <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('settings.api.webhookUrl')}
            </label>
            <input
              id="webhook-url"
              type="url"
              value={externalAPIs.webhookUrl}
              onChange={(e) => setExternalAPIs({ ...externalAPIs, webhookUrl: e.target.value })}
              className="w-full px-4 py-3 font-mono text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              placeholder={t('settings.api.placeholders.webhookUrl')}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t('settings.api.webhookUrlDesc')}
            </p>
          </div>

          {/* Webhook Secret */}
          <div>
            <label htmlFor="webhook-secret" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('settings.api.webhookSecret')}
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  id="webhook-secret"
                  type={showExternalKeys.webhookSecret ? 'text' : 'password'}
                  value={externalAPIs.webhookSecret}
                  onChange={(e) => setExternalAPIs({ ...externalAPIs, webhookSecret: e.target.value })}
                  className="w-full px-4 py-3 pr-10 font-mono text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                  placeholder={t('settings.api.placeholders.webhookSecret')}
                />
              </div>
              <button
                onClick={() => setShowExternalKeys({ ...showExternalKeys, webhookSecret: !showExternalKeys.webhookSecret })}
                className="p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title={showExternalKeys.webhookSecret ? t('settings.api.hide') : t('settings.api.show')}
              >
                {showExternalKeys.webhookSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t('settings.api.webhookSecretDesc')}
            </p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-slate-700">
            <button
              onClick={() => {
                // TODO: API call to save external API settings
                alert(t('settings.api.messages.saved'));
              }}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {t('settings.api.saveSettings')}
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/50 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>{t('settings.api.importantNote')}:</strong> {t('settings.api.importantNoteDesc')}
          </p>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('settings.api.upgradeModal.title')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.api.upgradeModal.subtitle')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title={t('settings.api.close')}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Current Plan */}
              <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.api.upgradeModal.yourCurrentPlan')}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentPlan.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">₺{currentPlan.price}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.api.perMonth')}</p>
                  </div>
                </div>
              </div>

              {/* Next Tier */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">{t('settings.api.upgradeModal.recommended')}</span>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{currentPlan.nextTier}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">₺{currentPlan.nextPrice}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.api.perMonth')}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    {t('settings.api.upgradeModal.features.apiRequests50k')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    {t('settings.api.upgradeModal.features.messages25k')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    {t('settings.api.upgradeModal.features.aiTokens2500k')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    {t('settings.api.upgradeModal.features.prioritySupport')}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    {t('settings.api.upgradeModal.features.advancedAnalytics')}
                  </div>
                </div>

                {/* Upgrade Type Selection */}
                <div className="space-y-3">
                  <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" />
                    {t('settings.api.upgradeModal.upgradeNow')}
                  </button>
                  <button className="w-full py-3 bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-medium border-2 border-blue-600 dark:border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-600 transition-all">
                    {t('settings.api.requestApproval')}
                  </button>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-4">
                  {t('settings.api.upgradeModal.autoUpgradeNote')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantAPISettings;


