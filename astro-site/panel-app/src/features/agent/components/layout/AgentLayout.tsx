/**
 * Agent Layout - Main Layout for Agent Panel
 * 
 * Enterprise-grade layout component with error boundary support
 */
import React, { useState, useEffect } from 'react';
import ErrorBoundary from '@/features/agent/components/ErrorBoundary';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/features/agent/utils/locale';
import AgentSidebar from './AgentSidebar';
import AgentHeader from './AgentHeader';
import { Menu, X, Bell, CheckCircle, Coffee, XCircle, Clock, PhoneIncoming } from 'lucide-react';
import ThemeSwitcher from '@/shared/ui/theme/ThemeSwitcher';
import NotificationCenter from '@/features/agent/components/notifications/NotificationCenter';
import MentionToast from '@/features/agent/components/notifications/MentionToast';
import AgentIncomingCallAlert from '@/features/agent/components/voice/AgentIncomingCallAlert';
import AgentCallNotification from '@/features/agent/components/voice/AgentCallNotification';
import SkipToContent from '@/shared/components/SkipToContent';
import { logger } from '@/shared/utils/logger';
import ActiveCallScreen from '@/features/agent/components/voice/ActiveCallScreen';
import { VoiceCall, CallMediaState } from '@/types';
import { useAgentStatusStore } from '@/features/agent/stores/agent-status-store';
import { useEmergencyCallStore, EmergencyCall } from '@/features/agent/stores/emergency-call-store';
import { useMentionNotificationStore } from '@/features/agent/stores/mention-notification-store';
import { useAuthStore } from '@/shared/stores/auth-store';

interface AgentLayoutProps {
  children: React.ReactNode;
}

const AgentLayout: React.FC<AgentLayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation('agent');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [incomingCall, setIncomingCall] = useState<VoiceCall | null>(null);
  const [activeCall, setActiveCall] = useState<VoiceCall | null>(null);
  const [expandedCall, setExpandedCall] = useState<EmergencyCall | null>(null);
  const [mediaState, setMediaState] = useState<CallMediaState>({
    audio: { muted: false, volume: 80 },
    recording: { isRecording: false },
    connection: { quality: 'excellent', latency: 45, packetLoss: 0.1 },
  });

  const { status: agentStatus } = useAgentStatusStore();
  const { activeCall: emergencyCall, acceptCall, rejectCall, dismissCall, isRinging, currentAgentName, triggerEmergencyCall } = useEmergencyCallStore();
  const { activeToast, dismissToast } = useMentionNotificationStore();
  const { user } = useAuthStore();

  // Current agent name from auth store
  const myAgentName = user?.name || 'Agent';

  // Helper: Convert emergency sentiment to voice call sentiment
  const mapSentiment = (sentiment?: 'angry' | 'frustrated' | 'neutral' | 'happy'): 'positive' | 'neutral' | 'negative' => {
    switch (sentiment) {
      case 'happy': return 'positive';
      case 'angry': case 'frustrated': return 'negative';
      default: return 'neutral';
    }
  };

  // Helper: Convert emergency priority to voice call priority
  const mapPriority = (priority: 'critical' | 'urgent' | 'high' | 'medium' | 'low'): 'low' | 'normal' | 'high' | 'urgent' => {
    if (priority === 'critical') return 'urgent';
    if (priority === 'urgent') return 'urgent';
    if (priority === 'high') return 'high';
    if (priority === 'medium') return 'normal';
    if (priority === 'low') return 'low';
    return 'normal';
  };

  // Convert EmergencyCall to VoiceCall format for AgentIncomingCallAlert
  // Memoized to prevent unnecessary re-renders when emergency call data changes
  const emergencyCallAsVoice: VoiceCall | null = React.useMemo(() => {
    if (!emergencyCall) return null;
    
    return {
      id: emergencyCall.id,
      tenantId: user?.tenantId || '', // ✅ From auth store
      caller: {
        id: emergencyCall.id,
        name: emergencyCall.customerName,
        phoneNumber: emergencyCall.customerPhone || '',
        avatar: emergencyCall.customerAvatar,
        role: 'customer' as const,
      },
      callee: {
        id: 'agent-current',
        name: myAgentName,
        phoneNumber: '',
        role: 'agent' as const,
      },
      callType: 'inbound',
      startedAt: emergencyCall.timestamp.toISOString(),
      status: isRinging ? 'ringing' : 'connected',
      metadata: {
        priority: mapPriority(emergencyCall.priority),
        notes: emergencyCall.reason,
      },
      aiHandling: {
        isHandledByAI: true,
        aiStuckReason: emergencyCall.reason || 'AI yardım istiyor',
        aiDuration: emergencyCall.metadata?.waitingTime || 0,
        aiSummary: {
          conversationContext: emergencyCall.messages.map(m => `${m.senderName}: ${m.content}`).join('\n'),
          stuckReason: emergencyCall.reason || 'AI konuşmayı ilerleteemedi',
          customerIntent: emergencyCall.metadata?.tags?.join(', ') || 'Detaylı bilgi gerekiyor',
          sentiment: mapSentiment(emergencyCall.metadata?.customerSentiment),
          previousInteractions: emergencyCall.metadata?.aiAttempts || 0,
          lastInteractionDate: formatDate(emergencyCall.timestamp, i18n.language),
          quickNotes: emergencyCall.metadata?.tags || [],
          // NOTE: Simulation data - will be replaced by backend API response in production
          suggestedResponse: 'Müşteri ile doğrudan iletişime geçin ve sorununu çözün.',
          keyTopics: emergencyCall.metadata?.tags || [],
          customerIssues: [emergencyCall.reason || 'Genel destek talebi'],
          aiAttempts: emergencyCall.metadata?.aiAttempts || 0,
        },
      },
    };
  }, [emergencyCall, isRinging, user?.tenantId, myAgentName, i18n.language]);

  // DEBUG: Log emergency call state
  React.useEffect(() => {
    if (import.meta.env.DEV) {
      logger.debug('🔍 [AGENT LAYOUT] Emergency call state changed:', {
        hasEmergencyCall: !!emergencyCall,
        emergencyCall: emergencyCall ? {
          id: emergencyCall.id,
          customerName: emergencyCall.customerName,
          isRinging
        } : null,
        hasEmergencyCallAsVoice: !!emergencyCallAsVoice
      });
    }
  }, [emergencyCall, isRinging, emergencyCallAsVoice]);

  // Status configuration with i18n support
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
    <div 
      className="relative flex h-auto min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200" 
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      {/* ✅ ACCESSIBILITY: Skip to content link for keyboard navigation */}
      <SkipToContent />
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div className={`
        fixed top-0 left-0 h-full w-72 z-50 transform transition-transform duration-300 lg:hidden
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="bg-white dark:bg-slate-800 h-full shadow-2xl overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Menü</h2>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              aria-label={t('layout.closeMenu')}
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <AgentSidebar 
            onItemClick={() => setIsMobileSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Main Layout Container */}
      <div className="layout-container flex h-full grow flex-col">
        {/* Mobile Header with Full Features */}
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
              <h1 className="text-sm font-bold text-gray-900 dark:text-gray-100">{myAgentName} - AsistanApp</h1>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1">
              {/* Status Badge - Read-only (Controlled from Sidebar) */}
              <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg ${currentStatus.bgColor}`}>
                <StatusIcon className={`w-3.5 h-3.5 ${currentStatus.iconColor}`} />
                <span className={`text-xs font-semibold ${currentStatus.textColor}`}>
                  {currentStatus.label}
                </span>
              </div>

              {/* 🧪 DEV ONLY: Call Simulators for Testing */}
              {import.meta.env.DEV && (
                <div className="flex items-center gap-1">
                  {/* Normal Call Simulator */}
                  <button
                    onClick={() => {
                      const testCall: EmergencyCall = {
                        id: `normal-call-${Date.now()}`,
                        customerName: 'Mehmet Demir',
                        customerPhone: '+90 532 999 8877',
                        conversationId: `conv-${Date.now()}`,
                        priority: 'high',
                        reason: 'Genel bilgi talebi',
                        timestamp: new Date(),
                        messages: [{ id: '1', sender: 'customer', senderName: 'Mehmet Demir', content: 'Çalışma saatlerinizi öğrenebilir miyim?', timestamp: new Date() }],
                        metadata: { aiAttempts: 1, waitingTime: 30, customerSentiment: 'neutral', tags: ['bilgi'] },
                      };
                      triggerEmergencyCall(testCall);
                      logger.debug('🧪 [DEV] Normal call triggered', { testCall });
                    }}
                    className="p-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-all"
                    title="🧪 DEV: Normal Call Test"
                  >
                    <PhoneIncoming className="w-4 h-4" />
                  </button>

                  {/* Emergency Call Simulator */}
                  <button
                    onClick={() => {
                      const testCall: EmergencyCall = {
                        id: `urgent-call-${Date.now()}`,
                        customerName: 'Ayşe Yılmaz',
                        customerPhone: '+90 555 123 4567',
                        conversationId: `conv-${Date.now()}`,
                        priority: 'urgent',
                        reason: 'Müşteri ödeme sorunu yaşıyor',
                        timestamp: new Date(),
                        messages: [{ id: '1', sender: 'customer', senderName: 'Ayşe Yılmaz', content: 'Acil yardım!', timestamp: new Date() }],
                        metadata: { aiAttempts: 3, waitingTime: 120, customerSentiment: 'frustrated', tags: ['acil'] },
                      };
                      triggerEmergencyCall(testCall);
                      logger.debug('🧪 [DEV] Emergency call triggered', { testCall });
                    }}
                    className="p-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-md transition-all animate-pulse"
                    title="🧪 DEV: Emergency Call Test"
                  >
                    <PhoneIncoming className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Notifications */}
              <button 
                onClick={() => setShowNotifications(true)}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                aria-label={t('layout.notifications')}
              >
                <Bell className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
              </button>

              {/* Theme Switcher */}
              <ThemeSwitcher />
            </div>
          </div>

          {/* Notification Center Modal */}
          {showNotifications && (
            <NotificationCenter onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* Desktop Layout */}
        <div className="gap-1 px-2 sm:px-4 lg:px-6 flex flex-1 justify-center py-2 lg:py-5">
          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="layout-content-container flex-col flex-shrink-0 hidden lg:flex">
            <AgentSidebar 
              isCollapsed={isCollapsed}
              onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            />
          </div>

          {/* Main Content - Full width on mobile, flex on desktop */}
          <div className="layout-content-container flex flex-col flex-1 min-w-0 w-full">
            {/* Desktop Header - Hidden on mobile */}
            <div className="hidden lg:block">
              <AgentHeader />
            </div>
            
            {/* Page Content */}
            <div id="main-content" className="flex-1" tabIndex={-1}>
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Call Alert - FULL SCREEN RED (urgent/critical only) */}
      {emergencyCall && isRinging && (emergencyCall.priority === 'urgent' || emergencyCall.priority === 'critical') && emergencyCallAsVoice && (
        <AgentIncomingCallAlert
          call={emergencyCallAsVoice}
          onAccept={() => {
            acceptCall(myAgentName);
          }}
          onReject={() => {
            rejectCall('Agent meşgul');
          }}
          takenByOtherAgent={
            emergencyCall?.takenBy && emergencyCall.takenBy.agentName !== myAgentName
              ? {
                  name: emergencyCall.takenBy.agentName,
                  timestamp: emergencyCall.takenBy.takenAt
                }
              : undefined
          }
        />
      )}

      {/* Normal Incoming Call - POP-UP NOTIFICATION (high/medium/low) */}
      {emergencyCall && !expandedCall && isRinging && (emergencyCall.priority === 'high' || emergencyCall.priority === 'medium' || emergencyCall.priority === 'low') && emergencyCallAsVoice && (
        <AgentCallNotification
          call={emergencyCallAsVoice}
          onAccept={() => {
            acceptCall(myAgentName);
          }}
          onReject={() => {
            rejectCall('Agent meşgul');
          }}
          onDismiss={() => {
            dismissCall();
          }}
          onExpand={() => {
            setExpandedCall(emergencyCall);
          }}
        />
      )}

      {/* Expanded Normal Call - FULL SCREEN (like urgent call UI) */}
      {expandedCall && isRinging && (expandedCall.priority === 'high' || expandedCall.priority === 'medium' || expandedCall.priority === 'low') && emergencyCallAsVoice && (
        <AgentIncomingCallAlert
          call={emergencyCallAsVoice}
          onAccept={() => {
            acceptCall(myAgentName);
            setExpandedCall(null);
          }}
          onReject={() => {
            rejectCall('Agent meşgul');
            setExpandedCall(null);
          }}
        />
      )}

      {/* Regular Incoming Call Alert (Old UI for non-emergency calls) */}
      {incomingCall && !activeCall && !emergencyCall && (
        <AgentIncomingCallAlert
          call={incomingCall}
          onAccept={() => {
            setActiveCall(incomingCall);
            setIncomingCall(null);
          }}
          onReject={() => {
            setIncomingCall(null);
          }}
        />
      )}

      {/* Active Call Screen */}
      {activeCall && (
        <ActiveCallScreen
          call={activeCall}
          mediaState={mediaState}
          onToggleMute={() => {
            setMediaState((prev) => ({
              ...prev,
              audio: { ...prev.audio, muted: !prev.audio.muted },
            }));
          }}
          onToggleSpeaker={() => {
            setMediaState((prev) => ({
              ...prev,
              audio: { ...prev.audio, volume: prev.audio.volume > 0 ? 0 : 80 },
            }));
          }}
          onHold={() => {
            setActiveCall({ ...activeCall, status: 'on_hold' });
          }}
          onResume={() => {
            setActiveCall({ ...activeCall, status: 'connected' });
          }}
          onTransfer={() => {
            {/* ✅ Transfer Modal: Will be implemented in Phase 3 with full transfer workflow */}
          }}
          onEndCall={() => {
            setActiveCall(null);
          }}
        />
      )}

      {/* Mention Toast - Bottom Right Notification */}
      {activeToast && (
        <MentionToast
          channelId={activeToast.channelId}
          messageId={activeToast.messageId}
          channelName={activeToast.channelName}
          mentionedBy={activeToast.mentionedBy}
          message={activeToast.message}
          onDismiss={dismissToast}
        />
      )}
    </div>
  );
};

export default AgentLayout;

