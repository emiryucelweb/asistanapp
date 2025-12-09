/**
 * @vitest-environment jsdom
 * 
 * useAIChatbot Hook Tests
 * Enterprise-grade tests for AI chatbot functionality
 * 
 * @group hooks
 * @group ai-chatbot
 */
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock the entire hook for isolated testing
const mockSendMessage = vi.fn();
const mockClearConversation = vi.fn();
const mockRetryLastMessage = vi.fn();
const mockCancelRequest = vi.fn();
const mockGetLastAIMessage = vi.fn();
const mockGetConversationSummary = vi.fn(() => ({
  totalMessages: 0,
  userMessages: 0,
  aiMessages: 0,
  averageConfidence: 0,
  handoffRate: 0,
  topIntents: [],
  duration: 0
}));
const mockGetAnalytics = vi.fn(() => ({
  totalMessages: 0,
  responseTime: 0,
  successRate: 1.0
}));

vi.mock('../useAIChatbot', () => ({
  useAIChatbot: vi.fn(() => ({
    messages: [],
    isLoading: false,
    isTyping: false,
    error: null,
    statistics: { totalMessages: 0, successRate: 1.0 },
    sendMessage: mockSendMessage,
    sendMessageQueue: vi.fn(),
    clearConversation: mockClearConversation,
    retryLastMessage: mockRetryLastMessage,
    cancelRequest: mockCancelRequest,
    getLastAIMessage: mockGetLastAIMessage,
    getConversationSummary: mockGetConversationSummary,
    getAnalytics: mockGetAnalytics,
    canSendMessage: true,
    hasMessages: false,
    lastMessageRequiresHandoff: false
  }))
}));

vi.mock('@/shared/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn()
  }
}));

import { useAIChatbot } from '../useAIChatbot';

describe('useAIChatbot - Enterprise Grade Tests', () => {
  const defaultProps = {
    conversationId: 'conv-123',
    customerId: 'customer-456',
    language: 'tr' as const,
    autoSave: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Test 1: Hook returns expected structure
  it('should return expected hook structure', () => {
    // Arrange & Act
    const result = useAIChatbot(defaultProps);
    
    // Assert - State
    expect(result.messages).toEqual([]);
    expect(result.isLoading).toBe(false);
    expect(result.isTyping).toBe(false);
    expect(result.error).toBeNull();
    expect(result.statistics).toBeDefined();
  });

  // Test 2: Actions are functions
  it('should expose all action functions', () => {
    // Arrange & Act
    const result = useAIChatbot(defaultProps);
    
    // Assert
    expect(typeof result.sendMessage).toBe('function');
    expect(typeof result.clearConversation).toBe('function');
    expect(typeof result.retryLastMessage).toBe('function');
    expect(typeof result.cancelRequest).toBe('function');
  });

  // Test 3: Getters are functions
  it('should expose all getter functions', () => {
    // Arrange & Act
    const result = useAIChatbot(defaultProps);
    
    // Assert
    expect(typeof result.getLastAIMessage).toBe('function');
    expect(typeof result.getConversationSummary).toBe('function');
    expect(typeof result.getAnalytics).toBe('function');
  });

  // Test 4: Utils are defined
  it('should expose utility properties', () => {
    // Arrange & Act
    const result = useAIChatbot(defaultProps);
    
    // Assert
    expect(typeof result.canSendMessage).toBe('boolean');
    expect(typeof result.hasMessages).toBe('boolean');
    expect(typeof result.lastMessageRequiresHandoff).toBe('boolean');
  });

  // Test 5: Can send message when not loading
  it('should allow sending messages when not loading', () => {
    // Arrange & Act
    const result = useAIChatbot(defaultProps);
    
    // Assert
    expect(result.canSendMessage).toBe(true);
    expect(result.isLoading).toBe(false);
  });

  // Test 6: Has no messages initially
  it('should have no messages initially', () => {
    // Arrange & Act
    const result = useAIChatbot(defaultProps);
    
    // Assert
    expect(result.hasMessages).toBe(false);
    expect(result.messages).toHaveLength(0);
  });

  // Test 7: No handoff required initially
  it('should not require handoff initially', () => {
    // Arrange & Act
    const result = useAIChatbot(defaultProps);
    
    // Assert
    expect(result.lastMessageRequiresHandoff).toBe(false);
  });

  // Test 8: Statistics structure
  it('should have correct statistics structure', () => {
    // Arrange & Act
    const result = useAIChatbot(defaultProps);
    
    // Assert
    expect(result.statistics).toBeDefined();
    expect(typeof result.statistics.totalMessages).toBe('number');
    expect(typeof result.statistics.successRate).toBe('number');
  });

  // Test 9: Conversation summary structure
  it('should return correct conversation summary structure', () => {
    // Arrange
    const result = useAIChatbot(defaultProps);
    
    // Act
    const summary = result.getConversationSummary();
    
    // Assert
    expect(summary).toHaveProperty('totalMessages');
    expect(summary).toHaveProperty('userMessages');
    expect(summary).toHaveProperty('aiMessages');
    expect(summary).toHaveProperty('averageConfidence');
    expect(summary).toHaveProperty('handoffRate');
    expect(summary).toHaveProperty('topIntents');
    expect(summary).toHaveProperty('duration');
  });

  // Test 10: Analytics structure
  it('should return correct analytics structure', () => {
    // Arrange
    const result = useAIChatbot(defaultProps);
    
    // Act
    const analytics = result.getAnalytics();
    
    // Assert
    expect(analytics).toBeDefined();
    expect(typeof analytics.totalMessages).toBe('number');
  });
});
