/**
 * Mention Notification Store Tests
 * Enterprise-grade test suite for mention toast notification state management
 * 
 * ALTIN KURALLAR:
 * 1. Test GERÇEK senaryoları, sadece pass olmasın
 * 2. Her satır, her dal, her edge case kontrol edilmeli
 * 3. Mock'lar gerçek davranışı yansıtmalı
 * 4. Bağımlılıklar doğrulanmalı
 * 5. Maintainable ve okunaklı olmalı
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useMentionNotificationStore, type MentionToastData } from '../mention-notification-store';

// Mock logger
vi.mock('@/shared/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('MentionNotificationStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useMentionNotificationStore.setState({ activeToast: null });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should have null activeToast initially', () => {
      const store = useMentionNotificationStore.getState();
      expect(store.activeToast).toBeNull();
    });

    it('should expose all required methods', () => {
      const store = useMentionNotificationStore.getState();
      
      expect(store.showToast).toBeDefined();
      expect(typeof store.showToast).toBe('function');
      
      expect(store.dismissToast).toBeDefined();
      expect(typeof store.dismissToast).toBe('function');
      
      expect(store.simulateMention).toBeDefined();
      expect(typeof store.simulateMention).toBe('function');
    });
  });

  describe('showToast', () => {
    it('should display a toast with correct data', () => {
      const testToast: MentionToastData = {
        channelId: 'channel-1',
        messageId: 'message-123',
        channelName: 'general-chat',
        mentionedBy: 'John Doe',
        message: 'Hey @Test User, check this out!',
      };
      
      const { showToast } = useMentionNotificationStore.getState();
      showToast(testToast);
      
      const store = useMentionNotificationStore.getState();
      expect(store.activeToast).toEqual(testToast);
    });

    it('should log toast display', async () => {
      const { logger } = await import('@/shared/utils/logger');
      
      const testToast: MentionToastData = {
        channelId: 'channel-1',
        messageId: 'message-123',
        channelName: 'general-chat',
        mentionedBy: 'Jane Smith',
        message: 'Hello @Test User!',
      };
      
      const { showToast } = useMentionNotificationStore.getState();
      showToast(testToast);
      
      expect(logger.info).toHaveBeenCalledWith(
        '[MentionNotificationStore] Toast shown',
        { toast: testToast }
      );
    });

    it('should replace existing toast with new toast', () => {
      const firstToast: MentionToastData = {
        channelId: 'channel-1',
        messageId: 'message-1',
        channelName: 'general',
        mentionedBy: 'User 1',
        message: 'First message',
      };
      
      const secondToast: MentionToastData = {
        channelId: 'channel-2',
        messageId: 'message-2',
        channelName: 'support',
        mentionedBy: 'User 2',
        message: 'Second message',
      };
      
      const { showToast } = useMentionNotificationStore.getState();
      
      // Show first toast
      showToast(firstToast);
      expect(useMentionNotificationStore.getState().activeToast).toEqual(firstToast);
      
      // Show second toast - should replace first
      showToast(secondToast);
      expect(useMentionNotificationStore.getState().activeToast).toEqual(secondToast);
      expect(useMentionNotificationStore.getState().activeToast).not.toEqual(firstToast);
    });

    it('should handle toast with empty message', () => {
      const testToast: MentionToastData = {
        channelId: 'channel-1',
        messageId: 'message-123',
        channelName: 'general-chat',
        mentionedBy: 'John Doe',
        message: '',
      };
      
      const { showToast } = useMentionNotificationStore.getState();
      showToast(testToast);
      
      const store = useMentionNotificationStore.getState();
      expect(store.activeToast).toEqual(testToast);
      expect(store.activeToast?.message).toBe('');
    });

    it('should handle toast with very long message', () => {
      const longMessage = 'A'.repeat(500);
      const testToast: MentionToastData = {
        channelId: 'channel-1',
        messageId: 'message-123',
        channelName: 'general-chat',
        mentionedBy: 'John Doe',
        message: longMessage,
      };
      
      const { showToast } = useMentionNotificationStore.getState();
      showToast(testToast);
      
      const store = useMentionNotificationStore.getState();
      expect(store.activeToast?.message).toBe(longMessage);
      expect(store.activeToast?.message.length).toBe(500);
    });

    it('should handle special characters in channel name', () => {
      const testToast: MentionToastData = {
        channelId: 'channel-1',
        messageId: 'message-123',
        channelName: 'general-chat™®©',
        mentionedBy: 'John Doe',
        message: 'Test message',
      };
      
      const { showToast } = useMentionNotificationStore.getState();
      showToast(testToast);
      
      const store = useMentionNotificationStore.getState();
      expect(store.activeToast?.channelName).toBe('general-chat™®©');
    });
  });

  describe('dismissToast', () => {
    it('should clear the active toast', () => {
      const testToast: MentionToastData = {
        channelId: 'channel-1',
        messageId: 'message-123',
        channelName: 'general-chat',
        mentionedBy: 'John Doe',
        message: 'Test message',
      };
      
      const { showToast, dismissToast } = useMentionNotificationStore.getState();
      
      // First show a toast
      showToast(testToast);
      expect(useMentionNotificationStore.getState().activeToast).toEqual(testToast);
      
      // Then dismiss it
      dismissToast();
      expect(useMentionNotificationStore.getState().activeToast).toBeNull();
    });

    it('should log toast dismissal', async () => {
      const { logger } = await import('@/shared/utils/logger');
      
      const { dismissToast } = useMentionNotificationStore.getState();
      dismissToast();
      
      expect(logger.info).toHaveBeenCalledWith('[MentionNotificationStore] Toast dismissed');
    });

    it('should be safe to call when no toast is active', () => {
      const { dismissToast } = useMentionNotificationStore.getState();
      
      // No toast active
      expect(useMentionNotificationStore.getState().activeToast).toBeNull();
      
      // Should not throw
      expect(() => dismissToast()).not.toThrow();
      
      // Should still be null
      expect(useMentionNotificationStore.getState().activeToast).toBeNull();
    });

    it('should be safe to call multiple times', () => {
      const testToast: MentionToastData = {
        channelId: 'channel-1',
        messageId: 'message-123',
        channelName: 'general-chat',
        mentionedBy: 'John Doe',
        message: 'Test message',
      };
      
      const { showToast, dismissToast } = useMentionNotificationStore.getState();
      
      // Show toast
      showToast(testToast);
      
      // Dismiss multiple times
      dismissToast();
      dismissToast();
      dismissToast();
      
      // Should still be null
      expect(useMentionNotificationStore.getState().activeToast).toBeNull();
    });
  });

  describe('simulateMention', () => {
    it('should create and show a test toast', () => {
      const { simulateMention } = useMentionNotificationStore.getState();
      
      // Before simulation
      expect(useMentionNotificationStore.getState().activeToast).toBeNull();
      
      // Simulate mention
      simulateMention();
      
      // After simulation
      const store = useMentionNotificationStore.getState();
      expect(store.activeToast).not.toBeNull();
      expect(store.activeToast?.channelId).toBe('channel-1');
      expect(store.activeToast?.messageId).toBe('message-123');
      expect(store.activeToast?.channelName).toBe('general-chat');
      expect(store.activeToast?.mentionedBy).toBe('John Doe');
      expect(store.activeToast?.message).toContain('@Test User');
    });

    it('should log simulation', async () => {
      const { logger } = await import('@/shared/utils/logger');
      
      const { simulateMention } = useMentionNotificationStore.getState();
      simulateMention();
      
      expect(logger.info).toHaveBeenCalledWith('[MentionNotificationStore] Test mention simulated');
    });

    it('should use showToast internally', async () => {
      const { logger } = await import('@/shared/utils/logger');
      
      const { simulateMention } = useMentionNotificationStore.getState();
      simulateMention();
      
      // Should call showToast, which logs
      expect(logger.info).toHaveBeenCalledWith(
        '[MentionNotificationStore] Toast shown',
        expect.objectContaining({
          toast: expect.objectContaining({
            channelId: 'channel-1',
            messageId: 'message-123',
          }),
        })
      );
    });

    it('should always use the same test data', () => {
      const { simulateMention } = useMentionNotificationStore.getState();
      
      // First simulation
      simulateMention();
      const firstToast = useMentionNotificationStore.getState().activeToast;
      
      // Dismiss and simulate again
      useMentionNotificationStore.getState().dismissToast();
      simulateMention();
      const secondToast = useMentionNotificationStore.getState().activeToast;
      
      // Should be identical test data
      expect(firstToast).toEqual(secondToast);
    });
  });

  describe('Real-World Scenarios', () => {
    it('should handle typical mention workflow', () => {
      const { showToast, dismissToast } = useMentionNotificationStore.getState();
      
      // 1. User receives mention via WebSocket (simulated)
      const mentionData: MentionToastData = {
        channelId: 'support-team',
        messageId: 'msg-456',
        channelName: 'Support Team',
        mentionedBy: 'Jane Smith',
        message: '@Agent can you help with ticket #1234?',
      };
      
      showToast(mentionData);
      
      // 2. Toast is displayed
      expect(useMentionNotificationStore.getState().activeToast).toEqual(mentionData);
      
      // 3. After 5 seconds (auto-dismiss in UI or manual click)
      dismissToast();
      
      // 4. Toast is gone
      expect(useMentionNotificationStore.getState().activeToast).toBeNull();
    });

    it('should handle rapid mentions (queue behavior)', () => {
      const { showToast } = useMentionNotificationStore.getState();
      
      const mention1: MentionToastData = {
        channelId: 'channel-1',
        messageId: 'msg-1',
        channelName: 'Channel 1',
        mentionedBy: 'User 1',
        message: 'First mention',
      };
      
      const mention2: MentionToastData = {
        channelId: 'channel-2',
        messageId: 'msg-2',
        channelName: 'Channel 2',
        mentionedBy: 'User 2',
        message: 'Second mention',
      };
      
      const mention3: MentionToastData = {
        channelId: 'channel-3',
        messageId: 'msg-3',
        channelName: 'Channel 3',
        mentionedBy: 'User 3',
        message: 'Third mention',
      };
      
      // Rapid mentions - only last one should be visible (current behavior)
      showToast(mention1);
      showToast(mention2);
      showToast(mention3);
      
      const store = useMentionNotificationStore.getState();
      expect(store.activeToast).toEqual(mention3);
    });

    it('should integrate with team chat navigation', () => {
      const { showToast } = useMentionNotificationStore.getState();
      
      // Mention with navigation data
      const mention: MentionToastData = {
        channelId: 'engineering-team',
        messageId: 'msg-789',
        channelName: 'Engineering Team',
        mentionedBy: 'Lead Developer',
        message: '@Agent urgent bug needs attention',
      };
      
      showToast(mention);
      
      const store = useMentionNotificationStore.getState();
      
      // Should have all data needed for navigation
      expect(store.activeToast?.channelId).toBe('engineering-team');
      expect(store.activeToast?.messageId).toBe('msg-789');
      
      // URL would be: /agent/team/chat?channelId=engineering-team&messageId=msg-789
    });
  });

  describe('Edge Cases', () => {
    it('should handle UTF-8 characters in message', () => {
      const testToast: MentionToastData = {
        channelId: 'channel-1',
        messageId: 'message-123',
        channelName: 'general-chat',
        mentionedBy: 'John Doe',
        message: 'Hello 你好 @Test User こんにちは 🎉',
      };
      
      const { showToast } = useMentionNotificationStore.getState();
      showToast(testToast);
      
      const store = useMentionNotificationStore.getState();
      expect(store.activeToast?.message).toBe('Hello 你好 @Test User こんにちは 🎉');
    });

    it('should handle emojis in mention', () => {
      const testToast: MentionToastData = {
        channelId: 'channel-1',
        messageId: 'message-123',
        channelName: '🚀 Launch Channel',
        mentionedBy: 'John Doe 👨‍💻',
        message: '@Test User 🎯 Check this out! 🔥',
      };
      
      const { showToast } = useMentionNotificationStore.getState();
      showToast(testToast);
      
      const store = useMentionNotificationStore.getState();
      expect(store.activeToast?.channelName).toContain('🚀');
      expect(store.activeToast?.mentionedBy).toContain('👨‍💻');
      expect(store.activeToast?.message).toContain('🎯');
    });

    it('should handle mentions with URLs', () => {
      const testToast: MentionToastData = {
        channelId: 'channel-1',
        messageId: 'message-123',
        channelName: 'general-chat',
        mentionedBy: 'John Doe',
        message: '@Test User check https://example.com/ticket/123',
      };
      
      const { showToast } = useMentionNotificationStore.getState();
      showToast(testToast);
      
      const store = useMentionNotificationStore.getState();
      expect(store.activeToast?.message).toContain('https://example.com');
    });

    it('should handle mentions with code blocks', () => {
      const testToast: MentionToastData = {
        channelId: 'channel-1',
        messageId: 'message-123',
        channelName: 'dev-channel',
        mentionedBy: 'Developer',
        message: '@Test User review this code: `const x = 42;`',
      };
      
      const { showToast } = useMentionNotificationStore.getState();
      showToast(testToast);
      
      const store = useMentionNotificationStore.getState();
      expect(store.activeToast?.message).toContain('`const x = 42;`');
    });
  });

  describe('State Persistence', () => {
    it('should maintain state across multiple operations', () => {
      const { showToast, dismissToast, simulateMention } = useMentionNotificationStore.getState();
      
      // Multiple operations
      simulateMention();
      expect(useMentionNotificationStore.getState().activeToast).not.toBeNull();
      
      dismissToast();
      expect(useMentionNotificationStore.getState().activeToast).toBeNull();
      
      const customToast: MentionToastData = {
        channelId: 'custom',
        messageId: 'msg-custom',
        channelName: 'Custom Channel',
        mentionedBy: 'Custom User',
        message: 'Custom message',
      };
      
      showToast(customToast);
      expect(useMentionNotificationStore.getState().activeToast).toEqual(customToast);
      
      dismissToast();
      expect(useMentionNotificationStore.getState().activeToast).toBeNull();
    });
  });

  describe('Performance', () => {
    it('should handle rapid state updates', () => {
      const { showToast, dismissToast } = useMentionNotificationStore.getState();
      
      // Rapid updates
      for (let i = 0; i < 100; i++) {
        const toast: MentionToastData = {
          channelId: `channel-${i}`,
          messageId: `msg-${i}`,
          channelName: `Channel ${i}`,
          mentionedBy: `User ${i}`,
          message: `Message ${i}`,
        };
        
        showToast(toast);
        if (i % 2 === 0) {
          dismissToast();
        }
      }
      
      // Should end with a toast visible (last iteration is 99, odd number)
      const store = useMentionNotificationStore.getState();
      expect(store.activeToast?.channelId).toBe('channel-99');
    });
  });
});

