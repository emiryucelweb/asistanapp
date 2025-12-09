/**
 * Dashboard React Query Hooks
 * Custom hooks for dashboard data fetching
 */
import { useQuery } from 'react-query';
import { dashboardService } from '../../api/services';
import { queryKeys } from '../queryClient';

/**
 * Get dashboard KPIs
 */
export const useDashboardKPIs = (dateRange: string) => {
  return useQuery(
    queryKeys.dashboard.kpis(dateRange),
    () => dashboardService.getKPIs(dateRange),
    {
      select: (data) => data.data,
      staleTime: 60000, // 1 minute
    }
  );
};

/**
 * Get revenue trend
 */
export const useRevenueTrend = (dateRange: string) => {
  return useQuery(
    queryKeys.dashboard.revenueTrend(dateRange),
    () => dashboardService.getRevenueTrend(dateRange),
    {
      select: (data) => data.data,
      staleTime: 60000, // 1 minute
    }
  );
};

/**
 * Get conversation trend
 */
export const useConversationTrend = (dateRange: string) => {
  return useQuery(
    queryKeys.dashboard.conversationTrend(dateRange),
    () => dashboardService.getConversationTrend(dateRange),
    {
      select: (data) => data.data,
      staleTime: 60000, // 1 minute
    }
  );
};

/**
 * Get AI performance
 */
export const useAIPerformance = (dateRange: string) => {
  return useQuery(
    queryKeys.dashboard.aiPerformance(dateRange),
    () => dashboardService.getAIPerformance(dateRange),
    {
      select: (data) => data.data,
      staleTime: 60000, // 1 minute
    }
  );
};

/**
 * Get channel distribution
 */
export const useChannelDistribution = (dateRange: string) => {
  return useQuery(
    queryKeys.dashboard.channelDistribution(dateRange),
    () => dashboardService.getChannelDistribution(dateRange),
    {
      select: (data) => data.data,
      staleTime: 60000, // 1 minute
    }
  );
};

/**
 * Get team performance
 */
export const useTeamPerformance = (dateRange: string) => {
  return useQuery(
    queryKeys.dashboard.teamPerformance(dateRange),
    () => dashboardService.getTeamPerformance(dateRange),
    {
      select: (data) => data.data,
      staleTime: 60000, // 1 minute
    }
  );
};

/**
 * Get recent alerts
 */
export const useAlerts = () => {
  return useQuery(
    queryKeys.dashboard.alerts(),
    () => dashboardService.getAlerts(),
    {
      select: (data) => data.data,
      staleTime: 30000, // 30 seconds
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );
};

