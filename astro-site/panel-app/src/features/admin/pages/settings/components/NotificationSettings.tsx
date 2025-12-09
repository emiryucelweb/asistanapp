import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '@/shared/utils/logger';
import { Bell, Mail, MessageSquare, Smartphone, Save } from 'lucide-react';

const NotificationSettings: React.FC = () => {
  const { t } = useTranslation('admin');
  const [notifications, setNotifications] = useState({
    email: {
      newAppointment: true,
      appointmentCancel: true,
      newCustomer: true,
      aiHandoff: true,
      dailyReport: false
    },
    sms: {
      urgent: true,
      important: false,
      lowCredit: true
    },
    push: {
      newMessage: true,
      liveCalls: true,
      urgentRequests: true
    },
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00',
      weekend: false
    }
  });

  const handleSave = () => {
    alert(t('settings.notifications.settingsSaved'));
    logger.debug('Notification settings saved:', notifications);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('settings.notifications.title')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('settings.notifications.subtitle')}</p>
      </div>

      {/* Email Notifications */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <Mail className="w-5 h-5 inline mr-2 text-blue-500" />
          {t('settings.notifications.email.title')}
        </h3>
        <div className="space-y-3">
          {Object.entries({
            newAppointment: t('settings.notifications.email.newAppointment'),
            appointmentCancel: t('settings.notifications.email.appointmentCancel'),
            newCustomer: t('settings.notifications.email.newCustomer'),
            aiHandoff: t('settings.notifications.email.aiHandoff'),
            dailyReport: t('settings.notifications.email.dailyReport')
          }).map(([key, label]) => (
            <label key={key} htmlFor={`email-${key}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer">
              <span className="text-sm text-gray-900 dark:text-gray-100">{label}</span>
              <input
                id={`email-${key}`}
                type="checkbox"
                checked={notifications.email[key as keyof typeof notifications.email]}
                onChange={(e) => setNotifications({
                  ...notifications,
                  email: { ...notifications.email, [key]: e.target.checked }
                })}
                className="w-4 h-4 text-blue-600 border-gray-300 dark:border-slate-600 rounded focus:ring-blue-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* SMS Notifications */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <MessageSquare className="w-5 h-5 inline mr-2 text-green-500" />
          {t('settings.notifications.sms.title')}
        </h3>
        <div className="space-y-3">
          {Object.entries({
            urgent: t('settings.notifications.sms.urgent'),
            important: t('settings.notifications.sms.important'),
            lowCredit: t('settings.notifications.sms.lowCredit')
          }).map(([key, label]) => (
            <label key={key} htmlFor={`sms-${key}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer">
              <span className="text-sm text-gray-900 dark:text-gray-100">{label}</span>
              <input
                id={`sms-${key}`}
                type="checkbox"
                checked={notifications.sms[key as keyof typeof notifications.sms]}
                onChange={(e) => setNotifications({
                  ...notifications,
                  sms: { ...notifications.sms, [key]: e.target.checked }
                })}
                className="w-4 h-4 text-green-600 border-gray-300 dark:border-slate-600 rounded focus:ring-green-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <Smartphone className="w-5 h-5 inline mr-2 text-purple-500" />
          {t('settings.notifications.push.title')}
        </h3>
        <div className="space-y-3">
          {Object.entries({
            newMessage: t('settings.notifications.push.newMessage'),
            liveCalls: t('settings.notifications.push.liveCalls'),
            urgentRequests: t('settings.notifications.push.urgentRequests')
          }).map(([key, label]) => (
            <label key={key} htmlFor={`push-${key}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer">
              <span className="text-sm text-gray-900 dark:text-gray-100">{label}</span>
              <input
                id={`push-${key}`}
                type="checkbox"
                checked={notifications.push[key as keyof typeof notifications.push]}
                onChange={(e) => setNotifications({
                  ...notifications,
                  push: { ...notifications.push, [key]: e.target.checked }
                })}
                className="w-4 h-4 text-purple-600 border-gray-300 dark:border-slate-600 rounded focus:ring-purple-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <Bell className="w-5 h-5 inline mr-2 text-gray-500 dark:text-gray-400" />
          {t('settings.notifications.quietHours.title')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.notifications.quietHours.enable')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.notifications.quietHours.description')}</p>
            </div>
            <label htmlFor="quiet-hours-toggle" className="relative inline-flex items-center cursor-pointer">
              <span className="sr-only">{t('settings.notifications.quietHours.enable')}</span>
              <input
                id="quiet-hours-toggle"
                type="checkbox"
                checked={notifications.quietHours.enabled}
                onChange={(e) => setNotifications({
                  ...notifications,
                  quietHours: { ...notifications.quietHours, enabled: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 dark:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          {notifications.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="quiet-hours-start" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.notifications.quietHours.start')}</label>
                <input
                  id="quiet-hours-start"
                  type="time"
                  value={notifications.quietHours.start}
                  onChange={(e) => setNotifications({
                    ...notifications,
                    quietHours: { ...notifications.quietHours, start: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="quiet-hours-end" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.notifications.quietHours.end')}</label>
                <input
                  id="quiet-hours-end"
                  type="time"
                  value={notifications.quietHours.end}
                  onChange={(e) => setNotifications({
                    ...notifications,
                    quietHours: { ...notifications.quietHours, end: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button className="px-6 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium">
          {t('settings.common.cancel')}
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {t('settings.common.save')}
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;



