 

/**
 * Conversation Service
 * Business logic layer for conversation management
 * Pure functions for filtering, sorting, and computing stats
 * 
 * @module agent/services/conversationService
 */

import type { Conversation } from '../types';
import { PRIORITY_WEIGHTS } from '../constants';

// ============================================================================
// FILTERING
// ============================================================================

export interface ConversationFilters {
  searchQuery?: string;
  status?: 'waiting' | 'assigned' | 'resolved' | 'all';
  priority?: 'high' | 'medium' | 'low';
  channel?: string;
  assignedTo?: string;
  hasUnread?: boolean;
  isAiStuck?: boolean;
  activeTab?: 'all' | 'my' | 'waiting' | 'assigned' | 'phone';
  userId?: string;
}

/**
 * Filter conversations based on multiple criteria
 * Pure function - testable and predictable
 */
export function filterConversations(
  conversations: Conversation[],
  filters: ConversationFilters
): Conversation[] {
  return conversations.filter((conv) => {
    // Tab filtering
    if (filters.activeTab === 'phone') {
      if (conv.channel !== 'phone') return false;
    } else if (filters.activeTab === 'my') {
      if (conv.assignedTo !== filters.userId || conv.channel === 'phone') return false;
    } else if (filters.activeTab === 'waiting') {
      if (conv.status !== 'waiting' || conv.channel === 'phone') return false;
    }

    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesName = conv.customerName.toLowerCase().includes(query);
      const matchesMessage = conv.lastMessage.toLowerCase().includes(query);
      if (!matchesName && !matchesMessage) return false;
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      // 'my' is handled by activeTab filter above
      if (conv.status !== filters.status) {
        return false;
      }
    }

    // Priority filter
    if (filters.priority && conv.priority !== filters.priority) {
      return false;
    }

    // Channel filter
    if (filters.channel && conv.channel !== filters.channel) {
      return false;
    }

    // Assigned to filter
    if (filters.assignedTo && conv.assignedTo !== filters.assignedTo) {
      return false;
    }

    // Unread filter
    if (filters.hasUnread !== undefined) {
      const hasUnread = conv.unreadCount > 0;
      if (filters.hasUnread !== hasUnread) return false;
    }

    // AI stuck filter
    if (filters.isAiStuck !== undefined) {
      if (conv.aiStuck !== filters.isAiStuck) return false;
    }

    return true;
  });
}

// ============================================================================
// SORTING
// ============================================================================

export type SortBy = 'priority' | 'lastMessageTime' | 'createdAt' | 'unreadCount';
export type SortOrder = 'asc' | 'desc';

/**
 * Sort conversations by specified criteria
 * Pure function - testable and predictable
 */
export function sortConversations(
  conversations: Conversation[],
  sortBy: SortBy = 'priority',
  order: SortOrder = 'desc'
): Conversation[] {
  const sorted = [...conversations];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'priority': {
        const aPriority = PRIORITY_WEIGHTS[a.priority] || 0;
        const bPriority = PRIORITY_WEIGHTS[b.priority] || 0;
        comparison = bPriority - aPriority;

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
        const aTime = new Date(a.createdAt || a.lastMessageTime).getTime();
        const bTime = new Date(b.createdAt || b.lastMessageTime).getTime();
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

    return order === 'asc' ? -comparison : comparison;
  });

  return sorted;
}

// ============================================================================
// STATISTICS
// ============================================================================

export interface ConversationStats {
  total: number;
  waiting: number;
  assigned: number;
  resolved: number;
  unread: number;
  aiStuck: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  byChannel: Record<string, number>;
}

/**
 * Compute statistics from conversations
 * Pure function - testable and predictable
 */
export function computeConversationStats(
  conversations: Conversation[]
): ConversationStats {
  const stats: ConversationStats = {
    total: conversations.length,
    waiting: 0,
    assigned: 0,
    resolved: 0,
    unread: 0,
    aiStuck: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    byChannel: {},
  };

  conversations.forEach((conv) => {
    // Status
    if (conv.status === 'waiting') stats.waiting++;
    if (conv.status === 'assigned') stats.assigned++;
    if (conv.status === 'resolved') stats.resolved++;

    // Unread
    if (conv.unreadCount > 0) stats.unread++;

    // AI Stuck
    if (conv.aiStuck) stats.aiStuck++;

    // Priority
    if (conv.priority === 'high') stats.highPriority++;
    if (conv.priority === 'medium') stats.mediumPriority++;
    if (conv.priority === 'low') stats.lowPriority++;

    // Channel
    stats.byChannel[conv.channel] = (stats.byChannel[conv.channel] || 0) + 1;
  });

  return stats;
}

// ============================================================================
// SEARCH
// ============================================================================

/**
 * Search conversations by query
 * Searches in: name, message, email, phone
 */
export function searchConversations(
  conversations: Conversation[],
  query: string
): Conversation[] {
  if (!query.trim()) return conversations;

  const normalizedQuery = query.toLowerCase().trim();

  return conversations.filter((conv) => {
    const searchableFields = [
      conv.customerName,
      conv.lastMessage,
      conv.customerEmail,
      conv.customerPhone,
    ].filter(Boolean);

    return searchableFields.some((field) =>
      field?.toLowerCase().includes(normalizedQuery)
    );
  });
}

// ============================================================================
// GROUPING
// ============================================================================

/**
 * Group conversations by status
 */
export function groupByStatus(
  conversations: Conversation[]
): Record<string, Conversation[]> {
  return conversations.reduce((groups, conv) => {
    const status = conv.status;
    if (!groups[status]) {
      groups[status] = [];
    }
    groups[status].push(conv);
    return groups;
  }, {} as Record<string, Conversation[]>);
}

/**
 * Group conversations by channel
 */
export function groupByChannel(
  conversations: Conversation[]
): Record<string, Conversation[]> {
  return conversations.reduce((groups, conv) => {
    const channel = conv.channel;
    if (!groups[channel]) {
      groups[channel] = [];
    }
    groups[channel].push(conv);
    return groups;
  }, {} as Record<string, Conversation[]>);
}

/**
 * Group conversations by priority
 */
export function groupByPriority(
  conversations: Conversation[]
): Record<string, Conversation[]> {
  return conversations.reduce((groups, conv) => {
    const priority = conv.priority;
    if (!groups[priority]) {
      groups[priority] = [];
    }
    groups[priority].push(conv);
    return groups;
  }, {} as Record<string, Conversation[]>);
}

// ============================================================================
// UTILITY
// ============================================================================

/**
 * Find conversation by ID
 */
export function findConversationById(
  conversations: Conversation[],
  id: string
): Conversation | undefined {
  return conversations.find((conv) => conv.id === id);
}

/**
 * Check if conversation needs attention
 * (high priority + unread + waiting)
 */
export function needsAttention(conversation: Conversation): boolean {
  return (
    conversation.priority === 'high' &&
    conversation.unreadCount > 0 &&
    conversation.status === 'waiting'
  );
}

/**
 * Get conversations needing attention
 */
export function getConversationsNeedingAttention(
  conversations: Conversation[]
): Conversation[] {
  return conversations.filter(needsAttention);
}

