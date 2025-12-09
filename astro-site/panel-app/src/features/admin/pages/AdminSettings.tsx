/**
 * Super Admin Settings Page - Platform Ayarları
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Settings,
  Globe,
  Bell,
  Shield,
  Mail,
  Smartphone,
  Key,
  Database,
  DollarSign,
  Save,
} from 'lucide-react';
import { logger } from '@/shared/utils/logger';

const AdminSettings: React.FC = () => {
  const { t } = useTranslation('admin');
  const [settings, setSettings] = useState({
    // General
    platformName: 'AsistanApp',
    platformUrl: 'https://asistanapp.com',
    supportEmail: 'support@asistanapp.com',
    
    // Notifications
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    
    // Security
    twoFactorAuth: true,
    sessionTimeout: '30',
    passwordMinLength: '8',
    
    // API
    apiRateLimit: '1000',
    webhookTimeout: '30',
    
    // Billing
    currency: 'USD',
    taxRate: '18',
    invoicePrefix: 'INV-',
  });

  const handleSave = () => {
    // TODO: Implement API call to save settings
    logger.debug('Settings saved:', settings);
    if (import.meta.env.DEV) {
      logger.info('⚙️ Settings saved! (Backend integration needed)');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('settings.platformTitle')}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t('settings.platformSubtitle')}
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Save className="w-5 h-5" />
          <span>{t('settings.save')}</span>
        </button>
      </div>

      {/* General Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('settings.general.title')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="admin-settings-platform-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('settings.general.platformName')}
            </label>
            <input
              id="admin-settings-platform-name"
              type="text"
              value={settings.platformName}
              onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="admin-settings-platform-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('settings.general.platformUrl')}
            </label>
            <input
              id="admin-settings-platform-url"
              type="url"
              value={settings.platformUrl}
              onChange={(e) => setSettings({ ...settings, platformUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="admin-settings-support-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('settings.general.supportEmail')}
            </label>
            <input
              id="admin-settings-support-email"
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('settings.notificationsSettings.title')}
          </h2>
        </div>
        <div className="space-y-4">
          <label htmlFor="admin-settings-email-notif" className="flex items-center gap-3">
            <span className="sr-only">{t('settings.notificationsSettings.enableEmail')}</span>
            <input
              id="admin-settings-email-notif"
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) =>
                setSettings({ ...settings, emailNotifications: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t('settings.notificationsSettings.emailTitle')}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t('settings.notificationsSettings.emailDescription')}
              </p>
            </div>
          </label>

          <label htmlFor="admin-settings-sms-notif" className="flex items-center gap-3">
            <span className="sr-only">{t('settings.notificationsSettings.enableSMS')}</span>
            <input
              id="admin-settings-sms-notif"
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t('settings.notificationsSettings.smsTitle')}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t('settings.notificationsSettings.smsDescription')}
              </p>
            </div>
          </label>

          <label htmlFor="admin-settings-push-notif" className="flex items-center gap-3">
            <span className="sr-only">{t('settings.notificationsSettings.enablePush')}</span>
            <input
              id="admin-settings-push-notif"
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) =>
                setSettings({ ...settings, pushNotifications: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t('settings.notificationsSettings.pushTitle')}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t('settings.notificationsSettings.pushDescription')}
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('settings.securitySettings.title')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="admin-settings-session-timeout" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('settings.securitySettings.sessionTimeout')}
            </label>
            <input
              id="admin-settings-session-timeout"
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="admin-settings-password-min-length" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('settings.securitySettings.passwordMinLength')}
            </label>
            <input
              id="admin-settings-password-min-length"
              type="number"
              value={settings.passwordMinLength}
              onChange={(e) => setSettings({ ...settings, passwordMinLength: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="admin-settings-2fa-required" className="flex items-center gap-3">
            <span className="sr-only">{t('settings.securitySettings.enable2FA')}</span>
            <input
              id="admin-settings-2fa-required"
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t('settings.securitySettings.twoFactorTitle')}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t('settings.securitySettings.twoFactorDescription')}
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* API Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('settings.apiSettings.title')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="admin-settings-api-rate-limit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('settings.apiSettings.rateLimit')}
            </label>
            <input
              id="admin-settings-api-rate-limit"
              type="number"
              value={settings.apiRateLimit}
              onChange={(e) => setSettings({ ...settings, apiRateLimit: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="admin-settings-webhook-timeout" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('settings.apiSettings.webhookTimeout')}
            </label>
            <input
              id="admin-settings-webhook-timeout"
              type="number"
              value={settings.webhookTimeout}
              onChange={(e) => setSettings({ ...settings, webhookTimeout: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Billing Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('settings.billingSettings.title')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="admin-settings-currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('settings.billingSettings.currency')}
            </label>
            <select
              id="admin-settings-currency"
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="TRY">TRY (₺)</option>
            </select>
          </div>
          <div>
            <label htmlFor="admin-settings-tax-rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('settings.billingSettings.taxRate')}
            </label>
            <input
              id="admin-settings-tax-rate"
              type="number"
              value={settings.taxRate}
              onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="admin-settings-invoice-prefix" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('settings.billingSettings.invoicePrefix')}
            </label>
            <input
              id="admin-settings-invoice-prefix"
              type="text"
              value={settings.invoicePrefix}
              onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Save className="w-5 h-5" />
          <span>{t('settings.saveAll')}</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;



