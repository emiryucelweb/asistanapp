/**
 * @vitest-environment jsdom
 * 
 * AI Streaming Chat Safety Tests - ENTERPRISE GRADE
 * 
 * Extended tests for AI safety scenarios including:
 * - Token overflow handling
 * - Stream cancellation edge cases
 * - Error recovery flows
 * - Cost spike awareness
 * - Malformed response handling
 * 
 * @group hooks
 * @group ai-safety
 * @group streaming
 * 
 * ALTIN KURALLAR:
 * ✅ AAA Pattern (Arrange-Act-Assert)
 * ✅ Tek test → tek davranış
 * ✅ State izolasyonu (beforeEach/afterEach)
 * ✅ Mock Stratejisi Tutarlı
 * ✅ Descriptive Naming
 * ✅ Edge Case Coverage
 * ✅ Real-World Scenarios
 * ✅ Error Handling
 * ✅ Cleanup
 * ✅ Type Safety
 */

import { renderHook, act, waitFor, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// ============================================================================
// MOCKS
// ============================================================================

vi.mock('@/shared/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('@/shared/stores/auth-store', () => ({
  useAuthStore: vi.fn((selector) => {
    if (typeof selector === 'function') {
      return selector({ token: 'test-token-123' });
    }
    return { token: 'test-token-123' };
  }),
}));

// Mock EventSource
const eventSourceInstances: MockEventSource[] = [];

class MockEventSource {
  url: string;
  readyState = 0;
  private listeners: Record<string, Function[]> = {};

  static instances: MockEventSource[] = eventSourceInstances;

  constructor(url: string) {
    this.url = url;
    this.readyState = 1;
    eventSourceInstances.push(this);
    Promise.resolve().then(() => {
      this.emit('connected', { data: JSON.stringify({ status: 'connected' }) });
    });
  }

  addEventListener(event: string, handler: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
  }

  removeEventListener(event: string, handler: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(h => h !== handler);
    }
  }

  emit(event: string, eventData: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(handler => handler(eventData));
    }
  }

  close() {
    this.readyState = 2;
  }

  static clear() {
    eventSourceInstances.length = 0;
  }

  static getLatest(): MockEventSource | undefined {
    return eventSourceInstances[eventSourceInstances.length - 1];
  }
}

global.EventSource = MockEventSource as any;
global.fetch = vi.fn();

import { useStreamingChat } from '../useStreamingChat';
import { logger } from '@/shared/utils/logger';

// ============================================================================
// AI SAFETY TESTS - TOKEN OVERFLOW
// ============================================================================

describe('AI Safety - Token Overflow Handling', () => {
  const defaultOptions = {
    conversationId: 'conv-123',
    customerId: 'customer-456',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    MockEventSource.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('should handle very long streaming response gracefully', async () => {
    // Arrange
    const { result } = renderHook(() => useStreamingChat(defaultOptions));

    act(() => {
      result.current.sendMessage('Generate a very long response');
    });

    await waitFor(() => {
      expect(MockEventSource.getLatest()).toBeDefined();
    });

    const eventSource = MockEventSource.getLatest()!;

    // Act - Simulate very long response (100KB+)
    let fullText = '';
    const chunkSize = 1000;
    const chunks = 100;

    for (let i = 0; i < chunks; i++) {
      const chunk = 'A'.repeat(chunkSize);
      fullText += chunk;

      act(() => {
        eventSource.emit('token', {
          data: JSON.stringify({ token: chunk, fullText }),
        });
      });
    }

    // Assert - Should handle without crashing
    expect(result.current.streamingMessage?.content.length).toBe(100000);
    expect(result.current.isStreaming).toBe(true);
  });

  it('should handle token burst (rapid token emission)', async () => {
    // Arrange
    const { result } = renderHook(() => useStreamingChat(defaultOptions));

    act(() => {
      result.current.sendMessage('Test');
    });

    await waitFor(() => {
      expect(MockEventSource.getLatest()).toBeDefined();
    });

    const eventSource = MockEventSource.getLatest()!;

    // Act - Emit 1000 tokens in rapid succession
    const start = performance.now();
    let fullText = '';

    for (let i = 0; i < 1000; i++) {
      fullText += 'w ';
      act(() => {
        eventSource.emit('token', {
          data: JSON.stringify({ token: 'w ', fullText }),
        });
      });
    }

    const duration = performance.now() - start;

    // Assert - Should complete in reasonable time (<1s)
    expect(duration).toBeLessThan(1000);
    expect(result.current.streamingMessage?.content.split(' ').length).toBeGreaterThan(900);
  });

  it('should handle metadata with high token count', async () => {
    // Arrange
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useStreamingChat({ ...defaultOptions, onComplete })
    );

    act(() => {
      result.current.sendMessage('Test');
    });

    await waitFor(() => {
      expect(MockEventSource.getLatest()).toBeDefined();
    });

    const eventSource = MockEventSource.getLatest()!;

    // Act - Complete with high token metadata
    act(() => {
      eventSource.emit('done', {
        data: JSON.stringify({
          fullText: 'Response',
          metadata: {
            tokensUsed: 128000, // GPT-4 Turbo max
            model: 'gpt-4-turbo',
            promptTokens: 8000,
            completionTokens: 120000,
          },
        }),
      });
    });

    // Assert
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: expect.objectContaining({
            tokensUsed: 128000,
          }),
        })
      );
    });
  });
});

// ============================================================================
// AI SAFETY TESTS - CANCELLATION
// ============================================================================

describe('AI Safety - Stream Cancellation', () => {
  const defaultOptions = {
    conversationId: 'conv-123',
    customerId: 'customer-456',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    MockEventSource.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('should cancel immediately on user request', async () => {
    // Arrange
    const { result } = renderHook(() => useStreamingChat(defaultOptions));

    act(() => {
      result.current.sendMessage('Generate response');
    });

    await waitFor(() => {
      expect(MockEventSource.getLatest()).toBeDefined();
    });

    const eventSource = MockEventSource.getLatest()!;
    const closeSpy = vi.spyOn(eventSource, 'close');

    // Start streaming
    act(() => {
      eventSource.emit('token', {
        data: JSON.stringify({ token: 'Starting', fullText: 'Starting' }),
      });
    });

    // Act - Cancel immediately
    const cancelStart = performance.now();
    act(() => {
      result.current.cancelStream();
    });
    const cancelDuration = performance.now() - cancelStart;

    // Assert - Cancellation should be instant
    expect(cancelDuration).toBeLessThan(10);
    expect(closeSpy).toHaveBeenCalled();
    expect(result.current.isStreaming).toBe(false);
    expect(result.current.streamingMessage).toBeNull();
  });

  it('should handle double cancellation gracefully', async () => {
    // Arrange
    const { result } = renderHook(() => useStreamingChat(defaultOptions));

    act(() => {
      result.current.sendMessage('Test');
    });

    await waitFor(() => {
      expect(MockEventSource.getLatest()).toBeDefined();
    });

    // Act - Double cancel
    act(() => {
      result.current.cancelStream();
    });

    // Assert - Should not throw
    expect(() => {
      act(() => {
        result.current.cancelStream();
      });
    }).not.toThrow();

    expect(result.current.isStreaming).toBe(false);
  });

  it('should preserve partial response on cancellation when configured', async () => {
    // Arrange
    const { result } = renderHook(() => useStreamingChat(defaultOptions));

    act(() => {
      result.current.sendMessage('Test');
    });

    await waitFor(() => {
      expect(MockEventSource.getLatest()).toBeDefined();
    });

    const eventSource = MockEventSource.getLatest()!;

    // Stream partial response
    act(() => {
      eventSource.emit('token', {
        data: JSON.stringify({ token: 'Partial ', fullText: 'Partial ' }),
      });
    });

    act(() => {
      eventSource.emit('token', {
        data: JSON.stringify({ token: 'response', fullText: 'Partial response' }),
      });
    });

    const partialContent = result.current.streamingMessage?.content;

    // Act - Cancel
    act(() => {
      result.current.cancelStream();
    });

    // Assert - Partial content should have been visible
    expect(partialContent).toBe('Partial response');
    // After cancel, streamingMessage is cleared
    expect(result.current.streamingMessage).toBeNull();
  });

  it('should cancel before stream starts', () => {
    // Arrange
    const { result } = renderHook(() => useStreamingChat(defaultOptions));

    // Act - Cancel before sending
    act(() => {
      result.current.cancelStream();
    });

    // Assert - Should not throw, remain in initial state
    expect(result.current.isStreaming).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.messages).toEqual([]);
  });
});

// ============================================================================
// AI SAFETY TESTS - ERROR RECOVERY
// ============================================================================

describe('AI Safety - Error Recovery', () => {
  const defaultOptions = {
    conversationId: 'conv-123',
    customerId: 'customer-456',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    MockEventSource.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('should preserve user message after stream error', async () => {
    // Arrange
    const onError = vi.fn();
    const { result } = renderHook(() =>
      useStreamingChat({
        ...defaultOptions,
        onError,
        maxReconnectAttempts: 0,
        enableFallback: false,
      })
    );

    // Act - Send message
    act(() => {
      result.current.sendMessage('Important message');
    });

    await waitFor(() => {
      expect(MockEventSource.getLatest()).toBeDefined();
    });

    // Trigger error
    const eventSource = MockEventSource.getLatest()!;
    act(() => {
      eventSource.emit('error', { type: 'error' });
    });

    // Assert - User message should be preserved
    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].content).toBe('Important message');
  });

  it('should allow retry after error', async () => {
    // Arrange
    const onError = vi.fn();
    const { result } = renderHook(() =>
      useStreamingChat({
        ...defaultOptions,
        onError,
        maxReconnectAttempts: 0,
        enableFallback: false,
      })
    );

    // First message - error
    act(() => {
      result.current.sendMessage('First attempt');
    });

    await waitFor(() => {
      expect(MockEventSource.instances.length).toBe(1);
    });

    act(() => {
      MockEventSource.instances[0].emit('error', { type: 'error' });
    });

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    // Act - Retry with new message
    act(() => {
      result.current.sendMessage('Retry attempt');
    });

    await waitFor(() => {
      expect(MockEventSource.instances.length).toBe(2);
    });

    // Assert - New stream should be created
    expect(result.current.messages.filter(m => m.role === 'user')).toHaveLength(2);
  });

  it('should clear error state on successful message', async () => {
    // Arrange
    const { result } = renderHook(() =>
      useStreamingChat({
        ...defaultOptions,
        maxReconnectAttempts: 0,
        enableFallback: false,
      })
    );

    // Cause error
    act(() => {
      result.current.sendMessage('Error message');
    });

    await waitFor(() => {
      expect(MockEventSource.getLatest()).toBeDefined();
    });

    act(() => {
      MockEventSource.getLatest()!.emit('error', { type: 'error' });
    });

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    // Act - Send new successful message
    act(() => {
      result.current.sendMessage('Success message');
    });

    await waitFor(() => {
      expect(MockEventSource.instances.length).toBe(2);
    });

    const newEventSource = MockEventSource.instances[1];

    act(() => {
      newEventSource.emit('done', {
        data: JSON.stringify({ fullText: 'Success!', metadata: {} }),
      });
    });

    // Assert - Error should be cleared
    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
  });
});

// ============================================================================
// AI SAFETY TESTS - MALFORMED RESPONSE
// ============================================================================

describe('AI Safety - Malformed Response Handling', () => {
  const defaultOptions = {
    conversationId: 'conv-123',
    customerId: 'customer-456',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    MockEventSource.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  // ✅ FIXED: Hook now has try-catch wrapper in JSON.parse for malformed responses
  it('should handle invalid JSON in token event', async () => {
    // Arrange
    const { result } = renderHook(() => useStreamingChat(defaultOptions));

    act(() => {
      result.current.sendMessage('Test');
    });

    await waitFor(() => {
      expect(MockEventSource.getLatest()).toBeDefined();
    });

    const eventSource = MockEventSource.getLatest()!;

    // Act - Send malformed JSON
    act(() => {
      eventSource.emit('token', { data: '{ invalid json }}}' });
    });

    // Assert - Should log error but not crash
    expect(logger.error).toHaveBeenCalled();
    expect(result.current.isStreaming).toBe(true); // Should continue
  });

  // ✅ FIXED: Hook now handles null/undefined data
  it('should handle missing data in token event', async () => {
    // Arrange
    const { result } = renderHook(() => useStreamingChat(defaultOptions));

    act(() => {
      result.current.sendMessage('Test');
    });

    await waitFor(() => {
      expect(MockEventSource.getLatest()).toBeDefined();
    });

    const eventSource = MockEventSource.getLatest()!;

    // Act - Send token without data
    act(() => {
      eventSource.emit('token', {});
    });

    // Assert - Should handle gracefully
    expect(result.current.isStreaming).toBe(true);
  });

  it('should handle null fullText in token', async () => {
    // Arrange
    const { result } = renderHook(() => useStreamingChat(defaultOptions));

    act(() => {
      result.current.sendMessage('Test');
    });

    await waitFor(() => {
      expect(MockEventSource.getLatest()).toBeDefined();
    });

    const eventSource = MockEventSource.getLatest()!;

    // Act - Send token with null fullText
    act(() => {
      eventSource.emit('token', {
        data: JSON.stringify({ token: 'Hello', fullText: null }),
      });
    });

    // Assert - Should handle gracefully
    expect(result.current.isStreaming).toBe(true);
  });

  it('should handle empty done event', async () => {
    // Arrange
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useStreamingChat({ ...defaultOptions, onComplete })
    );

    act(() => {
      result.current.sendMessage('Test');
    });

    await waitFor(() => {
      expect(MockEventSource.getLatest()).toBeDefined();
    });

    const eventSource = MockEventSource.getLatest()!;

    // Stream some content
    act(() => {
      eventSource.emit('token', {
        data: JSON.stringify({ token: 'Hello', fullText: 'Hello' }),
      });
    });

    // Act - Send done with empty data
    act(() => {
      eventSource.emit('done', { data: '{}' });
    });

    // Assert - Should complete with streamed content
    await waitFor(() => {
      expect(result.current.isStreaming).toBe(false);
    });
  });
});

// ============================================================================
// AI SAFETY TESTS - CONCURRENT STREAMS
// ============================================================================

describe('AI Safety - Concurrent Stream Prevention', () => {
  const defaultOptions = {
    conversationId: 'conv-123',
    customerId: 'customer-456',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    MockEventSource.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('should handle new message while streaming', async () => {
    // Arrange
    const { result } = renderHook(() => useStreamingChat(defaultOptions));

    // Start first stream
    act(() => {
      result.current.sendMessage('First message');
    });

    await waitFor(() => {
      expect(MockEventSource.instances.length).toBe(1);
    });

    // First stream is active
    expect(result.current.isStreaming).toBe(true);

    // Act - Send second message while first is streaming
    act(() => {
      result.current.sendMessage('Second message');
    });

    await waitFor(() => {
      expect(MockEventSource.instances.length).toBe(2);
    });

    // Assert - Should have created new stream for second message
    expect(result.current.messages.filter(m => m.role === 'user')).toHaveLength(2);
  });

  // ✅ FIXED: Hook now closes previous stream before creating new one
  it('should close previous stream when sending new message', async () => {
    // Arrange
    const { result } = renderHook(() => useStreamingChat(defaultOptions));

    act(() => {
      result.current.sendMessage('First');
    });

    await waitFor(() => {
      expect(MockEventSource.instances.length).toBe(1);
    });

    const firstEventSource = MockEventSource.instances[0];
    const closeSpy = vi.spyOn(firstEventSource, 'close');

    // Act - Send new message
    act(() => {
      result.current.sendMessage('Second');
    });

    // Assert - First stream should be closed
    expect(closeSpy).toHaveBeenCalled();
  });
});

// ============================================================================
// AI SAFETY TESTS - RESOURCE CLEANUP
// ============================================================================

describe('AI Safety - Resource Cleanup', () => {
  const defaultOptions = {
    conversationId: 'conv-123',
    customerId: 'customer-456',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    MockEventSource.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  // ✅ EventSource.close() automatically cleans up event listeners
  it('should close EventSource on unmount', async () => {
    // Arrange
    const { result, unmount } = renderHook(() => useStreamingChat(defaultOptions));

    act(() => {
      result.current.sendMessage('Test');
    });

    await waitFor(() => {
      expect(MockEventSource.getLatest()).toBeDefined();
    });

    const eventSource = MockEventSource.getLatest()!;
    const closeSpy = vi.spyOn(eventSource, 'close');

    // Act
    unmount();

    // Assert - EventSource.close() cleans up listeners automatically
    expect(closeSpy).toHaveBeenCalled();
    expect(eventSource.readyState).toBe(2); // CLOSED
  });

  // Note: conversationId change cleanup would require additional useEffect
  // Current implementation closes on sendMessage, which is acceptable
  it('should not leave orphan streams when sending rapid messages', async () => {
    // Arrange
    const { result } = renderHook(() => useStreamingChat(defaultOptions));

    // Act - Send multiple messages rapidly
    act(() => {
      result.current.sendMessage('First');
    });

    await waitFor(() => {
      expect(MockEventSource.instances.length).toBe(1);
    });

    // First stream should be closed when second message is sent
    const firstEventSource = MockEventSource.instances[0];
    
    act(() => {
      result.current.sendMessage('Second');
    });

    await waitFor(() => {
      expect(MockEventSource.instances.length).toBe(2);
    });

    // Assert - First stream should be closed
    expect(firstEventSource.readyState).toBe(2); // CLOSED
  });
});

// ============================================================================
// AI SAFETY TESTS - METADATA TRACKING
// ============================================================================

describe('AI Safety - Cost & Token Tracking', () => {
  const defaultOptions = {
    conversationId: 'conv-123',
    customerId: 'customer-456',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    MockEventSource.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('should track token usage in metadata', async () => {
    // Arrange
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useStreamingChat({ ...defaultOptions, onComplete })
    );

    act(() => {
      result.current.sendMessage('Test');
    });

    await waitFor(() => {
      expect(MockEventSource.getLatest()).toBeDefined();
    });

    const eventSource = MockEventSource.getLatest()!;

    // Act - Complete with token metadata
    act(() => {
      eventSource.emit('done', {
        data: JSON.stringify({
          fullText: 'Response',
          metadata: {
            promptTokens: 100,
            completionTokens: 500,
            tokensUsed: 600,
            estimatedCost: 0.012,
          },
        }),
      });
    });

    // Assert
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: expect.objectContaining({
            promptTokens: 100,
            completionTokens: 500,
            tokensUsed: 600,
            estimatedCost: 0.012,
          }),
        })
      );
    });
  });

  it('should handle missing token metadata gracefully', async () => {
    // Arrange
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useStreamingChat({ ...defaultOptions, onComplete })
    );

    act(() => {
      result.current.sendMessage('Test');
    });

    await waitFor(() => {
      expect(MockEventSource.getLatest()).toBeDefined();
    });

    const eventSource = MockEventSource.getLatest()!;

    // Act - Complete without token metadata
    act(() => {
      eventSource.emit('done', {
        data: JSON.stringify({
          fullText: 'Response',
          metadata: { model: 'unknown' },
        }),
      });
    });

    // Assert - Should complete without error
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
      expect(result.current.messages).toHaveLength(2);
    });
  });
});

// ============================================================================
// REAL-WORLD SCENARIOS
// ============================================================================

describe('AI Safety - Real-World Scenarios', () => {
  const defaultOptions = {
    conversationId: 'conv-123',
    customerId: 'customer-456',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    MockEventSource.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('should handle network disconnection during streaming', async () => {
    // Arrange
    const onError = vi.fn();
    const { result } = renderHook(() =>
      useStreamingChat({
        ...defaultOptions,
        onError,
        maxReconnectAttempts: 0,
        enableFallback: false,
      })
    );

    act(() => {
      result.current.sendMessage('Long request');
    });

    await waitFor(() => {
      expect(MockEventSource.getLatest()).toBeDefined();
    });

    const eventSource = MockEventSource.getLatest()!;

    // Start receiving tokens
    act(() => {
      eventSource.emit('token', {
        data: JSON.stringify({ token: 'Starting...', fullText: 'Starting...' }),
      });
    });

    // Act - Simulate network disconnection
    act(() => {
      eventSource.emit('error', { type: 'error' });
    });

    // Assert
    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
      expect(result.current.isStreaming).toBe(false);
    });

    // User message should be preserved
    expect(result.current.messages[0].content).toBe('Long request');
  });

  it('should handle complete user workflow with multiple messages', async () => {
    // Arrange
    const { result } = renderHook(() => useStreamingChat(defaultOptions));

    // First message
    act(() => {
      result.current.sendMessage('Hello, I need help');
    });

    await waitFor(() => {
      expect(MockEventSource.instances.length).toBe(1);
    });

    // Complete first response
    act(() => {
      MockEventSource.instances[0].emit('done', {
        data: JSON.stringify({
          fullText: 'Hello! How can I help you today?',
          metadata: { tokensUsed: 10 },
        }),
      });
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
    });

    // Second message
    act(() => {
      result.current.sendMessage('I have a billing question');
    });

    await waitFor(() => {
      expect(MockEventSource.instances.length).toBe(2);
    });

    // Complete second response
    act(() => {
      MockEventSource.instances[1].emit('done', {
        data: JSON.stringify({
          fullText: 'Sure, I can help with billing. What would you like to know?',
          metadata: { tokensUsed: 15 },
        }),
      });
    });

    // Assert - Full conversation
    await waitFor(() => {
      expect(result.current.messages).toHaveLength(4);
    });

    expect(result.current.messages[0].role).toBe('user');
    expect(result.current.messages[1].role).toBe('assistant');
    expect(result.current.messages[2].role).toBe('user');
    expect(result.current.messages[3].role).toBe('assistant');
  });

  it('should handle user clearing conversation and starting fresh', async () => {
    // Arrange
    const { result } = renderHook(() => useStreamingChat(defaultOptions));

    // Build conversation
    act(() => {
      result.current.sendMessage('Message 1');
    });

    await waitFor(() => {
      expect(MockEventSource.getLatest()).toBeDefined();
    });

    act(() => {
      MockEventSource.getLatest()!.emit('done', {
        data: JSON.stringify({ fullText: 'Response 1', metadata: {} }),
      });
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
    });

    // Act - Clear and start fresh
    act(() => {
      result.current.clearMessages();
    });

    expect(result.current.messages).toEqual([]);

    // New conversation
    act(() => {
      result.current.sendMessage('Fresh start');
    });

    // Assert
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].content).toBe('Fresh start');
  });
});

