import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, Eye, Download, Trash2, Save } from 'lucide-react';

const SecuritySettings: React.FC = () => {
  const { t } = useTranslation('admin');
  const [security, setSecuritySettings] = useState({
    encryption: true,
    sessionTimeout: 30,
    ipRestriction: false,
    allowedIPs: '',
    dataRetention: 365,
    autoBackup: true,
    backupFrequency: 'daily'
  });

  const [activityLogs] = useState([
    { id: 1, action: t('security.mockData.actions.login'), user: 'admin@asistanapp.com', ip: '192.168.1.100', time: t('system.mockData.time.5min') || '5 minutes ago', status: 'success' },
    { id: 2, action: t('security.mockData.actions.settingsChange'), user: 'admin@asistanapp.com', ip: '192.168.1.100', time: t('system.mockData.time.1hour'), status: 'success' },
    { id: 3, action: t('security.mockData.actions.loginAttempt'), user: 'unknown@example.com', ip: '185.45.78.90', time: t('system.mockData.time.2hours'), status: 'failed' }
  ]);

  const handleSave = () => {
    alert(t('settings.security.messages.saved'));
  };

  const handleExportData = () => {
    alert(t('settings.security.messages.exportingData'));
  };

  const handleDeleteAccount = () => {
    if (confirm(t('settings.security.messages.confirmDeleteAccount'))) {
      alert(t('settings.security.messages.deleteCancelled'));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('settings.security.title')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('settings.security.description')}</p>
      </div>

      {/* Data Security */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <Lock className="w-5 h-5 inline mr-2 text-blue-500" />
          {t('settings.security.dataSecurity')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.security.encryption')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.security.encryptionDesc')}</p>
            </div>
            <label htmlFor="encryption-toggle" className="relative inline-flex items-center cursor-pointer">
              <span className="sr-only">{t('settings.security.encryption')}</span>
              <input
                id="encryption-toggle"
                type="checkbox"
                checked={security.encryption}
                onChange={(e) => setSecuritySettings({ ...security, encryption: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 dark:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label htmlFor="session-timeout" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.security.sessionTimeout')}</label>
            <select
              id="session-timeout"
              value={security.sessionTimeout}
              onChange={(e) => setSecuritySettings({ ...security, sessionTimeout: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            >
              <option value={15}>{t('settings.security.timeouts.15min')}</option>
              <option value={30}>{t('settings.security.timeouts.30min')}</option>
              <option value={60}>{t('settings.security.timeouts.1hour')}</option>
              <option value={120}>{t('settings.security.timeouts.2hours')}</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.security.ipRestriction')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.security.ipRestrictionDesc')}</p>
            </div>
            <label htmlFor="ip-restriction-toggle" className="relative inline-flex items-center cursor-pointer">
              <span className="sr-only">{t('settings.security.ipRestriction')}</span>
              <input
                id="ip-restriction-toggle"
                type="checkbox"
                checked={security.ipRestriction}
                onChange={(e) => setSecuritySettings({ ...security, ipRestriction: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 dark:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          {security.ipRestriction && (
            <div>
              <label htmlFor="allowed-ips" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.security.allowedIPs')}</label>
              <textarea
                id="allowed-ips"
                value={security.allowedIPs}
                onChange={(e) => setSecuritySettings({ ...security, allowedIPs: e.target.value })}
                placeholder={t('settings.security.ipPlaceholder')}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('settings.security.ipHelp')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Activity Logs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <Eye className="w-5 h-5 inline mr-2" />
          {t('settings.security.activityLogs')}
        </h3>
        <div className="space-y-2">
          {activityLogs.map((log) => (
            <div key={log.id} className={`p-3 rounded-lg border ${log.status === 'success' ? 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{log.action}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${log.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {log.status === 'success' ? t('settings.security.status.success') : t('settings.security.status.failed')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{log.user} • {log.ip} • {log.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KVKK/GDPR */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <Shield className="w-5 h-5 inline mr-2 text-green-500" />
          {t('settings.security.kvkkGdpr')}
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="data-retention" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.security.dataRetention')}</label>
            <select
              id="data-retention"
              value={security.dataRetention}
              onChange={(e) => setSecuritySettings({ ...security, dataRetention: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            >
              <option value={90}>{t('settings.security.retentionPeriods.90days')}</option>
              <option value={180}>{t('settings.security.retentionPeriods.6months')}</option>
              <option value={365}>{t('settings.security.retentionPeriods.1year')}</option>
              <option value={730}>{t('settings.security.retentionPeriods.2years')}</option>
            </select>
          </div>
          <button
            onClick={handleExportData}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            {t('settings.security.exportData')}
          </button>
        </div>
      </div>

      {/* Backup */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('settings.security.autoBackup')}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.security.autoBackup')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.security.autoBackupDesc')}</p>
            </div>
            <label htmlFor="auto-backup-toggle" className="relative inline-flex items-center cursor-pointer">
              <span className="sr-only">{t('settings.security.autoBackup')}</span>
              <input
                id="auto-backup-toggle"
                type="checkbox"
                checked={security.autoBackup}
                onChange={(e) => setSecuritySettings({ ...security, autoBackup: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 dark:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
          {security.autoBackup && (
            <div>
              <label htmlFor="backup-frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.security.backupFrequency')}</label>
              <select
                id="backup-frequency"
                value={security.backupFrequency}
                onChange={(e) => setSecuritySettings({ ...security, backupFrequency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              >
                <option value="daily">{t('settings.security.frequencies.daily')}</option>
                <option value="weekly">{t('settings.security.frequencies.weekly')}</option>
                <option value="monthly">{t('settings.security.frequencies.monthly')}</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border-2 border-red-200 dark:border-red-800 p-6">
        <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-4">⚠️ {t('settings.security.dangerZone')}</h3>
        <p className="text-sm text-red-700 dark:text-red-400 mb-4">{t('settings.security.dangerZoneDesc')}</p>
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          {t('settings.security.deleteAccount')}
        </button>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button className="px-6 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium">
          {t('settings.security.cancel')}
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {t('settings.security.actions.saveChanges')}
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;



