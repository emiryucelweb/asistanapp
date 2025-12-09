 

import { useState, useCallback, useRef, useEffect } from 'react';
import { logger } from '@/shared/utils/logger';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  confidence?: number;
  intent?: string;
  metadata?: {
    processingTime: number;
    tokensUsed: number;
    model: string;
    language: string;
    sentiment: string;
    entities: Array<{ type: string; value: string; confidence: number }>;
  };
  suggestedActions?: Array<{
    type: string;
    label: string;
    data: any;
  }>;
  requiresHumanHandoff?: boolean;
  escalationReason?: string;
}

interface ChatContext {
  businessType: string;
  department?: string;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  customerData?: {
    name?: string;
    email?: string;
    phone?: string;
    vipStatus?: boolean;
    tags?: string[];
  };
}

interface UseAIChatbotProps {
  conversationId: string;
  customerId: string;
  context?: ChatContext;
  language?: 'tr' | 'en' | 'de' | 'fr' | 'es' | 'auto';
  onHandoffRequired?: (reason: string) => void;
  onActionSuggested?: (actions: AIMessage['suggestedActions']) => void;
  autoSave?: boolean;
}

export const useAIChatbot = ({
  conversationId,
  customerId,
  context,
  language = 'tr',
  onHandoffRequired,
  onActionSuggested,
  autoSave = true
}: UseAIChatbotProps) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [statistics, setStatistics] = useState({
    totalMessages: 0,
    averageConfidence: 0,
    handoffRate: 0,
    averageResponseTime: 0
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const isProcessingRef = useRef(false);

  // Load conversation history
  const loadHistory = useCallback(async () => {
    try {
      const response = await fetch(`/api/ai-chatbot/history/${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setStatistics(data.statistics || statistics);
      }
    } catch (err: unknown) {
      logger.error('Failed to load conversation history:', err);
    }
  }, [conversationId, statistics]);

  // Send message to AI
  const sendMessage = useCallback(async (message: string): Promise<AIMessage | null> => {
    if (!message.trim() || isProcessingRef.current) {
      return null;
    }

    // Add user message immediately
    const userMessage: AIMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);
    setError(null);
    isProcessingRef.current = true;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const startTime = Date.now();

      const response = await fetch('/api/ai-chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          conversationId,
          customerId,
          message: message.trim(),
          language,
          context
        })
      });

      if (!response.ok) {
        throw new Error(`AI Chatbot Error: ${response.statusText}`);
      }

      const data = await response.json();
      const processingTime = Date.now() - startTime;

      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }

      const aiResponse = data.data;

      // Create AI message
      const aiMessage: AIMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: aiResponse.message,
        timestamp: new Date(),
        confidence: aiResponse.confidence,
        intent: aiResponse.intent,
        metadata: {
          ...aiResponse.metadata,
          processingTime
        },
        suggestedActions: aiResponse.suggestedActions,
        requiresHumanHandoff: aiResponse.requiresHumanHandoff,
        escalationReason: aiResponse.escalationReason
      };

      setMessages(prev => [...prev, aiMessage]);

      // Handle callbacks
      if (aiResponse.requiresHumanHandoff && onHandoffRequired) {
        onHandoffRequired(aiResponse.escalationReason || 'AI requested human handoff');
      }

      if (aiResponse.suggestedActions && aiResponse.suggestedActions.length > 0 && onActionSuggested) {
        onActionSuggested(aiResponse.suggestedActions);
      }

      // Update statistics
      setStatistics(prev => ({
        ...prev,
        totalMessages: prev.totalMessages + 1,
        averageConfidence: (prev.averageConfidence + aiResponse.confidence) / 2,
        averageResponseTime: (prev.averageResponseTime + processingTime) / 2
      }));

      // Auto-save if enabled
      if (autoSave) {
        await saveConversation([userMessage, aiMessage]);
      }

      return aiMessage;

    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, don't show error
        return null;
      }

      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      logger.error('AI Chatbot error:', err);
      return null;

    } finally {
      setIsLoading(false);
      setIsTyping(false);
      isProcessingRef.current = false;
      abortControllerRef.current = null;
    }
   
  // TODO: Unknown deps in callback - needs analysis
  }, [conversationId, customerId, language, context, onHandoffRequired, onActionSuggested, autoSave]);

  // Send multiple messages in queue
  const sendMessageQueue = useCallback(async (messageQueue: string[]) => {
    for (const message of messageQueue) {
      await sendMessage(message);
      // Small delay between messages
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }, [sendMessage]);

  // Clear conversation
  const clearConversation = useCallback(async () => {
    try {
      await fetch(`/api/ai-chatbot/context/${conversationId}`, {
        method: 'DELETE'
      });

      setMessages([]);
      setError(null);
      setStatistics({
        totalMessages: 0,
        averageConfidence: 0,
        handoffRate: 0,
        averageResponseTime: 0
      });
    } catch (err: unknown) {
      logger.error('Failed to clear conversation:', err);
    }
  }, [conversationId]);

  // Save conversation to backend
  const saveConversation = useCallback(async (newMessages: AIMessage[]) => {
    try {
      await fetch('/api/ai-chatbot/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          messages: newMessages
        })
      });
    } catch (err: unknown) {
      logger.error('Failed to save conversation:', err);
    }
  }, [conversationId]);

  // Get conversation analytics
  const getAnalytics = useCallback(async () => {
    try {
      const response = await fetch(`/api/ai-chatbot/analytics?conversationId=${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (err: unknown) {
      logger.error('Failed to get analytics:', err);
    }
    return null;
  }, [conversationId]);

  // Retry last message
  const retryLastMessage = useCallback(async () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      // Remove last AI response if exists
      const lastMessageIndex = messages.length - 1;
      if (messages[lastMessageIndex]?.role === 'assistant') {
        setMessages(prev => prev.slice(0, -1));
      }
      
      await sendMessage(lastUserMessage.content);
    }
  }, [messages, sendMessage]);

  // Cancel current request
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Get last AI message
  const getLastAIMessage = useCallback((): AIMessage | null => {
    const aiMessages = messages.filter(m => m.role === 'assistant');
    return aiMessages.length > 0 ? aiMessages[aiMessages.length - 1] : null;
  }, [messages]);

  // Get conversation summary
  const getConversationSummary = useCallback(() => {
    const userMessages = messages.filter(m => m.role === 'user');
    const aiMessages = messages.filter(m => m.role === 'assistant');
    
    const totalConfidence = aiMessages.reduce((sum, msg) => sum + (msg.confidence || 0), 0);
    const averageConfidence = aiMessages.length > 0 ? totalConfidence / aiMessages.length : 0;
    
    const handoffMessages = aiMessages.filter(m => m.requiresHumanHandoff);
    const handoffRate = aiMessages.length > 0 ? handoffMessages.length / aiMessages.length : 0;

    const intents = aiMessages.reduce((acc, msg) => {
      if (msg.intent) {
        acc[msg.intent] = (acc[msg.intent] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalMessages: messages.length,
      userMessages: userMessages.length,
      aiMessages: aiMessages.length,
      averageConfidence,
      handoffRate,
      topIntents: Object.entries(intents)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([intent, count]) => ({ intent, count })),
      duration: messages.length > 0 
        ? new Date(messages[messages.length - 1].timestamp).getTime() - new Date(messages[0].timestamp).getTime()
        : 0
    };
  }, [messages]);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // State
    messages,
    isLoading,
    isTyping,
    error,
    statistics,
    
    // Actions
    sendMessage,
    sendMessageQueue,
    clearConversation,
    retryLastMessage,
    cancelRequest,
    
    // Getters
    getLastAIMessage,
    getConversationSummary,
    getAnalytics,
    
    // Utils
    canSendMessage: !isLoading && !isProcessingRef.current,
    hasMessages: messages.length > 0,
    lastMessageRequiresHandoff: getLastAIMessage()?.requiresHumanHandoff || false
  };
};
