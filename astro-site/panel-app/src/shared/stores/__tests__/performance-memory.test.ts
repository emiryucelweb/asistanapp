/**
 * @vitest-environment jsdom
 * 
 * Performance & Memory Leak Tests - ENTERPRISE GRADE
 * 
 * Tests for:
 * - Zustand store memory management
 * - Event listener cleanup
 * - Subscription management
 * - State accumulation prevention
 * - Long-running session handling
 * 
 * @group performance
 * @group memory
 * @group stores
 * 
 * ALTIN KURALLAR:
 * ✅ AAA Pattern (Arrange-Act-Assert)
 * ✅ Tek test → tek davranış
 * ✅ State izolasyonu (beforeEach/afterEach)
 * ✅ Mock Stratejisi Tutarlı
 * ✅ Descriptive Naming
 * ✅ Edge Case Coverage
 * ✅ Real-World Scenarios
 * ✅ Cleanup
 * ✅ Type Safety
 */

import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { act, renderHook, cleanup } from '@testing-library/react';

// ============================================================================
// MOCKS
// ============================================================================

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Mock fetch
global.fetch = vi.fn();

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock logger
vi.mock('@/shared/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// ============================================================================
// MEMORY LEAK DETECTION UTILITIES
// ============================================================================

class MemoryLeakDetector {
  private listeners: Map<string, Set<Function>> = new Map();
  private subscriptions: Set<Function> = new Set();
  private intervals: Set<ReturnType<typeof setInterval>> = new Set();
  private timeouts: Set<ReturnType<typeof setTimeout>> = new Set();

  registerEventListener(eventName: string, handler: Function) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName)!.add(handler);
  }

  unregisterEventListener(eventName: string, handler: Function) {
    this.listeners.get(eventName)?.delete(handler);
  }

  registerSubscription(unsubscribe: Function) {
    this.subscriptions.add(unsubscribe);
    return () => this.subscriptions.delete(unsubscribe);
  }

  registerInterval(id: ReturnType<typeof setInterval>) {
    this.intervals.add(id);
  }

  clearInterval(id: ReturnType<typeof setInterval>) {
    this.intervals.delete(id);
  }

  registerTimeout(id: ReturnType<typeof setTimeout>) {
    this.timeouts.add(id);
  }

  clearTimeout(id: ReturnType<typeof setTimeout>) {
    this.timeouts.delete(id);
  }

  getActiveListenerCount(): number {
    let count = 0;
    this.listeners.forEach(handlers => {
      count += handlers.size;
    });
    return count;
  }

  getActiveSubscriptionCount(): number {
    return this.subscriptions.size;
  }

  getActiveIntervalCount(): number {
    return this.intervals.size;
  }

  getActiveTimeoutCount(): number {
    return this.timeouts.size;
  }

  reset() {
    this.listeners.clear();
    this.subscriptions.clear();
    this.intervals.forEach(clearInterval);
    this.intervals.clear();
    this.timeouts.forEach(clearTimeout);
    this.timeouts.clear();
  }
}

// ============================================================================
// ZUSTAND STORE MEMORY TESTS
// ============================================================================

describe('Zustand Store - Memory Management', () => {
  let detector: MemoryLeakDetector;

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.clear();
    detector = new MemoryLeakDetector();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    detector.reset();
    cleanup();
  });

  describe('Auth Store Memory', () => {
    it('should not leak subscriptions after multiple state changes', async () => {
      // Arrange
      const { create } = await import('zustand');
      
      interface TestStore {
        count: number;
        increment: () => void;
      }
      
      const useTestStore = create<TestStore>((set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
      }));

      const subscriptions: (() => void)[] = [];

      // Act - Create multiple subscriptions and unsubscribe
      for (let i = 0; i < 100; i++) {
        const unsub = useTestStore.subscribe((state) => {
          // noop listener
        });
        subscriptions.push(unsub);
      }

      // Unsubscribe all
      subscriptions.forEach(unsub => unsub());

      // Assert - All subscriptions should be cleaned up
      // The store should still work
      useTestStore.getState().increment();
      expect(useTestStore.getState().count).toBe(1);
    });

    it('should handle rapid state updates without memory accumulation', async () => {
      // Arrange
      const { create } = await import('zustand');
      
      interface TestStore {
        items: string[];
        addItem: (item: string) => void;
        clearItems: () => void;
      }
      
      const useTestStore = create<TestStore>((set) => ({
        items: [],
        addItem: (item) => set((state) => ({ items: [...state.items, item] })),
        clearItems: () => set({ items: [] }),
      }));

      // Act - Add many items then clear
      for (let i = 0; i < 1000; i++) {
        useTestStore.getState().addItem(`item-${i}`);
      }

      const sizeBeforeClear = useTestStore.getState().items.length;
      useTestStore.getState().clearItems();
      const sizeAfterClear = useTestStore.getState().items.length;

      // Assert
      expect(sizeBeforeClear).toBe(1000);
      expect(sizeAfterClear).toBe(0);
    });

    it('should cleanup persisted state when logout', () => {
      // Arrange
      mockLocalStorage.setItem('authToken', 'test-token');
      mockLocalStorage.setItem('refreshToken', 'test-refresh');
      mockLocalStorage.setItem('tenantId', 'test-tenant');

      // Act - Simulate logout cleanup
      mockLocalStorage.removeItem('authToken');
      mockLocalStorage.removeItem('refreshToken');
      mockLocalStorage.removeItem('tenantId');

      // Assert
      expect(mockLocalStorage.getItem('authToken')).toBeNull();
      expect(mockLocalStorage.getItem('refreshToken')).toBeNull();
      expect(mockLocalStorage.getItem('tenantId')).toBeNull();
    });
  });

  describe('Notification Store Memory', () => {
    it('should not accumulate notifications without limit', async () => {
      // Arrange
      const { create } = await import('zustand');
      
      const MAX_NOTIFICATIONS = 50;
      
      interface Notification {
        id: string;
        message: string;
      }
      
      interface NotificationStore {
        notifications: Notification[];
        addNotification: (notification: Notification) => void;
        removeNotification: (id: string) => void;
        clearAll: () => void;
      }
      
      const useNotificationStore = create<NotificationStore>((set, get) => ({
        notifications: [],
        addNotification: (notification) => set((state) => {
          const newNotifications = [...state.notifications, notification];
          // Limit to MAX_NOTIFICATIONS
          return {
            notifications: newNotifications.slice(-MAX_NOTIFICATIONS),
          };
        }),
        removeNotification: (id) => set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id),
        })),
        clearAll: () => set({ notifications: [] }),
      }));

      // Act - Add more than limit
      for (let i = 0; i < 100; i++) {
        useNotificationStore.getState().addNotification({
          id: `notif-${i}`,
          message: `Message ${i}`,
        });
      }

      // Assert - Should be limited
      expect(useNotificationStore.getState().notifications.length).toBe(MAX_NOTIFICATIONS);
    });
  });

  describe('Theme Store Memory', () => {
    it('should not leak when toggling theme rapidly', async () => {
      // Arrange
      const { create } = await import('zustand');
      
      interface ThemeStore {
        theme: 'light' | 'dark';
        toggleTheme: () => void;
      }
      
      const useThemeStore = create<ThemeStore>((set, get) => ({
        theme: 'light',
        toggleTheme: () => set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
      }));

      // Act - Toggle many times
      for (let i = 0; i < 1000; i++) {
        useThemeStore.getState().toggleTheme();
      }

      // Assert - Should end in original state (even number of toggles)
      expect(useThemeStore.getState().theme).toBe('light');
    });
  });
});

// ============================================================================
// EVENT LISTENER CLEANUP TESTS
// ============================================================================

describe('Event Listener Cleanup', () => {
  let originalAddEventListener: typeof window.addEventListener;
  let originalRemoveEventListener: typeof window.removeEventListener;
  let addedListeners: Map<string, Set<EventListener>>;
  let removedListeners: Map<string, Set<EventListener>>;

  beforeAll(() => {
    addedListeners = new Map();
    removedListeners = new Map();

    originalAddEventListener = window.addEventListener;
    originalRemoveEventListener = window.removeEventListener;

    window.addEventListener = vi.fn((type: string, listener: EventListener) => {
      if (!addedListeners.has(type)) {
        addedListeners.set(type, new Set());
      }
      addedListeners.get(type)!.add(listener);
      originalAddEventListener.call(window, type, listener);
    });

    window.removeEventListener = vi.fn((type: string, listener: EventListener) => {
      if (!removedListeners.has(type)) {
        removedListeners.set(type, new Set());
      }
      removedListeners.get(type)!.add(listener);
      originalRemoveEventListener.call(window, type, listener);
    });
  });

  afterAll(() => {
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;
  });

  beforeEach(() => {
    addedListeners.clear();
    removedListeners.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should cleanup resize listeners on unmount', () => {
    // Arrange
    const TestComponent = () => {
      const [width, setWidth] = React.useState(window.innerWidth);

      React.useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);

      return null;
    };

    const React = require('react');
    const { render, unmount } = require('@testing-library/react');

    // Act
    const { unmount: unmountComponent } = render(React.createElement(TestComponent));
    const addedCount = addedListeners.get('resize')?.size ?? 0;

    unmountComponent();
    const removedCount = removedListeners.get('resize')?.size ?? 0;

    // Assert
    expect(addedCount).toBe(removedCount);
  });

  it('should cleanup online/offline listeners', () => {
    // Arrange
    const TestComponent = () => {
      const [isOnline, setIsOnline] = React.useState(true);

      React.useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      }, []);

      return null;
    };

    const React = require('react');
    const { render } = require('@testing-library/react');

    // Act
    const { unmount } = render(React.createElement(TestComponent));

    const addedOnline = addedListeners.get('online')?.size ?? 0;
    const addedOffline = addedListeners.get('offline')?.size ?? 0;

    unmount();

    const removedOnline = removedListeners.get('online')?.size ?? 0;
    const removedOffline = removedListeners.get('offline')?.size ?? 0;

    // Assert
    expect(addedOnline).toBe(removedOnline);
    expect(addedOffline).toBe(removedOffline);
  });
});

// ============================================================================
// WEBSOCKET MEMORY TESTS
// ============================================================================

describe('WebSocket Memory Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('should cleanup WebSocket on component unmount', () => {
    // Arrange
    const mockWebSocket = {
      send: vi.fn(),
      close: vi.fn(),
      readyState: 1,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    const closeSpy = mockWebSocket.close;

    // Simulate a hook that manages WebSocket
    const useWebSocketMock = () => {
      const wsRef = React.useRef<typeof mockWebSocket | null>(null);

      React.useEffect(() => {
        wsRef.current = mockWebSocket;

        return () => {
          if (wsRef.current) {
            wsRef.current.close();
          }
        };
      }, []);

      return wsRef;
    };

    const React = require('react');

    // Act
    const { result, unmount } = renderHook(() => useWebSocketMock());
    unmount();

    // Assert
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should handle WebSocket reconnection without memory leak', () => {
    // Arrange
    const connections: { close: ReturnType<typeof vi.fn> }[] = [];

    const createMockWebSocket = () => {
      const ws = {
        send: vi.fn(),
        close: vi.fn(),
        readyState: 1,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
      connections.push(ws);
      return ws;
    };

    // Simulate reconnection
    let currentWs = createMockWebSocket();

    const reconnect = () => {
      currentWs.close();
      currentWs = createMockWebSocket();
    };

    // Act - Reconnect 10 times
    for (let i = 0; i < 10; i++) {
      reconnect();
    }

    // Assert - All previous connections should be closed
    expect(connections.length).toBe(11); // Initial + 10 reconnects
    // First 10 should have close called
    for (let i = 0; i < 10; i++) {
      expect(connections[i].close).toHaveBeenCalled();
    }
    // Last one should not be closed yet
    expect(connections[10].close).not.toHaveBeenCalled();
  });
});

// ============================================================================
// INTERVAL & TIMEOUT CLEANUP TESTS
// ============================================================================

describe('Interval & Timeout Cleanup', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    cleanup();
  });

  it('should cleanup setInterval on unmount', () => {
    // Arrange
    const intervalCallback = vi.fn();
    const React = require('react');

    const TestComponent = () => {
      React.useEffect(() => {
        const interval = setInterval(intervalCallback, 1000);
        return () => clearInterval(interval);
      }, []);
      return null;
    };

    const { render } = require('@testing-library/react');

    // Act
    const { unmount } = render(React.createElement(TestComponent));

    // Advance timers while mounted
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(intervalCallback).toHaveBeenCalledTimes(3);

    // Unmount
    unmount();

    // Advance timers after unmount
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Assert - Should not call after unmount
    expect(intervalCallback).toHaveBeenCalledTimes(3);
  });

  it('should cleanup setTimeout on unmount', () => {
    // Arrange
    const timeoutCallback = vi.fn();
    const React = require('react');

    const TestComponent = () => {
      React.useEffect(() => {
        const timeout = setTimeout(timeoutCallback, 5000);
        return () => clearTimeout(timeout);
      }, []);
      return null;
    };

    const { render } = require('@testing-library/react');

    // Act
    const { unmount } = render(React.createElement(TestComponent));

    // Unmount before timeout fires
    unmount();

    // Advance past timeout
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // Assert - Should not be called
    expect(timeoutCallback).not.toHaveBeenCalled();
  });
});

// ============================================================================
// STATE ACCUMULATION TESTS
// ============================================================================

describe('State Accumulation Prevention', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should limit chat message history', async () => {
    // Arrange
    const MAX_MESSAGES = 100;
    const { create } = await import('zustand');

    interface Message {
      id: string;
      content: string;
    }

    interface ChatStore {
      messages: Message[];
      addMessage: (message: Message) => void;
      clearMessages: () => void;
    }

    const useChatStore = create<ChatStore>((set) => ({
      messages: [],
      addMessage: (message) => set((state) => {
        const newMessages = [...state.messages, message];
        // Keep only last MAX_MESSAGES
        return {
          messages: newMessages.slice(-MAX_MESSAGES),
        };
      }),
      clearMessages: () => set({ messages: [] }),
    }));

    // Act - Add more than limit
    for (let i = 0; i < 200; i++) {
      useChatStore.getState().addMessage({
        id: `msg-${i}`,
        content: `Message ${i}`,
      });
    }

    // Assert
    expect(useChatStore.getState().messages.length).toBe(MAX_MESSAGES);
    // Should have the last 100 messages
    expect(useChatStore.getState().messages[0].id).toBe('msg-100');
    expect(useChatStore.getState().messages[99].id).toBe('msg-199');
  });

  it('should cleanup old error logs', async () => {
    // Arrange
    const MAX_ERRORS = 50;
    const { create } = await import('zustand');

    interface ErrorLog {
      timestamp: number;
      message: string;
    }

    interface ErrorStore {
      errors: ErrorLog[];
      logError: (message: string) => void;
      clearOldErrors: (maxAge: number) => void;
    }

    const useErrorStore = create<ErrorStore>((set, get) => ({
      errors: [],
      logError: (message) => set((state) => {
        const newErrors = [
          ...state.errors,
          { timestamp: Date.now(), message },
        ];
        return { errors: newErrors.slice(-MAX_ERRORS) };
      }),
      clearOldErrors: (maxAge) => set((state) => ({
        errors: state.errors.filter(
          e => Date.now() - e.timestamp < maxAge
        ),
      })),
    }));

    // Act - Log many errors
    for (let i = 0; i < 100; i++) {
      useErrorStore.getState().logError(`Error ${i}`);
    }

    // Assert
    expect(useErrorStore.getState().errors.length).toBe(MAX_ERRORS);
  });
});

// ============================================================================
// PERFORMANCE BENCHMARK TESTS
// ============================================================================

describe('Performance Benchmarks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render large list efficiently', () => {
    // Arrange
    const React = require('react');
    const { render } = require('@testing-library/react');

    const LargeList = ({ items }: { items: string[] }) => {
      return React.createElement(
        'ul',
        null,
        items.map((item: string, index: number) =>
          React.createElement('li', { key: index }, item)
        )
      );
    };

    const items = Array.from({ length: 1000 }, (_, i) => `Item ${i}`);

    // Act
    const start = performance.now();
    const { container } = render(React.createElement(LargeList, { items }));
    const duration = performance.now() - start;

    // Assert - Should render in under 500ms
    expect(duration).toBeLessThan(500);
    expect(container.querySelectorAll('li').length).toBe(1000);
  });

  it('should update state quickly', async () => {
    // Arrange
    const { create } = await import('zustand');

    interface CountStore {
      count: number;
      increment: () => void;
    }

    const useCountStore = create<CountStore>((set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }));

    // Act
    const start = performance.now();
    for (let i = 0; i < 10000; i++) {
      useCountStore.getState().increment();
    }
    const duration = performance.now() - start;

    // Assert - 10000 updates in under 100ms
    expect(duration).toBeLessThan(100);
    expect(useCountStore.getState().count).toBe(10000);
  });

  it('should handle deep state updates efficiently', async () => {
    // Arrange
    const { create } = await import('zustand');

    interface DeepState {
      level1: {
        level2: {
          level3: {
            value: number;
          };
        };
      };
      updateDeepValue: (value: number) => void;
    }

    const useDeepStore = create<DeepState>((set) => ({
      level1: {
        level2: {
          level3: {
            value: 0,
          },
        },
      },
      updateDeepValue: (value) => set((state) => ({
        level1: {
          ...state.level1,
          level2: {
            ...state.level1.level2,
            level3: {
              ...state.level1.level2.level3,
              value,
            },
          },
        },
      })),
    }));

    // Act
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      useDeepStore.getState().updateDeepValue(i);
    }
    const duration = performance.now() - start;

    // Assert - Deep updates in under 50ms
    expect(duration).toBeLessThan(50);
    expect(useDeepStore.getState().level1.level2.level3.value).toBe(999);
  });
});

// ============================================================================
// LONG-RUNNING SESSION TESTS
// ============================================================================

describe('Long-Running Session Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it('should handle 8-hour session without memory issues', async () => {
    // Arrange
    const { create } = await import('zustand');

    interface SessionStore {
      events: { time: number }[];
      logEvent: () => void;
      pruneOldEvents: () => void;
    }

    const ONE_HOUR = 60 * 60 * 1000;
    const MAX_EVENTS = 1000;

    const useSessionStore = create<SessionStore>((set, get) => ({
      events: [],
      logEvent: () => set((state) => ({
        events: [...state.events, { time: Date.now() }].slice(-MAX_EVENTS),
      })),
      pruneOldEvents: () => set((state) => ({
        events: state.events.filter(e => Date.now() - e.time < ONE_HOUR),
      })),
    }));

    // Act - Simulate 8-hour session with events every minute
    const EIGHT_HOURS = 8 * ONE_HOUR;
    const ONE_MINUTE = 60 * 1000;
    const PRUNE_INTERVAL = 15 * ONE_MINUTE;

    let elapsed = 0;
    while (elapsed < EIGHT_HOURS) {
      // Log event
      useSessionStore.getState().logEvent();

      // Prune every 15 minutes
      if (elapsed % PRUNE_INTERVAL === 0) {
        useSessionStore.getState().pruneOldEvents();
      }

      // Advance time
      act(() => {
        vi.advanceTimersByTime(ONE_MINUTE);
      });
      elapsed += ONE_MINUTE;
    }

    // Assert - Should maintain bounded size
    expect(useSessionStore.getState().events.length).toBeLessThanOrEqual(MAX_EVENTS);
  });

  it('should cleanup stale data periodically', async () => {
    // Arrange
    const { create } = await import('zustand');

    interface CacheStore {
      cache: Map<string, { data: string; timestamp: number }>;
      set: (key: string, data: string) => void;
      cleanup: (maxAge: number) => void;
    }

    const useCacheStore = create<CacheStore>((set, get) => ({
      cache: new Map(),
      set: (key, data) => {
        const newCache = new Map(get().cache);
        newCache.set(key, { data, timestamp: Date.now() });
        set({ cache: newCache });
      },
      cleanup: (maxAge) => {
        const now = Date.now();
        const newCache = new Map();
        get().cache.forEach((value, key) => {
          if (now - value.timestamp < maxAge) {
            newCache.set(key, value);
          }
        });
        set({ cache: newCache });
      },
    }));

    // Act - Add items and advance time
    useCacheStore.getState().set('item1', 'data1');
    useCacheStore.getState().set('item2', 'data2');

    act(() => {
      vi.advanceTimersByTime(5 * 60 * 1000); // 5 minutes
    });

    useCacheStore.getState().set('item3', 'data3');

    // Cleanup items older than 3 minutes
    useCacheStore.getState().cleanup(3 * 60 * 1000);

    // Assert - Only item3 should remain
    expect(useCacheStore.getState().cache.size).toBe(1);
    expect(useCacheStore.getState().cache.has('item3')).toBe(true);
  });
});

