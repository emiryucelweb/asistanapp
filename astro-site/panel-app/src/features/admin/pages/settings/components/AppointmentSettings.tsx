import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '@/shared/utils/logger';
import { Calendar, Bell, Save, XCircle } from 'lucide-react';

const AppointmentSettings: React.FC = () => {
  const { t } = useTranslation('admin');
  const [settings, setSettings] = useState({
    duration: 30,
    bufferTime: 10,
    maxConcurrent: 2,
    minNotice: 2,
    autoApprove: false,
    allowCancel: true,
    cancelDeadline: 24,
    enableReminders: true,
    smsReminder: true,
    emailReminder: true,
    whatsappReminder: false,
    reminderTime: 24
  });

  const handleSave = () => {
    alert(t('settings.appointments.settingsSaved'));
    logger.debug('Appointment settings saved:', settings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('settings.appointments.title')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('settings.appointments.description')}</p>
      </div>

      {/* General Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <Calendar className="w-5 h-5 inline mr-2" />
          {t('settings.appointments.generalSettings')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="appt-duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.appointments.appointmentDuration')}</label>
            <select
              id="appt-duration"
              value={settings.duration}
              onChange={(e) => setSettings({ ...settings, duration: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            >
              <option value={15}>{t('settings.appointments.duration15min')}</option>
              <option value={30}>{t('settings.appointments.duration30min')}</option>
              <option value={45}>{t('settings.appointments.duration45min')}</option>
              <option value={60}>{t('settings.appointments.duration60min')}</option>
            </select>
          </div>
          <div>
            <label htmlFor="appt-buffer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.appointments.bufferTime')}</label>
            <select
              id="appt-buffer"
              value={settings.bufferTime}
              onChange={(e) => setSettings({ ...settings, bufferTime: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            >
              <option value={0}>{t('settings.appointments.noBuffer')}</option>
              <option value={5}>{t('settings.appointments.buffer5min')}</option>
              <option value={10}>{t('settings.appointments.buffer10min')}</option>
              <option value={15}>{t('settings.appointments.buffer15min')}</option>
            </select>
          </div>
          <div>
            <label htmlFor="appt-max-concurrent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.appointments.maxConcurrent')}</label>
            <input
              id="appt-max-concurrent"
              type="number"
              min={1}
              max={10}
              value={settings.maxConcurrent}
              onChange={(e) => setSettings({ ...settings, maxConcurrent: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="appt-min-notice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.appointments.minNotice')}</label>
            <input
              id="appt-min-notice"
              type="number"
              min={1}
              max={72}
              value={settings.minNotice}
              onChange={(e) => setSettings({ ...settings, minNotice: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Approval Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('settings.appointments.approvalSystem')}</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.appointments.autoApprove')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.appointments.autoApproveDesc')}</p>
            </div>
            <label htmlFor="appt-auto-approve" className="relative inline-flex items-center cursor-pointer">
              <span className="sr-only">{t('settings.appointments.autoApprove')}</span>
              <input
                id="appt-auto-approve"
                type="checkbox"
                checked={settings.autoApprove}
                onChange={(e) => setSettings({ ...settings, autoApprove: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 dark:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Cancel Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <XCircle className="w-5 h-5 inline mr-2 text-red-500" />
          {t('settings.appointments.cancelAndChange')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.appointments.customerCanCancel')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.appointments.customerCanCancelDesc')}</p>
            </div>
            <label htmlFor="appt-allow-cancel" className="relative inline-flex items-center cursor-pointer">
              <span className="sr-only">{t('settings.appointments.customerCanCancel')}</span>
              <input
                id="appt-allow-cancel"
                type="checkbox"
                checked={settings.allowCancel}
                onChange={(e) => setSettings({ ...settings, allowCancel: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 dark:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          {settings.allowCancel && (
            <div>
              <label htmlFor="appt-cancel-deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.appointments.cancelDeadline')}</label>
              <input
                id="appt-cancel-deadline"
                type="number"
                min={1}
                max={72}
                value={settings.cancelDeadline}
                onChange={(e) => setSettings({ ...settings, cancelDeadline: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('settings.appointments.cancelDeadlineExample')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Reminder Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          <Bell className="w-5 h-5 inline mr-2 text-amber-500" />
          {t('settings.appointments.reminderSettings')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.appointments.sendReminder')}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.appointments.sendReminderDesc')}</p>
            </div>
            <label htmlFor="appt-enable-reminders" className="relative inline-flex items-center cursor-pointer">
              <span className="sr-only">{t('settings.appointments.sendReminder')}</span>
              <input
                id="appt-enable-reminders"
                type="checkbox"
                checked={settings.enableReminders}
                onChange={(e) => setSettings({ ...settings, enableReminders: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-slate-800 after:border-gray-300 dark:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>
          {settings.enableReminders && (
            <>
              <div>
                <label htmlFor="appt-reminder-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('settings.appointments.reminderTime')}</label>
                <select
                  id="appt-reminder-time"
                  value={settings.reminderTime}
                  onChange={(e) => setSettings({ ...settings, reminderTime: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                >
                  <option value={2}>{t('settings.appointments.reminder2h')}</option>
                  <option value={12}>{t('settings.appointments.reminder12h')}</option>
                  <option value={24}>{t('settings.appointments.reminder1d')}</option>
                  <option value={48}>{t('settings.appointments.reminder2d')}</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.smsReminder}
                    onChange={(e) => setSettings({ ...settings, smsReminder: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 dark:border-slate-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">{t('settings.appointments.smsReminder')}</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.emailReminder}
                    onChange={(e) => setSettings({ ...settings, emailReminder: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 dark:border-slate-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">{t('settings.appointments.emailReminder')}</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.whatsappReminder}
                    onChange={(e) => setSettings({ ...settings, whatsappReminder: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 dark:border-slate-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-900 dark:text-gray-100">{t('settings.appointments.whatsappReminder')}</span>
                </label>
              </div>
            </>
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
          {t('settings.common.saveChanges')}
        </button>
      </div>
    </div>
  );
};

export default AppointmentSettings;



