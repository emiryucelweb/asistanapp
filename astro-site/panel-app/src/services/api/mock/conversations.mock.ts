/**
 * Mock Data for Conversations API
 */

import { mockDelay } from '../config';
import { 
  mockConversations, 
  mockConversationMessages, 
  mockConversationStats,
  mockConversationFilters 
} from '@/data/mocks';

export const mockConversationsApi = {
  async getConversations(filters?: any) {
    await mockDelay();
    let filtered = [...mockConversations];
    
    if (filters?.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    if (filters?.channel) {
      filtered = filtered.filter(c => c.channel === filters.channel);
    }
    
    return {
      conversations: filtered,
      total: filtered.length,
      page: 1,
      pageSize: 20
    };
  },

  async getConversationById(id: string) {
    await mockDelay();
    const conversation = mockConversations.find(c => c.id === id);
    return conversation || null;
  },

  async getMessages(conversationId: string) {
    await mockDelay();
    // @ts-ignore
    return mockConversationMessages[conversationId] || [];
  },

  async sendMessage(conversationId: string, message: string) {
    await mockDelay();
    return {
      success: true,
      messageId: `msg-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
  },

  async updateConversationStatus(conversationId: string, status: string) {
    await mockDelay();
    return { success: true, conversationId, status };
  },

  async assignConversation(conversationId: string, agentId: string) {
    await mockDelay();
    return { success: true, conversationId, agentId };
  },

  async getStats() {
    await mockDelay();
    return mockConversationStats;
  },

  async getFilters() {
    await mockDelay();
    return mockConversationFilters;
  }
};
