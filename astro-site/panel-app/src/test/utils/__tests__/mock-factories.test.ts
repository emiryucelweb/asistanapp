/**
 * Mock Factories Tests
 * Enterprise-grade tests for mock data generators
 * 
 * @group test
 * @group utils
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  createUserId,
  createCustomerId,
  createAgentId,
  createConversationId,
  createMessageId,
  createISOTimestamp,
  createMockMessage,
  createMockConversation,
  createMockConversations,
  createMockMessages,
} from '../mock-factories';

describe('Mock Factories - Enterprise Grade Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set a fixed date for deterministic tests
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Branded ID Helpers', () => {
    it('should create unique UserId', () => {
      const id1 = createUserId();
      const id2 = createUserId();
      
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^user-/);
    });

    it('should create UserId with custom value', () => {
      const customId = createUserId('user-custom-123');
      expect(customId).toBe('user-custom-123');
    });

    it('should create unique CustomerId', () => {
      const id1 = createCustomerId();
      const id2 = createCustomerId();
      
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^customer-/);
    });

    it('should create CustomerId with custom value', () => {
      const customId = createCustomerId('customer-custom-456');
      expect(customId).toBe('customer-custom-456');
    });

    it('should create unique AgentId', () => {
      const id1 = createAgentId();
      const id2 = createAgentId();
      
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^agent-/);
    });

    it('should create AgentId with custom value', () => {
      const customId = createAgentId('agent-custom-789');
      expect(customId).toBe('agent-custom-789');
    });

    it('should create unique ConversationId', () => {
      const id1 = createConversationId();
      const id2 = createConversationId();
      
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^conv-/);
    });

    it('should create ConversationId with custom value', () => {
      const customId = createConversationId('conv-custom-abc');
      expect(customId).toBe('conv-custom-abc');
    });

    it('should create unique MessageId', () => {
      const id1 = createMessageId();
      const id2 = createMessageId();
      
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^msg-/);
    });

    it('should create MessageId with custom value', () => {
      const customId = createMessageId('msg-custom-xyz');
      expect(customId).toBe('msg-custom-xyz');
    });

    it('should create ISOTimestamp', () => {
      const timestamp = createISOTimestamp();
      
      expect(timestamp).toBeTruthy();
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/); // ISO format
      expect(new Date(timestamp).toString()).not.toBe('Invalid Date');
    });

    it('should create ISOTimestamp from custom date', () => {
      const customDate = new Date('2024-01-15T12:30:00Z');
      const timestamp = createISOTimestamp(customDate);
      
      expect(timestamp).toBe(customDate.toISOString());
    });
  });

  describe('Mock Message Generator', () => {
    it('should create mock message with default values', () => {
      const message = createMockMessage();
      
      expect(message).toBeDefined();
      expect(message.id).toMatch(/^msg-/);
      expect(message.conversationId).toMatch(/^conv-/);
      expect(message.content).toBe('Test message');
      expect(message.sender).toBe('customer');
      expect(message.type).toBe('text');
      expect(message.timestamp).toBeTruthy();
    });

    it('should create mock message with overrides', () => {
      const overrides = {
        content: 'Custom message content',
        sender: 'agent' as const,
        senderName: 'Agent Smith',
        type: 'file' as const,
      };

      const message = createMockMessage(overrides);
      
      expect(message.content).toBe('Custom message content');
      expect(message.sender).toBe('agent');
      expect(message.senderName).toBe('Agent Smith');
      expect(message.type).toBe('file');
    });

    it('should create mock message with custom IDs', () => {
      const messageId = createMessageId('msg-test-123');
      const conversationId = createConversationId('conv-test-456');

      const message = createMockMessage({
        id: messageId,
        conversationId,
      });

      expect(message.id).toBe(messageId);
      expect(message.conversationId).toBe(conversationId);
    });

    it('should include all required message fields', () => {
      const message = createMockMessage();
      
      expect(message).toHaveProperty('id');
      expect(message).toHaveProperty('conversationId');
      expect(message).toHaveProperty('content');
      expect(message).toHaveProperty('sender');
      expect(message).toHaveProperty('senderId');
      expect(message).toHaveProperty('senderName');
      expect(message).toHaveProperty('timestamp');
      expect(message).toHaveProperty('type');
    });
  });

  describe('Mock Conversation Generator', () => {
    it('should create mock conversation with default values', () => {
      const conversation = createMockConversation();
      
      expect(conversation).toBeDefined();
      expect(conversation.id).toMatch(/^conv-/);
      expect(conversation.customerId).toMatch(/^customer-/);
      expect(conversation.customerName).toBe('Test Customer');
      expect(conversation.channel).toBe('whatsapp');
      expect(conversation.status).toBe('waiting');
      expect(conversation.priority).toBe('normal');
      expect(conversation.lastMessage).toBe('Test last message');
      expect(conversation.unreadCount).toBe(0);
      expect(conversation.isLocked).toBe(false);
      expect(conversation.aiStuck).toBe(false);
    });

    it('should create mock conversation with overrides', () => {
      const overrides = {
        customerName: 'VIP Customer',
        channel: 'instagram' as const,
        status: 'assigned' as const,
        priority: 'high' as const,
        unreadCount: 5,
      };

      const conversation = createMockConversation(overrides);
      
      expect(conversation.customerName).toBe('VIP Customer');
      expect(conversation.channel).toBe('instagram');
      expect(conversation.status).toBe('assigned');
      expect(conversation.priority).toBe('high');
      expect(conversation.unreadCount).toBe(5);
    });

    it('should create mock conversation with custom IDs', () => {
      const conversationId = createConversationId('conv-custom-789');
      const customerId = createCustomerId('customer-custom-101');

      const conversation = createMockConversation({
        id: conversationId,
        customerId,
      });

      expect(conversation.id).toBe(conversationId);
      expect(conversation.customerId).toBe(customerId);
    });

    it('should include all required conversation fields', () => {
      const conversation = createMockConversation();
      
      expect(conversation).toHaveProperty('id');
      expect(conversation).toHaveProperty('customerId');
      expect(conversation).toHaveProperty('customerName');
      expect(conversation).toHaveProperty('customerEmail');
      expect(conversation).toHaveProperty('customerPhone');
      expect(conversation).toHaveProperty('channel');
      expect(conversation).toHaveProperty('status');
      expect(conversation).toHaveProperty('priority');
      expect(conversation).toHaveProperty('lastMessage');
      expect(conversation).toHaveProperty('lastMessageTime');
      expect(conversation).toHaveProperty('createdAt');
      expect(conversation).toHaveProperty('updatedAt');
      expect(conversation).toHaveProperty('unreadCount');
      expect(conversation).toHaveProperty('isLocked');
      expect(conversation).toHaveProperty('aiStuck');
      expect(conversation).toHaveProperty('tags');
      expect(conversation).toHaveProperty('metadata');
    });

    it('should create conversation with optional fields', () => {
      const conversation = createMockConversation({
        assignedTo: createAgentId('agent-123'),
        assignedToName: 'Agent John',
        sentiment: 'happy',
      });

      expect(conversation.assignedTo).toBe('agent-123');
      expect(conversation.assignedToName).toBe('Agent John');
      expect(conversation.sentiment).toBe('happy');
    });

    it('should create conversation with locked state', () => {
      const conversation = createMockConversation({
        isLocked: true,
        lockedBy: createAgentId('agent-lock') as any, // Extended property
        lockedByName: 'Lock Owner',
      });

      expect(conversation.isLocked).toBe(true);
      expect((conversation as any).lockedBy).toBe('agent-lock');
      expect((conversation as any).lockedByName).toBe('Lock Owner');
    });

    it('should create conversation with AI stuck state', () => {
      const conversation = createMockConversation({
        aiStuck: true,
      });

      expect(conversation.aiStuck).toBe(true);
    });
  });

  describe('Bulk Mock Generators', () => {
    it('should create multiple mock conversations', () => {
      const conversations = createMockConversations(5);
      
      expect(conversations).toHaveLength(5);
      expect(conversations[0].id).toMatch(/^conv-test-1/);
      expect(conversations[0].customerName).toBe('Test Customer 1');
      expect(conversations[4].customerName).toBe('Test Customer 5');
    });

    it('should create unique conversations in batch', () => {
      const conversations = createMockConversations(10);
      const ids = conversations.map(c => c.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(10); // All IDs unique
    });

    it('should apply overrides to all generated conversations', () => {
      const conversations = createMockConversations(3, {
        channel: 'web' as const,
        priority: 'urgent' as const,
      });
      
      conversations.forEach(conv => {
        expect(conv.channel).toBe('web');
        expect(conv.priority).toBe('urgent');
      });
    });

    it('should create multiple mock messages', () => {
      const conversationId = createConversationId('conv-test');
      const messages = createMockMessages(5, conversationId);
      
      expect(messages).toHaveLength(5);
      expect(messages[0].content).toBe('Test message 1');
      expect(messages[4].content).toBe('Test message 5');
      
      // All messages should belong to same conversation
      messages.forEach(msg => {
        expect(msg.conversationId).toBe(conversationId);
      });
    });

    it('should create messages with timestamps in sequence', () => {
      const conversationId = createConversationId('conv-test');
      const messages = createMockMessages(3, conversationId);
      
      // Messages should have different timestamps
      const timestamp1 = new Date(messages[0].timestamp).getTime();
      const timestamp2 = new Date(messages[1].timestamp).getTime();
      const timestamp3 = new Date(messages[2].timestamp).getTime();
      
      expect(timestamp1).toBeLessThan(timestamp2);
      expect(timestamp2).toBeLessThan(timestamp3);
    });

    it('should create unique messages in batch', () => {
      const conversationId = createConversationId('conv-test');
      const messages = createMockMessages(10, conversationId);
      const ids = messages.map(m => m.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(10); // All IDs unique
    });

    it('should apply overrides to all generated messages', () => {
      const conversationId = createConversationId('conv-test');
      const messages = createMockMessages(3, conversationId, {
        sender: 'agent' as const,
        type: 'image' as const,
      });
      
      messages.forEach(msg => {
        expect(msg.sender).toBe('agent');
        expect(msg.type).toBe('image');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle creating zero conversations', () => {
      const conversations = createMockConversations(0);
      expect(conversations).toHaveLength(0);
    });

    it('should handle creating zero messages', () => {
      const conversationId = createConversationId('conv-test');
      const messages = createMockMessages(0, conversationId);
      expect(messages).toHaveLength(0);
    });

    it('should handle creating large batches', () => {
      const conversations = createMockConversations(100);
      expect(conversations).toHaveLength(100);
      
      // Verify all are unique
      const ids = new Set(conversations.map(c => c.id));
      expect(ids.size).toBe(100);
    });

    it('should handle empty string IDs (fallback to generated ID)', () => {
      // Empty string is falsy, so it falls back to generated ID
      const userId = createUserId('');
      expect(userId).toMatch(/^user-/); // Falls back to auto-generated
    });

    it('should handle special characters in custom IDs', () => {
      const conversationId = createConversationId('conv-特殊文字-🎉');
      expect(conversationId).toBe('conv-特殊文字-🎉');
    });

    it('should handle very long custom content', () => {
      const longContent = 'A'.repeat(10000);
      const message = createMockMessage({ content: longContent });
      expect(message.content).toBe(longContent);
      expect(message.content.length).toBe(10000);
    });

    it('should preserve metadata in conversations', () => {
      const metadata = {
        source: 'web',
        campaign: 'summer-2024',
        customField: { nested: true },
      };

      const conversation = createMockConversation({ metadata });
      expect(conversation.metadata).toEqual(metadata);
    });

    it('should preserve tags in conversations', () => {
      const tags = ['urgent', 'vip', 'complaint'] as const;
      const conversation = createMockConversation({ tags: tags as any });
      expect(conversation.tags).toEqual(tags);
    });
  });

  describe('Error Handling', () => {
    it('should handle undefined overrides gracefully', () => {
      // Arrange & Act
      const message = createMockMessage(undefined);
      
      // Assert
      expect(message).toBeDefined();
      expect(message.id).toBeDefined();
    });

    it('should handle null-ish values in overrides', () => {
      // Arrange & Act
      const conversation = createMockConversation({
        customerName: '',
        lastMessage: '',
      });
      
      // Assert
      expect(conversation.customerName).toBe('');
      expect(conversation.lastMessage).toBe('');
    });

    it('should not crash with partial overrides', () => {
      // Arrange & Act & Assert
      expect(() => createMockMessage({ content: 'test' })).not.toThrow();
      expect(() => createMockConversation({ channel: 'web' })).not.toThrow();
    });
  });

  describe('Type Safety', () => {
    it('should create properly typed branded IDs', () => {
      const userId = createUserId();
      const customerId = createCustomerId();
      const agentId = createAgentId();
      const conversationId = createConversationId();
      const messageId = createMessageId();

      // These should be strings at runtime
      expect(typeof userId).toBe('string');
      expect(typeof customerId).toBe('string');
      expect(typeof agentId).toBe('string');
      expect(typeof conversationId).toBe('string');
      expect(typeof messageId).toBe('string');
    });

    it('should create properly typed timestamps', () => {
      const timestamp = createISOTimestamp();
      
      // Should be a valid ISO string
      expect(typeof timestamp).toBe('string');
      expect(new Date(timestamp).toString()).not.toBe('Invalid Date');
    });
  });
});

