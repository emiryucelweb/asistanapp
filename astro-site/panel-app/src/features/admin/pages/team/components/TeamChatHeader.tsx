/**
 * TeamChatHeader Component - Top Navigation Bar
 * 
 * Enterprise-grade header with navigation, search, notifications, and user menu
 * Implements responsive design and accessibility best practices
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MessageSquare,
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import type { User as UserType } from '@/types';

interface TeamChatHeaderProps {
  /**
   * Current authenticated user
   */
  user: UserType | null;
  
  /**
   * Notifications array
   */
  notifications: any[];
  
  /**
   * UI state
   */
  showNotifications: boolean;
  showUserMenu: boolean;
  
  /**
   * State setters
   */
  setShowNotifications: (show: boolean) => void;
  setShowUserMenu: (show: boolean) => void;
  setShowSearchModal: (show: boolean) => void;
  
  /**
   * Callbacks
   */
  onNotificationClick?: (notification: any) => void;
}

/**
 * TeamChatHeader - Modular header component
 * 
 * Features:
 * - Back navigation
 * - Search modal trigger
 * - Notifications dropdown
 * - User menu dropdown
 * - Responsive design
 */
export function TeamChatHeader(props: TeamChatHeaderProps) {
  const { t } = useTranslation('admin');
  const {
    user,
    notifications,
    showNotifications,
    showUserMenu,
    setShowNotifications,
    setShowUserMenu,
    setShowSearchModal,
    onNotificationClick,
  } = props;

  const navigate = useNavigate();

  /**
   * Handle notification click
   */
  const handleNotificationClick = (notification: any) => {
    setShowNotifications(false);
    
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  /**
   * Handle logout
   */
  const handleLogout = () => {
    setShowUserMenu(false);
    
    if (confirm(t('teamChat.header.confirmLogout'))) {
      navigate(user?.role === 'agent' ? '/agent/login' : '/admin/login');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-3 sm:px-4 py-2 sm:py-3 flex-shrink-0">
      <div className="flex items-center justify-between">
        {/* Left Side - Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label={t('team.header.back')}
            type="button"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
          </button>
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              {t('teamChat.header.title')}
            </h1>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search Button */}
          <button 
            onClick={() => setShowSearchModal(true)}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label={t('team.header.search')}
            type="button"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              aria-label={t('team.header.notifications')}
              aria-expanded={showNotifications}
              type="button"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
              
              {/* Unread indicator */}
              {notifications.filter((n: any) => n.unread).length > 0 && (
                <span 
                  className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                  aria-label={t('teamChat.header.unreadNotifications', { count: notifications.filter((n: any) => n.unread).length })}
                />
              )}
            </button>
            
            {showNotifications && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowNotifications(false)}
                  aria-hidden="true"
                />
                
                {/* Dropdown */}
                <div 
                  className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto"
                  role="menu"
                  aria-label={t('teamChat.header.notificationsAria')}
                >
                  <div className="p-3 border-b border-gray-200 dark:border-slate-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {t('teamChat.header.notifications')}
                    </h3>
                  </div>
                  
                  <div className="divide-y divide-gray-200 dark:divide-slate-700">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                        {t('teamChat.header.noNotifications')}
                      </div>
                    ) : (
                      notifications.map((notif: any) => (
                        <button
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
                            notif.unread ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                          }`}
                          role="menuitem"
                          type="button"
                        >
                          <p className="text-sm text-gray-900 dark:text-white">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {notif.time}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Menu Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              aria-label={t('team.header.userMenu')}
              aria-expanded={showUserMenu}
              type="button"
            >
              <img
                src={user?.profile?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                alt={user?.name || 'User'}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
              />
              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" aria-hidden="true" />
            </button>
            
            {showUserMenu && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowUserMenu(false)}
                  aria-hidden="true"
                />
                
                {/* Dropdown */}
                <div 
                  className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden"
                  role="menu"
                  aria-label={t('team.header.userMenu')}
                >
                  {/* User Info */}
                  <div className="p-3 border-b border-gray-200 dark:border-slate-700">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="p-2">
                    <button 
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate(user?.role === 'agent' ? '/agent/profile' : '/admin/settings');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded text-sm text-gray-900 dark:text-gray-100 transition-colors"
                      role="menuitem"
                      type="button"
                    >
                      <User className="w-4 h-4" aria-hidden="true" />
                      <span>{t('teamChat.header.myProfile')}</span>
                    </button>
                    
                    <button 
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate(user?.role === 'agent' ? '/agent/settings' : '/admin/settings');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded text-sm text-gray-900 dark:text-gray-100 transition-colors"
                      role="menuitem"
                      type="button"
                    >
                      <Settings className="w-4 h-4" aria-hidden="true" />
                      <span>{t('teamChat.header.settings')}</span>
                    </button>
                    
                    <div className="border-t border-gray-200 dark:border-slate-600 my-1" />
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-sm text-red-600 dark:text-red-400 transition-colors"
                      role="menuitem"
                      type="button"
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      <span>{t('team.chat.logout')}</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

