/**
 * Agent Panel API Service
 * All backend API calls for agent panel
 * 
 * @module services/api/agent
 */

import { apiClient } from '@/lib/api/client';
import type { Conversation, Message, AgentStats } from '@/types';

// ==================== DASHBOARD ====================

export const agentDashboardApi = {
  /**
   * Get agent dashboard statistics
   */
  async getStats() {
    const response = await apiClient.get<AgentStats>('/agent/dashboard/stats');
    return response.data;
  },

  /**
   * Get agent activities
   */
  async getActivities(limit: number = 10) {
    const response = await apiClient.get('/agent/dashboard/activities', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get agent performance
   */
  async getPerformance(dateRange: string = '7d') {
    const response = await apiClient.get('/agent/dashboard/performance', {
      params: { dateRange },
    });
    return response.data;
  },
};

// ==================== CONVERSATIONS ====================

export const agentConversationsApi = {
  /**
   * Get conversations assigned to agent
   */
  async getConversations(filters?: {
    status?: 'waiting' | 'assigned' | 'resolved';
    priority?: 'high' | 'medium' | 'low';
    channel?: string;
    search?: string;
    assigned?: 'me' | 'all';
  }) {
    const response = await apiClient.get<Conversation[]>('/agent/conversations', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get single conversation with messages
   */
  async getConversation(conversationId: string) {
    const response = await apiClient.get<Conversation & { messages: Message[] }>(
      `/agent/conversations/${conversationId}`
    );
    return response.data;
  },

  /**
   * Take over conversation from AI
   */
  async takeOver(conversationId: string) {
    const response = await apiClient.post(
      `/agent/conversations/${conversationId}/takeover`
    );
    return response.data;
  },

  /**
   * Send message
   */
  async sendMessage(conversationId: string, content: string, attachments?: string[]) {
    const response = await apiClient.post<Message>(
      `/agent/conversations/${conversationId}/messages`,
      {
        content,
        attachments,
      }
    );
    return response.data;
  },

  /**
   * Resolve conversation
   */
  async resolveConversation(conversationId: string, resolution?: string) {
    const response = await apiClient.post(
      `/agent/conversations/${conversationId}/resolve`,
      { resolution }
    );
    return response.data;
  },

  /**
   * Add note to conversation
   */
  async addNote(conversationId: string, note: string) {
    const response = await apiClient.post(
      `/agent/conversations/${conversationId}/notes`,
      { note }
    );
    return response.data;
  },

  /**
   * Add tags to conversation
   */
  async addTags(conversationId: string, tags: string[]) {
    const response = await apiClient.post(
      `/agent/conversations/${conversationId}/tags`,
      { tags }
    );
    return response.data;
  },

  /**
   * Transfer conversation to another agent
   */
  async transferConversation(conversationId: string, targetAgentId: string, note?: string) {
    const response = await apiClient.post(
      `/agent/conversations/${conversationId}/transfer`,
      {
        targetAgentId,
        note,
      }
    );
    return response.data;
  },

  /**
   * Get conversation history
   */
  async getConversationHistory(customerId: string) {
    const response = await apiClient.get<Conversation[]>(
      `/agent/conversations/history/${customerId}`
    );
    return response.data;
  },

  /**
   * Mark conversation as read
   */
  async markAsRead(conversationId: string) {
    const response = await apiClient.post(
      `/agent/conversations/${conversationId}/read`
    );
    return response.data;
  },

  /**
   * Send typing indicator
   */
  async sendTypingIndicator(conversationId: string, isTyping: boolean) {
    const response = await apiClient.post(
      `/agent/conversations/${conversationId}/typing`,
      { isTyping }
    );
    return response.data;
  },
};

// ==================== PROFILE ====================

export const agentProfileApi = {
  /**
   * Get agent profile
   */
  async getProfile() {
    const response = await apiClient.get('/agent/profile');
    return response.data;
  },

  /**
   * Update agent profile
   */
  async updateProfile(data: {
    name?: string;
    email?: string;
    phone?: string;
    bio?: string;
    avatar?: string;
    skills?: string[];
    languages?: string[];
  }) {
    const response = await apiClient.put('/agent/profile', data);
    return response.data;
  },

  /**
   * Update agent status
   */
  async updateStatus(status: 'available' | 'busy' | 'away' | 'offline') {
    const response = await apiClient.put('/agent/profile/status', { status });
    return response.data;
  },

  /**
   * Upload avatar
   */
  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post('/agent/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get agent statistics
   */
  async getStatistics(dateRange: string = '30d') {
    const response = await apiClient.get('/agent/profile/statistics', {
      params: { dateRange },
    });
    return response.data;
  },
};

// ==================== AI CHAT ====================

export const agentAIChatApi = {
  /**
   * Send message to AI assistant
   */
  async sendMessage(message: string, context?: Record<string, any>) {
    const response = await apiClient.post('/agent/ai-chat/messages', {
      message,
      context,
    });
    return response.data;
  },

  /**
   * Get AI suggestions for current conversation
   */
  async getSuggestions(conversationId: string) {
    const response = await apiClient.get(`/agent/ai-chat/suggestions/${conversationId}`);
    return response.data;
  },

  /**
   * Get AI response for specific query
   */
  async getAIResponse(query: string, conversationId?: string) {
    const response = await apiClient.post('/agent/ai-chat/response', {
      query,
      conversationId,
    });
    return response.data;
  },

  /**
   * Get chat history with AI
   */
  async getChatHistory(limit: number = 50) {
    const response = await apiClient.get('/agent/ai-chat/history', {
      params: { limit },
    });
    return response.data;
  },
};

// ==================== VOICE CALLS ====================

export const agentVoiceApi = {
  /**
   * Initiate call
   */
  async initiateCall(conversationId: string, phoneNumber: string) {
    const response = await apiClient.post('/agent/voice/calls/initiate', {
      conversationId,
      phoneNumber,
    });
    return response.data;
  },

  /**
   * Answer incoming call
   */
  async answerCall(callId: string) {
    const response = await apiClient.post(`/agent/voice/calls/${callId}/answer`);
    return response.data;
  },

  /**
   * End call
   */
  async endCall(callId: string) {
    const response = await apiClient.post(`/agent/voice/calls/${callId}/end`);
    return response.data;
  },

  /**
   * Transfer call
   */
  async transferCall(callId: string, targetAgentId: string) {
    const response = await apiClient.post(`/agent/voice/calls/${callId}/transfer`, {
      targetAgentId,
    });
    return response.data;
  },

  /**
   * Get call history
   */
  async getCallHistory(filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await apiClient.get('/agent/voice/calls/history', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get call recording
   */
  async getCallRecording(callId: string) {
    const response = await apiClient.get(`/agent/voice/calls/${callId}/recording`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// ==================== QUICK ACTIONS ====================

export const agentQuickActionsApi = {
  /**
   * Get saved quick replies
   */
  async getQuickReplies() {
    const response = await apiClient.get('/agent/quick-actions/replies');
    return response.data;
  },

  /**
   * Save quick reply
   */
  async saveQuickReply(data: { title: string; content: string; category?: string }) {
    const response = await apiClient.post('/agent/quick-actions/replies', data);
    return response.data;
  },

  /**
   * Delete quick reply
   */
  async deleteQuickReply(replyId: string) {
    const response = await apiClient.delete(`/agent/quick-actions/replies/${replyId}`);
    return response.data;
  },

  /**
   * Get templates
   */
  async getTemplates(category?: string) {
    const response = await apiClient.get('/agent/quick-actions/templates', {
      params: { category },
    });
    return response.data;
  },
};

// ==================== NOTIFICATIONS ====================

export const agentNotificationsApi = {
  /**
   * Get notifications
   */
  async getNotifications(limit: number = 20) {
    const response = await apiClient.get('/agent/notifications', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string) {
    const response = await apiClient.post(`/agent/notifications/${notificationId}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    const response = await apiClient.post('/agent/notifications/read-all');
    return response.data;
  },

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string) {
    const response = await apiClient.delete(`/agent/notifications/${notificationId}`);
    return response.data;
  },
};

