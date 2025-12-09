/**
 * useConversationList Hook Tests
 * Enterprise-grade test suite for conversation list management
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useConversationList } from '../useConversationList';
import { createMockConversation } from '@/test/utils/mock-factories';
import type { ReactNode } from 'react';

// Mock the useConversations hook
vi.mock('@/lib/react-query/hooks/useConversations', () => ({
  useConversations: vi.fn(),
}));

describe('useConversationList', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('Basic Functionality', () => {
    it('should return empty array initially when loading', async () => {
      const { useConversations } = vi.mocked(await import('@/lib/react-query/hooks/useConversations'));
      useConversations.mockReturnValue({
        data: [],
        isLoading: true,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      const { result } = renderHook(() => useConversationList(), { wrapper });
      
      expect(result.current.conversations).toEqual([]);
      expect(result.current.isLoading).toBe(true);
    });

    it('should load conversations successfully', async () => {
      const mockConversations = [
        createMockConversation({ id: 'conv-1', customerName: 'Customer 1' }),
        createMockConversation({ id: 'conv-2', customerName: 'Customer 2' }),
      ];

      const { useConversations } = vi.mocked(await import('@/lib/react-query/hooks/useConversations'));
      useConversations.mockReturnValue({
        data: mockConversations,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      const { result } = renderHook(() => useConversationList(), { wrapper });

      expect(result.current.conversations).toHaveLength(2);
      expect(result.current.conversations[0].customerName).toBe('Customer 1');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error');
      
      const { useConversations } = vi.mocked(await import('@/lib/react-query/hooks/useConversations'));
      useConversations.mockReturnValue({
        data: [],
        isLoading: false,
        isError: true,
        error: mockError,
        refetch: vi.fn(),
      } as any);

      const { result } = renderHook(() => useConversationList(), { wrapper });

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(mockError);
      expect(result.current.conversations).toEqual([]);
    });
  });

  describe('Filtering', () => {
    it('should filter conversations by status', async () => {
      const mockConversations = [
        createMockConversation({ id: 'conv-1', status: 'waiting' }),
        createMockConversation({ id: 'conv-2', status: 'resolved' }),
        createMockConversation({ id: 'conv-3', status: 'waiting' }),
      ];

      const { useConversations } = vi.mocked(await import('@/lib/react-query/hooks/useConversations'));
      useConversations.mockReturnValue({
        data: mockConversations,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      const { result } = renderHook(() => useConversationList({ filter: { status: 'waiting' } }), { wrapper });

      expect(result.current.filteredConversations).toHaveLength(2);
      expect(result.current.filteredConversations.every(c => c.status === 'waiting')).toBe(true);
    });

    it('should filter conversations by priority', async () => {
      const mockConversations = [
        createMockConversation({ id: 'conv-1', channel: 'whatsapp' }),
        createMockConversation({ id: 'conv-2', channel: 'web' }),
        createMockConversation({ id: 'conv-3', channel: 'whatsapp' }),
      ];

      const { useConversations } = vi.mocked(await import('@/lib/react-query/hooks/useConversations'));
      useConversations.mockReturnValue({
        data: mockConversations,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      const { result } = renderHook(() => useConversationList({ filter: { channel: 'whatsapp' } }), { wrapper });

      expect(result.current.filteredConversations).toHaveLength(2);
      expect(result.current.filteredConversations.every(c => c.channel === 'whatsapp')).toBe(true);
    });

    it('should filter conversations by priority', async () => {
      const mockConversations = [
        createMockConversation({ id: 'conv-1', priority: 'high' }),
        createMockConversation({ id: 'conv-2', priority: 'low' }),
        createMockConversation({ id: 'conv-3', priority: 'high' }),
      ];

      const { useConversations } = vi.mocked(await import('@/lib/react-query/hooks/useConversations'));
      useConversations.mockReturnValue({
        data: mockConversations,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      const { result } = renderHook(() => useConversationList({ filter: { priority: 'high' } }), { wrapper });

      expect(result.current.filteredConversations).toHaveLength(2);
      expect(result.current.filteredConversations.every(c => c.priority === 'high')).toBe(true);
    });
  });

  describe('Sorting', () => {
    it('should sort conversations by priority descending by default', async () => {
      const mockConversations = [
        createMockConversation({ id: 'conv-1', priority: 'low' }),
        createMockConversation({ id: 'conv-2', priority: 'urgent' }),
        createMockConversation({ id: 'conv-3', priority: 'high' }),
      ];

      const { useConversations } = vi.mocked(await import('@/lib/react-query/hooks/useConversations'));
      useConversations.mockReturnValue({
        data: mockConversations,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      const { result } = renderHook(() => useConversationList(), { wrapper });

      // Default sort is by priority DESC
      expect(result.current.sortedConversations[0].priority).toBe('urgent');
      expect(result.current.sortedConversations[1].priority).toBe('high');
      expect(result.current.sortedConversations[2].priority).toBe('low');
    });

    it('should sort conversations by lastMessageTime when specified', async () => {
      const mockConversations = [
        createMockConversation({ 
          id: 'conv-1', 
          lastMessageTime: new Date('2024-01-01').toISOString() 
        }),
        createMockConversation({ 
          id: 'conv-2', 
          lastMessageTime: new Date('2024-01-03').toISOString() 
        }),
        createMockConversation({ 
          id: 'conv-3', 
          lastMessageTime: new Date('2024-01-02').toISOString() 
        }),
      ];

      const { useConversations } = vi.mocked(await import('@/lib/react-query/hooks/useConversations'));
      useConversations.mockReturnValue({
        data: mockConversations,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      const { result } = renderHook(
        () => useConversationList({ sort: { sortBy: 'lastMessageTime', order: 'desc' } }), 
        { wrapper }
      );

      const dates = result.current.sortedConversations.map(c => c.lastMessageTime);
      expect(new Date(dates[0]) >= new Date(dates[1])).toBe(true);
      expect(new Date(dates[1]) >= new Date(dates[2])).toBe(true);
    });
  });

  describe('Performance & Memoization', () => {
    it('should memoize conversations array', async () => {
      const mockConversations = [
        createMockConversation({ id: 'conv-1' }),
      ];

      const { useConversations } = vi.mocked(await import('@/lib/react-query/hooks/useConversations'));
      useConversations.mockReturnValue({
        data: mockConversations,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      const { result, rerender } = renderHook(() => useConversationList(), { wrapper });

      const firstResult = result.current.conversations;
      
      rerender();
      
      // Should return same reference if data hasn't changed
      expect(result.current.conversations).toBe(firstResult);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty conversation list', async () => {
      const { useConversations } = vi.mocked(await import('@/lib/react-query/hooks/useConversations'));
      useConversations.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      const { result } = renderHook(() => useConversationList(), { wrapper });

      expect(result.current.conversations).toEqual([]);
      expect(result.current.error).toBeNull();
      expect(result.current.stats.total).toBe(0);
    });

    it('should handle null/undefined data gracefully', async () => {
      const { useConversations } = vi.mocked(await import('@/lib/react-query/hooks/useConversations'));
      useConversations.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      const { result } = renderHook(() => useConversationList(), { wrapper });

      expect(result.current.conversations).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Statistics', () => {
    it('should compute conversation stats correctly', async () => {
      const mockConversations = [
        createMockConversation({ id: 'conv-1', status: 'waiting', unreadCount: 5 }),
        createMockConversation({ id: 'conv-2', status: 'assigned', unreadCount: 0 }),
        createMockConversation({ id: 'conv-3', status: 'resolved', unreadCount: 0 }),
        createMockConversation({ id: 'conv-4', status: 'waiting', unreadCount: 2 }),
      ];

      const { useConversations } = vi.mocked(await import('@/lib/react-query/hooks/useConversations'));
      useConversations.mockReturnValue({
        data: mockConversations,
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      const { result } = renderHook(() => useConversationList(), { wrapper });

      expect(result.current.stats.total).toBe(4);
      expect(result.current.stats.unreadCount).toBe(2);
      expect(result.current.stats.waitingCount).toBe(2);
      expect(result.current.stats.assignedCount).toBe(1);
      expect(result.current.stats.resolvedCount).toBe(1);
    });
  });
});
