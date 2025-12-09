 
// NOTE: Infrastructure/utility file - `any` used for generic types & external library interfaces

/**
 * Dashboard API Service
 * Handles dashboard metrics and analytics
 */
import api from '../client';
import { ApiResponse } from '../types';

export interface DashboardKPI {
  activeConversations: number;
  aiResolutionRate: number;
  customerSatisfaction: number;
  revenue: number;
  trends: {
    conversations: number;
    satisfaction: number;
    revenue: number;
  };
}

export interface ChartData {
  date: string;
  value: number;
  label?: string;
}

export interface ChannelDistribution {
  channel: string;
  count: number;
  percentage: number;
}

export interface TeamPerformance {
  agentId: string;
  agentName: string;
  conversationsHandled: number;
  avgResponseTime: number;
  satisfactionScore: number;
}

export const dashboardService = {
  /**
   * Get dashboard KPIs
   */
  getKPIs: async (dateRange: string): Promise<ApiResponse<DashboardKPI>> => {
    const response = await api.get<ApiResponse<DashboardKPI>>('/dashboard/kpis', {
      params: { range: dateRange },
    });
    return response.data;
  },

  /**
   * Get revenue trend data
   */
  getRevenueTrend: async (dateRange: string): Promise<ApiResponse<ChartData[]>> => {
    const response = await api.get<ApiResponse<ChartData[]>>('/dashboard/trends/revenue', {
      params: { range: dateRange },
    });
    return response.data;
  },

  /**
   * Get conversation trend data
   */
  getConversationTrend: async (dateRange: string): Promise<ApiResponse<ChartData[]>> => {
    const response = await api.get<ApiResponse<ChartData[]>>('/dashboard/trends/conversations', {
      params: { range: dateRange },
    });
    return response.data;
  },

  /**
   * Get AI performance data
   */
  getAIPerformance: async (dateRange: string): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>('/dashboard/ai-performance', {
      params: { range: dateRange },
    });
    return response.data;
  },

  /**
   * Get channel distribution
   */
  getChannelDistribution: async (dateRange: string): Promise<ApiResponse<ChannelDistribution[]>> => {
    const response = await api.get<ApiResponse<ChannelDistribution[]>>('/dashboard/channels', {
      params: { range: dateRange },
    });
    return response.data;
  },

  /**
   * Get team performance
   */
  getTeamPerformance: async (dateRange: string): Promise<ApiResponse<TeamPerformance[]>> => {
    const response = await api.get<ApiResponse<TeamPerformance[]>>('/dashboard/team-performance', {
      params: { range: dateRange },
    });
    return response.data;
  },

  /**
   * Get recent alerts
   */
  getAlerts: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>('/dashboard/alerts');
    return response.data;
  },
};

export default dashboardService;

