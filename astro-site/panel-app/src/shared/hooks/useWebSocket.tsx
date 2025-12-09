 

/**
 * WebSocket Hook
 * Real-time notifications
 */
import { useEffect, useCallback } from 'react';
import { logger } from '@/shared/utils/logger';
import { wsClient } from '@/lib/websocket/client';
import toast from 'react-hot-toast';

interface NotificationPayload {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
}

interface ConversationUpdatePayload {
  conversationId: string;
  type: 'new_message' | 'status_change' | 'ai_stuck';
  data: any;
}

export const useWebSocket = () => {
  useEffect(() => {
    // Connect on mount
    const socket = wsClient.connect();

    if (!socket) {
      logger.warn('WebSocket not available');
      return;
    }

    // Listen for real-time notifications
    socket.on('notification', (payload: NotificationPayload) => {
      logger.debug('📬 New notification:', payload);
      
      switch (payload.type) {
        case 'success':
          toast.success(payload.message, { duration: 4000 });
          break;
        case 'error':
          toast.error(payload.message, { duration: 5000 });
          break;
        case 'warning':
          toast.custom(
            (_t) => (
              <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 rounded-lg p-4 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="text-orange-500">⚠️</div>
                  <div>
                    <p className="font-semibold text-orange-900 dark:text-orange-100">{payload.title}</p>
                    <p className="text-sm text-orange-700 dark:text-orange-300">{payload.message}</p>
                  </div>
                </div>
              </div>
            ),
            { duration: 6000 }
          );
          break;
        default:
          toast(payload.message, { duration: 4000 });
      }
    });

    // Listen for conversation updates
    socket.on('conversation:update', (payload: ConversationUpdatePayload) => {
      logger.debug('💬 Conversation update:', payload);
      // Future: Update conversation state
    });

    // Listen for new messages
    socket.on('message:new', (payload: any) => {
      logger.debug('📨 New message:', payload);
      // Future: Update messages state
    });

    // Cleanup on unmount
    return () => {
      socket.off('notification');
      socket.off('conversation:update');
      socket.off('message:new');
    };
  }, []);

  const sendMessage = useCallback((event: string, data: any) => {
    wsClient.emit(event, data);
  }, []);

  return { sendMessage };
};


