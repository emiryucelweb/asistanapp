/**
 * @vitest-environment jsdom
 */
import { renderHook, act, waitFor, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useQuickActions } from '../useQuickActions';
import { logger } from '@/shared/utils/logger';

// Mock logger
vi.mock('@/shared/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn()
  }
}));

// Mock fetch
global.fetch = vi.fn();

// Mock window.confirm
global.confirm = vi.fn();

describe('useQuickActions', () => {
  const mockActions = [
    {
      id: 'action-1',
      name: 'Send Welcome Email',
      description: 'Send welcome email to customer',
      icon: '📧',
      category: 'communication',
      keyboardShortcut: 'Ctrl+E',
      isEnabled: true,
      isPinned: false,
      executionCount: 10,
      lastUsed: '2024-01-15T10:00:00Z',
      configuration: {
        requiresConfirmation: false,
        showNotification: true
      }
    },
    {
      id: 'action-2',
      name: 'Close Conversation',
      description: 'Close and archive conversation',
      icon: '✔️',
      category: 'conversation',
      isEnabled: true,
      isPinned: true,
      executionCount: 25,
      lastUsed: '2024-01-16T14:30:00Z',
      configuration: {
        requiresConfirmation: true,
        showNotification: true
      }
    },
    {
      id: 'action-3',
      name: 'Assign to Team',
      description: 'Assign conversation to team member',
      icon: '👥',
      category: 'assignment',
      isEnabled: true,
      isPinned: false,
      executionCount: 5,
      lastUsed: '2024-01-14T09:00:00Z'
    }
  ];

  const defaultProps = {
    customerId: 'customer-123',
    conversationId: 'conv-456',
    context: {
      customerName: 'John Doe',
      conversationStatus: 'open'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    (global.fetch as any).mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  // Test 1: AAA Pattern - Initial loading
  it('should load available quick actions on mount', async () => {
    // Arrange
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ actions: mockActions })
    });
    
    // Act
    const { result } = renderHook(() => useQuickActions(defaultProps));
    
    // Assert - Loading state
    expect(result.current.loading).toBe(true);
    
    // Assert - Loaded state
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.actions).toHaveLength(3);
      expect(result.current.error).toBeNull();
    });
  });

  // Test 2: Execute action successfully
  it('should execute quick action successfully', async () => {
    // Arrange
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ actions: mockActions })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: { emailSent: true },
          notification: {
            type: 'success',
            title: 'Success',
            message: 'Email sent successfully'
          }
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ actions: mockActions })
      });

    const { result } = renderHook(() => useQuickActions(defaultProps));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Act
    let executionResult: any;
    await act(async () => {
      executionResult = await result.current.executeAction('action-1');
    });
    
    // Assert
    expect(executionResult.success).toBe(true);
    expect(executionResult.notification?.type).toBe('success');
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/quick-actions/execute',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('action-1')
      })
    );
  });

  // Test 3: Error Handling - Action not found
  it('should handle non-existent action execution', async () => {
    // Arrange
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ actions: mockActions })
    });

    const { result } = renderHook(() => useQuickActions(defaultProps));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Act
    let executionResult: any;
    await act(async () => {
      executionResult = await result.current.executeAction('non-existent-action');
    });
    
    // Assert
    expect(executionResult.success).toBe(false);
    expect(executionResult.message).toBe('Action not found');
  });

  // Test 4: Confirmation dialog for actions requiring confirmation
  it('should show confirmation dialog and handle cancellation', async () => {
    // Arrange
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ actions: mockActions })
    });

    vi.mocked(global.confirm).mockReturnValue(false); // User cancels

    const { result } = renderHook(() => useQuickActions(defaultProps));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Act
    let executionResult: any;
    await act(async () => {
      executionResult = await result.current.executeAction('action-2'); // requiresConfirmation: true
    });
    
    // Assert
    expect(global.confirm).toHaveBeenCalled();
    expect(executionResult.success).toBe(false);
    expect(executionResult.message).toBe('Action cancelled by user');
  });

  // Test 5: Pin/unpin actions
  it('should toggle pin status of action', async () => {
    // Arrange
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ actions: mockActions })
      })
      .mockResolvedValueOnce({ ok: true });

    const { result } = renderHook(() => useQuickActions(defaultProps));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    const initialPinState = result.current.actions.find(a => a.id === 'action-1')?.isPinned;
    
    // Act
    await act(async () => {
      await result.current.togglePinAction('action-1');
    });
    
    // Assert
    const updatedAction = result.current.actions.find(a => a.id === 'action-1');
    expect(updatedAction?.isPinned).toBe(!initialPinState);
  });

  // Test 6: Filter and search actions
  it('should filter actions by category and search query', async () => {
    // Arrange
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ actions: mockActions })
    });

    const { result } = renderHook(() => useQuickActions(defaultProps));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Act - Get by category
    const communicationActions = result.current.getActionsByCategory('communication');
    
    // Assert
    expect(communicationActions).toHaveLength(1);
    expect(communicationActions[0].id).toBe('action-1');
    
    // Act - Search
    const searchResults = result.current.searchActions('email');
    
    // Assert
    expect(searchResults).toHaveLength(1);
    expect(searchResults[0].name).toContain('Email');
    
    // Act - Empty search returns all enabled
    const allResults = result.current.searchActions('');
    expect(allResults).toHaveLength(3);
  });

  // Test 7: Real-World Scenario - Most used and pinned actions
  it('should get pinned, most used, and recently used actions', async () => {
    // Arrange
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ actions: mockActions })
    });

    const { result } = renderHook(() => useQuickActions(defaultProps));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Act - Get pinned actions
    const pinnedActions = result.current.getPinnedActions();
    
    // Assert - Only action-2 is pinned
    expect(pinnedActions).toHaveLength(1);
    expect(pinnedActions[0].id).toBe('action-2');
    
    // Act - Get most used actions
    const mostUsed = result.current.getMostUsedActions(2);
    
    // Assert - Sorted by executionCount descending
    expect(mostUsed).toHaveLength(2);
    expect(mostUsed[0].id).toBe('action-2'); // executionCount: 25
    expect(mostUsed[1].id).toBe('action-1'); // executionCount: 10
    
    // Act - Get recently used actions
    const recentlyUsed = result.current.getRecentlyUsedActions(3);
    
    // Assert - Sorted by lastUsed descending
    expect(recentlyUsed).toHaveLength(3);
    expect(recentlyUsed[0].id).toBe('action-2'); // Most recent: 2024-01-16
    expect(recentlyUsed[1].id).toBe('action-1'); // 2024-01-15
    expect(recentlyUsed[2].id).toBe('action-3'); // Oldest: 2024-01-14
  });

  // Test 8: Track executing actions
  it('should track action execution state', async () => {
    // Arrange
    let resolveExecute: (value: any) => void;
    const executePromise = new Promise(resolve => {
      resolveExecute = resolve;
    });

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ actions: mockActions })
      })
      .mockImplementationOnce(() => executePromise.then(() => ({
        ok: true,
        json: async () => ({ data: {}, notification: null })
      })))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ actions: mockActions })
      });

    const { result } = renderHook(() => useQuickActions(defaultProps));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    // Act - Start executing action (won't complete until we resolve)
    let executionResultPromise: Promise<any>;
    act(() => {
      executionResultPromise = result.current.executeAction('action-1');
    });
    
    // Assert - Action should be in executing state immediately after act
    await waitFor(() => {
      expect(result.current.isActionExecuting('action-1')).toBe(true);
    });
    
    // Resolve the fetch and wait for completion
    await act(async () => {
      resolveExecute!({});
      await executionResultPromise;
    });
    
    // Assert - Action should no longer be executing
    expect(result.current.isActionExecuting('action-1')).toBe(false);
  });
});

