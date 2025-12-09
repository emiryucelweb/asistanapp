/**
 * useConversationList Hook
 * Performance-optimized conversation list management with virtualization support
 * 
 * @module agent/hooks/useConversationList
 */

import { useMemo, useCallback, useState, useEffect } from 'react';
import { useConversations } from '@/lib/react-query/hooks/useConversations';
import type { Conversation, ConversationFilter, ConversationSort } from '../types';
import { PRIORITY_WEIGHTS } from '../constants';
import { logger } from '@/shared/utils/logger';

export interface UseConversationListOptions {
  filter?: ConversationFilter;
  sort?: ConversationSort;
  enableVirtualization?: boolean;
  pageSize?: number;
}

export interface UseConversationListReturn {
  conversations: Conversation[];
  filteredConversations: Conversation[];
  sortedConversations: Conversation[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  hasMore: boolean;
  loadMore: () => void;
  // Computed stats
  stats: {
    total: number;
    unreadCount: number;
    waitingCount: number;
    assignedCount: number;
    resolvedCount: number;
  };
}

/**
 * Custom hook for managing conversation lists with performance optimizations
 */
export function useConversationList(
  options: UseConversationListOptions = {}
): UseConversationListReturn {
  const {
    filter = {},
    sort = { sortBy: 'priority', order: 'desc' },
    enableVirtualization = false,
    pageSize = 50,
  } = options;

  const [currentPage, setCurrentPage] = useState(1);

  // Fetch conversations with React Query
  const {
    data: conversationsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useConversations({
    ...filter,
    page: currentPage,
    limit: pageSize,
  });

  // useConversations returns Conversation[] directly (with type assertion for compatibility)
  // Memoized to prevent exhaustive-deps warnings in downstream useMemo hooks
  const conversations: Conversation[] = useMemo(
    () => (conversationsData || []) as unknown as Conversation[],
    [conversationsData]
  );

  // Memoized filtering
  const filteredConversations = useMemo(() => {
    logger.debug('Filtering conversations', { filterCount: Object.keys(filter).length });
    
    return conversations.filter((conv: Conversation) => {
      // Status filter
      if (filter.status) {
        const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
        if (!statuses.includes(conv.status)) return false;
      }

      // Priority filter
      if (filter.priority) {
        const priorities = Array.isArray(filter.priority) ? filter.priority : [filter.priority];
        if (!priorities.includes(conv.priority)) return false;
      }

      // Channel filter
      if (filter.channel) {
        const channels = Array.isArray(filter.channel) ? filter.channel : [filter.channel];
        if (!channels.includes(conv.channel)) return false;
      }

      // Assigned to filter
      if (filter.assignedTo) {
        const assignees = Array.isArray(filter.assignedTo) ? filter.assignedTo : [filter.assignedTo];
        if (!conv.assignedTo || !assignees.includes(conv.assignedTo)) return false;
      }

      // Unread filter
      if (filter.hasUnread !== undefined) {
        if (filter.hasUnread && conv.unreadCount === 0) return false;
        if (!filter.hasUnread && conv.unreadCount > 0) return false;
      }

      // AI stuck filter
      if (filter.isAiStuck !== undefined) {
        if (conv.aiStuck !== filter.isAiStuck) return false;
      }

      // Search query
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        const searchableText = [
          conv.customerName,
          conv.lastMessage,
          conv.customerEmail,
          conv.customerPhone,
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchableText.includes(query)) return false;
      }

      return true;
    });
  }, [conversations, filter]);

  // Memoized sorting
  const sortedConversations = useMemo(() => {
    logger.debug('Sorting conversations', { sortBy: sort.sortBy, order: sort.order });
    
    const sorted = [...filteredConversations];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sort.sortBy) {
        case 'priority': {
          const aPriority = PRIORITY_WEIGHTS[a.priority as keyof typeof PRIORITY_WEIGHTS] || 0;
          const bPriority = PRIORITY_WEIGHTS[b.priority as keyof typeof PRIORITY_WEIGHTS] || 0;
          comparison = bPriority - aPriority; // Higher priority first
          
          // Secondary sort by unread count
          if (comparison === 0) {
            comparison = b.unreadCount - a.unreadCount;
          }
          break;
        }

        case 'lastMessageTime': {
          const aTime = new Date(a.lastMessageTime).getTime();
          const bTime = new Date(b.lastMessageTime).getTime();
          comparison = bTime - aTime;
          break;
        }

        case 'createdAt': {
          const aTime = new Date(a.createdAt).getTime();
          const bTime = new Date(b.createdAt).getTime();
          comparison = bTime - aTime;
          break;
        }

        case 'updatedAt': {
          const aTime = new Date(a.updatedAt).getTime();
          const bTime = new Date(b.updatedAt).getTime();
          comparison = bTime - aTime;
          break;
        }

        case 'unreadCount': {
          comparison = b.unreadCount - a.unreadCount;
          break;
        }

        default:
          comparison = 0;
      }

      // Apply sort order
      return sort.order === 'asc' ? -comparison : comparison;
    });

    return sorted;
  }, [filteredConversations, sort]);

  // Computed statistics
  const stats = useMemo(() => {
    return {
      total: filteredConversations.length,
      unreadCount: filteredConversations.filter((c: Conversation) => c.unreadCount > 0).length,
      waitingCount: filteredConversations.filter((c: Conversation) => c.status === 'waiting').length,
      assignedCount: filteredConversations.filter((c: Conversation) => c.status === 'assigned').length,
      resolvedCount: filteredConversations.filter((c: Conversation) => c.status === 'resolved').length,
    };
  }, [filteredConversations]);

  // Pagination
  // ✅ Pagination will be implemented when backend adds pagination metadata to API response
  // Expected format: { data: Conversation[], pagination: { hasNext: boolean, total: number } }
  const hasMore = false; // Placeholder until API provides pagination
  
  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore, isLoading]);

  // Reset page when filter changes
  useEffect(() => {
    // Note: Intentional setState in effect - reset pagination when filter changes
    setCurrentPage(1);
  }, [filter]);

  return {
    conversations,
    filteredConversations,
    sortedConversations,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
    hasMore,
    loadMore,
    stats,
  };
}

