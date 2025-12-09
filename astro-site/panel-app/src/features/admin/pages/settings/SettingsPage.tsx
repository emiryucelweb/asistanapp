import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  User,
  Building2,
  Bot,
  MessageSquare,
  Users,
  Calendar,
  Bell,
  CreditCard,
  Plug,
  Shield,
  Palette,
  Database,
  Key,
  ChevronRight
} from 'lucide-react';

// Import settings components
import ProfileSettings from './components/ProfileSettings';
import BusinessSettings from './components/BusinessSettings';
import AISettings from './components/AISettings';
import ChannelSettings from './components/ChannelSettings';
import AppointmentSettings from './components/AppointmentSettings';
import NotificationSettings from './components/NotificationSettings';
import BillingSettings from './components/BillingSettings';
import IntegrationSettings from './components/IntegrationSettings';
import SecuritySettings from './components/SecuritySettings';
import CustomizationSettings from './components/CustomizationSettings';
import DataSettings from './components/DataSettings';

type SettingsCategory = 
  | 'profile'
  | 'business'
  | 'ai'
  | 'channels'
  | 'appointments'
  | 'notifications'
  | 'billing'
  | 'integrations'
  | 'security'
  | 'customization'
  | 'data';

interface SettingsMenuItem {
  id: SettingsCategory;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const SettingsPage: React.FC = () => {
  const { t } = useTranslation('admin');
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('profile');

  const menuItems: SettingsMenuItem[] = [
    {
      id: 'profile',
      label: t('settings.navigation.profile.label'),
      icon: <User className="w-5 h-5" />,
      description: t('settings.navigation.profile.description')
    },
    {
      id: 'business',
      label: t('settings.navigation.business.label'),
      icon: <Building2 className="w-5 h-5" />,
      description: t('settings.navigation.business.description')
    },
    {
      id: 'ai',
      label: t('settings.navigation.ai.label'),
      icon: <Bot className="w-5 h-5" />,
      description: t('settings.navigation.ai.description')
    },
    {
      id: 'channels',
      label: t('settings.navigation.channels.label'),
      icon: <MessageSquare className="w-5 h-5" />,
      description: t('settings.navigation.channels.description')
    },
    {
      id: 'appointments',
      label: t('settings.navigation.appointments.label'),
      icon: <Calendar className="w-5 h-5" />,
      description: t('settings.navigation.appointments.description')
    },
    {
      id: 'notifications',
      label: t('settings.navigation.notifications.label'),
      icon: <Bell className="w-5 h-5" />,
      description: t('settings.navigation.notifications.description')
    },
    {
      id: 'billing',
      label: t('settings.navigation.billing.label'),
      icon: <CreditCard className="w-5 h-5" />,
      description: t('settings.navigation.billing.description')
    },
    {
      id: 'integrations',
      label: t('settings.navigation.integrations.label'),
      icon: <Plug className="w-5 h-5" />,
      description: t('settings.navigation.integrations.description')
    },
    {
      id: 'security',
      label: t('settings.navigation.security.label'),
      icon: <Shield className="w-5 h-5" />,
      description: t('settings.navigation.security.description')
    },
    {
      id: 'customization',
      label: t('settings.navigation.customization.label'),
      icon: <Palette className="w-5 h-5" />,
      description: t('settings.navigation.customization.description')
    },
    {
      id: 'data',
      label: t('settings.navigation.data.label'),
      icon: <Database className="w-5 h-5" />,
      description: t('settings.navigation.data.description')
    }
  ];

  const renderContent = () => {
    switch (activeCategory) {
      case 'profile':
        return <ProfileSettings />;
      case 'business':
        return <BusinessSettings />;
      case 'ai':
        return <AISettings />;
      case 'channels':
        return <ChannelSettings />;
      case 'appointments':
        return <AppointmentSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'billing':
        return <BillingSettings />;
      case 'integrations':
        return <IntegrationSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'customization':
        return <CustomizationSettings />;
      case 'data':
        return <DataSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{t('settings.title')}</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{t('settings.subtitle')}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Responsive */}
        <div className="w-full lg:w-80 bg-white dark:bg-slate-800 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-slate-700 lg:min-h-[calc(100vh-89px)] flex-shrink-0">
          <nav className="p-2 sm:p-4">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveCategory(item.id)}
                  className={`w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-left transition-all group ${
                    activeCategory === item.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-l-4 border-blue-500 dark:border-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 border-l-4 border-transparent'
                  }`}
                  aria-current={activeCategory === item.id ? 'page' : undefined}
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className={activeCategory === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs sm:text-sm font-medium ${activeCategory === item.id ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
                        {item.label}
                      </p>
                      <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  {activeCategory === item.id && (
                    <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 bg-gray-50 dark:bg-slate-900">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;



