/**
 * Header - Stitch AI Design
 * Top navigation bar with notifications and user menu
 */
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Bell, 
  HelpCircle, 
  User, 
  Settings, 
  LogOut, 
  UserCircle,
  CreditCard,
  Building2,
  ChevronDown,
  Check,
  Trash2,
  AlertCircle,
  MessageSquare,
  Calendar,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { useAuthStore } from '@/shared/stores/auth-store';
import ThemeSwitcher from '@/shared/ui/theme/ThemeSwitcher';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ReactNode;
  route?: string; // Tıklanınca gidilecek yer
}

const Header: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // NOTE: These are MOCK notifications and will be replaced with real data from backend
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: t('header.notifications.conversationAssigned'),
      message: t('header.notifications.urgentConversationMessage', { name: 'Ayşe Yılmaz' }),
      time: t('time.minutesAgo', { count: 5 }),
      read: false,
      icon: <UserCheck className="w-5 h-5" />,
      route: '/admin/conversations'
    },
    {
      id: '2',
      type: 'info',
      title: t('header.notifications.conversationAssigned'),
      message: t('header.notifications.conversationAssignedMessage', { name: 'Mehmet Demir' }),
      time: t('time.hoursAgo', { count: 1 }),
      read: false,
      icon: <UserCheck className="w-5 h-5" />,
      route: '/admin/conversations'
    },
    {
      id: '3',
      type: 'info',
      title: t('header.notifications.performanceReport'),
      message: t('header.notifications.dailyReportReady'),
      time: t('time.hoursAgo', { count: 2 }),
      read: true,
      icon: <TrendingUp className="w-5 h-5" />,
      route: '/admin/reports'
    },
    {
      id: '4',
      type: 'success',
      title: t('header.notifications.paymentSuccessful'),
      message: t('header.notifications.subscriptionRenewed'),
      time: t('time.daysAgo', { count: 1 }),
      read: true,
      icon: <CreditCard className="w-5 h-5" />,
      route: '/admin/settings'
    }
  ]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.route) {
      navigate(notification.route);
      setShowNotifications(false);
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-orange-600 bg-orange-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'success': return 'text-green-600 bg-green-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7ecf3] dark:border-b-slate-700 px-4 sm:px-6 lg:px-10 py-3 bg-white dark:bg-slate-800 transition-colors duration-200">
      {/* Logo - Hidden on mobile (shown in mobile header) */}
      <div className="hidden lg:flex items-center gap-4 text-[#0e131b] dark:text-gray-100">
        <img src="/logo.svg" alt="AsistanApp" className="w-8 h-8" />
        <h2 className="text-[#0e131b] dark:text-gray-100 text-lg font-bold leading-tight tracking-[-0.015em]">AsistanApp</h2>
      </div>

            {/* Right Section */}
            <div className="flex flex-1 justify-end gap-2 sm:gap-4 lg:gap-8">
              <div className="flex gap-1 sm:gap-2">
                {/* Theme Switcher */}
                <ThemeSwitcher />
                
                {/* Notifications Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#e7ecf3] dark:bg-slate-700 text-[#0e131b] dark:text-gray-100 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-[#d0d9e7] dark:hover:bg-slate-600 transition-colors"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

               {/* Notifications Dropdown */}
               {showNotifications && (
                 <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg z-50 max-h-[500px] overflow-hidden flex flex-col">
                   {/* Header */}
                   <div className="p-4 border-b border-gray-200 dark:border-slate-600 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                   <Bell className="w-5 h-5" />
                   {t('header.notifications.title')}
                   {unreadCount > 0 && (
                     <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                       {t('header.notifications.newCount', { count: unreadCount })}
                     </span>
                   )}
                 </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      {t('header.notifications.markAllRead')}
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer ${
                            !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                              {notification.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                             <div className="flex items-start justify-between gap-2">
                               <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                                 {notification.title}
                               </h4>
                               <button
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   deleteNotification(notification.id);
                                 }}
                                 className="p-1 hover:bg-gray-200 dark:hover:bg-slate-600 rounded transition-colors"
                               >
                                 <Trash2 className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                               </button>
                             </div>
                             <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-gray-500">{notification.time}</p>
                                {!notification.read && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification.id);
                                    }}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                  >
                                    {t('markAsRead')}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                          <div className="p-8 text-center">
                            <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-600 dark:text-gray-400">{t('header.notifications.noNotifications')}</p>
                          </div>
                  )}
                </div>

                   {/* Footer */}
                   <div className="p-3 border-t border-gray-200 dark:border-slate-600">
                     <button
                       onClick={() => {
                         navigate('/settings');
                         setShowNotifications(false);
                       }}
                       className="w-full px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors font-medium"
                     >
                       {t('header.notifications.settings')}
                     </button>
                   </div>
              </div>
            )}
          </div>
          
                 {/* Help */}
                 <button 
                   onClick={() => navigate('/admin/help')}
                   className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#e7ecf3] dark:bg-slate-700 text-[#0e131b] dark:text-gray-100 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5 hover:bg-[#d0d9e7] dark:hover:bg-slate-600 transition-colors"
                 >
            <HelpCircle size={20} />
          </button>
        </div>

        {/* User Menu Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 group"
          >
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer group-hover:ring-2 group-hover:ring-[#4d6a99] transition-all"
              style={{
                backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=User")'
              }}
            />
            <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-gray-900 transition-colors" />
          </button>

               {/* User Dropdown Menu */}
               {showUserMenu && (
                 <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-lg z-50 overflow-hidden">
              {/* User Info */}
              <div className="p-4 border-b border-gray-200 dark:border-slate-600 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <div className="flex items-center gap-3">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12"
                    style={{
                      backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=User")'
                    }}
                  />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-100">{user?.name || t('header.userMenu.user')}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email || 'user@asistanapp.com'}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={() => {
                    navigate('/admin/settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                >
                  <UserCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{t('header.userMenu.profile')}</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/admin/settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                >
                  <Building2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{t('header.userMenu.business')}</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/admin/settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                >
                  <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{t('header.userMenu.billing')}</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/admin/settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                >
                  <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{t('header.userMenu.settings')}</span>
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-200 dark:border-slate-600 py-2">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3 text-red-600 dark:text-red-400"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">{t('header.userMenu.logout')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

