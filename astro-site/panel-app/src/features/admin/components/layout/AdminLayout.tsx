/**
 * Super Admin Layout - AsistanApp Yönetim Paneli
 * Tüm müşteri firmalarını yöneten super admin paneli
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import ThemeSwitcher from '@/shared/ui/theme/ThemeSwitcher';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { t } = useTranslation('admin');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 lg:hidden ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminSidebar onItemClick={() => setIsMobileSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between px-3 py-2.5">
            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              aria-label={t('layout.toggleMenu')}
            >
              <Menu className="w-5 h-5 text-gray-900 dark:text-gray-100" />
            </button>

            {/* Center Logo */}
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="AsistanApp" className="w-6 h-6" />
              <h1 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                Admin Panel
              </h1>
            </div>

            {/* Theme Switcher */}
            <ThemeSwitcher />
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <AdminHeader />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

