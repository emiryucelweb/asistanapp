 

/**
 * Agent React Query Hooks
 * Custom hooks for agent data fetching and mutations
 * 
 * NOTE: Toast messages are intentionally removed from hooks to allow
 * components to provide i18n translations. Use onSuccess/onError callbacks
 * in components to show localized messages.
 */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { agentService, AgentProfile, UpdateAgentProfileDto, UpdateAgentStatusDto } from '../../api/services';
import { queryKeys } from '../queryClient';

/**
 * Get agent profile
 */
export const useAgentProfile = (agentId: string) => {
  return useQuery(
    queryKeys.agents.detail(agentId),
    () => agentService.getProfile(agentId),
    {
      select: (data) => data.data,
      enabled: !!agentId,
      staleTime: 60000, // 1 minute
    }
  );
};

/**
 * Get current user's agent profile
 * Used on Dashboard - optimized to prevent tab-switch refetch
 */
export const useMyAgentProfile = () => {
  return useQuery(
    queryKeys.agents.my(),
    () => agentService.getMyProfile(),
    {
      select: (data) => data.data,
      staleTime: 300000, // 5 minutes
      refetchOnWindowFocus: false, // Don't refetch on tab switch
      refetchOnMount: false, // Don't refetch on component mount
    }
  );
};

/**
 * Get agent workload
 */
export const useAgentWorkload = (agentId: string) => {
  return useQuery(
    queryKeys.agents.workload(agentId),
    () => agentService.getWorkload(agentId),
    {
      select: (data) => data.data,
      enabled: !!agentId,
      refetchInterval: 30000, // Refetch every 30 seconds
      staleTime: 20000,
    }
  );
};

/**
 * Get agent metrics
 * Used on Dashboard - optimized for less frequent refetch
 */
export const useAgentMetrics = (
  agentId: string,
  params?: { from?: string; to?: string }
) => {
  return useQuery(
    queryKeys.agents.metrics(agentId, params),
    () => agentService.getMetrics(agentId, params),
    {
      select: (data) => data.data,
      enabled: !!agentId,
      staleTime: 300000, // 5 minutes (dashboard data doesn't change frequently)
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: false, // Don't refetch on component mount (only if stale)
    }
  );
};

/**
 * Get all agents
 */
export const useAgents = (params?: { status?: string; role?: string; available?: boolean }) => {
  return useQuery(
    queryKeys.agents.list(params),
    () => agentService.getAgents(params),
    {
      select: (data) => data.data,
      staleTime: 30000,
    }
  );
};

/**
 * Update agent profile mutation
 * NOTE: Component should handle success/error toasts with i18n
 */
export const useUpdateAgentProfile = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ agentId, data }: { agentId: string; data: UpdateAgentProfileDto }) =>
      agentService.updateProfile(agentId, data),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(queryKeys.agents.detail(variables.agentId));
        queryClient.invalidateQueries(queryKeys.agents.my());
      },
    }
  );
};

/**
 * Update agent status mutation
 * NOTE: Component should handle success/error toasts with i18n
 */
export const useUpdateAgentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ agentId, statusData }: { agentId: string; statusData: UpdateAgentStatusDto }) =>
      agentService.updateStatus(agentId, statusData),
    {
      onMutate: async ({ agentId, statusData }) => {
        // Optimistic update
        await queryClient.cancelQueries(queryKeys.agents.detail(agentId));
        
        const previousAgent = queryClient.getQueryData<{ data: AgentProfile }>(
          queryKeys.agents.detail(agentId)
        );

        if (previousAgent) {
          queryClient.setQueryData(queryKeys.agents.detail(agentId), {
            ...previousAgent,
            data: {
              ...previousAgent.data,
              status: statusData.status,
            },
          });
        }

        return { previousAgent };
      },
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(queryKeys.agents.detail(variables.agentId));
        queryClient.invalidateQueries(queryKeys.agents.my());
        queryClient.invalidateQueries(queryKeys.agents.list());
      },
      onError: (err, variables, context) => {
        // Rollback optimistic update
        if (context?.previousAgent) {
          queryClient.setQueryData(
            queryKeys.agents.detail(variables.agentId),
            context.previousAgent
          );
        }
      },
    }
  );
};

/**
 * Upload agent avatar mutation
 * NOTE: Component should handle success/error toasts with i18n
 */
export const useUploadAgentAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ agentId, file }: { agentId: string; file: File }) =>
      agentService.uploadAvatar(agentId, file),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(queryKeys.agents.detail(variables.agentId));
        queryClient.invalidateQueries(queryKeys.agents.my());
      },
    }
  );
};

/**
 * Update agent preferences mutation
 * NOTE: Component should handle success/error toasts with i18n
 */
export const useUpdateAgentPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ agentId, preferences }: { agentId: string; preferences: Record<string, any> }) =>
      agentService.updatePreferences(agentId, preferences),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(queryKeys.agents.detail(variables.agentId));
        queryClient.invalidateQueries(queryKeys.agents.my());
      },
    }
  );
};

