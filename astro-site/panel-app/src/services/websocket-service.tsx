 

/* =========================================
   Frontend WebSocket Client Service
   Real-time communication with backend
========================================= */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '@/shared/stores/auth-store';
import useNotificationStore from '@/shared/stores/notification-store';
import { logger } from '@/shared/utils/logger';

// ===========================================
// 🏗️ TYPES & INTERFACES
// ===========================================

export type WSEventType = 
  | 'connection_established'
  | 'message_received'
  | 'message_sent' 
  | 'typing_start'
  | 'typing_stop'
  | 'agent_status_change'
  | 'conversation_assigned'
  | 'conversation_transferred'
  | 'conversation_closed'
  | 'dashboard_update'
  | 'notification';

export interface WSMessage {
  type: WSEventType;
  tenantId: string;
  userId: string;
  conversationId?: string;
  agentId?: string;
  data: any;
  timestamp: number;
}

export interface AgentStatus {
  agentId: string;
  tenantId: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  currentConversations: string[];
  lastSeen: number;
  deviceInfo?: {
    userAgent: string;
    ip: string;
  };
}

export interface ConnectionStatus {
  isConnected: boolean;
  isConnecting: boolean;
  reconnectAttempts: number;
  lastConnected?: number;
  error?: string;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  agentId?: string;
  userName: string;
  startedAt: number;
}

// ===========================================
// 🌐 WEBSOCKET CLIENT SERVICE
// ===========================================

class WebSocketClientService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectInterval = 1000;
  private isConnecting = false;
  private connectionStatus: ConnectionStatus = {
    isConnected: false,
    isConnecting: false,
    reconnectAttempts: 0,
  };
  private messageHandlers = new Map<string, ((message: WSMessage) => void)[]>();
  private statusChangeHandlers: ((status: ConnectionStatus) => void)[] = [];
  private typingIndicators = new Map<string, TypingIndicator[]>(); // conversationId -> indicators
  private heartbeatInterval: NodeJS.Timeout | null = null;

  // ===========================================
  // 🔌 CONNECTION MANAGEMENT
  // ===========================================

  connect(token: string, tenantId: string, userId: string, agentId?: string) {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;
    this.updateConnectionStatus({ isConnecting: true, error: undefined });

    // Build WebSocket URL with auth params
    const baseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
    const wsUrl = new URL('/v1/ws', baseUrl);
    wsUrl.searchParams.set('token', token);
    wsUrl.searchParams.set('tenantId', tenantId);
    
    try {
      this.ws = new WebSocket(wsUrl.toString());
      
      this.ws.onopen = () => {
        logger.websocket('WebSocket connected successfully');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.updateConnectionStatus({ 
          isConnected: true, 
          isConnecting: false, 
          reconnectAttempts: 0,
          lastConnected: Date.now(),
        });
        
        // Start heartbeat
        this.startHeartbeat();
        
        // Send agent status if available
        if (agentId) {
          this.sendAgentStatus('online');
        }
      };
      
      this.ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          logger.error('Failed to parse WebSocket message', error as Error, { raw: event.data });
        }
      };
      
      this.ws.onclose = (event) => {
        logger.websocket('WebSocket disconnected', { code: event.code, reason: event.reason });
        this.isConnecting = false;
        this.updateConnectionStatus({ 
          isConnected: false, 
          isConnecting: false,
          error: event.reason || 'Connection closed',
        });
        
        this.stopHeartbeat();
        
        // Auto-reconnect for unexpected closures
        if (event.code !== 1000) { // Not normal closure
          this.scheduleReconnect(token, tenantId, userId, agentId);
        }
      };
      
      this.ws.onerror = (error) => {
        logger.error('WebSocket error', new Error('WebSocket error'), { error });
        this.isConnecting = false;
        this.updateConnectionStatus({ 
          isConnecting: false,
          error: 'Connection error',
        });
      };
    } catch (error) {
      logger.error('Failed to create WebSocket connection', error as Error);
      this.isConnecting = false;
      this.updateConnectionStatus({ 
        isConnecting: false,
        error: 'Failed to create connection',
      });
    }
  }

  private scheduleReconnect(token: string, tenantId: string, userId: string, agentId?: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts);
      
      setTimeout(() => {
        this.reconnectAttempts++;
        logger.websocket('Reconnecting', { attempt: this.reconnectAttempts, max: this.maxReconnectAttempts });
        this.updateConnectionStatus({ 
          reconnectAttempts: this.reconnectAttempts,
        });
        this.connect(token, tenantId, userId, agentId);
      }, delay);
    } else {
      logger.error('Max reconnect attempts reached', new Error('Max reconnect attempts'));
      this.updateConnectionStatus({ 
        error: 'Max reconnect attempts reached',
      });
    }
  }

  disconnect() {
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    
    this.updateConnectionStatus({ 
      isConnected: false, 
      isConnecting: false,
    });
    
    // Clear typing indicators
    this.typingIndicators.clear();
  }

  // ===========================================
  // 💓 HEARTBEAT & HEALTH CHECK
  // ===========================================

  private startHeartbeat() {
    this.stopHeartbeat();
    
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      }
    }, 30000); // Every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // ===========================================
  // 📨 MESSAGE HANDLING
  // ===========================================

  private handleMessage(message: WSMessage) {
    // Call registered handlers
    const handlers = this.messageHandlers.get(message.type) || [];
    handlers.forEach(handler => handler(message));

    // Built-in message handling
    switch (message.type) {
      case 'connection_established':
        logger.websocket('WebSocket connection established', { data: message.data });
        break;

      case 'notification':
        useNotificationStore.getState().addNotification({
          type: message.data.priority === 'urgent' ? 'error' : 'info',
          title: message.data.title || 'Yeni Bildirim',
          message: message.data.message,
        });
        break;

      case 'message_received':
        this.handleNewMessage(message);
        break;

      case 'typing_start':
        this.handleTypingStart(message);
        break;

      case 'typing_stop':
        this.handleTypingStop(message);
        break;

      case 'agent_status_change':
        this.handleAgentStatusChange(message);
        break;

      case 'conversation_assigned':
        this.handleConversationAssigned(message);
        break;

      case 'dashboard_update':
        // Trigger dashboard refresh
        window.dispatchEvent(new CustomEvent('dashboard_update', { 
          detail: message.data 
        }));
        break;

      default:
        logger.debug('Unknown WebSocket message type', { type: message.type });
    }
  }

  private handleNewMessage(message: WSMessage) {
    // Play notification sound (optional)
    this.playNotificationSound();
    
    // Show browser notification if page is not focused
    if (document.hidden && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Yeni Mesaj', {
        body: message.data.content?.substring(0, 100) || 'Yeni bir mesaj aldınız',
        icon: '/favicon.ico',
        tag: `conversation-${message.conversationId}`,
      });
    }
  }

  private handleTypingStart(message: WSMessage) {
    if (!message.conversationId) return;
    
    const indicators = this.typingIndicators.get(message.conversationId) || [];
    
    // Remove existing indicator for same user
    const filtered = indicators.filter(i => i.userId !== message.userId);
    
    // Add new indicator
    filtered.push({
      conversationId: message.conversationId,
      userId: message.userId,
      agentId: message.agentId,
      userName: message.data.userName || 'Agent',
      startedAt: Date.now(),
    });
    
    this.typingIndicators.set(message.conversationId, filtered);
    
    // Auto-expire after 10 seconds
    setTimeout(() => {
      this.removeTypingIndicator(message.conversationId!, message.userId);
    }, 10000);
  }

  private handleTypingStop(message: WSMessage) {
    if (!message.conversationId) return;
    this.removeTypingIndicator(message.conversationId, message.userId);
  }

  private removeTypingIndicator(conversationId: string, userId: string) {
    const indicators = this.typingIndicators.get(conversationId) || [];
    const filtered = indicators.filter(i => i.userId !== userId);
    
    if (filtered.length === 0) {
      this.typingIndicators.delete(conversationId);
    } else {
      this.typingIndicators.set(conversationId, filtered);
    }
  }

  private handleAgentStatusChange(message: WSMessage) {
    // Broadcast agent status change to components
    window.dispatchEvent(new CustomEvent('agent_status_change', { 
      detail: message.data 
    }));
  }

  private handleConversationAssigned(message: WSMessage) {
    useNotificationStore.getState().addNotification({
      type: 'info',
      title: 'Yeni Sohbet Atandı',
      message: `Size yeni bir sohbet atandı: #${message.conversationId?.substring(0, 8)}`,
    });
  }

  // ===========================================
  // 📤 SENDING MESSAGES
  // ===========================================

  send(message: Partial<WSMessage>) {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      logger.warn('WebSocket not connected, message not sent');
      return false;
    }

    const fullMessage: WSMessage = {
      type: message.type || 'notification',
      tenantId: message.tenantId || '',
      userId: message.userId || '',
      conversationId: message.conversationId,
      agentId: message.agentId,
      data: message.data || {},
      timestamp: Date.now(),
    };

    try {
      this.ws.send(JSON.stringify(fullMessage));
      return true;
    } catch (error) {
      logger.error('Failed to send WebSocket message', error as Error);
      return false;
    }
  }

  // Send typing start
  sendTypingStart(conversationId: string, userName: string) {
    return this.send({
      type: 'typing_start',
      conversationId,
      data: { userName },
    });
  }

  // Send typing stop
  sendTypingStop(conversationId: string) {
    return this.send({
      type: 'typing_stop',
      conversationId,
      data: {},
    });
  }

  // Send agent status
  sendAgentStatus(status: AgentStatus['status']) {
    return this.send({
      type: 'agent_status_change',
      data: { status },
    });
  }

  // Send message
  sendMessage(conversationId: string, content: string, type = 'text') {
    return this.send({
      type: 'message_sent',
      conversationId,
      data: { content, type },
    });
  }

  // ===========================================
  // 👂 EVENT LISTENERS
  // ===========================================

  on(eventType: WSEventType, handler: (message: WSMessage) => void) {
    const handlers = this.messageHandlers.get(eventType) || [];
    handlers.push(handler);
    this.messageHandlers.set(eventType, handlers);
  }

  off(eventType: WSEventType, handler: (message: WSMessage) => void) {
    const handlers = this.messageHandlers.get(eventType) || [];
    const filtered = handlers.filter(h => h !== handler);
    this.messageHandlers.set(eventType, filtered);
  }

  onStatusChange(handler: (status: ConnectionStatus) => void) {
    this.statusChangeHandlers.push(handler);
  }

  offStatusChange(handler: (status: ConnectionStatus) => void) {
    this.statusChangeHandlers = this.statusChangeHandlers.filter(h => h !== handler);
  }

  private updateConnectionStatus(updates: Partial<ConnectionStatus>) {
    this.connectionStatus = { ...this.connectionStatus, ...updates };
    this.statusChangeHandlers.forEach(handler => handler(this.connectionStatus));
  }

  // ===========================================
  // 📊 PUBLIC GETTERS
  // ===========================================

  getConnectionStatus(): ConnectionStatus {
    return { ...this.connectionStatus };
  }

  getTypingIndicators(conversationId: string): TypingIndicator[] {
    return this.typingIndicators.get(conversationId) || [];
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // ===========================================
  // 🎵 UTILITIES
  // ===========================================

  private playNotificationSound() {
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore autoplay restrictions
      });
    } catch (error: unknown) {
      // Ignore sound errors - silent failure for better UX
      logger.debug('Notification sound failed', { error: error instanceof Error ? error.message : String(error) });
    }
  }

  // Request notification permission
  static async requestNotificationPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      return await Notification.requestPermission();
    }
    return 'denied';
  }
}

// ===========================================
// 🎣 REACT HOOKS
// ===========================================

// Singleton instance
const websocketService = new WebSocketClientService();

// Main WebSocket hook
export const useWebSocket = () => {
  const { user, token } = useAuthStore();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    websocketService.getConnectionStatus()
  );

  useEffect(() => {
    const handleStatusChange = (status: ConnectionStatus) => {
      setConnectionStatus(status);
    };

    websocketService.onStatusChange(handleStatusChange);

    // Connect if authenticated
    if (user && token && user.tenantId) {
      websocketService.connect(token, user.tenantId, user.id, user.agentId);
    }

    return () => {
      websocketService.offStatusChange(handleStatusChange);
      websocketService.disconnect();
    };
  }, [user, token]);

  return {
    // Connection
    connectionStatus,
    isConnected: websocketService.isConnected(),
    
    // Messaging
    send: websocketService.send.bind(websocketService),
    sendMessage: websocketService.sendMessage.bind(websocketService),
    sendTypingStart: websocketService.sendTypingStart.bind(websocketService),
    sendTypingStop: websocketService.sendTypingStop.bind(websocketService),
    sendAgentStatus: websocketService.sendAgentStatus.bind(websocketService),
    
    // Event listeners
    on: websocketService.on.bind(websocketService),
    off: websocketService.off.bind(websocketService),
    
    // Utilities
    disconnect: websocketService.disconnect.bind(websocketService),
  };
};

// Typing indicators hook
export const useTypingIndicators = (conversationId: string) => {
  const [indicators, setIndicators] = useState<TypingIndicator[]>([]);

  useEffect(() => {
    const updateIndicators = () => {
      setIndicators(websocketService.getTypingIndicators(conversationId));
    };

    // Set up interval to update indicators
    const interval = setInterval(updateIndicators, 1000);
    
    // Listen for typing events
    const handleTypingStart = (message: WSMessage) => {
      if (message.conversationId === conversationId) {
        updateIndicators();
      }
    };

    const handleTypingStop = (message: WSMessage) => {
      if (message.conversationId === conversationId) {
        updateIndicators();
      }
    };

    websocketService.on('typing_start', handleTypingStart);
    websocketService.on('typing_stop', handleTypingStop);

    // Initial update
    updateIndicators();

    return () => {
      clearInterval(interval);
      websocketService.off('typing_start', handleTypingStart);
      websocketService.off('typing_stop', handleTypingStop);
    };
  }, [conversationId]);

  return indicators;
};

// Agent status hook  
export const useAgentStatus = () => {
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([]);

  useEffect(() => {
    const handleStatusChange = (event: CustomEvent) => {
      // Update agent status in list
      const updatedStatus = event.detail as AgentStatus;
      setAgentStatuses(prev => {
        const filtered = prev.filter(a => a.agentId !== updatedStatus.agentId);
        return [...filtered, updatedStatus];
      });
    };

    window.addEventListener('agent_status_change', handleStatusChange as EventListener);

    return () => {
      window.removeEventListener('agent_status_change', handleStatusChange as EventListener);
    };
  }, []);

  return agentStatuses;
};

export default websocketService;
