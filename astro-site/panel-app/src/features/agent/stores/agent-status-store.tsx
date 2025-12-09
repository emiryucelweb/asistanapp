/**
 * Agent Status Store - Agent Status Management + Break Timer
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AgentStatus = 'available' | 'busy' | 'away' | 'on_break';

interface AgentStatusState {
  status: AgentStatus;
  
  // Break management
  dailyBreakMinutes: number; // Daily total break allowance (minutes)
  usedBreakSeconds: number; // Break time used today (seconds)
  breakStartTime: number | null; // Break start time (timestamp)
  lastResetDate: string; // Last reset date (resets daily)
  
  // Actions
  setStatus: (status: AgentStatus) => void;
  setDailyBreakMinutes: (minutes: number) => void;
  startBreak: () => void;
  endBreak: () => void;
  getRemainingBreakSeconds: () => number;
  resetDailyBreak: () => void; // Reset for new day
}

// Selectors (for performance optimization)
export const selectStatus = (state: AgentStatusState) => state.status;
export const selectRemainingBreakSeconds = (state: AgentStatusState) => state.getRemainingBreakSeconds();
export const selectIsOnBreak = (state: AgentStatusState) => state.status === 'on_break';

export const useAgentStatusStore = create<AgentStatusState>()(
  persist(
    (set, get) => ({
      status: 'available',
      dailyBreakMinutes: 30, // Default 30 minutes
      usedBreakSeconds: 0,
      breakStartTime: null,
      lastResetDate: new Date().toDateString(),
      
      setStatus: (status) => {
        const state = get();
        
        // If going on break, start timer
        if (status === 'on_break' && state.status !== 'on_break') {
          get().startBreak();
        }
        // If returning from break, stop timer
        else if (status !== 'on_break' && state.status === 'on_break') {
          get().endBreak();
        }
        
        set({ status });
      },
      
      setDailyBreakMinutes: (minutes) => set({ dailyBreakMinutes: minutes }),
      
      startBreak: () => {
        // Check for new day
        const today = new Date().toDateString();
        const state = get();
        if (state.lastResetDate !== today) {
          get().resetDailyBreak();
        }
        
        set({ breakStartTime: Date.now() });
      },
      
      endBreak: () => {
        const state = get();
        if (state.breakStartTime) {
          const elapsedSeconds = Math.floor((Date.now() - state.breakStartTime) / 1000);
          set({ 
            usedBreakSeconds: state.usedBreakSeconds + elapsedSeconds,
            breakStartTime: null 
          });
        }
      },
      
      getRemainingBreakSeconds: () => {
        const state = get();
        const totalBreakSeconds = state.dailyBreakMinutes * 60;
        let currentUsed = state.usedBreakSeconds;
        
        // If currently on break, add elapsed time
        if (state.breakStartTime) {
          const currentBreakSeconds = Math.floor((Date.now() - state.breakStartTime) / 1000);
          currentUsed += currentBreakSeconds;
        }
        
        return Math.max(0, totalBreakSeconds - currentUsed);
      },
      
      resetDailyBreak: () => {
        set({ 
          usedBreakSeconds: 0,
          breakStartTime: null,
          lastResetDate: new Date().toDateString()
        });
      },
    }),
    {
      name: 'agent-status-storage',
    }
  )
);


