import { create } from 'zustand';
import { logger } from '@/shared/utils/logger';

export interface Message {
  id: string;
  sender: 'customer' | 'ai' | 'agent';
  senderName: string;
  content: string;
  timestamp: Date;
  type?: 'text' | 'image' | 'file';
}

export interface EmergencyCall {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAvatar?: string;
  conversationId: string;
  priority: 'critical' | 'urgent' | 'high' | 'medium' | 'low';
  reason?: string;
  timestamp: Date;
  messages: Message[];
  metadata?: {
    aiAttempts?: number;
    waitingTime?: number;
    customerSentiment?: 'angry' | 'frustrated' | 'neutral' | 'happy';
    tags?: string[];
  };
  takenBy?: {
    agentId: string;
    agentName: string;
    takenAt: Date;
  };
}

interface EmergencyCallState {
  activeCall: EmergencyCall | null;
  callQueue: EmergencyCall[];
  isRinging: boolean;
  isMuted: boolean;
  currentAgentName?: string;
  
  // Actions
  triggerEmergencyCall: (call: EmergencyCall) => void;
  acceptCall: (agentName: string) => void;
  rejectCall: (reason?: string) => void;
  dismissCall: () => void;
  toggleMute: () => void;
  clearQueue: () => void;
  setCurrentAgent: (agentName: string) => void;
}

// Selectors (for performance optimization)
export const selectActiveCall = (state: EmergencyCallState) => state.activeCall;
export const selectIsRinging = (state: EmergencyCallState) => state.isRinging;
export const selectCallQueueCount = (state: EmergencyCallState) => state.callQueue.length;
export const selectIsMuted = (state: EmergencyCallState) => state.isMuted;

export const useEmergencyCallStore = create<EmergencyCallState>((set, get) => ({
  activeCall: null,
  callQueue: [],
  isRinging: false,
  isMuted: false,
  currentAgentName: undefined,

  triggerEmergencyCall: (call) => {
    if (import.meta.env.DEV) {
      logger.debug('🚨 [EMERGENCY STORE] triggerEmergencyCall called:', { 
        callId: call.id, 
        customerName: call.customerName,
        currentActiveCall: get().activeCall?.id
      });
    }

    // If there's an active call, add to queue
    const currentCall = get().activeCall;
    if (currentCall) {
      if (import.meta.env.DEV) {
        logger.debug('⚠️ [EMERGENCY STORE] Active call exists, adding to queue');
      }
      set((state) => ({
        callQueue: [...state.callQueue, call],
      }));
      return;
    }

    // Activate new emergency call
    if (import.meta.env.DEV) {
      logger.debug('✅ [EMERGENCY STORE] Emergency call activated, isRinging: true', {
        activeCall: call,
        isRinging: true
      });
    }
    set({
      activeCall: call,
      isRinging: true,
    });

    // Send browser notification
    // Note: Notification text should come from i18n in production, but browser Notification API
    // doesn't have access to React context. Consider using a wrapper component.
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 EMERGENCY CALL!', {
        body: `${call.customerName} needs urgent assistance!`,
        icon: call.customerAvatar || '/emergency-icon.png',
        tag: call.id,
        requireInteraction: true,
      });
    }

    // Vibration (for mobile devices)
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200, 100, 200]);
    }
  },

  acceptCall: (agentName: string) => {
    const call = get().activeCall;
    if (!call) {
      logger.debug('❌ acceptCall: No active call!');
      return;
    }
    
    logger.debug('✅ acceptCall called:', { agentName, callId: call.id });
    
    // Mark call as taken
    const updatedCall = {
      ...call,
      takenBy: {
        agentId: 'current-agent-id', // TODO: Get from auth store in production
        agentName: agentName,
        takenAt: new Date(),
      },
    };

    logger.debug('🔄 Call accepted, redirecting to voice call screen...');
    
    // Update store
    set({ 
      activeCall: updatedCall,
      isRinging: false,
      currentAgentName: agentName
    });

    // Notify API (in production)
    // await api.acceptEmergencyCall(call.id, agentId);

    // Immediately redirect to voice call screen (connection will happen on screen)
    logger.debug('📞 Redirecting to voice call screen:', { conversationId: call.conversationId });
    window.location.href = `/agent/voice-call/${call.conversationId}`;
    
    // Close modal (no timeout needed since redirect will happen)
    setTimeout(() => {
      set({ activeCall: null });
      
      // If there are other calls in queue, process them
      const queue = get().callQueue;
      if (queue.length > 0) {
        const nextCall = queue[0];
        set({
          callQueue: queue.slice(1),
        });
        get().triggerEmergencyCall(nextCall);
      }
    }, 500);
  },

  rejectCall: (_reason) => {
    const call = get().activeCall;
    if (!call) return;
    
    set({
      activeCall: null,
      isRinging: false,
    });

    // Send rejection info to API (in production)
    // await api.rejectEmergencyCall(call.id, reason);

    // If there are other calls in queue, show them
    const queue = get().callQueue;
    if (queue.length > 0) {
      const nextCall = queue[0];
      set({
        callQueue: queue.slice(1),
      });
      setTimeout(() => {
        get().triggerEmergencyCall(nextCall);
      }, 1000);
    }
  },

  dismissCall: () => {
    set({
      activeCall: null,
      isRinging: false,
    });
  },

  toggleMute: () => {
    set((state) => ({
      isMuted: !state.isMuted,
    }));
  },

  clearQueue: () => {
    set({
      callQueue: [],
    });
  },

  setCurrentAgent: (agentName: string) => {
    set({ currentAgentName: agentName });
  },
}));

