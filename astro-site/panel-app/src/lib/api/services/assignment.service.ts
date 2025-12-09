 

/**
 * Assignment API Service
 * Handles smart assignment and agent assignment logic
 */
import api from '../client';
import { ApiResponse, ListParams } from '../types';

export interface AssignmentRequest {
  conversationId: string;
  customer: {
    id: string;
    name: string;
    tier: 'vip' | 'premium' | 'regular' | 'new';
    preferredLanguage?: string;
    previousAgentId?: string;
    satisfactionHistory?: number;
  };
  conversation: {
    channel: string;
    priority: string;
    type: string;
    estimatedComplexity: number;
    requiredSkills?: string[];
    urgentKeywords?: string[];
  };
  context: {
    businessHours: boolean;
    isHoliday?: boolean;
    currentTime: number;
    timezone?: string;
  };
}

export interface AssignmentResult {
  success: boolean;
  assignedAgentId: string;
  confidence: number;
  reasoning: string;
  alternativeAgents: {
    agentId: string;
    score: number;
    reason: string;
  }[];
  fallbackStrategy: string;
  estimatedWaitTime: number;
  predictedSatisfaction: number;
  predictedResolutionTime: number;
  assignmentTime: number;
}

export interface AssignmentMetrics {
  totalAssignments: number;
  successRate: number;
  averageConfidence: number;
  averageWaitTime: number;
  agentUtilization: {
    agentId: string;
    agentName: string;
    utilizationRate: number;
    assignmentCount: number;
  }[];
  channelDistribution: {
    [channel: string]: number;
  };
  priorityDistribution: {
    [priority: string]: number;
  };
  period: {
    start: string;
    end: string;
  };
}

export interface AssignmentRule {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  priority: number;
  conditions: {
    channel?: string[];
    priority?: string[];
    customerTier?: string[];
    timeOfDay?: { start: string; end: string };
    requiredSkills?: string[];
    [key: string]: any;
  };
  actions: {
    assignToAgent?: string;
    assignToTeam?: string;
    routingStrategy?: 'round_robin' | 'least_busy' | 'skill_based' | 'random';
    maxWaitTime?: number;
    [key: string]: any;
  };
  isActive: boolean;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkloadDistribution {
  tenantId: string;
  timestamp: string;
  agents: {
    agentId: string;
    agentName: string;
    currentLoad: number;
    maxLoad: number;
    utilizationRate: number;
    activeConversations: number;
    averageHandlingTime: number;
  }[];
  overallUtilization: number;
  totalActiveConversations: number;
  totalCapacity: number;
}

export interface CreateAssignmentRuleDto {
  name: string;
  description?: string;
  priority?: number;
  conditions: AssignmentRule['conditions'];
  actions: AssignmentRule['actions'];
  isActive?: boolean;
  enabled?: boolean;
}

export interface UpdateAssignmentRuleDto extends Partial<CreateAssignmentRuleDto> {}

export const assignmentService = {
  /**
   * Request agent assignment for a conversation
   */
  requestAssignment: async (request: AssignmentRequest): Promise<ApiResponse<AssignmentResult>> => {
    const response = await api.post<ApiResponse<AssignmentResult>>(
      '/smart-assignment/assignment/request',
      request
    );
    return response.data;
  },

  /**
   * Assign conversation to specific agent (manual assignment)
   */
  assignToAgent: async (conversationId: string, agentId: string): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await api.post<ApiResponse<{ success: boolean }>>(
      `/conversations/${conversationId}/assign`,
      { agentId }
    );
    return response.data;
  },

  /**
   * Get assignment metrics
   */
  getMetrics: async (params?: { from?: string; to?: string; period?: string }): Promise<ApiResponse<AssignmentMetrics>> => {
    const response = await api.get<ApiResponse<AssignmentMetrics>>(
      '/smart-assignment/assignment/metrics',
      { params }
    );
    return response.data;
  },

  /**
   * Get all assignment rules
   */
  getRules: async (params?: ListParams): Promise<ApiResponse<AssignmentRule[]>> => {
    const response = await api.get<ApiResponse<AssignmentRule[]>>(
      '/smart-assignment/assignment/rules',
      { params }
    );
    return response.data;
  },

  /**
   * Create new assignment rule
   */
  createRule: async (data: CreateAssignmentRuleDto): Promise<ApiResponse<AssignmentRule>> => {
    const response = await api.post<ApiResponse<AssignmentRule>>(
      '/smart-assignment/assignment/rules',
      data
    );
    return response.data;
  },

  /**
   * Update assignment rule
   */
  updateRule: async (ruleId: string, data: UpdateAssignmentRuleDto): Promise<ApiResponse<AssignmentRule>> => {
    const response = await api.put<ApiResponse<AssignmentRule>>(
      `/smart-assignment/assignment/rules/${ruleId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete assignment rule
   */
  deleteRule: async (ruleId: string): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await api.delete<ApiResponse<{ success: boolean }>>(
      `/smart-assignment/assignment/rules/${ruleId}`
    );
    return response.data;
  },

  /**
   * Get workload distribution across all agents
   */
  getWorkloadDistribution: async (): Promise<ApiResponse<WorkloadDistribution>> => {
    const response = await api.get<ApiResponse<WorkloadDistribution>>(
      '/smart-assignment/assignment/workload'
    );
    return response.data;
  },
};

export default assignmentService;

