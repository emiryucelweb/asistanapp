/**
 * useStreamingChat Hook (Panel Version)
 * React hook for consuming Server-Sent Events from AI chat streaming endpoint
 * 
 * Features:
 * - Real-time token streaming
 * - Auto-reconnect on error
 * - Fallback to non-streaming
 * - Loading states
 * - Error handling
 * - Panel-specific auth handling
 * 
 * @author AsistanApp Team
 * @date 2025-10-01
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { logger } from '@/shared/utils/logger';
import { useAuthStore } from '@/shared/stores/auth-store';

export interface StreamingMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  timestamp: Date;
  metadata?: {
    language?: string;
    sentiment?: string;
    model?: string;
    tokensUsed?: number;
    processingTime?: number;
  };
}

export interface UseStreamingChatOptions {
  conversationId: string;
  customerId: string;
  onError?: (error: Error) => void;
  onComplete?: (message: StreamingMessage) => void;
  maxReconnectAttempts?: number;
  enableFallback?: boolean;
}

export interface UseStreamingChatReturn {
  messages: StreamingMessage[];
  streamingMessage: StreamingMessage | null;
  isStreaming: boolean;
  error: Error | null;
  sendMessage: (text: string, language?: string) => Promise<void>;
  cancelStream: () => void;
  clearMessages: () => void;
}

export function useStreamingChat(options: UseStreamingChatOptions): UseStreamingChatReturn {
  const {
    conversationId,
    customerId,
    onError,
    onComplete,
    maxReconnectAttempts = 3,
    enableFallback = true,
  } = options;

  const token = useAuthStore((state) => state.token); // Panel-specific auth store
  const [messages, setMessages] = useState<StreamingMessage[]>([]);
  const [streamingMessage, setStreamingMessage] = useState<StreamingMessage | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);

  // Cleanup EventSource on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  const cancelStream = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsStreaming(false);
    setStreamingMessage(null);
  }, []);

  const sendMessageViaFallback = useCallback(async (text: string, language?: string) => {
    try {
      const response = await fetch('/api/ai-chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId,
          customerId,
          message: text,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      const assistantMessage: StreamingMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: data.data.message,
        timestamp: new Date(),
        metadata: data.data.metadata,
      };

      setMessages(prev => [...prev, assistantMessage]);
      onComplete?.(assistantMessage);

    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
      throw error;
    }
  }, [token, conversationId, customerId, onComplete, onError]);

  const sendMessage = useCallback(async (text: string, language?: string) => {
    try {
      setError(null);
      
      // Close any existing stream before starting new one
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      
      // Add user message
      const userMessage: StreamingMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Initialize streaming message
      const initialStreamingMessage: StreamingMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: '',
        isStreaming: true,
        timestamp: new Date(),
      };
      setStreamingMessage(initialStreamingMessage);
      setIsStreaming(true);

      // Build SSE URL with auth token
      const params = new URLSearchParams({
        conversationId,
        customerId,
        message: text,
        ...(language && { language }),
      });

      // ⚠️ EventSource doesn't support custom headers, so we append token to URL
      // Alternative: Use fetch + ReadableStream or server-side cookie auth
      const streamUrl = `/api/ai-chatbot/chat/stream?${params}&token=${token}`;
      
      // Create EventSource
      const eventSource = new EventSource(streamUrl);
      eventSourceRef.current = eventSource;

      let fullText = '';
      let metadata: StreamingMessage['metadata'] = {};

      eventSource.addEventListener('connected', (e) => {
        try {
          const data = JSON.parse(e.data);
          logger.debug('[SSE] Connected:', data);
          reconnectAttemptsRef.current = 0;
        } catch (parseError) {
          logger.error('[SSE] Failed to parse connected event:', parseError);
        }
      });

      eventSource.addEventListener('metadata', (e) => {
        try {
          const data = JSON.parse(e.data);
          metadata = { ...metadata, ...data };
        } catch (parseError) {
          logger.error('[SSE] Failed to parse metadata event:', parseError);
        }
      });

      eventSource.addEventListener('token', (e) => {
        try {
          if (!e.data) {
            logger.warn('[SSE] Received empty token data');
            return;
          }
          const data = JSON.parse(e.data);
          fullText = data.fullText ?? fullText;

          setStreamingMessage(prev => prev ? {
            ...prev,
            content: fullText,
          } : null);
        } catch (parseError) {
          logger.error('[SSE] Failed to parse token event:', parseError);
          // Continue streaming - don't break on parse error
        }
      });

      eventSource.addEventListener('done', (e) => {
        try {
          const data = JSON.parse(e.data);
          fullText = data.fullText ?? fullText;
          metadata = { ...metadata, ...(data.metadata || {}) };

          const finalMessage: StreamingMessage = {
            ...initialStreamingMessage,
            content: fullText,
            isStreaming: false,
            metadata,
          };

          setMessages(prev => [...prev, finalMessage]);
          setStreamingMessage(null);
          setIsStreaming(false);

          eventSource.close();
          eventSourceRef.current = null;

          onComplete?.(finalMessage);
        } catch (parseError) {
          logger.error('[SSE] Failed to parse done event:', parseError);
          // Still close the stream on parse error
          setStreamingMessage(null);
          setIsStreaming(false);
          eventSource.close();
          eventSourceRef.current = null;
        }
      });

      eventSource.addEventListener('error', (e) => {
        logger.error('[SSE] Error:', e);
        
        const err = new Error('Stream connection error');
        setError(err);
        onError?.(err);

        eventSource.close();
        eventSourceRef.current = null;

        // Retry logic
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          logger.debug(`[SSE] Reconnecting (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`);
          
          setTimeout(() => {
            sendMessage(text, language);
          }, 1000 * Math.pow(2, reconnectAttemptsRef.current - 1));
        } else if (enableFallback) {
          logger.debug('[SSE] Max reconnect attempts reached, falling back to non-streaming');
          setStreamingMessage(null);
          setIsStreaming(false);
          sendMessageViaFallback(text, language);
        } else {
          setStreamingMessage(null);
          setIsStreaming(false);
        }
      });

    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
      setIsStreaming(false);
      setStreamingMessage(null);
    }
  }, [
    token,
    conversationId,
    customerId,
    maxReconnectAttempts,
    enableFallback,
    onError,
    onComplete,
    sendMessageViaFallback,
  ]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setStreamingMessage(null);
    setError(null);
  }, []);

  return {
    messages,
    streamingMessage,
    isStreaming,
    error,
    sendMessage,
    cancelStream,
    clearMessages,
  };
}

