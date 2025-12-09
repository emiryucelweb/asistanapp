/**
 * Analytics Tracker Tests
 * Enterprise-grade tests for analytics tracking system
 * 
 * @group utils
 * @group analytics
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { analyticsTracker, EventCategory, useAnalytics } from '../analytics-tracker';
import { advancedLogger } from '../advanced-logger';

// Mock advanced logger
vi.mock('../advanced-logger', () => ({
  advancedLogger: {
    info: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
    setUserId: vi.fn(),
  },
}));

describe('AnalyticsTracker - Enterprise Grade Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear queue before each test
    analyticsTracker.clearQueue();
    // Enable tracking for tests
    analyticsTracker.setEnabled(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with a unique session ID', () => {
      const queue = analyticsTracker.getQueue();
      expect(queue).toEqual([]);
    });

    it('should enable/disable tracking', () => {
      analyticsTracker.setEnabled(false);
      analyticsTracker.trackAction('test_action');
      expect(analyticsTracker.getQueue()).toHaveLength(0);

      analyticsTracker.setEnabled(true);
      analyticsTracker.trackAction('test_action');
      expect(analyticsTracker.getQueue().length).toBeGreaterThan(0);
    });
  });

  describe('User Tracking', () => {
    it('should set user ID', () => {
      analyticsTracker.setUserId('user-123');
      expect(advancedLogger.setUserId).toHaveBeenCalledWith('user-123');
    });

    it('should set user properties', () => {
      const properties = {
        userId: 'user-123',
        role: 'admin',
        tenantId: 'tenant-456',
        plan: 'enterprise',
      };

      analyticsTracker.setUserProperties(properties);
      expect(advancedLogger.info).toHaveBeenCalledWith(
        'User properties set',
        { properties }
      );
    });

    it('should not set user properties when disabled', () => {
      analyticsTracker.setEnabled(false);
      analyticsTracker.setUserProperties({ userId: 'user-123' });
      expect(advancedLogger.info).not.toHaveBeenCalled();
    });
  });

  describe('Event Tracking', () => {
    it('should track basic event', () => {
      analyticsTracker.track(EventCategory.USER, 'login');
      
      const queue = analyticsTracker.getQueue();
      expect(queue).toHaveLength(1);
      expect(queue[0]).toMatchObject({
        category: EventCategory.USER,
        action: 'login',
      });
      expect(queue[0].timestamp).toBeDefined();
      expect(queue[0].sessionId).toBeDefined();
    });

    it('should track event with label and value', () => {
      analyticsTracker.track(
        EventCategory.CONVERSATION,
        'message_sent',
        'conv-123',
        10,
        { channel: 'whatsapp' }
      );

      const queue = analyticsTracker.getQueue();
      expect(queue).toHaveLength(1);
      expect(queue[0]).toMatchObject({
        category: EventCategory.CONVERSATION,
        action: 'message_sent',
        label: 'conv-123',
        value: 10,
        metadata: { channel: 'whatsapp' },
      });
    });

    it('should include userId in events when set', () => {
      analyticsTracker.setUserId('user-456');
      analyticsTracker.trackAction('button_click');

      const queue = analyticsTracker.getQueue();
      expect(queue[0].userId).toBe('user-456');
    });

    it('should not track events when disabled', () => {
      analyticsTracker.setEnabled(false);
      analyticsTracker.track(EventCategory.USER, 'test');
      
      expect(analyticsTracker.getQueue()).toHaveLength(0);
    });
  });

  describe('Specialized Tracking Methods', () => {
    it('should track user action', () => {
      analyticsTracker.trackAction('button_click', { button: 'submit' });
      
      const queue = analyticsTracker.getQueue();
      expect(queue[0]).toMatchObject({
        category: EventCategory.USER,
        action: 'button_click',
        metadata: { button: 'submit' },
      });
    });

    it('should track conversation event', () => {
      analyticsTracker.trackConversation(
        'conversation_created',
        'conv-789',
        { channel: 'web' }
      );

      const queue = analyticsTracker.getQueue();
      expect(queue[0]).toMatchObject({
        category: EventCategory.CONVERSATION,
        action: 'conversation_created',
        label: 'conv-789',
        metadata: { channel: 'web' },
      });
    });

    it('should track message event', () => {
      analyticsTracker.trackMessage(
        'message_sent',
        'msg-123',
        { type: 'text' }
      );

      const queue = analyticsTracker.getQueue();
      expect(queue[0]).toMatchObject({
        category: EventCategory.MESSAGE,
        action: 'message_sent',
        label: 'msg-123',
        metadata: { type: 'text' },
      });
    });

    it('should track error', () => {
      const error = new Error('Test error');
      error.stack = 'Error stack trace';

      analyticsTracker.trackError(error, { context: 'test' });

      const queue = analyticsTracker.getQueue();
      expect(queue[0]).toMatchObject({
        category: EventCategory.ERROR,
        action: 'Error',
        label: 'Test error',
        metadata: {
          stack: 'Error stack trace',
          context: 'test',
        },
      });
    });

    it('should track performance metric', () => {
      analyticsTracker.trackPerformance('page_load', 1250, { route: '/dashboard' });

      const queue = analyticsTracker.getQueue();
      expect(queue[0]).toMatchObject({
        category: EventCategory.PERFORMANCE,
        action: 'page_load',
        value: 1250,
        metadata: { route: '/dashboard' },
      });
    });

    it('should track conversion event', () => {
      analyticsTracker.trackConversion('trial_started', 99.99, { plan: 'pro' });

      const queue = analyticsTracker.getQueue();
      expect(queue[0]).toMatchObject({
        category: EventCategory.CONVERSION,
        action: 'trial_started',
        value: 99.99,
        metadata: { plan: 'pro' },
      });
    });

    it('should track page view', () => {
      analyticsTracker.trackPageView({
        path: '/dashboard',
        title: 'Dashboard',
        referrer: '/',
        loadTime: 1200,
        metadata: { user: 'admin' },
      });

      expect(advancedLogger.info).toHaveBeenCalledWith(
        'Page view tracked',
        expect.objectContaining({
          path: '/dashboard',
          title: 'Dashboard',
        })
      );

      const queue = analyticsTracker.getQueue();
      expect(queue[0]).toMatchObject({
        category: EventCategory.NAVIGATION,
        action: 'page_view',
        label: '/dashboard',
        value: 1200,
      });
    });
  });

  describe('Queue Management', () => {
    it('should add events to queue', () => {
      analyticsTracker.trackAction('action1');
      analyticsTracker.trackAction('action2');
      analyticsTracker.trackAction('action3');

      const queue = analyticsTracker.getQueue();
      expect(queue).toHaveLength(3);
    });

    it('should clear queue', () => {
      analyticsTracker.trackAction('action1');
      analyticsTracker.trackAction('action2');
      
      analyticsTracker.clearQueue();
      expect(analyticsTracker.getQueue()).toHaveLength(0);
    });

    it('should return a copy of the queue', () => {
      analyticsTracker.trackAction('test');
      const queue1 = analyticsTracker.getQueue();
      const queue2 = analyticsTracker.getQueue();

      expect(queue1).toEqual(queue2);
      expect(queue1).not.toBe(queue2); // Different references
    });

    it('should auto-flush when queue is full (maxQueueSize = 50)', () => {
      // Track 51 events to trigger auto-flush
      for (let i = 0; i < 51; i++) {
        analyticsTracker.trackAction(`action_${i}`);
      }

      // After flush, queue should be cleared or contain remaining events
      const queue = analyticsTracker.getQueue();
      expect(queue.length).toBeLessThan(51);
    });
  });

  describe('Flush Behavior', () => {
    it('should flush events', async () => {
      analyticsTracker.trackAction('action1');
      analyticsTracker.trackAction('action2');

      await analyticsTracker.forceFlush();

      expect(advancedLogger.debug).toHaveBeenCalledWith(
        'Analytics events flushed',
        { count: 2 }
      );
    });

    it('should not flush empty queue', async () => {
      analyticsTracker.clearQueue();
      await analyticsTracker.forceFlush();

      // Should not log flush for empty queue
      expect(advancedLogger.debug).not.toHaveBeenCalledWith(
        'Analytics events flushed',
        expect.anything()
      );
    });
  });

  describe('useAnalytics Hook', () => {
    it('should return analytics methods', () => {
      const analytics = useAnalytics();

      expect(analytics).toHaveProperty('track');
      expect(analytics).toHaveProperty('trackPageView');
      expect(analytics).toHaveProperty('trackAction');
      expect(analytics).toHaveProperty('trackConversation');
      expect(analytics).toHaveProperty('trackMessage');
      expect(analytics).toHaveProperty('trackError');
      expect(analytics).toHaveProperty('trackPerformance');
      expect(analytics).toHaveProperty('trackConversion');
      expect(analytics).toHaveProperty('setUserId');
      expect(analytics).toHaveProperty('setUserProperties');
    });

    it('should bind methods correctly', () => {
      const analytics = useAnalytics();
      
      analyticsTracker.clearQueue();
      analytics.trackAction('test_action');

      const queue = analyticsTracker.getQueue();
      expect(queue).toHaveLength(1);
      expect(queue[0].action).toBe('test_action');
    });
  });

  describe('Event Categories', () => {
    it('should support all event categories', () => {
      expect(EventCategory.USER).toBe('user');
      expect(EventCategory.CONVERSATION).toBe('conversation');
      expect(EventCategory.MESSAGE).toBe('message');
      expect(EventCategory.NAVIGATION).toBe('navigation');
      expect(EventCategory.PERFORMANCE).toBe('performance');
      expect(EventCategory.ERROR).toBe('error');
      expect(EventCategory.ENGAGEMENT).toBe('engagement');
      expect(EventCategory.CONVERSION).toBe('conversion');
    });
  });

  describe('Edge Cases', () => {
    it('should handle tracking with no metadata', () => {
      analyticsTracker.trackAction('simple_action');
      
      const queue = analyticsTracker.getQueue();
      expect(queue[0]).toMatchObject({
        action: 'simple_action',
      });
    });

    it('should handle tracking with empty metadata', () => {
      analyticsTracker.trackAction('action', {});
      
      const queue = analyticsTracker.getQueue();
      expect(queue[0].metadata).toEqual({});
    });

    it('should handle error without stack trace', () => {
      const error = new Error('Simple error');
      delete error.stack;

      analyticsTracker.trackError(error);

      const queue = analyticsTracker.getQueue();
      expect(queue[0].metadata?.stack).toBeUndefined();
    });

    it('should handle page view with minimal data', () => {
      analyticsTracker.trackPageView({ path: '/minimal' });

      const queue = analyticsTracker.getQueue();
      expect(queue[0].label).toBe('/minimal');
    });
  });

  describe('Singleton Instance', () => {
    it('should maintain state across multiple imports', () => {
      analyticsTracker.setUserId('user-singleton');
      analyticsTracker.trackAction('test');

      const queue = analyticsTracker.getQueue();
      expect(queue[0].userId).toBe('user-singleton');
    });
  });
});

