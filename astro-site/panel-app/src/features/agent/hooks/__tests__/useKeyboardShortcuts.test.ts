/**
 * useKeyboardShortcuts Hook Tests - ENTERPRISE GRADE
 * 
 * Comprehensive tests for keyboard shortcut management
 * 
 * @group hook
 * @group agent
 * @group keyboard
 * 
 * ALTIN KURALLAR:
 * ✅ React hooks tests with @testing-library/react
 * ✅ AAA Pattern (Arrange-Act-Assert)
 * ✅ Event simulation tests
 * ✅ Tek test → tek davranış
 * ✅ Cleanup verification
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, cleanup } from '@testing-library/react';
import {
  useKeyboardShortcuts,
  getAgentKeyboardShortcuts,
  type KeyboardShortcut,
} from '../useKeyboardShortcuts';

// ============================================================================
// MOCKS
// ============================================================================

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'keyboard.categories.general': 'General',
        'keyboard.categories.conversations': 'Conversations',
        'keyboard.categories.quickActions': 'Quick Actions',
        'keyboard.focusSearch': 'Focus search',
        'keyboard.closeModals': 'Close modals',
        'keyboard.showShortcuts': 'Show shortcuts',
        'keyboard.sendMessage': 'Send message',
        'keyboard.nextConversation': 'Next conversation',
        'keyboard.previousConversation': 'Previous conversation',
        'keyboard.resolveConversation': 'Resolve conversation',
        'keyboard.transfer': 'Transfer',
        'keyboard.quickReplies': 'Quick replies',
        'keyboard.addTags': 'Add tags',
      };
      return translations[key] || key;
    },
  }),
}));

// ============================================================================
// TEST UTILITIES
// ============================================================================

/**
 * Helper to create keyboard event
 */
const createKeyboardEvent = (
  key: string,
  options: {
    ctrlKey?: boolean;
    altKey?: boolean;
    shiftKey?: boolean;
    metaKey?: boolean;
  } = {}
): KeyboardEvent => {
  return new KeyboardEvent('keydown', {
    key,
    ctrlKey: options.ctrlKey || false,
    altKey: options.altKey || false,
    shiftKey: options.shiftKey || false,
    metaKey: options.metaKey || false,
    bubbles: true,
    cancelable: true,
  });
};

// ============================================================================
// HOOK TESTS
// ============================================================================

describe('useKeyboardShortcuts - Basic Behavior', () => {
  let mockAction: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockAction = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should trigger shortcut on matching key', () => {
    // Arrange
    const shortcuts: KeyboardShortcut[] = [
      { key: 'k', ctrl: true, description: 'Test', action: mockAction },
    ];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Act
    const event = createKeyboardEvent('k', { ctrlKey: true });
    window.dispatchEvent(event);

    // Assert
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('should not trigger on non-matching key', () => {
    // Arrange
    const shortcuts: KeyboardShortcut[] = [
      { key: 'k', ctrl: true, description: 'Test', action: mockAction },
    ];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Act
    const event = createKeyboardEvent('j', { ctrlKey: true });
    window.dispatchEvent(event);

    // Assert
    expect(mockAction).not.toHaveBeenCalled();
  });

  it('should not trigger without required modifier keys', () => {
    // Arrange
    const shortcuts: KeyboardShortcut[] = [
      { key: 'k', ctrl: true, description: 'Test', action: mockAction },
    ];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Act - Press 'k' without Ctrl
    const event = createKeyboardEvent('k');
    window.dispatchEvent(event);

    // Assert
    expect(mockAction).not.toHaveBeenCalled();
  });

  it('should handle enabled false', () => {
    // Arrange
    const shortcuts: KeyboardShortcut[] = [
      { key: 'k', ctrl: true, description: 'Test', action: mockAction },
    ];
    renderHook(() => useKeyboardShortcuts(shortcuts, false));

    // Act
    const event = createKeyboardEvent('k', { ctrlKey: true });
    window.dispatchEvent(event);

    // Assert
    expect(mockAction).not.toHaveBeenCalled();
  });

  it('should cleanup event listener on unmount', () => {
    // Arrange
    const shortcuts: KeyboardShortcut[] = [
      { key: 'k', ctrl: true, description: 'Test', action: mockAction },
    ];
    const { unmount } = renderHook(() => useKeyboardShortcuts(shortcuts));

    // Act - Unmount and try to trigger
    unmount();
    const event = createKeyboardEvent('k', { ctrlKey: true });
    window.dispatchEvent(event);

    // Assert
    expect(mockAction).not.toHaveBeenCalled();
  });
});

describe('useKeyboardShortcuts - Modifier Keys', () => {
  let mockAction: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockAction = vi.fn();
  });

  it('should handle Ctrl modifier', () => {
    // Arrange
    const shortcuts: KeyboardShortcut[] = [
      { key: 'Enter', ctrl: true, description: 'Send', action: mockAction },
    ];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Act
    const event = createKeyboardEvent('Enter', { ctrlKey: true });
    window.dispatchEvent(event);

    // Assert
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('should handle Alt modifier', () => {
    // Arrange
    const shortcuts: KeyboardShortcut[] = [
      { key: 'n', alt: true, description: 'New', action: mockAction },
    ];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Act
    const event = createKeyboardEvent('n', { altKey: true });
    window.dispatchEvent(event);

    // Assert
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('should handle Shift modifier', () => {
    // Arrange
    const shortcuts: KeyboardShortcut[] = [
      { key: 't', shift: true, description: 'Tags', action: mockAction },
    ];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Act
    const event = createKeyboardEvent('t', { shiftKey: true });
    window.dispatchEvent(event);

    // Assert
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple modifiers (Ctrl+Shift)', () => {
    // Arrange
    const shortcuts: KeyboardShortcut[] = [
      { key: 't', ctrl: true, shift: true, description: 'Add Tags', action: mockAction },
    ];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Act
    const event = createKeyboardEvent('t', { ctrlKey: true, shiftKey: true });
    window.dispatchEvent(event);

    // Assert
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('should handle Meta key (Cmd on Mac)', () => {
    // Arrange
    const shortcuts: KeyboardShortcut[] = [
      { key: 'k', ctrl: true, description: 'Search', action: mockAction },
    ];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Act - Meta key should match Ctrl
    const event = createKeyboardEvent('k', { metaKey: true });
    window.dispatchEvent(event);

    // Assert
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('should not trigger with wrong modifier combination', () => {
    // Arrange
    const shortcuts: KeyboardShortcut[] = [
      { key: 't', ctrl: true, shift: true, description: 'Test', action: mockAction },
    ];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Act - Only Ctrl, missing Shift
    const event = createKeyboardEvent('t', { ctrlKey: true });
    window.dispatchEvent(event);

    // Assert
    expect(mockAction).not.toHaveBeenCalled();
  });
});

describe('useKeyboardShortcuts - Multiple Shortcuts', () => {
  it('should handle multiple shortcuts', () => {
    // Arrange
    const mockAction1 = vi.fn();
    const mockAction2 = vi.fn();
    const shortcuts: KeyboardShortcut[] = [
      { key: 'k', ctrl: true, description: 'Search', action: mockAction1 },
      { key: 'n', ctrl: true, description: 'New', action: mockAction2 },
    ];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Act - Trigger first shortcut
    window.dispatchEvent(createKeyboardEvent('k', { ctrlKey: true }));

    // Assert
    expect(mockAction1).toHaveBeenCalledTimes(1);
    expect(mockAction2).not.toHaveBeenCalled();

    // Act - Trigger second shortcut
    window.dispatchEvent(createKeyboardEvent('n', { ctrlKey: true }));

    // Assert
    expect(mockAction1).toHaveBeenCalledTimes(1);
    expect(mockAction2).toHaveBeenCalledTimes(1);
  });

  it('should stop at first matching shortcut', () => {
    // Arrange
    const mockAction1 = vi.fn();
    const mockAction2 = vi.fn();
    const shortcuts: KeyboardShortcut[] = [
      { key: 'k', ctrl: true, description: 'Search 1', action: mockAction1 },
      { key: 'k', ctrl: true, description: 'Search 2', action: mockAction2 }, // Duplicate
    ];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Act
    window.dispatchEvent(createKeyboardEvent('k', { ctrlKey: true }));

    // Assert - Only first action should be called
    expect(mockAction1).toHaveBeenCalledTimes(1);
    expect(mockAction2).not.toHaveBeenCalled();
  });
});

describe('useKeyboardShortcuts - PreventDefault', () => {
  it('should prevent default by default', () => {
    // Arrange
    const mockAction = vi.fn();
    const shortcuts: KeyboardShortcut[] = [
      { key: 'k', ctrl: true, description: 'Test', action: mockAction },
    ];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Act
    const event = createKeyboardEvent('k', { ctrlKey: true });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    window.dispatchEvent(event);

    // Assert
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(mockAction).toHaveBeenCalled();
  });

  it('should not prevent default when preventDefault is false', () => {
    // Arrange
    const mockAction = vi.fn();
    const shortcuts: KeyboardShortcut[] = [
      { key: 'k', ctrl: true, description: 'Test', action: mockAction, preventDefault: false },
    ];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Act
    const event = createKeyboardEvent('k', { ctrlKey: true });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    window.dispatchEvent(event);

    // Assert
    expect(preventDefaultSpy).not.toHaveBeenCalled();
    expect(mockAction).toHaveBeenCalled();
  });
});

describe('useKeyboardShortcuts - Case Insensitivity', () => {
  it('should match keys case-insensitively', () => {
    // Arrange
    const mockAction = vi.fn();
    const shortcuts: KeyboardShortcut[] = [
      { key: 'K', ctrl: true, description: 'Test', action: mockAction }, // Uppercase in config
    ];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Act - Press lowercase 'k'
    window.dispatchEvent(createKeyboardEvent('k', { ctrlKey: true }));

    // Assert
    expect(mockAction).toHaveBeenCalledTimes(1);
  });
});

describe('useKeyboardShortcuts - Real-World Scenarios', () => {
  it('should handle agent conversation shortcuts', () => {
    // Arrange
    const mockSend = vi.fn();
    const mockNext = vi.fn();
    const mockPrev = vi.fn();
    const shortcuts: KeyboardShortcut[] = [
      { key: 'Enter', ctrl: true, description: 'Send message', action: mockSend },
      { key: 'n', ctrl: true, description: 'Next conversation', action: mockNext },
      { key: 'p', ctrl: true, description: 'Previous conversation', action: mockPrev },
    ];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Act - Send message
    window.dispatchEvent(createKeyboardEvent('Enter', { ctrlKey: true }));
    expect(mockSend).toHaveBeenCalledTimes(1);

    // Act - Next conversation
    window.dispatchEvent(createKeyboardEvent('n', { ctrlKey: true }));
    expect(mockNext).toHaveBeenCalledTimes(1);

    // Act - Previous conversation
    window.dispatchEvent(createKeyboardEvent('p', { ctrlKey: true }));
    expect(mockPrev).toHaveBeenCalledTimes(1);
  });

  it('should handle search and modal shortcuts', () => {
    // Arrange
    const mockSearch = vi.fn();
    const mockClose = vi.fn();
    const mockHelp = vi.fn();
    const shortcuts: KeyboardShortcut[] = [
      { key: 'k', ctrl: true, description: 'Focus search', action: mockSearch },
      { key: 'Escape', description: 'Close modals', action: mockClose },
      { key: '?', description: 'Show help', action: mockHelp },
    ];
    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Act & Assert
    window.dispatchEvent(createKeyboardEvent('k', { ctrlKey: true }));
    expect(mockSearch).toHaveBeenCalledTimes(1);

    window.dispatchEvent(createKeyboardEvent('Escape'));
    expect(mockClose).toHaveBeenCalledTimes(1);

    window.dispatchEvent(createKeyboardEvent('?'));
    expect(mockHelp).toHaveBeenCalledTimes(1);
  });
});

// ============================================================================
// HELPER FUNCTION TESTS
// ============================================================================

describe('getAgentKeyboardShortcuts - Helper Function', () => {
  it('should return structured keyboard shortcuts', () => {
    // Arrange
    const mockT = (key: string) => key;

    // Act
    const shortcuts = getAgentKeyboardShortcuts(mockT);

    // Assert
    expect(shortcuts).toBeInstanceOf(Array);
    expect(shortcuts.length).toBeGreaterThan(0);
  });

  it('should have general category', () => {
    // Arrange
    const mockT = (key: string) => key;

    // Act
    const shortcuts = getAgentKeyboardShortcuts(mockT);
    const generalCategory = shortcuts.find(cat => cat.category === 'keyboard.categories.general');

    // Assert
    expect(generalCategory).toBeDefined();
    expect(generalCategory?.shortcuts).toBeInstanceOf(Array);
    expect(generalCategory?.shortcuts.length).toBeGreaterThan(0);
  });

  it('should have conversations category', () => {
    // Arrange
    const mockT = (key: string) => key;

    // Act
    const shortcuts = getAgentKeyboardShortcuts(mockT);
    const convoCategory = shortcuts.find(cat => cat.category === 'keyboard.categories.conversations');

    // Assert
    expect(convoCategory).toBeDefined();
    expect(convoCategory?.shortcuts).toBeInstanceOf(Array);
  });

  it('should have quick actions category', () => {
    // Arrange
    const mockT = (key: string) => key;

    // Act
    const shortcuts = getAgentKeyboardShortcuts(mockT);
    const quickCategory = shortcuts.find(cat => cat.category === 'keyboard.categories.quickActions');

    // Assert
    expect(quickCategory).toBeDefined();
    expect(quickCategory?.shortcuts).toBeInstanceOf(Array);
  });

  it('should have proper shortcut structure', () => {
    // Arrange
    const mockT = (key: string) => key;

    // Act
    const shortcuts = getAgentKeyboardShortcuts(mockT);
    const firstShortcut = shortcuts[0].shortcuts[0];

    // Assert
    expect(firstShortcut).toHaveProperty('keys');
    expect(firstShortcut).toHaveProperty('description');
    expect(typeof firstShortcut.keys).toBe('string');
    expect(typeof firstShortcut.description).toBe('string');
  });

  it('should use translation function', () => {
    // Arrange
    const mockT = vi.fn((key: string) => `TRANSLATED_${key}`);

    // Act
    const shortcuts = getAgentKeyboardShortcuts(mockT);

    // Assert - Translation function should be called
    expect(mockT).toHaveBeenCalled();
    expect(shortcuts[0].category).toContain('TRANSLATED_');
  });
});

describe('getAgentKeyboardShortcuts - Content Validation', () => {
  it('should include search shortcut', () => {
    // Arrange
    const mockT = (key: string) => key;

    // Act
    const shortcuts = getAgentKeyboardShortcuts(mockT);
    const allShortcuts = shortcuts.flatMap(cat => cat.shortcuts);
    const searchShortcut = allShortcuts.find(s => s.keys === 'Ctrl+K');

    // Assert
    expect(searchShortcut).toBeDefined();
    expect(searchShortcut?.description).toBe('keyboard.focusSearch');
  });

  it('should include send message shortcut', () => {
    // Arrange
    const mockT = (key: string) => key;

    // Act
    const shortcuts = getAgentKeyboardShortcuts(mockT);
    const allShortcuts = shortcuts.flatMap(cat => cat.shortcuts);
    const sendShortcut = allShortcuts.find(s => s.keys === 'Ctrl+Enter');

    // Assert
    expect(sendShortcut).toBeDefined();
    expect(sendShortcut?.description).toBe('keyboard.sendMessage');
  });

  it('should include navigation shortcuts', () => {
    // Arrange
    const mockT = (key: string) => key;

    // Act
    const shortcuts = getAgentKeyboardShortcuts(mockT);
    const allShortcuts = shortcuts.flatMap(cat => cat.shortcuts);

    // Assert
    const nextShortcut = allShortcuts.find(s => s.keys === 'Ctrl+N');
    const prevShortcut = allShortcuts.find(s => s.keys === 'Ctrl+P');
    expect(nextShortcut).toBeDefined();
    expect(prevShortcut).toBeDefined();
  });
});

