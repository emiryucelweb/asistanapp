 

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/shared/utils/logger';

interface QuickAction {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  keyboardShortcut?: string;
  isEnabled: boolean;
  isPinned: boolean;
  executionCount: number;
  lastUsed?: string;
  configuration?: {
    requiresConfirmation?: boolean;
    showNotification?: boolean;
    customParams?: Record<string, any>;
  };
}

interface ActionExecutionResult {
  success: boolean;
  message?: string;
  data?: any;
  notification?: {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  };
}

interface UseQuickActionsProps {
  customerId?: string;
  conversationId?: string;
  context?: {
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerStatus?: string;
    conversationStatus?: string;
    channel?: string;
    priority?: string;
    tags?: string[];
  };
  autoRefresh?: boolean;
}

export const useQuickActions = ({
  customerId,
  conversationId,
  context,
  autoRefresh = true
}: UseQuickActionsProps) => {
  const [actions, setActions] = useState<QuickAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [executingActions, setExecutingActions] = useState<Set<string>>(new Set());

  // Load available quick actions
  const loadActions = useCallback(async () => {
    if (!customerId && !conversationId) {
      setActions([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/quick-actions/available`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          conversationId,
          context
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to load actions: ${response.statusText}`);
      }

      const data = await response.json();
      setActions(data.actions || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load quick actions';
      setError(errorMessage);
      logger.error('Error loading quick actions:', err);
    } finally {
      setLoading(false);
    }
  }, [customerId, conversationId, context]);

  // Execute a quick action
  const executeAction = useCallback(async (
    actionId: string, 
    params?: Record<string, any>
  ): Promise<ActionExecutionResult> => {
    const action = actions.find(a => a.id === actionId);
    
    if (!action) {
      return {
        success: false,
        message: 'Action not found'
      };
    }

    if (!action.isEnabled) {
      return {
        success: false,
        message: 'Action is disabled'
      };
    }

    // Show confirmation if required
    if (action.configuration?.requiresConfirmation) {
      const confirmed = window.confirm(`${action.name} aksiyonunu gerçekleştirmek istediğinizden emin misiniz?`);
      if (!confirmed) {
        return {
          success: false,
          message: 'Action cancelled by user'
        };
      }
    }

    // Mark action as executing
    setExecutingActions(prev => new Set([...prev, actionId]));

    try {
      const response = await fetch(`/api/quick-actions/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actionId,
          customerId,
          conversationId,
          context,
          params
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to execute action: ${response.statusText}`);
      }

      const result = await response.json();

      // Refresh actions to update usage stats
      if (autoRefresh) {
        await loadActions();
      }

      return {
        success: true,
        data: result.data,
        notification: result.notification
      };

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute action';
      return {
        success: false,
        message: errorMessage,
        notification: {
          type: 'error',
          title: 'Aksiyon Hatası',
          message: errorMessage
        }
      };
    } finally {
      // Remove from executing set
      setExecutingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionId);
        return newSet;
      });
    }
  }, [actions, customerId, conversationId, context, autoRefresh, loadActions]);

  // Pin/unpin an action
  const togglePinAction = useCallback(async (actionId: string) => {
    try {
      const response = await fetch(`/api/quick-actions/${actionId}/pin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          conversationId
        })
      });

      if (response.ok) {
        // Update local state
        setActions(prev => prev.map(action => 
          action.id === actionId 
            ? { ...action, isPinned: !action.isPinned }
            : action
        ));
      }
    } catch (err: unknown) {
      logger.error('Failed to toggle pin action:', err);
    }
  }, [customerId, conversationId]);

  // Get actions by category
  const getActionsByCategory = useCallback((category: string) => {
    return actions.filter(action => action.category === category && action.isEnabled);
  }, [actions]);

  // Get pinned actions
  const getPinnedActions = useCallback(() => {
    return actions.filter(action => action.isPinned && action.isEnabled);
  }, [actions]);

  // Get most used actions
  const getMostUsedActions = useCallback((limit = 5) => {
    return actions
      .filter(action => action.isEnabled)
      .sort((a, b) => b.executionCount - a.executionCount)
      .slice(0, limit);
  }, [actions]);

  // Get recently used actions
  const getRecentlyUsedActions = useCallback((limit = 5) => {
    return actions
      .filter(action => action.isEnabled && action.lastUsed)
      .sort((a, b) => {
        const dateA = new Date(a.lastUsed!);
        const dateB = new Date(b.lastUsed!);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit);
  }, [actions]);

  // Search actions
  const searchActions = useCallback((query: string) => {
    if (!query.trim()) return actions.filter(action => action.isEnabled);
    
    const lowercaseQuery = query.toLowerCase();
    return actions.filter(action => 
      action.isEnabled && (
        action.name.toLowerCase().includes(lowercaseQuery) ||
        action.description.toLowerCase().includes(lowercaseQuery) ||
        action.category.toLowerCase().includes(lowercaseQuery)
      )
    );
  }, [actions]);

  // Check if an action is executing
  const isActionExecuting = useCallback((actionId: string) => {
    return executingActions.has(actionId);
  }, [executingActions]);

  // Get available categories
  const getCategories = useCallback(() => {
    const categories = new Set(actions.map(action => action.category));
    return Array.from(categories);
  }, [actions]);

  // Load actions on mount and when dependencies change
  useEffect(() => {
    loadActions();
  }, [loadActions]);

  return {
    // State
    actions,
    loading,
    error,
    executingActions,

    // Actions
    executeAction,
    loadActions,
    togglePinAction,

    // Getters
    getActionsByCategory,
    getPinnedActions,
    getMostUsedActions,
    getRecentlyUsedActions,
    searchActions,
    getCategories,

    // Utils
    isActionExecuting,
    refresh: loadActions
  };
};
