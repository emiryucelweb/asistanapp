 

/**
 * Conversations React Query Hooks
 * Custom hooks for conversation data fetching and mutations
 */
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { conversationsService, Conversation, Message, CreateMessageDto } from '../../api/services';
import { queryKeys } from '../queryClient';
import toast from 'react-hot-toast';

/**
 * Get all conversations
 * Optimized for different use cases (dashboard vs. conversations page)
 */
export const useConversations = (params?: any) => {
  const isAssignedQuery = params?.status === 'assigned';
  
  return useQuery(
    queryKeys.conversations.list(params),
    () => conversationsService.getConversations(params),
    {
      select: (data) => data.data,
      staleTime: isAssignedQuery ? 120000 : 30000, // 2min for dashboard, 30s for conversations page
      refetchOnWindowFocus: !isAssignedQuery, // Only refetch on focus for active conversations page
      refetchOnMount: !isAssignedQuery, // Only refetch on mount for active conversations page
    }
  );
};

/**
 * Get single conversation
 */
export const useConversation = (id: string) => {
  return useQuery(
    queryKeys.conversations.detail(id),
    () => conversationsService.getConversation(id),
    {
      select: (data) => data.data,
      enabled: !!id,
    }
  );
};

/**
 * Get conversation messages
 */
export const useConversationMessages = (conversationId: string, params?: any) => {
  return useQuery(
    queryKeys.conversations.messages(conversationId, params),
    () => conversationsService.getMessages(conversationId, params),
    {
      select: (data) => data.data,
      enabled: !!conversationId,
      refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
    }
  );
};

/**
 * Send message mutation
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (dto: CreateMessageDto) => conversationsService.sendMessage(dto),
    {
      onSuccess: (data, variables) => {
        toast.success('Mesaj gönderildi');
        
        // Invalidate messages query to refetch
        queryClient.invalidateQueries(
          queryKeys.conversations.messages(variables.conversationId)
        );
        
        // Invalidate conversations list
        queryClient.invalidateQueries(queryKeys.conversations.all());
      },
      onError: () => {
        toast.error('Mesaj gönderilemedi');
      },
    }
  );
};

/**
 * Transfer to human mutation
 */
export const useTransferToHuman = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ conversationId, agentId }: { conversationId: string; agentId?: string }) =>
      conversationsService.transferToHuman(conversationId, agentId),
    {
      onSuccess: (_data) => {
        toast.success('Konuşma insana devredildi');
        queryClient.invalidateQueries(queryKeys.conversations.all());
      },
    }
  );
};

/**
 * Transfer to AI mutation
 */
export const useTransferToAI = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (conversationId: string) => conversationsService.transferToAI(conversationId),
    {
      onSuccess: () => {
        toast.success('Konuşma AI\'ya devredildi');
        queryClient.invalidateQueries(queryKeys.conversations.all());
      },
    }
  );
};

/**
 * Search conversations
 */
export const useSearchConversations = (query: string) => {
  return useQuery(
    queryKeys.conversations.search(query),
    () => conversationsService.searchConversations(query),
    {
      select: (data) => data.data,
      enabled: query.length > 2, // Only search if query is longer than 2 characters
      staleTime: 10000, // 10 seconds
    }
  );
};

/**
 * Add tags mutation
 */
export const useAddTags = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ conversationId, tags }: { conversationId: string; tags: string[] }) =>
      conversationsService.addTags(conversationId, tags),
    {
      onSuccess: () => {
        toast.success('Etiketler eklendi');
        queryClient.invalidateQueries(queryKeys.conversations.all());
      },
    }
  );
};

/**
 * Assign conversation mutation
 */
export const useAssignConversation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ conversationId, agentId }: { conversationId: string; agentId: string }) =>
      conversationsService.assignConversation(conversationId, agentId),
    {
      onSuccess: (data) => {
        toast.success('Konuşma başarıyla atandı');
        queryClient.invalidateQueries(queryKeys.conversations.all());
        queryClient.invalidateQueries(queryKeys.conversations.detail(data.data.id));
      },
      onError: () => {
        toast.error('Konuşma atanamadı');
      },
    }
  );
};

/**
 * Resolve conversation mutation
 */
export const useResolveConversation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (conversationId: string) => conversationsService.resolveConversation(conversationId),
    {
      onSuccess: (data) => {
        toast.success('Konuşma çözüldü');
        queryClient.invalidateQueries(queryKeys.conversations.all());
        queryClient.invalidateQueries(queryKeys.conversations.detail(data.data.id));
      },
      onError: () => {
        toast.error('Konuşma çözülemedi');
      },
    }
  );
};

/**
 * Mark conversation as read mutation
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (conversationId: string) => conversationsService.markAsRead(conversationId),
    {
      onSuccess: (data) => {
        // Silent update - no toast
        queryClient.invalidateQueries(queryKeys.conversations.detail(data.data.id));
      },
      onError: () => {
        // Silent error - no toast
      },
    }
  );
};

