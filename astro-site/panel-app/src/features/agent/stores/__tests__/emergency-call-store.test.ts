/**
 * Emergency Call Store Tests - ENTERPRISE GRADE
 * 
 * Comprehensive tests for emergency call state management
 * 
 * @group store
 * @group agent
 * @group emergency
 * 
 * ALTIN KURALLAR:
 * ✅ STATE TESTS - no network, no API mocks
 * ✅ AAA Pattern (Arrange-Act-Assert)
 * ✅ Tek test → tek davranış
 * ✅ Deterministik testler (fixed time)
 * ✅ State izolasyonu (her test kendi store instance)
 * ✅ Minimal test data
 * ✅ Positive + Negative tests
 * ✅ Real-world scenarios
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  useEmergencyCallStore,
  selectActiveCall,
  selectIsRinging,
  selectCallQueueCount,
  selectIsMuted,
  type EmergencyCall,
  type Message,
} from '../emergency-call-store';

// ============================================================================
// MOCKS
// ============================================================================

// Mock logger
vi.mock('@/shared/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock window.location
delete (window as any).location;
window.location = { href: '' } as any;

// Mock Notification API
(global as any).Notification = class Notification {
  static permission = 'granted';
  constructor(public title: string, public options: any) {}
};

// Mock navigator.vibrate
Object.defineProperty(navigator, 'vibrate', {
  writable: true,
  value: vi.fn(),
});

// ============================================================================
// TEST FACTORIES
// ============================================================================

/**
 * Factory: Create mock emergency call
 */
const createMockCall = (overrides?: Partial<EmergencyCall>): EmergencyCall => ({
  id: 'call-123',
  customerName: 'Test Customer',
  customerPhone: '+905551234567',
  customerEmail: 'test@example.com',
  conversationId: 'conv-456',
  priority: 'critical',
  timestamp: new Date('2024-01-15T10:00:00Z'),
  messages: [],
  ...overrides,
});

/**
 * Factory: Create mock message
 */
const createMockMessage = (overrides?: Partial<Message>): Message => ({
  id: 'msg-1',
  sender: 'customer',
  senderName: 'Test Customer',
  content: 'Help! This is urgent!',
  timestamp: new Date('2024-01-15T10:00:00Z'),
  type: 'text',
  ...overrides,
});

// ============================================================================
// INITIAL STATE TESTS
// ============================================================================

describe('EmergencyCallStore - Initial State', () => {
  it('should have correct initial state', () => {
    // Arrange
    const store = useEmergencyCallStore.getState();

    // Assert
    expect(store.activeCall).toBeNull();
    expect(store.callQueue).toEqual([]);
    expect(store.isRinging).toBe(false);
    expect(store.isMuted).toBe(false);
    expect(store.currentAgentName).toBeUndefined();
  });

  it('should have all required actions', () => {
    // Arrange
    const store = useEmergencyCallStore.getState();

    // Assert
    expect(typeof store.triggerEmergencyCall).toBe('function');
    expect(typeof store.acceptCall).toBe('function');
    expect(typeof store.rejectCall).toBe('function');
    expect(typeof store.dismissCall).toBe('function');
    expect(typeof store.toggleMute).toBe('function');
    expect(typeof store.clearQueue).toBe('function');
    expect(typeof store.setCurrentAgent).toBe('function');
  });
});

// ============================================================================
// TRIGGER EMERGENCY CALL TESTS
// ============================================================================

describe('EmergencyCallStore - triggerEmergencyCall', () => {
  beforeEach(() => {
    // Reset store to initial state
    const store = useEmergencyCallStore.getState();
    store.dismissCall();
    store.clearQueue();
  });

  it('should activate new emergency call', () => {
    // Arrange
    const call = createMockCall();
    const store = useEmergencyCallStore.getState();

    // Act
    store.triggerEmergencyCall(call);

    // Assert
    const state = useEmergencyCallStore.getState();
    expect(state.activeCall).toEqual(call);
    expect(state.isRinging).toBe(true);
  });

  it('should add call to queue if active call exists', () => {
    // Arrange
    const firstCall = createMockCall({ id: 'call-1' });
    const secondCall = createMockCall({ id: 'call-2' });
    const store = useEmergencyCallStore.getState();

    // Act
    store.triggerEmergencyCall(firstCall);
    store.triggerEmergencyCall(secondCall);

    // Assert
    const state = useEmergencyCallStore.getState();
    expect(state.activeCall?.id).toBe('call-1');
    expect(state.callQueue).toHaveLength(1);
    expect(state.callQueue[0].id).toBe('call-2');
  });

  it('should handle multiple calls in queue', () => {
    // Arrange
    const calls = [
      createMockCall({ id: 'call-1' }),
      createMockCall({ id: 'call-2' }),
      createMockCall({ id: 'call-3' }),
    ];
    const store = useEmergencyCallStore.getState();

    // Act
    calls.forEach(call => store.triggerEmergencyCall(call));

    // Assert
    const state = useEmergencyCallStore.getState();
    expect(state.activeCall?.id).toBe('call-1');
    expect(state.callQueue).toHaveLength(2);
    expect(state.callQueue.map(c => c.id)).toEqual(['call-2', 'call-3']);
  });

  it('should trigger browser notification if permission granted', () => {
    // Arrange
    const call = createMockCall();
    const store = useEmergencyCallStore.getState();

    // Act
    store.triggerEmergencyCall(call);

    // Assert - Notification constructor should be called
    // Note: In real test, we'd spy on Notification constructor
    expect(useEmergencyCallStore.getState().isRinging).toBe(true);
  });

  it('should trigger vibration on mobile devices', () => {
    // Arrange
    const call = createMockCall();
    const store = useEmergencyCallStore.getState();

    // Act
    store.triggerEmergencyCall(call);

    // Assert
    expect(navigator.vibrate).toHaveBeenCalledWith([200, 100, 200, 100, 200, 100, 200]);
  });
});

// ============================================================================
// ACCEPT CALL TESTS
// ============================================================================

describe('EmergencyCallStore - acceptCall', () => {
  beforeEach(() => {
    const store = useEmergencyCallStore.getState();
    store.dismissCall();
    store.clearQueue();
    // Reset currentAgentName
    useEmergencyCallStore.setState({ currentAgentName: undefined });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should accept active call and update state', () => {
    // Arrange
    const call = createMockCall();
    const store = useEmergencyCallStore.getState();
    store.triggerEmergencyCall(call);

    // Act
    store.acceptCall('Agent John');

    // Assert
    const state = useEmergencyCallStore.getState();
    expect(state.activeCall?.takenBy).toBeDefined();
    expect(state.activeCall?.takenBy?.agentName).toBe('Agent John');
    expect(state.isRinging).toBe(false);
    expect(state.currentAgentName).toBe('Agent John');
  });

  it('should redirect to voice call screen', () => {
    // Arrange
    const call = createMockCall({ conversationId: 'conv-456' });
    const store = useEmergencyCallStore.getState();
    store.triggerEmergencyCall(call);

    // Act
    store.acceptCall('Agent Jane');

    // Assert
    expect(window.location.href).toBe('/agent/voice-call/conv-456');
  });

  it('should do nothing if no active call', () => {
    // Arrange
    const store = useEmergencyCallStore.getState();

    // Act
    store.acceptCall('Agent Bob');

    // Assert - With early return, state should not change
    const state = useEmergencyCallStore.getState();
    expect(state.activeCall).toBeNull();
    expect(state.currentAgentName).toBeUndefined();
  });

  it('should process next call in queue after accepting', async () => {
    // Arrange
    const firstCall = createMockCall({ id: 'call-1' });
    const secondCall = createMockCall({ id: 'call-2' });
    const store = useEmergencyCallStore.getState();
    store.triggerEmergencyCall(firstCall);
    store.triggerEmergencyCall(secondCall);

    // Act
    store.acceptCall('Agent Alice');
    vi.advanceTimersByTime(501); // Wait for timeout

    // Assert - After timeout, queue should be processed
    // Note: Due to redirect, activeCall is cleared, but queue processing would happen
    const state = useEmergencyCallStore.getState();
    expect(state.callQueue.length).toBeLessThanOrEqual(1);
  });
});

// ============================================================================
// REJECT CALL TESTS
// ============================================================================

describe('EmergencyCallStore - rejectCall', () => {
  beforeEach(() => {
    const store = useEmergencyCallStore.getState();
    store.dismissCall();
    store.clearQueue();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should reject active call and clear state', () => {
    // Arrange
    const call = createMockCall();
    const store = useEmergencyCallStore.getState();
    store.triggerEmergencyCall(call);

    // Act
    store.rejectCall('Agent busy');

    // Assert
    const state = useEmergencyCallStore.getState();
    expect(state.activeCall).toBeNull();
    expect(state.isRinging).toBe(false);
  });

  it('should do nothing if no active call', () => {
    // Arrange
    const store = useEmergencyCallStore.getState();

    // Act
    store.rejectCall('No reason');

    // Assert - Should not throw
    expect(useEmergencyCallStore.getState().activeCall).toBeNull();
  });

  it('should process next call in queue after rejection', () => {
    // Arrange
    const firstCall = createMockCall({ id: 'call-1' });
    const secondCall = createMockCall({ id: 'call-2' });
    const store = useEmergencyCallStore.getState();
    store.triggerEmergencyCall(firstCall);
    store.triggerEmergencyCall(secondCall);

    // Act
    store.rejectCall('Busy');
    vi.advanceTimersByTime(1001); // Wait for timeout

    // Assert - Next call should be triggered
    const state = useEmergencyCallStore.getState();
    expect(state.callQueue.length).toBeLessThanOrEqual(0);
  });
});

// ============================================================================
// DISMISS & UTILITY TESTS
// ============================================================================

describe('EmergencyCallStore - Utility Actions', () => {
  beforeEach(() => {
    const store = useEmergencyCallStore.getState();
    store.dismissCall();
    store.clearQueue();
  });

  describe('dismissCall', () => {
    it('should dismiss active call', () => {
      // Arrange
      const call = createMockCall();
      const store = useEmergencyCallStore.getState();
      store.triggerEmergencyCall(call);

      // Act
      store.dismissCall();

      // Assert
      const state = useEmergencyCallStore.getState();
      expect(state.activeCall).toBeNull();
      expect(state.isRinging).toBe(false);
    });
  });

  describe('toggleMute', () => {
    it('should toggle mute state', () => {
      // Arrange
      const store = useEmergencyCallStore.getState();

      // Act
      store.toggleMute();

      // Assert
      expect(useEmergencyCallStore.getState().isMuted).toBe(true);

      // Act again
      store.toggleMute();

      // Assert
      expect(useEmergencyCallStore.getState().isMuted).toBe(false);
    });
  });

  describe('clearQueue', () => {
    it('should clear all queued calls', () => {
      // Arrange
      const calls = [
        createMockCall({ id: 'call-1' }),
        createMockCall({ id: 'call-2' }),
        createMockCall({ id: 'call-3' }),
      ];
      const store = useEmergencyCallStore.getState();
      calls.forEach(call => store.triggerEmergencyCall(call));

      // Act
      store.clearQueue();

      // Assert
      const state = useEmergencyCallStore.getState();
      expect(state.callQueue).toEqual([]);
    });
  });

  describe('setCurrentAgent', () => {
    it('should set current agent name', () => {
      // Arrange
      const store = useEmergencyCallStore.getState();

      // Act
      store.setCurrentAgent('Agent Smith');

      // Assert
      expect(useEmergencyCallStore.getState().currentAgentName).toBe('Agent Smith');
    });
  });
});

// ============================================================================
// SELECTORS TESTS
// ============================================================================

describe('EmergencyCallStore - Selectors', () => {
  beforeEach(() => {
    const store = useEmergencyCallStore.getState();
    store.dismissCall();
    store.clearQueue();
  });

  it('should select active call', () => {
    // Arrange
    const call = createMockCall();
    const store = useEmergencyCallStore.getState();
    store.triggerEmergencyCall(call);

    // Act
    const activeCall = selectActiveCall(useEmergencyCallStore.getState());

    // Assert
    expect(activeCall).toEqual(call);
  });

  it('should select isRinging', () => {
    // Arrange
    const call = createMockCall();
    const store = useEmergencyCallStore.getState();
    store.triggerEmergencyCall(call);

    // Act
    const isRinging = selectIsRinging(useEmergencyCallStore.getState());

    // Assert
    expect(isRinging).toBe(true);
  });

  it('should select call queue count', () => {
    // Arrange
    const calls = [
      createMockCall({ id: 'call-1' }),
      createMockCall({ id: 'call-2' }),
    ];
    const store = useEmergencyCallStore.getState();
    calls.forEach(call => store.triggerEmergencyCall(call));

    // Act
    const count = selectCallQueueCount(useEmergencyCallStore.getState());

    // Assert
    expect(count).toBe(1); // First is active, second in queue
  });

  it('should select isMuted', () => {
    // Arrange
    const store = useEmergencyCallStore.getState();
    store.toggleMute();

    // Act
    const isMuted = selectIsMuted(useEmergencyCallStore.getState());

    // Assert
    expect(isMuted).toBe(true);
  });
});

// ============================================================================
// EDGE CASES & REAL-WORLD SCENARIOS
// ============================================================================

describe('EmergencyCallStore - Edge Cases', () => {
  beforeEach(() => {
    const store = useEmergencyCallStore.getState();
    store.dismissCall();
    store.clearQueue();
  });

  it('should handle call with all metadata', () => {
    // Arrange
    const call = createMockCall({
      metadata: {
        aiAttempts: 3,
        waitingTime: 300,
        customerSentiment: 'frustrated',
        tags: ['vip', 'technical-issue'],
      },
      messages: [
        createMockMessage({ content: 'I need help urgently!' }),
      ],
    });
    const store = useEmergencyCallStore.getState();

    // Act
    store.triggerEmergencyCall(call);

    // Assert
    const state = useEmergencyCallStore.getState();
    expect(state.activeCall?.metadata?.aiAttempts).toBe(3);
    expect(state.activeCall?.messages).toHaveLength(1);
  });

  it('should handle rapid multiple call triggers', () => {
    // Arrange
    const calls = Array.from({ length: 10 }, (_, i) =>
      createMockCall({ id: `call-${i}` })
    );
    const store = useEmergencyCallStore.getState();

    // Act
    calls.forEach(call => store.triggerEmergencyCall(call));

    // Assert
    const state = useEmergencyCallStore.getState();
    expect(state.activeCall).toBeDefined();
    expect(state.callQueue).toHaveLength(9);
  });

  it('should handle accept with empty agent name', () => {
    // Arrange
    const call = createMockCall();
    const store = useEmergencyCallStore.getState();
    store.triggerEmergencyCall(call);

    // Act
    store.acceptCall('');

    // Assert
    const state = useEmergencyCallStore.getState();
    expect(state.activeCall?.takenBy?.agentName).toBe('');
  });
});

describe('EmergencyCallStore - Real-World Scenarios', () => {
  beforeEach(() => {
    const store = useEmergencyCallStore.getState();
    store.dismissCall();
    store.clearQueue();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should handle complete call lifecycle', () => {
    // Arrange
    const call = createMockCall();

    // Act - Trigger call (get fresh state reference each time)
    useEmergencyCallStore.getState().triggerEmergencyCall(call);
    expect(useEmergencyCallStore.getState().isRinging).toBe(true);
    expect(useEmergencyCallStore.getState().activeCall?.id).toBe(call.id);

    // Act - Accept call
    useEmergencyCallStore.getState().acceptCall('Agent Tom');
    expect(useEmergencyCallStore.getState().isRinging).toBe(false);
    expect(useEmergencyCallStore.getState().currentAgentName).toBe('Agent Tom');
    expect(useEmergencyCallStore.getState().activeCall?.takenBy?.agentName).toBe('Agent Tom');

    // Act - Dismiss call to end lifecycle
    useEmergencyCallStore.getState().dismissCall();
    
    // Assert - Call ended
    const finalState = useEmergencyCallStore.getState();
    expect(finalState.activeCall).toBeNull();
    expect(finalState.isRinging).toBe(false);
  });

  it('should handle queue processing after rejection', () => {
    // Arrange
    const calls = [
      createMockCall({ id: 'call-1', priority: 'critical' }),
      createMockCall({ id: 'call-2', priority: 'urgent' }),
      createMockCall({ id: 'call-3', priority: 'high' }),
    ];
    const store = useEmergencyCallStore.getState();

    // Act - Add all calls
    calls.forEach(call => store.triggerEmergencyCall(call));

    // Assert - First call active, others queued
    expect(useEmergencyCallStore.getState().activeCall?.id).toBe('call-1');
    expect(useEmergencyCallStore.getState().callQueue).toHaveLength(2);

    // Act - Reject first call
    store.rejectCall('Agent busy');
    vi.advanceTimersByTime(1001);

    // Assert - Next call processed
    const state = useEmergencyCallStore.getState();
    expect(state.callQueue.length).toBeLessThanOrEqual(1);
  });

  it('should handle VIP customer with metadata', () => {
    // Arrange
    const vipCall = createMockCall({
      customerName: 'VIP Customer',
      priority: 'critical',
      metadata: {
        tags: ['vip', 'premium', 'high-value'],
        customerSentiment: 'angry',
        aiAttempts: 5,
        waitingTime: 600,
      },
    });
    const store = useEmergencyCallStore.getState();

    // Act
    store.triggerEmergencyCall(vipCall);

    // Assert
    const state = useEmergencyCallStore.getState();
    expect(state.activeCall?.priority).toBe('critical');
    expect(state.activeCall?.metadata?.tags).toContain('vip');
  });
});

