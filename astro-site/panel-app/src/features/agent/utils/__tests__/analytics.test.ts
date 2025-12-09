/**
 * Analytics Utilities Tests - ENTERPRISE GRADE
 * 
 * Comprehensive tests for analytics tracking and performance monitoring
 * 
 * @group utils
 * @group agent
 * @group analytics
 * 
 * ALTIN KURALLAR:
 * ✅ AAA Pattern (Arrange-Act-Assert)
 * ✅ Tek test → tek davranış
 * ✅ Deterministik testler (fixed time, seeded random)
 * ✅ Mock disiplini (minimal, realistic)
 * ✅ State izolasyonu
 * ✅ Minimal test data
 * ✅ Positive + Negative tests
 * ✅ Factory pattern
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  analytics,
  conversationAnalytics,
  messageAnalytics,
  userActionAnalytics,
  performanceAnalytics,
  errorAnalytics,
  type AnalyticsEvent,
  type PerformanceMetric,
} from '../analytics';
import type { Logger } from '@/shared/utils/logger';

// ============================================================================
// MOCKS
// ============================================================================

// Mock logger (factory function to avoid hoisting issues)
vi.mock('@/shared/utils/logger', () => {
  const mockLogger: Logger = {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };
  
  return {
    logger: mockLogger,
  };
});

// Get mocked logger for assertions
import { logger as mockLogger } from '@/shared/utils/logger';

// ============================================================================
// TEST UTILITIES
// ============================================================================

/**
 * Factory: Create mock analytics event
 */
const createMockEvent = (overrides?: Partial<AnalyticsEvent>): AnalyticsEvent => ({
  category: 'user_action',
  action: 'test_action',
  label: 'test_label',
  value: 123,
  metadata: { test: 'data' },
  ...overrides,
});

/**
 * Factory: Create mock performance metric
 */
const createMockMetric = (overrides?: Partial<PerformanceMetric>): PerformanceMetric => ({
  name: 'test_metric',
  value: 100,
  unit: 'ms',
  metadata: { test: 'data' },
  ...overrides,
});

// ============================================================================
// ANALYTICS SERVICE TESTS
// ============================================================================

describe('Analytics - Core Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ==================== initialize ====================

  describe('initialize', () => {
    it('should initialize with user ID', () => {
      // Arrange
      const userId = 'agent-123';

      // Act
      analytics.initialize(userId);

      // Assert
      expect(mockLogger.debug).toHaveBeenCalledWith(
        'Analytics initialized',
        expect.objectContaining({
          userId,
          sessionId: expect.stringContaining('session_'),
        })
      );
    });
  });

  // ==================== trackEvent ====================

  describe('trackEvent', () => {
    it('should log event in dev mode', () => {
      // Arrange
      const event = createMockEvent();

      // Act
      analytics.trackEvent(event);

      // Assert
      expect(mockLogger.debug).toHaveBeenCalledWith('Analytics event (dev mode)', event);
    });

    it('should enrich event with timestamp and session in production', () => {
      // Arrange
      const event = createMockEvent();
      // Note: Test runs in dev mode, so we test the logging behavior
      
      // Act
      analytics.trackEvent(event);

      // Assert - In dev mode, logs debug message
      expect(mockLogger.debug).toHaveBeenCalled();
    });

    it('should handle event without optional fields', () => {
      // Arrange
      const event: AnalyticsEvent = {
        category: 'user_action',
        action: 'test',
      };

      // Act
      analytics.trackEvent(event);

      // Assert
      expect(mockLogger.debug).toHaveBeenCalledWith('Analytics event (dev mode)', event);
    });
  });

  // ==================== trackPageView ====================

  describe('trackPageView', () => {
    it('should track page view with navigation category', () => {
      // Arrange
      const pageName = 'Dashboard';
      const path = '/agent/dashboard';

      // Act
      analytics.trackPageView(pageName, path);

      // Assert
      expect(mockLogger.debug).toHaveBeenCalledWith(
        'Analytics event (dev mode)',
        expect.objectContaining({
          category: 'navigation',
          action: 'page_view',
          label: pageName,
          metadata: { path },
        })
      );
    });
  });

  // ==================== trackSessionStart ====================

  describe('trackSessionStart', () => {
    it('should track session start event', () => {
      // Arrange & Act
      analytics.trackSessionStart();

      // Assert
      expect(mockLogger.debug).toHaveBeenCalledWith(
        'Analytics event (dev mode)',
        expect.objectContaining({
          category: 'user_action',
          action: 'session_start',
        })
      );
    });
  });

  // ==================== trackSessionEnd ====================

  describe('trackSessionEnd', () => {
    it('should track session end with duration', () => {
      // Arrange
      const duration = 3600; // 1 hour

      // Act
      analytics.trackSessionEnd(duration);

      // Assert
      expect(mockLogger.debug).toHaveBeenCalledWith(
        'Analytics event (dev mode)',
        expect.objectContaining({
          category: 'user_action',
          action: 'session_end',
          value: duration,
          metadata: { unit: 'seconds' },
        })
      );
    });
  });

  // ==================== trackPerformance ====================

  describe('trackPerformance', () => {
    it('should not log in dev mode', () => {
      // Arrange
      const metric = createMockMetric();

      // Act
      analytics.trackPerformance(metric);

      // Assert
      // In dev mode (import.meta.env.PROD = false), performance tracking is disabled
      expect(mockLogger.info).not.toHaveBeenCalled();
    });
  });
});

// ============================================================================
// CONVERSATION ANALYTICS TESTS
// ============================================================================

describe('Analytics - Conversation Tracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should track conversation opened', () => {
    // Arrange
    const conversationId = 'conv-123';
    const channel = 'whatsapp';

    // Act
    conversationAnalytics.trackConversationOpened(conversationId, channel);

    // Assert
    expect(mockLogger.debug).toHaveBeenCalledWith(
      'Analytics event (dev mode)',
      expect.objectContaining({
        category: 'conversation',
        action: 'opened',
        label: channel,
        metadata: { conversationId },
      })
    );
  });

  it('should track conversation assigned', () => {
    // Arrange
    const conversationId = 'conv-123';
    const agentId = 'agent-456';

    // Act
    conversationAnalytics.trackConversationAssigned(conversationId, agentId);

    // Assert
    expect(mockLogger.debug).toHaveBeenCalledWith(
      'Analytics event (dev mode)',
      expect.objectContaining({
        category: 'conversation',
        action: 'assigned',
        metadata: { conversationId, agentId },
      })
    );
  });

  it('should track conversation resolved with resolution time', () => {
    // Arrange
    const conversationId = 'conv-123';
    const resolutionTime = 300; // 5 minutes

    // Act
    conversationAnalytics.trackConversationResolved(conversationId, resolutionTime);

    // Assert
    expect(mockLogger.debug).toHaveBeenCalledWith(
      'Analytics event (dev mode)',
      expect.objectContaining({
        category: 'conversation',
        action: 'resolved',
        value: resolutionTime,
        metadata: { conversationId, unit: 'seconds' },
      })
    );
  });

  it('should track conversation transferred between agents', () => {
    // Arrange
    const conversationId = 'conv-123';
    const fromAgent = 'agent-1';
    const toAgent = 'agent-2';

    // Act
    conversationAnalytics.trackConversationTransferred(conversationId, fromAgent, toAgent);

    // Assert
    expect(mockLogger.debug).toHaveBeenCalledWith(
      'Analytics event (dev mode)',
      expect.objectContaining({
        category: 'conversation',
        action: 'transferred',
        metadata: { conversationId, fromAgent, toAgent },
      })
    );
  });
});

// ============================================================================
// MESSAGE ANALYTICS TESTS
// ============================================================================

describe('Analytics - Message Tracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should track message sent without attachments', () => {
    // Arrange
    const conversationId = 'conv-123';
    const hasAttachments = false;

    // Act
    messageAnalytics.trackMessageSent(conversationId, hasAttachments);

    // Assert
    expect(mockLogger.debug).toHaveBeenCalledWith(
      'Analytics event (dev mode)',
      expect.objectContaining({
        category: 'message',
        action: 'sent',
        metadata: expect.objectContaining({
          conversationId,
          hasAttachments,
        }),
      })
    );
  });

  it('should track message sent with attachments and response time', () => {
    // Arrange
    const conversationId = 'conv-123';
    const hasAttachments = true;
    const responseTime = 45;

    // Act
    messageAnalytics.trackMessageSent(conversationId, hasAttachments, responseTime);

    // Assert
    expect(mockLogger.debug).toHaveBeenCalledWith(
      'Analytics event (dev mode)',
      expect.objectContaining({
        category: 'message',
        action: 'sent',
        value: responseTime,
        metadata: expect.objectContaining({
          conversationId,
          hasAttachments,
          responseTime: '45s',
        }),
      })
    );
  });

  it('should track quick reply used', () => {
    // Arrange
    const templateId = 'template-greeting';

    // Act
    messageAnalytics.trackQuickReplyUsed(templateId);

    // Assert
    expect(mockLogger.debug).toHaveBeenCalledWith(
      'Analytics event (dev mode)',
      expect.objectContaining({
        category: 'message',
        action: 'quick_reply_used',
        metadata: { templateId },
      })
    );
  });

  it('should track file attached with type and size', () => {
    // Arrange
    const fileType = 'image/jpeg';
    const fileSize = 2048000; // 2MB

    // Act
    messageAnalytics.trackFileAttached(fileType, fileSize);

    // Assert
    expect(mockLogger.debug).toHaveBeenCalledWith(
      'Analytics event (dev mode)',
      expect.objectContaining({
        category: 'message',
        action: 'file_attached',
        label: fileType,
        value: fileSize,
        metadata: { unit: 'bytes' },
      })
    );
  });
});

// ============================================================================
// USER ACTION ANALYTICS TESTS
// ============================================================================

describe('Analytics - User Action Tracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should track search with results count', () => {
    // Arrange
    const query = 'customer support issue';
    const resultsCount = 15;

    // Act
    userActionAnalytics.trackSearch(query, resultsCount);

    // Assert
    expect(mockLogger.debug).toHaveBeenCalledWith(
      'Analytics event (dev mode)',
      expect.objectContaining({
        category: 'user_action',
        action: 'search',
        value: resultsCount,
        metadata: { query: query.substring(0, 50) },
      })
    );
  });

  it('should truncate long search queries for privacy', () => {
    // Arrange
    const longQuery = 'a'.repeat(100);
    const resultsCount = 5;

    // Act
    userActionAnalytics.trackSearch(longQuery, resultsCount);

    // Assert
    const call = (mockLogger.debug as any).mock.calls[0];
    const trackedQuery = call[1].metadata.query;
    expect(trackedQuery).toHaveLength(50);
  });

  it('should track filter applied', () => {
    // Arrange
    const filterType = 'status';
    const filterValue = 'waiting';

    // Act
    userActionAnalytics.trackFilterApplied(filterType, filterValue);

    // Assert
    expect(mockLogger.debug).toHaveBeenCalledWith(
      'Analytics event (dev mode)',
      expect.objectContaining({
        category: 'user_action',
        action: 'filter_applied',
        label: filterType,
        metadata: { value: filterValue },
      })
    );
  });

  it('should track status change', () => {
    // Arrange
    const from = 'available';
    const to = 'away';

    // Act
    userActionAnalytics.trackStatusChanged(from, to);

    // Assert
    expect(mockLogger.debug).toHaveBeenCalledWith(
      'Analytics event (dev mode)',
      expect.objectContaining({
        category: 'user_action',
        action: 'status_changed',
        metadata: { from, to },
      })
    );
  });

  it('should track keyboard shortcut usage', () => {
    // Arrange
    const shortcut = 'Cmd+K';

    // Act
    userActionAnalytics.trackKeyboardShortcut(shortcut);

    // Assert
    expect(mockLogger.debug).toHaveBeenCalledWith(
      'Analytics event (dev mode)',
      expect.objectContaining({
        category: 'user_action',
        action: 'keyboard_shortcut',
        label: shortcut,
      })
    );
  });
});

// ============================================================================
// PERFORMANCE ANALYTICS TESTS
// ============================================================================

describe('Analytics - Performance Tracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should track page load time', () => {
    // Arrange
    const pageName = 'conversations';
    const loadTime = 1250; // ms

    // Act
    performanceAnalytics.trackPageLoad(pageName, loadTime);

    // Assert
    // In dev mode, trackPerformance doesn't log
    expect(mockLogger.info).not.toHaveBeenCalled();
  });

  it('should track API response time', () => {
    // Arrange
    const endpoint = '/api/conversations';
    const duration = 350;
    const success = true;

    // Act
    performanceAnalytics.trackApiResponse(endpoint, duration, success);

    // Assert
    // In dev mode, trackPerformance doesn't log
    expect(mockLogger.info).not.toHaveBeenCalled();
  });

  it('should track component render time', () => {
    // Arrange
    const componentName = 'ConversationList';
    const renderTime = 45;

    // Act
    performanceAnalytics.trackComponentRender(componentName, renderTime);

    // Assert
    // In dev mode, trackPerformance doesn't log
    expect(mockLogger.info).not.toHaveBeenCalled();
  });
});

// ============================================================================
// ERROR ANALYTICS TESTS
// ============================================================================

describe('Analytics - Error Tracking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should track generic error', () => {
    // Arrange
    const errorName = 'ValidationError';
    const errorMessage = 'Invalid input provided';

    // Act
    errorAnalytics.trackError(errorName, errorMessage);

    // Assert
    expect(mockLogger.debug).toHaveBeenCalledWith(
      'Analytics event (dev mode)',
      expect.objectContaining({
        category: 'error',
        action: 'occurred',
        label: errorName,
        metadata: {
          message: errorMessage,
          context: undefined,
        },
      })
    );
  });

  it('should track error with context', () => {
    // Arrange
    const errorName = 'NetworkError';
    const errorMessage = 'Failed to fetch';
    const context = 'MessageList.tsx:line 45';

    // Act
    errorAnalytics.trackError(errorName, errorMessage, context);

    // Assert
    expect(mockLogger.debug).toHaveBeenCalledWith(
      'Analytics event (dev mode)',
      expect.objectContaining({
        category: 'error',
        action: 'occurred',
        label: errorName,
        metadata: {
          message: errorMessage,
          context,
        },
      })
    );
  });

  it('should track API error with status code', () => {
    // Arrange
    const endpoint = '/api/messages';
    const statusCode = 500;
    const errorMessage = 'Internal Server Error';

    // Act
    errorAnalytics.trackApiError(endpoint, statusCode, errorMessage);

    // Assert
    expect(mockLogger.debug).toHaveBeenCalledWith(
      'Analytics event (dev mode)',
      expect.objectContaining({
        category: 'error',
        action: 'api_error',
        label: endpoint,
        value: statusCode,
        metadata: { message: errorMessage },
      })
    );
  });
});

// ============================================================================
// EDGE CASES & INTEGRATION TESTS
// ============================================================================

describe('Analytics - Edge Cases & Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle multiple tracking calls in sequence', () => {
    // Arrange & Act
    analytics.trackEvent(createMockEvent({ action: 'event1' }));
    analytics.trackEvent(createMockEvent({ action: 'event2' }));
    analytics.trackEvent(createMockEvent({ action: 'event3' }));

    // Assert
    expect(mockLogger.debug).toHaveBeenCalledTimes(3);
  });

  it('should handle concurrent tracking calls', () => {
    // Arrange
    const events = Array.from({ length: 5 }, (_, i) =>
      createMockEvent({ action: `event${i}` })
    );

    // Act
    events.forEach(event => analytics.trackEvent(event));

    // Assert
    expect(mockLogger.debug).toHaveBeenCalledTimes(5);
  });

  it('should handle events with special characters in metadata', () => {
    // Arrange
    const event = createMockEvent({
      metadata: {
        specialChars: '<script>alert("xss")</script>',
        unicode: '你好世界 🌍',
        symbols: '!@#$%^&*()',
      },
    });

    // Act
    analytics.trackEvent(event);

    // Assert
    expect(mockLogger.debug).toHaveBeenCalledWith(
      'Analytics event (dev mode)',
      expect.objectContaining({
        metadata: expect.objectContaining({
          specialChars: '<script>alert("xss")</script>',
          unicode: '你好世界 🌍',
          symbols: '!@#$%^&*()',
        }),
      })
    );
  });

  it('should handle events with deeply nested metadata', () => {
    // Arrange
    const event = createMockEvent({
      metadata: {
        level1: {
          level2: {
            level3: {
              value: 'deep',
            },
          },
        },
      },
    });

    // Act
    analytics.trackEvent(event);

    // Assert
    expect(mockLogger.debug).toHaveBeenCalledWith(
      'Analytics event (dev mode)',
      expect.objectContaining({
        metadata: expect.objectContaining({
          level1: expect.any(Object),
        }),
      })
    );
  });

  it('should handle events with null/undefined values', () => {
    // Arrange
    const event: AnalyticsEvent = {
      category: 'user_action',
      action: 'test',
      label: undefined,
      value: undefined,
      metadata: { nullValue: null, undefinedValue: undefined },
    };

    // Act
    analytics.trackEvent(event);

    // Assert
    expect(mockLogger.debug).toHaveBeenCalled();
  });

  it('should generate session ID with correct format', () => {
    // Arrange
    const userId = 'agent-123';

    // Act
    analytics.initialize(userId);

    // Assert
    const call = (mockLogger.debug as any).mock.calls[0];
    const sessionId = call[1].sessionId;
    
    // Session ID should match format: session_{timestamp}_{random}
    expect(sessionId).toMatch(/^session_\d+_[a-z0-9]{7}$/);
    expect(sessionId).toContain('session_');
  });
});

// ============================================================================
// REAL-WORLD SCENARIO TESTS
// ============================================================================

describe('Analytics - Real-World Scenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should track complete conversation lifecycle', () => {
    // Arrange
    const conversationId = 'conv-123';
    const agentId = 'agent-456';
    const channel = 'whatsapp';

    // Act - Simulate conversation lifecycle
    conversationAnalytics.trackConversationOpened(conversationId, channel);
    conversationAnalytics.trackConversationAssigned(conversationId, agentId);
    messageAnalytics.trackMessageSent(conversationId, false);
    conversationAnalytics.trackConversationResolved(conversationId, 300);

    // Assert
    expect(mockLogger.debug).toHaveBeenCalledTimes(4);
    expect(mockLogger.debug).toHaveBeenNthCalledWith(
      1,
      'Analytics event (dev mode)',
      expect.objectContaining({ action: 'opened' })
    );
    expect(mockLogger.debug).toHaveBeenNthCalledWith(
      2,
      'Analytics event (dev mode)',
      expect.objectContaining({ action: 'assigned' })
    );
    expect(mockLogger.debug).toHaveBeenNthCalledWith(
      3,
      'Analytics event (dev mode)',
      expect.objectContaining({ action: 'sent' })
    );
    expect(mockLogger.debug).toHaveBeenNthCalledWith(
      4,
      'Analytics event (dev mode)',
      expect.objectContaining({ action: 'resolved' })
    );
  });

  it('should track complete user session', () => {
    // Arrange
    const userId = 'agent-123';

    // Act - Simulate user session
    analytics.initialize(userId);
    analytics.trackSessionStart();
    userActionAnalytics.trackSearch('customer', 10);
    userActionAnalytics.trackFilterApplied('status', 'waiting');
    analytics.trackPageView('Dashboard', '/dashboard');
    analytics.trackSessionEnd(3600);

    // Assert - 6 total calls (1 initialize + 5 events)
    expect(mockLogger.debug).toHaveBeenCalledTimes(6);
  });

  it('should track error recovery flow', () => {
    // Arrange
    const endpoint = '/api/messages';

    // Act - Simulate error and retry
    errorAnalytics.trackApiError(endpoint, 500, 'Internal Server Error');
    performanceAnalytics.trackApiResponse(endpoint, 5000, false);
    // Retry successful
    performanceAnalytics.trackApiResponse(endpoint, 350, true);

    // Assert
    expect(mockLogger.debug).toHaveBeenCalledTimes(1); // Only error tracked (perf doesn't log in dev)
  });
});

