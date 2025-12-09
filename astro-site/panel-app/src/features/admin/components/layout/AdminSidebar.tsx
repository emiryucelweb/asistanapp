/**
 * Super Admin Sidebar - AsistanApp Yönetim Paneli Menüsü
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  DollarSign,
  Users,
  Settings,
  BarChart3,
  Shield,
  Database,
} from 'lucide-react';

interface AdminSidebarProps {
  onItemClick?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onItemClick }) => {
  const { t } = useTranslation('admin');
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: t('sidebar.overview'), path: '/asistansuper/dashboard' },
    { icon: Building2, label: t('sidebar.tenants'), path: '/asistansuper/tenants' },
    { icon: DollarSign, label: t('sidebar.financialReports'), path: '/asistansuper/financial-reports' },
    { icon: Users, label: t('sidebar.users'), path: '/asistansuper/users' },
    { icon: BarChart3, label: t('sidebar.analytics'), path: '/asistansuper/analytics' },
    { icon: Database, label: t('sidebar.system'), path: '/asistansuper/system' },
    { icon: Settings, label: t('sidebar.settings'), path: '/asistansuper/settings' },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="flex h-full min-h-screen w-80 flex-col justify-between bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      {/* Logo & Brand */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 px-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white text-lg font-bold">AsistanApp</h1>
            <p className="text-blue-300 text-xs">Super Admin Panel</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onItemClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className="flex-shrink-0" size={20} />
                <p className="text-sm font-medium">{item.label}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-3 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <p className="text-white text-sm font-medium">Admin</p>
            <p className="text-gray-400 text-xs">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;



