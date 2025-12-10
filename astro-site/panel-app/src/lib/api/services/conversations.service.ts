/**
 * Conversations API Service
 * Handles all conversation-related API calls
 */
import api from '../client';
import { ApiResponse, ListParams } from '../types';
import { isMockMode } from '@/services/api/config';
import { mockConversationsApi } from '@/services/api/mock/conversations.mock';

export interface Conversation {
  id: string;
  channel: 'instagram' | 'whatsapp' | 'facebook' | 'web' | 'phone';
  customerName: string;
  customerAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status: 'active' | 'closed' | 'archived';
  assignedTo: 'ai' | 'human';
  assignedAgent?: string;
  needsHelp: boolean;
  aiStuckReason?: string;
  tags?: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'customer' | 'agent' | 'ai';
  content: string;
  timestamp: Date;
  attachments?: {
    type: 'image' | 'video' | 'file';
    url: string;
    name: string;
  }[];
  read: boolean;
}

export interface CreateMessageDto {
  conversationId: string;
  content: string;
  attachments?: File[];
}

export const conversationsService = {
  /**
   * Get all conversations with filters
   */
  getConversations: async (params?: ListParams): Promise<ApiResponse<Conversation[]>> => {
    if (isMockMode()) {
      const result = await mockConversationsApi.getConversations(params);
      return { success: true, data: result.conversations as unknown as Conversation[] };
    }
    const response = await api.get<ApiResponse<Conversation[]>>('/conversations', { params });
    return response.data;
  },

  /**
   * Get single conversation by ID
   */
  getConversation: async (id: string): Promise<ApiResponse<Conversation>> => {
    if (isMockMode()) {
      const result = await mockConversationsApi.getConversationById(id);
      return { success: true, data: result as unknown as Conversation };
    }
    const response = await api.get<ApiResponse<Conversation>>(`/conversations/${id}`);
    return response.data;
  },

  /**
   * Get messages for a conversation
   */
  getMessages: async (conversationId: string, params?: ListParams): Promise<ApiResponse<Message[]>> => {
    if (isMockMode()) {
      const result = await mockConversationsApi.getMessages(conversationId);
      return { success: true, data: result as unknown as Message[] };
    }
    const response = await api.get<ApiResponse<Message[]>>(`/conversations/${conversationId}/messages`, { params });
    return response.data;
  },

  /**
   * Send a message
   */
  sendMessage: async (dto: CreateMessageDto): Promise<ApiResponse<Message>> => {
    if (isMockMode()) {
      const result = await mockConversationsApi.sendMessage(dto.conversationId, dto.content);
      return { 
        success: true, 
        data: {
          id: result.messageId,
          conversationId: dto.conversationId,
          sender: 'agent',
          content: dto.content,
          timestamp: new Date(),
          read: true
        } as Message
      };
    }
    const formData = new FormData();
    formData.append('content', dto.content);
    formData.append('conversationId', dto.conversationId);
    
    if (dto.attachments) {
      dto.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await api.post<ApiResponse<Message>>('/messages', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Transfer conversation from AI to human
   */
  transferToHuman: async (conversationId: string, agentId?: string): Promise<ApiResponse<Conversation>> => {
    const response = await api.post<ApiResponse<Conversation>>(`/conversations/${conversationId}/transfer`, {
      assignTo: 'human',
      agentId,
    });
    return response.data;
  },

  /**
   * Transfer conversation from human to AI
   */
  transferToAI: async (conversationId: string): Promise<ApiResponse<Conversation>> => {
    const response = await api.post<ApiResponse<Conversation>>(`/conversations/${conversationId}/transfer`, {
      assignTo: 'ai',
    });
    return response.data;
  },

  /**
   * Mark conversation as resolved
   * Uses PATCH /:id with status update since backend doesn't have /resolve endpoint
   */
  resolveConversation: async (conversationId: string): Promise<ApiResponse<Conversation>> => {
    if (isMockMode()) {
      await mockConversationsApi.updateConversationStatus(conversationId, 'resolved');
      const conv = await mockConversationsApi.getConversationById(conversationId);
      return { success: true, data: { ...conv, status: 'resolved' } as unknown as Conversation };
    }
    const response = await api.patch<ApiResponse<Conversation>>(`/conversations/${conversationId}`, {
      status: 'resolved'
    });
    return response.data;
  },

  /**
   * Assign conversation to an agent
   */
  assignConversation: async (conversationId: string, agentId: string): Promise<ApiResponse<Conversation>> => {
    if (isMockMode()) {
      await mockConversationsApi.assignConversation(conversationId, agentId);
      const conv = await mockConversationsApi.getConversationById(conversationId);
      return { success: true, data: { ...conv, assignedTo: 'human', assignedAgent: agentId } as unknown as Conversation };
    }
    const response = await api.post<ApiResponse<Conversation>>(`/conversations/${conversationId}/assign`, {
      agentId,
    });
    return response.data;
  },

  /**
   * Mark conversation as read
   */
  markAsRead: async (conversationId: string): Promise<ApiResponse<Conversation>> => {
    const response = await api.post<ApiResponse<Conversation>>(`/conversations/${conversationId}/read`);
    return response.data;
  },

  /**
   * Add tags to conversation
   */
  addTags: async (conversationId: string, tags: string[]): Promise<ApiResponse<Conversation>> => {
    const response = await api.post<ApiResponse<Conversation>>(`/conversations/${conversationId}/tags`, { tags });
    return response.data;
  },

  /**
   * Search conversations
   */
  searchConversations: async (query: string): Promise<ApiResponse<Conversation[]>> => {
    const response = await api.get<ApiResponse<Conversation[]>>('/conversations/search', {
      params: { q: query },
    });
    return response.data;
  },
};

export default conversationsService;

