 

/**
 * Agent API Service
 * Handles all agent-related API calls
 */
import api from '../client';
import { ApiResponse, ListParams } from '../types';

export interface AgentProfile {
  id: string;
  userId: string;
  tenantId: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'available' | 'busy' | 'away' | 'offline';
  role: 'agent' | 'senior_agent' | 'team_lead';
  skills: {
    [key: string]: number; // skill name: proficiency level (0-10)
  };
  languages: string[];
  maxConcurrentConversations: number;
  maxConcurrentChats: number;
  preferredChannels: string[];
  channelExpertise: string[];
  workingHours?: {
    [day: string]: {
      start: string;
      end: string;
      breaks?: { start: string; end: string }[];
    };
  };
  preferences?: {
    autoAcceptConversations: boolean;
    soundNotifications: boolean;
    desktopNotifications: boolean;
    [key: string]: any;
  };
  stats?: {
    totalConversations: number;
    resolvedConversations: number;
    averageResponseTime: number;
    averageResolutionTime: number;
    satisfactionScore: number;
    activeConversations: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AgentWorkload {
  agentId: string;
  tenantId: string;
  currentLoad: number;
  maxLoad: number;
  utilizationRate: number;
  activeConversations: number;
  waitingConversations: number;
  averageHandlingTime: number;
  predictedLoad: number;
  efficiency: number;
  timestamp: string;
}

export interface AgentMetrics {
  agentId: string;
  period: {
    start: string;
    end: string;
  };
  conversations: {
    total: number;
    resolved: number;
    escalated: number;
    transferred: number;
  };
  performance: {
    averageResponseTime: number;
    averageResolutionTime: number;
    firstResponseTime: number;
    satisfactionScore: number;
    resolutionRate: number;
  };
  productivity: {
    messagesPerConversation: number;
    conversationsPerHour: number;
    activeTime: number;
    idleTime: number;
  };
  channels: {
    [channel: string]: {
      count: number;
      averageTime: number;
    };
  };
}

export interface UpdateAgentProfileDto {
  name?: string;
  avatar?: string;
  skills?: { [key: string]: number };
  languages?: string[];
  maxConcurrentConversations?: number;
  maxConcurrentChats?: number;
  preferredChannels?: string[];
  channelExpertise?: string[];
  workingHours?: AgentProfile['workingHours'];
  preferences?: AgentProfile['preferences'];
}

export interface UpdateAgentStatusDto {
  status: 'available' | 'busy' | 'away' | 'offline';
  reason?: string;
  metadata?: Record<string, any>;
}

export const agentService = {
  /**
   * Get agent profile
   */
  getProfile: async (agentId: string): Promise<ApiResponse<AgentProfile>> => {
    const response = await api.get<ApiResponse<AgentProfile>>(`/smart-assignment/agents/${agentId}`);
    return response.data;
  },

  /**
   * Get current user's agent profile
   */
  getMyProfile: async (): Promise<ApiResponse<AgentProfile>> => {
    const response = await api.get<ApiResponse<AgentProfile>>('/agents/me');
    return response.data;
  },

  /**
   * Update agent profile
   */
  updateProfile: async (agentId: string, data: UpdateAgentProfileDto): Promise<ApiResponse<AgentProfile>> => {
    const response = await api.patch<ApiResponse<AgentProfile>>(`/smart-assignment/agents/${agentId}`, data);
    return response.data;
  },

  /**
   * Update agent status (available, busy, away, offline)
   */
  updateStatus: async (agentId: string, statusData: UpdateAgentStatusDto): Promise<ApiResponse<AgentProfile>> => {
    const response = await api.post<ApiResponse<AgentProfile>>(
      `/smart-assignment/agents/${agentId}/status`,
      statusData
    );
    return response.data;
  },

  /**
   * Get agent workload
   */
  getWorkload: async (agentId: string): Promise<ApiResponse<AgentWorkload>> => {
    const response = await api.get<ApiResponse<AgentWorkload>>(`/smart-assignment/agents/${agentId}/workload`);
    return response.data;
  },

  /**
   * Get agent metrics
   */
  getMetrics: async (agentId: string, params?: { from?: string; to?: string }): Promise<ApiResponse<AgentMetrics>> => {
    const response = await api.get<ApiResponse<AgentMetrics>>(
      `/smart-assignment/agents/${agentId}/metrics`,
      { params }
    );
    return response.data;
  },

  /**
   * Get all agents (for team lead/admin)
   */
  getAgents: async (params?: ListParams & { status?: string; role?: string; available?: boolean }): Promise<ApiResponse<AgentProfile[]>> => {
    const response = await api.get<ApiResponse<AgentProfile[]>>('/smart-assignment/agents', { params });
    return response.data;
  },

  /**
   * Upload agent avatar
   */
  uploadAvatar: async (agentId: string, file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post<ApiResponse<{ url: string }>>(
      `/agents/${agentId}/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Update agent preferences
   */
  updatePreferences: async (
    agentId: string,
    preferences: Record<string, any>
  ): Promise<ApiResponse<AgentProfile>> => {
    const response = await api.patch<ApiResponse<AgentProfile>>(
      `/smart-assignment/agents/${agentId}`,
      { preferences }
    );
    return response.data;
  },
};

export default agentService;

