/**
 * Super Admin Header
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Search, X } from 'lucide-react';
import ThemeSwitcher from '@/shared/ui/theme/ThemeSwitcher';

const AdminHeader: React.FC = () => {
  const { t } = useTranslation('admin');
  const [showNotifications, setShowNotifications] = useState(false);

  // TODO: Replace with real API call to fetch notifications
  // Mock data removed - use backend API endpoints
  const notifications: Array<{ id: string; title: string; message: string; time: string }> = [];

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('dashboard.searchCompany')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-20">
                  <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Bildirimler</h3>
                    <button onClick={() => setShowNotifications(false)}>
                      <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer border-b border-gray-100 dark:border-slate-700 last:border-0">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{notif.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;

