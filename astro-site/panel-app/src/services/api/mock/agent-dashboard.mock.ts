/**
 * Mock Data for Agent Dashboard API
 * Used when API_CONFIG.USE_MOCK_DATA is true
 */

import { mockDelay } from '../config';
import { 
  mockAgentStats,
  mockAgentQueue,
  mockAgentActiveConversations,
  mockAgentPerformanceToday,
  mockQuickReplies
} from '@/data/mocks';

/**
 * Mock API implementations for Agent Dashboard
 */
export const mockAgentDashboardApi = {
  async getAgentStats() {
    await mockDelay();
    return mockAgentStats;
  },

  async getQueue() {
    await mockDelay();
    return mockAgentQueue;
  },

  async getActiveConversations() {
    await mockDelay();
    return mockAgentActiveConversations;
  },

  async getPerformanceToday() {
    await mockDelay();
    return mockAgentPerformanceToday;
  },

  async getQuickReplies() {
    await mockDelay();
    return mockQuickReplies;
  },

  async acceptConversation(conversationId: string) {
    await mockDelay();
    return {
      success: true,
      conversationId,
      message: 'Görüşme başarıyla alındı'
    };
  },

  async setAgentStatus(status: 'online' | 'away' | 'busy' | 'offline') {
    await mockDelay(500);
    return {
      success: true,
      status,
      timestamp: new Date().toISOString()
    };
  },

  async sendQuickReply(conversationId: string, replyId: string) {
    await mockDelay();
    const reply = mockQuickReplies.find(r => r.id === replyId);
    return {
      success: true,
      conversationId,
      message: reply?.content || 'Mesaj gönderildi',
      timestamp: new Date().toISOString()
    };
  }
};
