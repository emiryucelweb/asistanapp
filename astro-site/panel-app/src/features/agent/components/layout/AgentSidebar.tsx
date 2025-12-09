 

/**
 * Agent Sidebar - Agent Panel Navigation Sidebar
 * 
 * Main navigation sidebar for agent panel with status controls
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, MessageSquare, User, Coffee, CheckCircle, ChevronLeft, ChevronRight, Bot, XCircle, Clock } from 'lucide-react';
import { showSuccess } from '@/shared/utils/toast';
import { useAgentStatusStore } from '@/features/agent/stores/agent-status-store';
import { useUpdateAgentStatus } from '@/lib/react-query/hooks';
import { useAuthStore } from '@/shared/stores/auth-store';
import { logger } from '@/shared/utils/logger';

interface AgentSidebarProps {
  onItemClick?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const AgentSidebar: React.FC<AgentSidebarProps> = ({ onItemClick, isCollapsed = false, onToggleCollapse }) => {
  const { t } = useTranslation('agent');
  const location = useLocation();
  const { user } = useAuthStore();
  const { 
    status: agentStatus, 
    setStatus, 
    getRemainingBreakSeconds,
    breakStartTime 
  } = useAgentStatusStore();
  const updateStatusMutation = useUpdateAgentStatus();
  const [showStatusMenu, setShowStatusMenu] = React.useState(false);
  const [remainingBreakTime, setRemainingBreakTime] = React.useState(0);
  
  // Update remaining break time every second when on break
  React.useEffect(() => {
    if (agentStatus === 'on_break' && breakStartTime) {
      const interval = setInterval(() => {
        setRemainingBreakTime(getRemainingBreakSeconds());
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setRemainingBreakTime(getRemainingBreakSeconds());
    }
  }, [agentStatus, breakStartTime, getRemainingBreakSeconds]);
  
  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const menuItems = [
    { icon: Home, label: t('sidebar.dashboard'), path: '/agent/dashboard', type: 'link' },
    { icon: MessageCircle, label: t('sidebar.conversations'), path: '/agent/conversations', type: 'link' },
    { icon: MessageSquare, label: t('sidebar.teamChat'), path: '/agent/team/chat', type: 'link' },
    { icon: Bot, label: t('sidebar.aiAssistant'), path: '/agent/ai-chat', badge: t('sidebar.new'), type: 'link' },
    { icon: User, label: t('sidebar.profile'), path: '/agent/profile', type: 'link' },
  ];

  const statusOptions = [
    { 
      value: 'available' as const, 
      label: t('status.available'), 
      icon: CheckCircle,
      color: 'text-green-500', 
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-700 dark:text-green-400' 
    },
    { 
      value: 'busy' as const, 
      label: t('status.busy'), 
      icon: XCircle,
      color: 'text-red-500', 
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-700 dark:text-red-400' 
    },
    { 
      value: 'away' as const, 
      label: t('status.away'), 
      icon: Clock,
      color: 'text-yellow-500', 
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      textColor: 'text-yellow-700 dark:text-yellow-400' 
    },
    { 
      value: 'on_break' as const, 
      label: t('status.onBreak'), 
      icon: Coffee,
      color: 'text-orange-500', 
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      textColor: 'text-orange-700 dark:text-orange-400' 
    },
  ];

  const currentStatusOption = statusOptions.find(s => s.value === agentStatus) || statusOptions[0];

  const isActive = (path?: string) => path && location.pathname === path;
  
  const handleStatusChange = async (newStatus: 'available' | 'busy' | 'away' | 'on_break') => {
    if (!user?.id) return;

    // Optimistic update
    setStatus(newStatus);
    setShowStatusMenu(false);
    
    const messages: Record<string, string> = {
      available: t('status.messages.available'),
      busy: t('status.messages.busy'),
      away: t('status.messages.away'),
      on_break: t('status.messages.onBreak')
    };
    
    showSuccess(messages[newStatus] || t('status.updated'));

    // Sync to backend
    try {
      // Map 'on_break' to 'offline' for backend API compatibility
      const backendStatus = newStatus === 'on_break' ? 'offline' : newStatus;
      
      await updateStatusMutation.mutateAsync({
        agentId: user.id,
        statusData: { status: backendStatus as 'available' | 'busy' | 'away' | 'offline' },
      });
    } catch (error) {
      // Status mutation handles error toast & rollback
      logger.error('Failed to update status', { error, newStatus });
    }
  };

  return (
    <div className={`flex h-full min-h-[700px] flex-col justify-between bg-slate-50 dark:bg-slate-900 p-4 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-80'}`}>
      {/* Logo */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <img src="/logo.svg" alt="AsistanApp" className="w-8 h-8 flex-shrink-0" />
            {!isCollapsed && (
              <div>
                <h1 className="text-[#0e131b] dark:text-gray-100 text-base font-medium leading-normal">{user?.name || 'Agent'}</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">AsistanApp</p>
              </div>
            )}
          </div>
          {!isCollapsed && onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              aria-label={t('layout.collapseSidebar')}
            >
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>
        
        {/* Collapsed: Expand button */}
        {isCollapsed && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors mx-auto"
            aria-label={t('layout.expandSidebar')}
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        )}

        {/* Agent Status Selector */}
        {!isCollapsed && (
          <div className="relative p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{t('status.label')}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{user?.name || 'Agent'}</span>
            </div>
            
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg ${currentStatusOption.bgColor} hover:opacity-90 transition-all`}
            >
              <div className="flex items-center gap-2.5">
                <currentStatusOption.icon className={`w-5 h-5 ${currentStatusOption.color}`} />
                <div className="flex flex-col items-start">
                  <span className={`text-sm font-semibold ${currentStatusOption.textColor}`}>
                    {currentStatusOption.label}
                  </span>
                  {agentStatus === 'on_break' && (
                    <span className="text-xs text-orange-600 dark:text-orange-400 font-mono">
                      {remainingBreakTime > 0 ? t('breakTimer.remaining', { time: formatTime(remainingBreakTime) }) : t('breakTimer.timeUp')}
                    </span>
                  )}
                </div>
              </div>
              <svg className={`w-4 h-4 ${currentStatusOption.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Status Dropdown */}
            {showStatusMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowStatusMenu(false)}
                />
                <div className="absolute left-3 right-3 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                  {statusOptions.map((option) => {
                    const StatusIcon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
                          agentStatus === option.value ? 'bg-gray-50 dark:bg-slate-700' : ''
                        }`}
                      >
                        <StatusIcon className={`w-5 h-5 ${option.color}`} />
                        <span className={`text-sm font-medium ${option.textColor}`}>
                          {option.label}
                        </span>
                        {agentStatus === option.value && (
                          <svg className="w-4 h-4 text-green-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
        
        {isCollapsed && (
          <div className="flex justify-center p-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className={`p-2 rounded-lg ${currentStatusOption.bgColor}`}
              title={currentStatusOption.label}
            >
              <currentStatusOption.icon className={`w-5 h-5 ${currentStatusOption.color}`} />
            </button>
            
            {/* Collapsed Status Dropdown */}
            {showStatusMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowStatusMenu(false)}
                />
                <div className="absolute left-20 top-0 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden min-w-[180px]">
                  {statusOptions.map((option) => {
                    const StatusIcon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${
                          agentStatus === option.value ? 'bg-gray-50 dark:bg-slate-700' : ''
                        }`}
                      >
                        <StatusIcon className={`w-5 h-5 ${option.color}`} />
                        <span className={`text-sm font-medium ${option.textColor}`}>
                          {option.label}
                        </span>
                        {agentStatus === option.value && (
                          <svg className="w-4 h-4 text-green-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
        
        {/* Menu Items */}
        <div className="flex flex-col gap-2">
          {menuItems.map((item, _index) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path!}
                onClick={onItemClick}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-xl transition-colors ${
                  active ? 'bg-[#e7ecf3] dark:bg-slate-700' : 'hover:bg-[#e7ecf3]/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Icon className="text-[#0e131b] dark:text-gray-100 flex-shrink-0" size={24} />
                {!isCollapsed && (
                  <div className="flex items-center gap-2 flex-1">
                    <p className="text-[#0e131b] dark:text-gray-100 text-sm font-medium leading-normal">{item.label}</p>
                    {(item as any).badge && (
                      <span className="px-1.5 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded uppercase">
                        {(item as any).badge}
                      </span>
                    )}
                  </div>
                )}
                {isCollapsed && (item as any).badge && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AgentSidebar;

