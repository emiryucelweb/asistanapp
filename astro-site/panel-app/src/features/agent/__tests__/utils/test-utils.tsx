 
// NOTE: Test/fixture file - `any` accepted for mock data flexibility

/**
 * Test Utilities
 * Comprehensive testing helpers for Agent Panel
 * 
 * @module agent/__tests__/utils/test-utils
 */

import React from 'react';
import { render as rtlRender, RenderOptions, RenderResult } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import userEvent from '@testing-library/user-event';
import type { Conversation, Message, AgentProfile } from '../../types';
import { conversationFixtures } from '../../fixtures/conversations.fixture';

// ============================================================================
// CUSTOM RENDER
// ============================================================================

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string;
  queryClient?: QueryClient;
}

/**
 * Custom render with all providers
 */
export function render(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult & { user: ReturnType<typeof userEvent.setup> } {
  const {
    initialRoute = '/',
    queryClient = createTestQueryClient(),
    ...renderOptions
  } = options;

  // Set initial route
  if (initialRoute !== '/') {
    window.history.pushState({}, 'Test page', initialRoute);
  }

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );

  const user = userEvent.setup();

  return {
    ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
    user,
  };
}

/**
 * Create test query client
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0, // React Query v5: cacheTime renamed to gcTime
      },
      mutations: {
        retry: false,
      },
    },
  });
}

// ============================================================================
// MOCK DATA FACTORIES
// ============================================================================

/**
 * Create mock conversation
 */
export function createMockConversation(overrides?: Partial<Conversation>): Conversation {
  const baseConversation = conversationFixtures[0];
  return {
    ...baseConversation,
    ...overrides,
  };
}

/**
 * Create mock message
 */
export function createMockMessage(overrides?: Partial<Message>): Message {
  return {
    id: 'msg-001' as any,
    conversationId: 'conv-001' as any,
    sender: 'customer',
    type: 'text',
    content: 'Test message',
    timestamp: new Date().toISOString() as any,
    isRead: false,
    isDelivered: true,
    isFailed: false,
    ...overrides,
  };
}

/**
 * Create mock agent profile
 */
export function createMockAgentProfile(overrides?: Partial<AgentProfile>): AgentProfile {
  return {
    id: 'agent-001' as any,
    name: 'Test Agent',
    email: 'test.agent@example.com',
    role: 'agent',
    status: 'available',
    isOnline: true,
    createdAt: new Date().toISOString() as any,
    stats: {
      activeConversations: 5,
      totalConversations: 100,
      resolvedConversations: 95,
      averageResponseTime: 300,
      averageResolutionTime: 1800,
      satisfactionScore: 4.5,
      totalMessages: 500,
      lastUpdatedAt: new Date().toISOString() as any,
    },
    preferences: {
      autoAssign: true,
      maxConcurrentConversations: 10,
      notificationSettings: {
        email: true,
        push: true,
        desktop: true,
        sound: true,
        newMessage: true,
        assignment: true,
        mention: true,
        emergencyCall: true,
      },
      theme: 'light',
      language: 'tr',
      timezone: 'Europe/Istanbul',
      dailyBreakMinutes: 30,
    },
    ...overrides,
  };
}

// ============================================================================
// MOCK API HANDLERS
// ============================================================================

/**
 * Mock successful API response
 */
export function mockApiSuccess<T>(data: T, delay: number = 0): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

/**
 * Mock API error
 */
export function mockApiError(message: string = 'API Error', delay: number = 0): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay);
  });
}

// ============================================================================
// ASYNC HELPERS
// ============================================================================

/**
 * Wait for async operations
 */
export function waitFor(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Flush promises
 */
export function flushPromises(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve));
}

// ============================================================================
// ACCESSIBILITY TESTING
// ============================================================================

/**
 * Check for accessibility violations
 * (Requires jest-axe)
 */
// @ts-expect-error jest-axe has no type declarations
import { axe, toHaveNoViolations } from 'jest-axe';

// Jest matcher extension (type issue with jest-axe)
expect.extend(toHaveNoViolations);

export async function checkA11y(container: HTMLElement): Promise<void> {
  const results = await axe(container);
  // @ts-expect-error toHaveNoViolations is a custom matcher
  expect(results).toHaveNoViolations();
}

// ============================================================================
// SNAPSHOT HELPERS
// ============================================================================

/**
 * Create deterministic snapshot (remove random IDs, timestamps)
 */
export function createDeterministicSnapshot(obj: any): any {
  const json = JSON.stringify(obj, (key, value) => {
    // Replace timestamps with fixed value
    if (key === 'timestamp' || key === 'createdAt' || key === 'updatedAt') {
      return '2024-01-01T00:00:00.000Z';
    }
    // Replace IDs with deterministic values
    if (key === 'id' && typeof value === 'string') {
      return 'test-id';
    }
    return value;
  });
  
  return JSON.parse(json);
}

// ============================================================================
// PERFORMANCE TESTING
// ============================================================================

/**
 * Measure render time
 */
export function measureRenderTime(component: React.ReactElement): number {
  const start = performance.now();
  rtlRender(component);
  const end = performance.now();
  return end - start;
}

/**
 * Assert render time is below threshold
 */
export function expectFastRender(component: React.ReactElement, maxMs: number = 16): void {
  const renderTime = measureRenderTime(component);
  expect(renderTime).toBeLessThan(maxMs);
}

// ============================================================================
// CUSTOM MATCHERS
// ============================================================================

/**
 * Custom Jest matchers
 */
export const customMatchers = {
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
};

// ============================================================================
// MOCK WEBSOCKET
// ============================================================================

/**
 * Mock WebSocket for real-time features
 */
export class MockWebSocket {
  url: string;
  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;

  constructor(url: string) {
    this.url = url;
    // Simulate connection
    setTimeout(() => {
      this.onopen?.(new Event('open'));
    }, 0);
  }

  send(_data: string): void {
    // Mock send
  }

  close(): void {
    this.onclose?.(new CloseEvent('close'));
  }

  simulateMessage(data: any): void {
    const event = new MessageEvent('message', {
      data: JSON.stringify(data),
    });
    this.onmessage?.(event);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export * from '@testing-library/react';
export { userEvent };

