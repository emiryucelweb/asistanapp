/**
 * useConversationState Hook
 * Centralized state management for conversations using useReducer
 * Replaces 23 individual useState calls with a single, predictable state tree
 * 
 * @module agent/hooks/useConversationState
 */

import { useReducer, useCallback } from 'react';
import type { Conversation } from '../types';
import type { FilterValues } from '../components/conversations/AdvancedFilters';

// ============================================================================
// STATE TYPES
// ============================================================================

/**
 * Conversation UI State
 * 
 * Design Decision: showEmojiPicker and isFullscreen are nullable
 * to distinguish between "never initialized" (null) and "explicitly off" (false)
 * This enables better UX tracking and analytics
 */
export interface ConversationUIState {
  activeTab: 'all' | 'my' | 'waiting' | 'assigned';
  showQuickReplies: boolean;
  showNotes: boolean;
  showTags: boolean;
  showAdvancedFilters: boolean;
  showAssignment: boolean;
  showKeyboardHelp: boolean;
  showCustomerHistory: boolean;
  showEmojiPicker: boolean | null;
  isFullscreen: boolean | null;
}

export interface ConversationDataState {
  selectedConversation: Conversation | null;
  messageInput: string;
  notes: string;
  attachedFiles: File[];
  isCustomerTyping: boolean;
  assignmentConversationId: string | null;
}

export interface ConversationFilterState {
  searchQuery: string;
  filterStatus: 'all' | 'waiting' | 'assigned' | 'my' | 'resolved';
  appliedFilters: FilterValues | null;
}

export interface ConversationState {
  ui: ConversationUIState;
  data: ConversationDataState;
  filters: ConversationFilterState;
}

// ============================================================================
// ACTION TYPES
// ============================================================================

export type ConversationAction =
  // Tab Navigation
  | { type: 'SET_ACTIVE_TAB'; payload: ConversationUIState['activeTab'] }
  
  // Conversation Selection
  | { type: 'SELECT_CONVERSATION'; payload: Conversation | null }
  
  // Message Input
  | { type: 'SET_MESSAGE_INPUT'; payload: string }
  | { type: 'CLEAR_MESSAGE_INPUT' }
  
  // File Attachments
  | { type: 'ADD_ATTACHMENT'; payload: File }
  | { type: 'ADD_ATTACHMENTS'; payload: File[] }
  | { type: 'REMOVE_ATTACHMENT'; payload: number }
  | { type: 'CLEAR_ATTACHMENTS' }
  
  // Modal Toggles
  | { type: 'TOGGLE_QUICK_REPLIES' }
  | { type: 'TOGGLE_NOTES' }
  | { type: 'TOGGLE_TAGS' }
  | { type: 'TOGGLE_ADVANCED_FILTERS' }
  | { type: 'TOGGLE_ASSIGNMENT'; payload?: string | null }
  | { type: 'TOGGLE_KEYBOARD_HELP' }
  | { type: 'TOGGLE_CUSTOMER_HISTORY' }
  | { type: 'TOGGLE_EMOJI_PICKER' }
  | { type: 'TOGGLE_FULLSCREEN' }
  | { type: 'CLOSE_ALL_MODALS' }
  
  // Notes
  | { type: 'SET_NOTES'; payload: string }
  
  // Filters
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTER_STATUS'; payload: ConversationFilterState['filterStatus'] }
  | { type: 'SET_APPLIED_FILTERS'; payload: FilterValues | null }
  
  // Typing Indicator
  | { type: 'SET_CUSTOMER_TYPING'; payload: boolean }
  
  // Reset
  | { type: 'RESET_STATE' };

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialUIState: ConversationUIState = {
  activeTab: 'all',
  showQuickReplies: false,
  showNotes: false,
  showTags: false,
  showAdvancedFilters: false,
  showAssignment: false,
  showKeyboardHelp: false,
  showCustomerHistory: false,
  showEmojiPicker: null, // null = never interacted, false = explicitly closed
  isFullscreen: null, // null = never toggled, true/false = user preference
};

const initialDataState: ConversationDataState = {
  selectedConversation: null,
  messageInput: '',
  notes: '',
  attachedFiles: [],
  isCustomerTyping: false,
  assignmentConversationId: null,
};

const initialFilterState: ConversationFilterState = {
  searchQuery: '',
  filterStatus: 'all',
  appliedFilters: null,
};

export const initialConversationState: ConversationState = {
  ui: initialUIState,
  data: initialDataState,
  filters: initialFilterState,
};

// ============================================================================
// REDUCER
// ============================================================================

export function conversationReducer(
  state: ConversationState,
  action: ConversationAction
): ConversationState {
  switch (action.type) {
    // Tab Navigation
    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        ui: { ...state.ui, activeTab: action.payload },
      };

    // Conversation Selection
    case 'SELECT_CONVERSATION':
      return {
        ...state,
        data: { ...state.data, selectedConversation: action.payload },
      };

    // Message Input
    case 'SET_MESSAGE_INPUT':
      return {
        ...state,
        data: { ...state.data, messageInput: action.payload },
      };

    case 'CLEAR_MESSAGE_INPUT':
      return {
        ...state,
        data: {
          ...state.data,
          messageInput: '',
          attachedFiles: [],
        },
      };

    // File Attachments
    case 'ADD_ATTACHMENT':
      return {
        ...state,
        data: {
          ...state.data,
          attachedFiles: [...state.data.attachedFiles, action.payload],
        },
      };

    case 'ADD_ATTACHMENTS':
      return {
        ...state,
        data: {
          ...state.data,
          attachedFiles: [...state.data.attachedFiles, ...action.payload],
        },
      };

    case 'REMOVE_ATTACHMENT':
      return {
        ...state,
        data: {
          ...state.data,
          attachedFiles: state.data.attachedFiles.filter((_, i) => i !== action.payload),
        },
      };

    case 'CLEAR_ATTACHMENTS':
      return {
        ...state,
        data: { ...state.data, attachedFiles: [] },
      };

    // Modal Toggles
    case 'TOGGLE_QUICK_REPLIES':
      return {
        ...state,
        ui: { ...state.ui, showQuickReplies: !state.ui.showQuickReplies },
      };

    case 'TOGGLE_NOTES':
      return {
        ...state,
        ui: { ...state.ui, showNotes: !state.ui.showNotes },
      };

    case 'TOGGLE_TAGS':
      return {
        ...state,
        ui: { ...state.ui, showTags: !state.ui.showTags },
      };

    case 'TOGGLE_ADVANCED_FILTERS':
      return {
        ...state,
        ui: { ...state.ui, showAdvancedFilters: !state.ui.showAdvancedFilters },
      };

    case 'TOGGLE_ASSIGNMENT':
      return {
        ...state,
        ui: { ...state.ui, showAssignment: !state.ui.showAssignment },
        data: {
          ...state.data,
          assignmentConversationId: action.payload !== undefined ? action.payload : state.data.assignmentConversationId,
        },
      };

    case 'TOGGLE_KEYBOARD_HELP':
      return {
        ...state,
        ui: { ...state.ui, showKeyboardHelp: !state.ui.showKeyboardHelp },
      };

    case 'TOGGLE_CUSTOMER_HISTORY':
      return {
        ...state,
        ui: { ...state.ui, showCustomerHistory: !state.ui.showCustomerHistory },
      };

    case 'TOGGLE_EMOJI_PICKER':
      return {
        ...state,
        ui: { 
          ...state.ui, 
          showEmojiPicker: state.ui.showEmojiPicker === null ? true : !state.ui.showEmojiPicker 
        },
      };

    case 'TOGGLE_FULLSCREEN':
      return {
        ...state,
        ui: { 
          ...state.ui, 
          isFullscreen: state.ui.isFullscreen === null ? true : !state.ui.isFullscreen 
        },
      };

    case 'CLOSE_ALL_MODALS':
      return {
        ...state,
        ui: {
          ...state.ui,
          showQuickReplies: false,
          showNotes: false,
          showTags: false,
          showAdvancedFilters: false,
          showAssignment: false,
          showKeyboardHelp: false,
          showCustomerHistory: false,
          showEmojiPicker: false,
          isFullscreen: false,
        },
      };

    // Notes
    case 'SET_NOTES':
      return {
        ...state,
        data: { ...state.data, notes: action.payload },
      };

    // Filters
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        filters: { ...state.filters, searchQuery: action.payload },
      };

    case 'SET_FILTER_STATUS':
      return {
        ...state,
        filters: { ...state.filters, filterStatus: action.payload },
      };

    case 'SET_APPLIED_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, appliedFilters: action.payload },
      };

    // Typing Indicator
    case 'SET_CUSTOMER_TYPING':
      return {
        ...state,
        data: { ...state.data, isCustomerTyping: action.payload },
      };

    // Reset
    case 'RESET_STATE':
      return initialConversationState;

    default:
      return state;
  }
}

// ============================================================================
// HOOK
// ============================================================================

export interface UseConversationStateReturn {
  state: ConversationState;
  actions: {
    // Tab
    setActiveTab: (tab: ConversationUIState['activeTab']) => void;
    
    // Conversation
    selectConversation: (conversation: Conversation | null) => void;
    
    // Message
    setMessageInput: (input: string) => void;
    clearMessageInput: () => void;
    
    // Attachments
    addAttachment: (file: File) => void;
    addAttachments: (files: File[]) => void;
    removeAttachment: (index: number) => void;
    clearAttachments: () => void;
    
    // Modals
    toggleQuickReplies: () => void;
    toggleNotes: () => void;
    toggleTags: () => void;
    toggleAdvancedFilters: () => void;
    toggleAssignment: (conversationId?: string | null) => void;
    toggleKeyboardHelp: () => void;
    toggleCustomerHistory: () => void;
    toggleEmojiPicker: () => void;
    toggleFullscreen: () => void;
    closeAllModals: () => void;
    
    // Notes
    setNotes: (notes: string) => void;
    
    // Filters
    setSearchQuery: (query: string) => void;
    setFilterStatus: (status: ConversationFilterState['filterStatus']) => void;
    setAppliedFilters: (filters: FilterValues | null) => void;
    
    // Typing
    setCustomerTyping: (isTyping: boolean) => void;
    
    // Reset
    resetState: () => void;
  };
}

/**
 * Custom hook for centralized conversation state management
 * Replaces 23 individual useState calls with a single, predictable state tree
 */
export function useConversationState(): UseConversationStateReturn {
  const [state, dispatch] = useReducer<React.Reducer<ConversationState, ConversationAction>>(
    conversationReducer, 
    initialConversationState
  );

  // Memoized actions
  const actions = {
    setActiveTab: useCallback((tab: ConversationUIState['activeTab']) => {
      dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
    }, []),

    selectConversation: useCallback((conversation: Conversation | null) => {
      dispatch({ type: 'SELECT_CONVERSATION', payload: conversation });
    }, []),

    setMessageInput: useCallback((input: string) => {
      dispatch({ type: 'SET_MESSAGE_INPUT', payload: input });
    }, []),

    clearMessageInput: useCallback(() => {
      dispatch({ type: 'CLEAR_MESSAGE_INPUT' });
    }, []),

    addAttachment: useCallback((file: File) => {
      dispatch({ type: 'ADD_ATTACHMENT', payload: file });
    }, []),

    addAttachments: useCallback((files: File[]) => {
      dispatch({ type: 'ADD_ATTACHMENTS', payload: files });
    }, []),

    removeAttachment: useCallback((index: number) => {
      dispatch({ type: 'REMOVE_ATTACHMENT', payload: index });
    }, []),

    clearAttachments: useCallback(() => {
      dispatch({ type: 'CLEAR_ATTACHMENTS' });
    }, []),

    toggleQuickReplies: useCallback(() => {
      dispatch({ type: 'TOGGLE_QUICK_REPLIES' });
    }, []),

    toggleNotes: useCallback(() => {
      dispatch({ type: 'TOGGLE_NOTES' });
    }, []),

    toggleTags: useCallback(() => {
      dispatch({ type: 'TOGGLE_TAGS' });
    }, []),

    toggleAdvancedFilters: useCallback(() => {
      dispatch({ type: 'TOGGLE_ADVANCED_FILTERS' });
    }, []),

    toggleAssignment: useCallback((conversationId?: string | null) => {
      dispatch({ type: 'TOGGLE_ASSIGNMENT', payload: conversationId });
    }, []),

    toggleKeyboardHelp: useCallback(() => {
      dispatch({ type: 'TOGGLE_KEYBOARD_HELP' });
    }, []),

    toggleCustomerHistory: useCallback(() => {
      dispatch({ type: 'TOGGLE_CUSTOMER_HISTORY' });
    }, []),

    toggleEmojiPicker: useCallback(() => {
      dispatch({ type: 'TOGGLE_EMOJI_PICKER' });
    }, []),

    toggleFullscreen: useCallback(() => {
      dispatch({ type: 'TOGGLE_FULLSCREEN' });
    }, []),

    closeAllModals: useCallback(() => {
      dispatch({ type: 'CLOSE_ALL_MODALS' });
    }, []),

    setNotes: useCallback((notes: string) => {
      dispatch({ type: 'SET_NOTES', payload: notes });
    }, []),

    setSearchQuery: useCallback((query: string) => {
      dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    }, []),

    setFilterStatus: useCallback((status: ConversationFilterState['filterStatus']) => {
      dispatch({ type: 'SET_FILTER_STATUS', payload: status });
    }, []),

    setAppliedFilters: useCallback((filters: FilterValues | null) => {
      dispatch({ type: 'SET_APPLIED_FILTERS', payload: filters });
    }, []),

    setCustomerTyping: useCallback((isTyping: boolean) => {
      dispatch({ type: 'SET_CUSTOMER_TYPING', payload: isTyping });
    }, []),

    resetState: useCallback(() => {
      dispatch({ type: 'RESET_STATE' });
    }, []),
  };

  return { state, actions };
}

