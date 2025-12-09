/**
 * Agent Header - Çalışan Paneli Header
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, CheckCircle, Coffee, LogOut, ChevronDown, XCircle, Clock, PhoneIncoming, AtSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import ThemeSwitcher from '@/shared/ui/theme/ThemeSwitcher';
import NotificationCenter from '@/features/agent/components/notifications/NotificationCenter';
import { useAgentStatusStore } from '@/features/agent/stores/agent-status-store';
import { useAuthStore } from '@/shared/stores/auth-store';
import { showSuccess } from '@/shared/utils/toast';
import { useEmergencyCallStore, EmergencyCall } from '@/features/agent/stores/emergency-call-store';
import { logger } from '@/shared/utils/logger';
import { useMentionNotificationStore } from '@/features/agent/stores/mention-notification-store';

const AgentHeader: React.FC = () => {
  const { t } = useTranslation('agent');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { status: agentStatus } = useAgentStatusStore();
  const { triggerEmergencyCall } = useEmergencyCallStore();
  const { simulateMention } = useMentionNotificationStore();

  const statusConfig = {
    available: { 
      label: t('status.available'), 
      icon: CheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30', 
      textColor: 'text-green-700 dark:text-green-400' 
    },
    busy: { 
      label: t('status.busy'), 
      icon: XCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/30', 
      textColor: 'text-red-700 dark:text-red-400' 
    },
    away: { 
      label: t('status.away'), 
      icon: Clock,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', 
      textColor: 'text-yellow-700 dark:text-yellow-400' 
    },
    on_break: { 
      label: t('status.onBreak'), 
      icon: Coffee,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30', 
      textColor: 'text-orange-700 dark:text-orange-400' 
    },
  };

  const currentStatus = statusConfig[agentStatus] || statusConfig.available;
  const StatusIcon = currentStatus.icon;

  return (
    <header className="flex h-18 shrink-0 items-center justify-between border-b border-solid border-b-[#e7ecf3] dark:border-b-slate-700 bg-white dark:bg-slate-800 px-10 py-3 transition-colors">
      <div className="flex items-center gap-4">
        <h2 className="text-[#0e131b] dark:text-gray-100 text-lg font-bold leading-tight tracking-[-0.015em]">
          {t('header.welcome')}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Status Badge - Read-only (Controlled from Sidebar) */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${currentStatus.bgColor}`}>
          <StatusIcon className={`w-4 h-4 ${currentStatus.iconColor}`} />
          <span className={`text-sm font-semibold ${currentStatus.textColor}`}>
            {currentStatus.label}
          </span>
        </div>

        {/* 🧪 DEV ONLY: Call Simulators for Testing */}
        {import.meta.env.DEV && (
          <div className="flex items-center gap-2">
            {/* Normal Call - Pop-up Simulator */}
            <button
              onClick={() => {
                const testCall: EmergencyCall = {
                  id: `normal-call-${Date.now()}`,
                  customerName: 'Mehmet Demir',
                  customerPhone: '+90 532 999 8877',
                  customerEmail: 'mehmet@example.com',
                  customerAvatar: 'https://i.pravatar.cc/150?img=12',
                  conversationId: `conv-${Date.now()}`,
                  priority: 'high', // NOT urgent/critical -> will show pop-up
                  reason: 'Genel bilgi talebi',
                  timestamp: new Date(),
                  messages: [
                    {
                      id: '1',
                      sender: 'customer',
                      senderName: 'Mehmet Demir',
                      content: 'Çalışma saatlerinizi öğrenebilir miyim?',
                      timestamp: new Date(),
                    },
                  ],
                  metadata: {
                    aiAttempts: 1,
                    waitingTime: 30,
                    customerSentiment: 'neutral',
                    tags: ['bilgi'],
                  },
                };
                triggerEmergencyCall(testCall);
                logger.debug('🧪 [DEV] Normal call (pop-up) triggered', testCall);
              }}
              className="px-2 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-all flex items-center gap-1.5 text-xs font-semibold hover:scale-105"
              title="🧪 DEV: Normal Call (Pop-up)"
              type="button"
            >
              <PhoneIncoming className="w-4 h-4" />
              <span>📞 Normal</span>
            </button>

            {/* Emergency Call - Full Screen Simulator */}
            <button
              onClick={() => {
                // NOTE: Test/simulation data - hardcoded strings acceptable for DEV mode testing
                // In production, this data will come from WebSocket/Backend API
                const testCall: EmergencyCall = {
                  id: `urgent-call-${Date.now()}`,
                  customerName: 'Ayşe Yılmaz',
                  customerPhone: '+90 555 123 4567',
                  customerEmail: 'ayse@example.com',
                  customerAvatar: 'https://i.pravatar.cc/150?img=1',
                  conversationId: `conv-${Date.now()}`,
                  priority: 'urgent', // urgent/critical -> full screen modal
                  reason: 'Müşteri ödeme sorunu yaşıyor ve AI çözüm bulamadı',
                  timestamp: new Date(),
                  messages: [
                    {
                      id: '1',
                      sender: 'customer',
                      senderName: 'Ayşe Yılmaz',
                      content: 'Merhaba, ödeme yapamıyorum! Acil yardım lazım!',
                      timestamp: new Date(),
                    },
                    {
                      id: '2',
                      sender: 'ai',
                      senderName: 'AI Asistan',
                      content: 'Müşteri ödemesi onaylanamadı. Size bağlanıyorum...',
                      timestamp: new Date(),
                    },
                  ],
                  metadata: {
                    aiAttempts: 3,
                    waitingTime: 120,
                    customerSentiment: 'frustrated',
                    tags: ['ödeme', 'acil', 'teknik-sorun'],
                  },
                };
                triggerEmergencyCall(testCall);
                logger.debug('🧪 [DEV] Emergency call (full screen) triggered', testCall);
              }}
              className="px-2 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-md transition-all flex items-center gap-1.5 text-xs font-bold animate-pulse hover:scale-105"
              title="🧪 DEV: Emergency Call (Full Screen)"
              type="button"
            >
              <PhoneIncoming className="w-4 h-4" />
              <span>🚨 Acil</span>
            </button>

            {/* Mention Test Simulator */}
            <button
              onClick={() => {
                simulateMention();
                showSuccess('Test mention notification created!');
                logger.debug('🧪 [DEV] Mention notification triggered');
              }}
              className="px-2 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all flex items-center gap-1.5 text-xs font-semibold hover:scale-105"
              title="🧪 DEV: Mention Notification"
              type="button"
            >
              <AtSign className="w-4 h-4" />
              <span>@ Mention</span>
            </button>
          </div>
        )}

        {/* Notifications */}
        <button 
          onClick={() => setShowNotifications(true)}
          className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* User Profile with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors px-2 py-1"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name || 'Agent'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('header.supportTeam')}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400 hidden md:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                <button
                  onClick={() => {
                    window.location.href = '/agent/profile';
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t('header.myProfile')}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('header.settingsPreferences')}</p>
                  </div>
                </button>
                
                <div className="border-t border-gray-200 dark:border-slate-700"></div>
                
                <button
                  onClick={async () => {
                    // Clear React Query cache
                    queryClient.clear();
                    
                    // Logout from auth store (clears tokens)
                    await logout();
                    
                    // Show success message
                    showSuccess(t('auth.logoutSuccess'));
                    
                    // Redirect to login
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left text-red-600 dark:text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">{t('auth.logout')}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Notification Center Modal */}
      {showNotifications && (
        <NotificationCenter onClose={() => setShowNotifications(false)} />
      )}
    </header>
  );
};

export default AgentHeader;

