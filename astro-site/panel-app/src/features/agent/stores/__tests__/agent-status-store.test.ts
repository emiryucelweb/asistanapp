/**
 * Agent Status Store Tests
 * Enterprise-grade test suite for agent status and break management
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { act } from '@testing-library/react';
import { useAgentStatusStore } from '../agent-status-store';

describe('AgentStatusStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      const store = useAgentStatusStore.getState();
      store.resetDailyBreak();
      store.setStatus('available');
      store.setDailyBreakMinutes(30);
    });
    
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Initial State', () => {
    it('should have available status initially', () => {
      const store = useAgentStatusStore.getState();
      
      expect(store.status).toBe('available');
      expect(store.dailyBreakMinutes).toBe(30);
      expect(store.usedBreakSeconds).toBe(0);
      expect(store.breakStartTime).toBeNull();
    });
  });

  describe('Status Management', () => {
    it('should update agent status', () => {
      const store = useAgentStatusStore.getState();
      
      act(() => {
        store.setStatus('busy');
      });
      
      expect(useAgentStatusStore.getState().status).toBe('busy');
    });

    it('should transition through all status states', () => {
      const statuses: Array<'available' | 'busy' | 'away' | 'on_break'> = [
        'available',
        'busy',
        'away',
        'on_break',
      ];
      
      statuses.forEach(status => {
        act(() => {
          useAgentStatusStore.getState().setStatus(status);
        });
        expect(useAgentStatusStore.getState().status).toBe(status);
      });
    });

    it('should automatically start break when status changes to on_break', () => {
      act(() => {
        useAgentStatusStore.getState().setStatus('on_break');
      });
      
      const store = useAgentStatusStore.getState();
      expect(store.status).toBe('on_break');
      expect(store.breakStartTime).toBeTruthy();
    });

    it('should automatically end break when status changes from on_break', () => {
      const startTime = Date.now();
      vi.useFakeTimers();
      vi.setSystemTime(startTime);
      
      // Start break first
      act(() => {
        useAgentStatusStore.getState().setStatus('on_break');
      });
      
      expect(useAgentStatusStore.getState().breakStartTime).toBeTruthy();
      
      // Fast-forward 1 second
      vi.setSystemTime(startTime + 1000);
      
      // Change to available
      act(() => {
        useAgentStatusStore.getState().setStatus('available');
      });
      
      const store = useAgentStatusStore.getState();
      expect(store.status).toBe('available');
      expect(store.breakStartTime).toBeNull();
      expect(store.usedBreakSeconds).toBeGreaterThanOrEqual(1);
      
      vi.useRealTimers();
    });
  });

  describe('Break Management', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should start a break', () => {
      act(() => {
        useAgentStatusStore.getState().startBreak();
      });
      
      const store = useAgentStatusStore.getState();
      expect(store.breakStartTime).toBeTruthy();
    });

    it('should end a break and accumulate used seconds', () => {
      const startTime = Date.now();
      vi.setSystemTime(startTime);
      
      // Start break
      act(() => {
        useAgentStatusStore.getState().startBreak();
      });
      
      // Fast-forward 5 seconds
      vi.setSystemTime(startTime + 5000);
      
      // End break
      act(() => {
        useAgentStatusStore.getState().endBreak();
      });
      
      const store = useAgentStatusStore.getState();
      expect(store.breakStartTime).toBeNull();
      expect(store.usedBreakSeconds).toBe(5);
    });

    it('should calculate remaining break seconds', () => {
      const store = useAgentStatusStore.getState();
      
      // Default is 30 minutes = 1800 seconds
      expect(store.getRemainingBreakSeconds()).toBe(1800);
    });

    it('should calculate remaining break seconds during active break', () => {
      const startTime = Date.now();
      vi.setSystemTime(startTime);
      
      act(() => {
        useAgentStatusStore.getState().startBreak();
      });
      
      // Fast-forward 60 seconds
      vi.setSystemTime(startTime + 60000);
      
      const store = useAgentStatusStore.getState();
      const remaining = store.getRemainingBreakSeconds();
      
      // Should be 1800 - 60 = 1740
      expect(remaining).toBe(1740);
    });

    it('should accumulate used break time across multiple breaks', () => {
      const startTime = Date.now();
      vi.setSystemTime(startTime);
      
      // First break - 10 seconds
      act(() => {
        useAgentStatusStore.getState().startBreak();
      });
      vi.setSystemTime(startTime + 10000);
      act(() => {
        useAgentStatusStore.getState().endBreak();
      });
      
      expect(useAgentStatusStore.getState().usedBreakSeconds).toBe(10);
      
      // Second break - 20 seconds
      vi.setSystemTime(startTime + 15000);
      act(() => {
        useAgentStatusStore.getState().startBreak();
      });
      vi.setSystemTime(startTime + 35000);
      act(() => {
        useAgentStatusStore.getState().endBreak();
      });
      
      // Total should be 10 + 20 = 30 seconds
      expect(useAgentStatusStore.getState().usedBreakSeconds).toBe(30);
    });

    it('should not allow negative remaining break time', () => {
      // Use all break time and more
      act(() => {
        useAgentStatusStore.getState().setDailyBreakMinutes(1); // 1 minute = 60 seconds
        useAgentStatusStore.getState().resetDailyBreak();
      });
      
      const startTime = Date.now();
      vi.setSystemTime(startTime);
      
      act(() => {
        useAgentStatusStore.getState().startBreak();
      });
      
      // Fast-forward 120 seconds (more than allowed)
      vi.setSystemTime(startTime + 120000);
      
      const store = useAgentStatusStore.getState();
      const remaining = store.getRemainingBreakSeconds();
      
      // Should return 0, not negative
      expect(remaining).toBe(0);
    });
  });

  describe('Daily Break Configuration', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should update daily break minutes', () => {
      act(() => {
        useAgentStatusStore.getState().setDailyBreakMinutes(45);
      });
      
      const store = useAgentStatusStore.getState();
      expect(store.dailyBreakMinutes).toBe(45);
      expect(store.getRemainingBreakSeconds()).toBe(45 * 60);
    });

    it('should reset daily break', () => {
      // Use some break time
      act(() => {
        const store = useAgentStatusStore.getState();
        store.startBreak();
      });
      
      vi.advanceTimersByTime(5000);
      
      act(() => {
        useAgentStatusStore.getState().endBreak();
      });
      
      expect(useAgentStatusStore.getState().usedBreakSeconds).toBeGreaterThan(0);
      
      // Reset
      act(() => {
        useAgentStatusStore.getState().resetDailyBreak();
      });
      
      const store = useAgentStatusStore.getState();
      expect(store.usedBreakSeconds).toBe(0);
      expect(store.breakStartTime).toBeNull();
    });
  });

  describe('Selectors', () => {
    it('selectStatus should return current status', async () => {
      act(() => {
        useAgentStatusStore.getState().setStatus('busy');
      });
      
      const { selectStatus } = await import('../agent-status-store');
      const status = selectStatus(useAgentStatusStore.getState());
      
      expect(status).toBe('busy');
    });

    it('selectIsOnBreak should return true when on break', async () => {
      act(() => {
        useAgentStatusStore.getState().setStatus('on_break');
      });
      
      const { selectIsOnBreak } = await import('../agent-status-store');
      const isOnBreak = selectIsOnBreak(useAgentStatusStore.getState());
      
      expect(isOnBreak).toBe(true);
    });

    it('selectIsOnBreak should return false when not on break', async () => {
      act(() => {
        useAgentStatusStore.getState().setStatus('available');
      });
      
      const { selectIsOnBreak } = await import('../agent-status-store');
      const isOnBreak = selectIsOnBreak(useAgentStatusStore.getState());
      
      expect(isOnBreak).toBe(false);
    });

    it('selectRemainingBreakSeconds should return remaining time', async () => {
      const { selectRemainingBreakSeconds } = await import('../agent-status-store');
      const remaining = selectRemainingBreakSeconds(useAgentStatusStore.getState());
      
      expect(remaining).toBe(1800); // 30 minutes default
    });
  });

  describe('Edge Cases', () => {
    it('should handle ending break when not on break', () => {
      const initialUsed = useAgentStatusStore.getState().usedBreakSeconds;
      
      act(() => {
        useAgentStatusStore.getState().endBreak();
      });
      
      // Should not change anything
      expect(useAgentStatusStore.getState().usedBreakSeconds).toBe(initialUsed);
      expect(useAgentStatusStore.getState().breakStartTime).toBeNull();
    });

    it('should handle starting break multiple times', () => {
      const startTime1 = Date.now();
      vi.setSystemTime(startTime1);
      
      act(() => {
        useAgentStatusStore.getState().startBreak();
      });
      
      const firstStartTime = useAgentStatusStore.getState().breakStartTime;
      
      // Start again
      vi.setSystemTime(startTime1 + 5000);
      act(() => {
        useAgentStatusStore.getState().startBreak();
      });
      
      const secondStartTime = useAgentStatusStore.getState().breakStartTime;
      
      // Should update to new start time
      expect(secondStartTime).not.toBe(firstStartTime);
      expect(secondStartTime).toBeGreaterThan(firstStartTime!);
    });
  });

  describe('Persistence', () => {
    it('should persist state across store instances', () => {
      // Set a specific status
      act(() => {
        useAgentStatusStore.getState().setStatus('busy');
        useAgentStatusStore.getState().setDailyBreakMinutes(45);
      });
      
      // Get new state reference (simulating persistence)
      const newState = useAgentStatusStore.getState();
      
      expect(newState.status).toBe('busy');
      expect(newState.dailyBreakMinutes).toBe(45);
    });
  });
});
