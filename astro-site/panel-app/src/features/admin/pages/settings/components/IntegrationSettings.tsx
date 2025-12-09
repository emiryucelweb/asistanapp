import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Video, CreditCard, Mail, Key, Save } from 'lucide-react';

const IntegrationSettings: React.FC = () => {
  const { t } = useTranslation('admin');
  const [integrations, _setIntegrations] = useState({
    googleCalendar: { enabled: false, connected: false },
    zoom: { enabled: false, connected: false },
    iyzico: { enabled: true, apiKey: 'iyz_xxxxxxxxxxxx' },
    sendgrid: { enabled: true, apiKey: 'SG.xxxxxxxxxxxx' }
  });

  const [apiKeys] = useState([
    { id: 1, name: 'Production API', key: 'ak_prod_xxxxxxxxxxxxxxxx', created: '15 Ara 2024', lastUsed: t('system.mockData.time.2min') },
    { id: 2, name: 'Development API', key: 'ak_dev_xxxxxxxxxxxxxxxx', created: '01 Ara 2024', lastUsed: t('system.mockData.time.1hour') }
  ]);

  const handleSave = () => {
    alert(t('settings.integrations.messages.saved'));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Entegrasyonlar & API</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">3. parti entegrasyonlar ve API erişimi</p>
      </div>

      {/* Third Party Integrations */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">3. Parti Entegrasyonlar</h3>
        <div className="space-y-4">
          {/* Google Calendar */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Google Calendar</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Randevuları senkronize et</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">
              {t('settings.integrations.connect')}
            </button>
          </div>

          {/* Zoom */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Zoom</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Online randevular için</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
              {t('settings.integrations.connect')}
            </button>
          </div>

          {/* iyzico */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">iyzico</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ödeme altyapısı</p>
                </div>
              </div>
              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-medium">Aktif</span>
            </div>
            <div>
              <label htmlFor="iyzico-api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.integrations.apiKey')}</label>
              <input
                id="iyzico-api-key"
                type="password"
                value={integrations.iyzico.apiKey}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* SendGrid */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">SendGrid</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email servisi</p>
                </div>
              </div>
              <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full font-medium">Aktif</span>
            </div>
            <div>
              <label htmlFor="sendgrid-api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.integrations.apiKey')}</label>
              <input
                id="sendgrid-api-key"
                type="password"
                value={integrations.sendgrid.apiKey}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            <Key className="w-5 h-5 inline mr-2" />
            API Anahtarları
          </h3>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
            {t('settings.integrations.createKey')}
          </button>
        </div>
        <div className="space-y-3">
          {apiKeys.map((key) => (
            <div key={key.id} className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900 dark:text-gray-100">{key.name}</p>
                <button className="text-sm text-red-600 hover:text-red-700">{t('settings.integrations.revoke')}</button>
              </div>
              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto">
                {key.key}
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>Oluşturulma: {key.created}</span>
                <span>Son kullanım: {key.lastUsed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Webhooks */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Webhook URL'leri</h3>
        <div>
          <label htmlFor="webhook-new-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Yeni Mesaj Webhook</label>
          <input
            id="webhook-new-message"
            type="url"
            placeholder="https://your-domain.com/webhook/new-message"
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button className="px-6 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium">
          {t('settings.integrations.cancel')}
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {t('settings.integrations.actions.saveChanges')}
        </button>
      </div>
    </div>
  );
};

export default IntegrationSettings;



