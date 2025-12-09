/**
 * useConversationState Hook Tests - ENTERPRISE GRADE
 * 
 * Comprehensive tests for centralized conversation state management
 * 
 * @group hook
 * @group agent
 * @group conversation
 * 
 * ALTIN KURALLAR:
 * ✅ React hooks tests with @testing-library/react
 * ✅ AAA Pattern (Arrange-Act-Assert)
 * ✅ Reducer pure function tests
 * ✅ Tek test → tek davranış
 * ✅ State immutability tests
 * ✅ Action coverage %100
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import {
  useConversationState,
  conversationReducer,
  initialConversationState,
  type ConversationAction,
  type Conversation,
} from '../useConversationState';
import type { FilterValues } from '../../components/conversations/AdvancedFilters';

// ============================================================================
// TEST FACTORIES
// ============================================================================

const createMockConversation = (overrides?: Partial<Conversation>): Conversation => ({
  id: 'conv-1',
  customer: {
    id: 'cust-1',
    name: 'Test Customer',
    avatar: '/avatar.jpg',
  },
  status: 'waiting',
  lastMessage: {
    id: 'msg-1',
    content: 'Test message',
    timestamp: new Date(),
    sender: 'customer',
  },
  unreadCount: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
} as Conversation);

const createMockFile = (name: string = 'test.pdf'): File => {
  return new File(['test content'], name, { type: 'application/pdf' });
};

// ============================================================================
// REDUCER TESTS - PURE FUNCTION
// ============================================================================

describe('conversationReducer - Pure Function Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Tab Navigation', () => {
    it('should set active tab', () => {
      // Arrange
      const action: ConversationAction = { type: 'SET_ACTIVE_TAB', payload: 'my' };

      // Act
      const newState = conversationReducer(initialConversationState, action);

      // Assert
      expect(newState.ui.activeTab).toBe('my');
      expect(newState).not.toBe(initialConversationState); // Immutability
    });
  });

  describe('Conversation Selection', () => {
    it('should select conversation', () => {
      // Arrange
      const conversation = createMockConversation();
      const action: ConversationAction = { type: 'SELECT_CONVERSATION', payload: conversation };

      // Act
      const newState = conversationReducer(initialConversationState, action);

      // Assert
      expect(newState.data.selectedConversation).toEqual(conversation);
    });

    it('should clear conversation when payload is null', () => {
      // Arrange
      const stateWithConv = {
        ...initialConversationState,
        data: { ...initialConversationState.data, selectedConversation: createMockConversation() },
      };
      const action: ConversationAction = { type: 'SELECT_CONVERSATION', payload: null };

      // Act
      const newState = conversationReducer(stateWithConv, action);

      // Assert
      expect(newState.data.selectedConversation).toBeNull();
    });
  });

  describe('Message Input', () => {
    it('should set message input', () => {
      // Arrange
      const action: ConversationAction = { type: 'SET_MESSAGE_INPUT', payload: 'Hello!' };

      // Act
      const newState = conversationReducer(initialConversationState, action);

      // Assert
      expect(newState.data.messageInput).toBe('Hello!');
    });

    it('should clear message input and attachments', () => {
      // Arrange
      const stateWithData = {
        ...initialConversationState,
        data: {
          ...initialConversationState.data,
          messageInput: 'Test message',
          attachedFiles: [createMockFile()],
        },
      };
      const action: ConversationAction = { type: 'CLEAR_MESSAGE_INPUT' };

      // Act
      const newState = conversationReducer(stateWithData, action);

      // Assert
      expect(newState.data.messageInput).toBe('');
      expect(newState.data.attachedFiles).toEqual([]);
    });
  });

  describe('File Attachments', () => {
    it('should add single attachment', () => {
      // Arrange
      const file = createMockFile();
      const action: ConversationAction = { type: 'ADD_ATTACHMENT', payload: file };

      // Act
      const newState = conversationReducer(initialConversationState, action);

      // Assert
      expect(newState.data.attachedFiles).toHaveLength(1);
      expect(newState.data.attachedFiles[0]).toBe(file);
    });

    it('should add multiple attachments', () => {
      // Arrange
      const files = [createMockFile('file1.pdf'), createMockFile('file2.jpg')];
      const action: ConversationAction = { type: 'ADD_ATTACHMENTS', payload: files };

      // Act
      const newState = conversationReducer(initialConversationState, action);

      // Assert
      expect(newState.data.attachedFiles).toHaveLength(2);
      expect(newState.data.attachedFiles).toEqual(files);
    });

    it('should remove attachment by index', () => {
      // Arrange
      const files = [createMockFile('file1.pdf'), createMockFile('file2.jpg'), createMockFile('file3.png')];
      const stateWithFiles = {
        ...initialConversationState,
        data: { ...initialConversationState.data, attachedFiles: files },
      };
      const action: ConversationAction = { type: 'REMOVE_ATTACHMENT', payload: 1 };

      // Act
      const newState = conversationReducer(stateWithFiles, action);

      // Assert
      expect(newState.data.attachedFiles).toHaveLength(2);
      expect(newState.data.attachedFiles.map(f => f.name)).toEqual(['file1.pdf', 'file3.png']);
    });

    it('should clear all attachments', () => {
      // Arrange
      const files = [createMockFile('file1.pdf'), createMockFile('file2.jpg')];
      const stateWithFiles = {
        ...initialConversationState,
        data: { ...initialConversationState.data, attachedFiles: files },
      };
      const action: ConversationAction = { type: 'CLEAR_ATTACHMENTS' };

      // Act
      const newState = conversationReducer(stateWithFiles, action);

      // Assert
      expect(newState.data.attachedFiles).toEqual([]);
    });
  });

  describe('Modal Toggles', () => {
    it('should toggle quick replies', () => {
      // Arrange
      const action: ConversationAction = { type: 'TOGGLE_QUICK_REPLIES' };

      // Act
      const state1 = conversationReducer(initialConversationState, action);
      const state2 = conversationReducer(state1, action);

      // Assert
      expect(state1.ui.showQuickReplies).toBe(true);
      expect(state2.ui.showQuickReplies).toBe(false);
    });

    it('should toggle notes', () => {
      // Arrange
      const action: ConversationAction = { type: 'TOGGLE_NOTES' };

      // Act
      const newState = conversationReducer(initialConversationState, action);

      // Assert
      expect(newState.ui.showNotes).toBe(true);
    });

    it('should toggle tags', () => {
      // Arrange
      const action: ConversationAction = { type: 'TOGGLE_TAGS' };

      // Act
      const newState = conversationReducer(initialConversationState, action);

      // Assert
      expect(newState.ui.showTags).toBe(true);
    });

    it('should toggle advanced filters', () => {
      // Arrange
      const action: ConversationAction = { type: 'TOGGLE_ADVANCED_FILTERS' };

      // Act
      const newState = conversationReducer(initialConversationState, action);

      // Assert
      expect(newState.ui.showAdvancedFilters).toBe(true);
    });

    it('should toggle assignment with conversation ID', () => {
      // Arrange
      const action: ConversationAction = { type: 'TOGGLE_ASSIGNMENT', payload: 'conv-123' };

      // Act
      const newState = conversationReducer(initialConversationState, action);

      // Assert
      expect(newState.ui.showAssignment).toBe(true);
      expect(newState.data.assignmentConversationId).toBe('conv-123');
    });

    it('should toggle assignment without conversation ID', () => {
      // Arrange
      const action: ConversationAction = { type: 'TOGGLE_ASSIGNMENT' };

      // Act
      const newState = conversationReducer(initialConversationState, action);

      // Assert
      expect(newState.ui.showAssignment).toBe(true);
      expect(newState.data.assignmentConversationId).toBeNull();
    });

    it('should toggle keyboard help', () => {
      // Arrange
      const action: ConversationAction = { type: 'TOGGLE_KEYBOARD_HELP' };

      // Act
      const newState = conversationReducer(initialConversationState, action);

      // Assert
      expect(newState.ui.showKeyboardHelp).toBe(true);
    });

    it('should toggle customer history', () => {
      // Arrange
      const action: ConversationAction = { type: 'TOGGLE_CUSTOMER_HISTORY' };

      // Act
      const newState = conversationReducer(initialConversationState, action);

      // Assert
      expect(newState.ui.showCustomerHistory).toBe(true);
    });

    it('should toggle emoji picker from null to true', () => {
      // Arrange
      const action: ConversationAction = { type: 'TOGGLE_EMOJI_PICKER' };

      // Act
      const newState = conversationReducer(initialConversationState, action);

      // Assert
      expect(newState.ui.showEmojiPicker).toBe(true);
    });

    it('should toggle emoji picker from true to false', () => {
      // Arrange
      const stateWithEmoji = {
        ...initialConversationState,
        ui: { ...initialConversationState.ui, showEmojiPicker: true },
      };
      const action: ConversationAction = { type: 'TOGGLE_EMOJI_PICKER' };

      // Act
      const newState = conversationReducer(stateWithEmoji, action);

      // Assert
      expect(newState.ui.showEmojiPicker).toBe(false);
    });

    it('should toggle fullscreen from null to true', () => {
      // Arrange
      const action: ConversationAction = { type: 'TOGGLE_FULLSCREEN' };

      // Act
      const newState = conversationReducer(initialConversationState, action);

      // Assert
      expect(newState.ui.isFullscreen).toBe(true);
    });

    it('should toggle fullscreen from true to false', () => {
      // Arrange
      const stateWithFullscreen = {
        ...initialConversationState,
        ui: { ...initialConversationState.ui, isFullscreen: true },
      };
      const action: ConversationAction = { type: 'TOGGLE_FULLSCREEN' };

      // Act
      const newState = conversationReducer(stateWithFullscreen, action);

      // Assert
      expect(newState.ui.isFullscreen).toBe(false);
    });

    it('should close all modals', () => {
      // Arrange
      const stateWithModals = {
        ...initialConversationState,
        ui: {
          ...initialConversationState.ui,
          showQuickReplies: true,
          showNotes: true,
          showTags: true,
          showAdvancedFilters: true,
          showAssignment: true,
          showKeyboardHelp: true,
          showCustomerHistory: true,
          showEmojiPicker: true,
          isFullscreen: true,
        },
      };
      const action: ConversationAction = { type: 'CLOSE_ALL_MODALS' };

      // Act
      const newState = conversationReducer(stateWithModals, action);

      // Assert
      expect(newState.ui.showQuickReplies).toBe(false);
      expect(newState.ui.showNotes).toBe(false);
      expect(newState.ui.showTags).toBe(false);
      expect(newState.ui.showAdvancedFilters).toBe(false);
      expect(newState.ui.showAssignment).toBe(false);
      expect(newState.ui.showKeyboardHelp).toBe(false);
      expect(newState.ui.showCustomerHistory).toBe(false);
      expect(newState.ui.showEmojiPicker).toBe(false);
      expect(newState.ui.isFullscreen).toBe(false);
    });
  });

  describe('Notes', () => {
    it('should set notes', () => {
      // Arrange
      const action: ConversationAction = { type: 'SET_NOTES', payload: 'Important note' };

      // Act
      const newState = conversationReducer(initialConversationState, action);

      // Assert
      expect(newState.data.notes).toBe('Important note');
    });
  });

  describe('Filters', () => {
    it('should set search query', () => {
      // Arrange
      const action: ConversationAction = { type: 'SET_SEARCH_QUERY', payload: 'test search' };

      // Act
      const newState = conversationReducer(initialConversationState, action);

      // Assert
      expect(newState.filters.searchQuery).toBe('test search');
    });

    it('should set filter status', () => {
      // Arrange
      const action: ConversationAction = { type: 'SET_FILTER_STATUS', payload: 'waiting' };

      // Act
      const newState = conversationReducer(initialConversationState, action);

      // Assert
      expect(newState.filters.filterStatus).toBe('waiting');
    });

    it('should set applied filters', () => {
      // Arrange
      const filters: FilterValues = {
        status: ['waiting'],
        priority: ['high'],
        tags: ['urgent'],
        dateRange: { start: new Date(), end: new Date() },
      };
      const action: ConversationAction = { type: 'SET_APPLIED_FILTERS', payload: filters };

      // Act
      const newState = conversationReducer(initialConversationState, action);

      // Assert
      expect(newState.filters.appliedFilters).toEqual(filters);
    });

    it('should clear applied filters', () => {
      // Arrange
      const stateWithFilters = {
        ...initialConversationState,
        filters: {
          ...initialConversationState.filters,
          appliedFilters: { status: ['waiting'] } as FilterValues,
        },
      };
      const action: ConversationAction = { type: 'SET_APPLIED_FILTERS', payload: null };

      // Act
      const newState = conversationReducer(stateWithFilters, action);

      // Assert
      expect(newState.filters.appliedFilters).toBeNull();
    });
  });

  describe('Typing Indicator', () => {
    it('should set customer typing true', () => {
      // Arrange
      const action: ConversationAction = { type: 'SET_CUSTOMER_TYPING', payload: true };

      // Act
      const newState = conversationReducer(initialConversationState, action);

      // Assert
      expect(newState.data.isCustomerTyping).toBe(true);
    });

    it('should set customer typing false', () => {
      // Arrange
      const stateWithTyping = {
        ...initialConversationState,
        data: { ...initialConversationState.data, isCustomerTyping: true },
      };
      const action: ConversationAction = { type: 'SET_CUSTOMER_TYPING', payload: false };

      // Act
      const newState = conversationReducer(stateWithTyping, action);

      // Assert
      expect(newState.data.isCustomerTyping).toBe(false);
    });
  });

  describe('Reset State', () => {
    it('should reset to initial state', () => {
      // Arrange
      const modifiedState = {
        ui: {
          ...initialConversationState.ui,
          activeTab: 'my' as const,
          showNotes: true,
        },
        data: {
          ...initialConversationState.data,
          messageInput: 'Test',
          notes: 'Notes',
        },
        filters: {
          ...initialConversationState.filters,
          searchQuery: 'search',
        },
      };
      const action: ConversationAction = { type: 'RESET_STATE' };

      // Act
      const newState = conversationReducer(modifiedState, action);

      // Assert
      expect(newState).toEqual(initialConversationState);
    });
  });

  describe('Immutability', () => {
    it('should not mutate original state', () => {
      // Arrange
      const originalState = { ...initialConversationState };
      const action: ConversationAction = { type: 'SET_MESSAGE_INPUT', payload: 'New message' };

      // Act
      conversationReducer(initialConversationState, action);

      // Assert
      expect(initialConversationState).toEqual(originalState);
    });
  });
});

// ============================================================================
// HOOK TESTS
// ============================================================================

describe('useConversationState - Hook Tests', () => {
  it('should initialize with default state', () => {
    // Arrange & Act
    const { result } = renderHook(() => useConversationState());

    // Assert
    expect(result.current.state).toEqual(initialConversationState);
  });

  it('should provide all action methods', () => {
    // Arrange & Act
    const { result } = renderHook(() => useConversationState());

    // Assert
    expect(typeof result.current.actions.setActiveTab).toBe('function');
    expect(typeof result.current.actions.selectConversation).toBe('function');
    expect(typeof result.current.actions.setMessageInput).toBe('function');
    expect(typeof result.current.actions.clearMessageInput).toBe('function');
    expect(typeof result.current.actions.addAttachment).toBe('function');
    expect(typeof result.current.actions.addAttachments).toBe('function');
    expect(typeof result.current.actions.removeAttachment).toBe('function');
    expect(typeof result.current.actions.clearAttachments).toBe('function');
    expect(typeof result.current.actions.toggleQuickReplies).toBe('function');
    expect(typeof result.current.actions.toggleNotes).toBe('function');
    expect(typeof result.current.actions.toggleTags).toBe('function');
    expect(typeof result.current.actions.toggleAdvancedFilters).toBe('function');
    expect(typeof result.current.actions.toggleAssignment).toBe('function');
    expect(typeof result.current.actions.toggleKeyboardHelp).toBe('function');
    expect(typeof result.current.actions.toggleCustomerHistory).toBe('function');
    expect(typeof result.current.actions.toggleEmojiPicker).toBe('function');
    expect(typeof result.current.actions.toggleFullscreen).toBe('function');
    expect(typeof result.current.actions.closeAllModals).toBe('function');
    expect(typeof result.current.actions.setNotes).toBe('function');
    expect(typeof result.current.actions.setSearchQuery).toBe('function');
    expect(typeof result.current.actions.setFilterStatus).toBe('function');
    expect(typeof result.current.actions.setAppliedFilters).toBe('function');
    expect(typeof result.current.actions.setCustomerTyping).toBe('function');
    expect(typeof result.current.actions.resetState).toBe('function');
  });

  describe('Integration Tests', () => {
    it('should handle complete conversation flow', () => {
      // Arrange
      const { result } = renderHook(() => useConversationState());
      const conversation = createMockConversation();
      const file = createMockFile();

      // Act & Assert - Select conversation
      act(() => {
        result.current.actions.selectConversation(conversation);
      });
      expect(result.current.state.data.selectedConversation).toEqual(conversation);

      // Act & Assert - Type message
      act(() => {
        result.current.actions.setMessageInput('Hello customer!');
      });
      expect(result.current.state.data.messageInput).toBe('Hello customer!');

      // Act & Assert - Add attachment
      act(() => {
        result.current.actions.addAttachment(file);
      });
      expect(result.current.state.data.attachedFiles).toHaveLength(1);

      // Act & Assert - Clear message
      act(() => {
        result.current.actions.clearMessageInput();
      });
      expect(result.current.state.data.messageInput).toBe('');
      expect(result.current.state.data.attachedFiles).toEqual([]);
    });

    it('should handle modal opening and closing', () => {
      // Arrange
      const { result } = renderHook(() => useConversationState());

      // Act - Open multiple modals
      act(() => {
        result.current.actions.toggleQuickReplies();
        result.current.actions.toggleNotes();
        result.current.actions.toggleKeyboardHelp();
      });

      // Assert - All modals open
      expect(result.current.state.ui.showQuickReplies).toBe(true);
      expect(result.current.state.ui.showNotes).toBe(true);
      expect(result.current.state.ui.showKeyboardHelp).toBe(true);

      // Act - Close all modals
      act(() => {
        result.current.actions.closeAllModals();
      });

      // Assert - All modals closed
      expect(result.current.state.ui.showQuickReplies).toBe(false);
      expect(result.current.state.ui.showNotes).toBe(false);
      expect(result.current.state.ui.showKeyboardHelp).toBe(false);
    });

    it('should handle filter application', () => {
      // Arrange
      const { result } = renderHook(() => useConversationState());

      // Act - Apply search
      act(() => {
        result.current.actions.setSearchQuery('urgent issue');
      });
      expect(result.current.state.filters.searchQuery).toBe('urgent issue');

      // Act - Apply status filter
      act(() => {
        result.current.actions.setFilterStatus('waiting');
      });
      expect(result.current.state.filters.filterStatus).toBe('waiting');

      // Act - Apply advanced filters
      const advancedFilters: FilterValues = {
        priority: ['high'],
        tags: ['urgent'],
      };
      act(() => {
        result.current.actions.setAppliedFilters(advancedFilters);
      });
      expect(result.current.state.filters.appliedFilters).toEqual(advancedFilters);
    });

    it('should handle state reset', () => {
      // Arrange
      const { result } = renderHook(() => useConversationState());

      // Act - Modify state
      act(() => {
        result.current.actions.setMessageInput('Test');
        result.current.actions.setNotes('Notes');
        result.current.actions.toggleQuickReplies();
        result.current.actions.setSearchQuery('search');
      });

      // Assert - State modified
      expect(result.current.state.data.messageInput).toBe('Test');
      expect(result.current.state.data.notes).toBe('Notes');
      expect(result.current.state.ui.showQuickReplies).toBe(true);
      expect(result.current.state.filters.searchQuery).toBe('search');

      // Act - Reset
      act(() => {
        result.current.actions.resetState();
      });

      // Assert - State reset
      expect(result.current.state).toEqual(initialConversationState);
    });

    it('should handle multiple file attachments', () => {
      // Arrange
      const { result } = renderHook(() => useConversationState());
      const files = [
        createMockFile('file1.pdf'),
        createMockFile('file2.jpg'),
        createMockFile('file3.png'),
      ];

      // Act - Add multiple files at once
      act(() => {
        result.current.actions.addAttachments(files);
      });

      // Assert
      expect(result.current.state.data.attachedFiles).toHaveLength(3);

      // Act - Remove middle file
      act(() => {
        result.current.actions.removeAttachment(1);
      });

      // Assert
      expect(result.current.state.data.attachedFiles).toHaveLength(2);
      expect(result.current.state.data.attachedFiles.map(f => f.name)).toEqual(['file1.pdf', 'file3.png']);

      // Act - Clear all
      act(() => {
        result.current.actions.clearAttachments();
      });

      // Assert
      expect(result.current.state.data.attachedFiles).toEqual([]);
    });
  });
});

