/**
 * Conversations API Service
 * Handles all conversation-related API calls
 */
import api from '../client';
import { ApiResponse, ListParams } from '../types';

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
    const response = await api.get<ApiResponse<Conversation[]>>('/conversations', { params });
    return response.data;
  },

  /**
   * Get single conversation by ID
   */
  getConversation: async (id: string): Promise<ApiResponse<Conversation>> => {
    const response = await api.get<ApiResponse<Conversation>>(`/conversations/${id}`);
    return response.data;
  },

  /**
   * Get messages for a conversation
   */
  getMessages: async (conversationId: string, params?: ListParams): Promise<ApiResponse<Message[]>> => {
    const response = await api.get<ApiResponse<Message[]>>(`/conversations/${conversationId}/messages`, { params });
    return response.data;
  },

  /**
   * Send a message
   */
  sendMessage: async (dto: CreateMessageDto): Promise<ApiResponse<Message>> => {
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
    const response = await api.patch<ApiResponse<Conversation>>(`/conversations/${conversationId}`, {
      status: 'resolved'
    });
    return response.data;
  },

  /**
   * Assign conversation to an agent
   */
  assignConversation: async (conversationId: string, agentId: string): Promise<ApiResponse<Conversation>> => {
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

