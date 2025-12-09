/**
 * Assignment React Query Hooks
 * Custom hooks for smart assignment operations
 */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  assignmentService,
  AssignmentRequest,
  CreateAssignmentRuleDto,
  UpdateAssignmentRuleDto,
} from '../../api/services';
import { queryKeys } from '../queryClient';
import toast from 'react-hot-toast';

/**
 * Request agent assignment
 */
export const useRequestAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (request: AssignmentRequest) => assignmentService.requestAssignment(request),
    {
      onSuccess: (data) => {
        toast.success(`Konuşma ${data.data.assignedAgentId} atandı`);
        queryClient.invalidateQueries(queryKeys.conversations.all());
        queryClient.invalidateQueries(queryKeys.assignment.workload());
      },
      onError: () => {
        toast.error('Atama başarısız oldu');
      },
    }
  );
};

/**
 * Assign to specific agent (manual)
 */
export const useAssignToAgent = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ conversationId, agentId }: { conversationId: string; agentId: string }) =>
      assignmentService.assignToAgent(conversationId, agentId),
    {
      onSuccess: () => {
        toast.success('Konuşma manuel olarak atandı');
        queryClient.invalidateQueries(queryKeys.conversations.all());
        queryClient.invalidateQueries(queryKeys.assignment.workload());
      },
      onError: () => {
        toast.error('Manuel atama başarısız oldu');
      },
    }
  );
};

/**
 * Get assignment metrics
 */
export const useAssignmentMetrics = (params?: { from?: string; to?: string; period?: string }) => {
  return useQuery(
    queryKeys.assignment.metrics(params),
    () => assignmentService.getMetrics(params),
    {
      select: (data) => data.data,
      staleTime: 60000, // 1 minute
    }
  );
};

/**
 * Get assignment rules
 */
export const useAssignmentRules = () => {
  return useQuery(
    queryKeys.assignment.rules(),
    () => assignmentService.getRules(),
    {
      select: (data) => data.data,
      staleTime: 300000, // 5 minutes
    }
  );
};

/**
 * Get workload distribution
 */
export const useWorkloadDistribution = () => {
  return useQuery(
    queryKeys.assignment.workload(),
    () => assignmentService.getWorkloadDistribution(),
    {
      select: (data) => data.data,
      refetchInterval: 30000, // Refetch every 30 seconds
      staleTime: 20000,
    }
  );
};

/**
 * Create assignment rule mutation
 */
export const useCreateAssignmentRule = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: CreateAssignmentRuleDto) => assignmentService.createRule(data),
    {
      onSuccess: () => {
        toast.success('Atama kuralı oluşturuldu');
        queryClient.invalidateQueries(queryKeys.assignment.rules());
      },
      onError: () => {
        toast.error('Kural oluşturulamadı');
      },
    }
  );
};

/**
 * Update assignment rule mutation
 */
export const useUpdateAssignmentRule = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ ruleId, data }: { ruleId: string; data: UpdateAssignmentRuleDto }) =>
      assignmentService.updateRule(ruleId, data),
    {
      onSuccess: (data, variables) => {
        toast.success('Atama kuralı güncellendi');
        queryClient.invalidateQueries(queryKeys.assignment.rules());
        queryClient.invalidateQueries(queryKeys.assignment.rule(variables.ruleId));
      },
      onError: () => {
        toast.error('Kural güncellenemedi');
      },
    }
  );
};

/**
 * Delete assignment rule mutation
 */
export const useDeleteAssignmentRule = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (ruleId: string) => assignmentService.deleteRule(ruleId),
    {
      onSuccess: () => {
        toast.success('Atama kuralı silindi');
        queryClient.invalidateQueries(queryKeys.assignment.rules());
      },
      onError: () => {
        toast.error('Kural silinemedi');
      },
    }
  );
};

