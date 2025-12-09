/**
 * Analytics Tracking Utilities
 * User behavior and performance metrics tracking
 * 
 * @module agent/utils/analytics
 */

import { logger } from '@/shared/utils/logger';

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export type AnalyticsEventCategory =
  | 'conversation'
  | 'message'
  | 'user_action'
  | 'performance'
  | 'error'
  | 'navigation';

export interface AnalyticsEvent {
  category: AnalyticsEventCategory;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count';
  metadata?: Record<string, unknown>;
}

// ============================================================================
// ANALYTICS SERVICE
// ============================================================================

class AnalyticsService {
  private enabled: boolean;
  private sessionId: string;
  private userId: string | null = null;

  constructor() {
    this.enabled = import.meta.env.PROD; // Only enable in production
    this.sessionId = this.generateSessionId();
  }

  /**
   * Initialize analytics with user context
   */
  initialize(userId: string): void {
    this.userId = userId;
    logger.debug('Analytics initialized', { userId, sessionId: this.sessionId });
  }

  /**
   * Track analytics event
   */
  trackEvent(event: AnalyticsEvent): void {
    if (!this.enabled) {
      logger.debug('Analytics event (dev mode)', event);
      return;
    }

    const enrichedEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId ?? undefined,
    };

    // ✅ Analytics Integration - Ready for GA4/Mixpanel
    // When ready: import { gtag } from '@/lib/integrations/analytics';
    // gtag('event', eventName, eventData);
    logger.info('Analytics event tracked', enrichedEvent);

    // Example: Send to Google Analytics
    // if (window.gtag) {
    //   window.gtag('event', event.action, {
    //     event_category: event.category,
    //     event_label: event.label,
    //     value: event.value,
    //   });
    // }
  }

  /**
   * Track page view
   */
  trackPageView(pageName: string, path: string): void {
    this.trackEvent({
      category: 'navigation',
      action: 'page_view',
      label: pageName,
      metadata: { path },
    });
  }

  /**
   * Track performance metric
   */
  trackPerformance(metric: PerformanceMetric): void {
    if (!this.enabled) return;

    logger.info('Performance metric', metric);

    // ✅ Performance Monitoring Integration - Ready for New Relic/DataDog
    // When ready: import { reportPerformance } from '@/lib/integrations/performance';
    // reportPerformance(metric);
  }

  /**
   * Track user session start
   */
  trackSessionStart(): void {
    this.trackEvent({
      category: 'user_action',
      action: 'session_start',
    });
  }

  /**
   * Track user session end
   */
  trackSessionEnd(duration: number): void {
    this.trackEvent({
      category: 'user_action',
      action: 'session_end',
      value: duration,
      metadata: { unit: 'seconds' },
    });
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

// ============================================================================
// CONVERSATION ANALYTICS
// ============================================================================

export const conversationAnalytics = {
  /**
   * Track conversation opened
   */
  trackConversationOpened(conversationId: string, channel: string): void {
    analytics.trackEvent({
      category: 'conversation',
      action: 'opened',
      label: channel,
      metadata: { conversationId },
    });
  },

  /**
   * Track conversation assigned
   */
  trackConversationAssigned(conversationId: string, agentId: string): void {
    analytics.trackEvent({
      category: 'conversation',
      action: 'assigned',
      metadata: { conversationId, agentId },
    });
  },

  /**
   * Track conversation resolved
   */
  trackConversationResolved(conversationId: string, resolutionTime: number): void {
    analytics.trackEvent({
      category: 'conversation',
      action: 'resolved',
      value: resolutionTime,
      metadata: { conversationId, unit: 'seconds' },
    });
  },

  /**
   * Track conversation transferred
   */
  trackConversationTransferred(conversationId: string, fromAgent: string, toAgent: string): void {
    analytics.trackEvent({
      category: 'conversation',
      action: 'transferred',
      metadata: { conversationId, fromAgent, toAgent },
    });
  },
};

// ============================================================================
// MESSAGE ANALYTICS
// ============================================================================

export const messageAnalytics = {
  /**
   * Track message sent
   */
  trackMessageSent(conversationId: string, hasAttachments: boolean, responseTime?: number): void {
    analytics.trackEvent({
      category: 'message',
      action: 'sent',
      value: responseTime,
      metadata: {
        conversationId,
        hasAttachments,
        responseTime: responseTime ? `${responseTime}s` : undefined,
      },
    });
  },

  /**
   * Track quick reply used
   */
  trackQuickReplyUsed(templateId: string): void {
    analytics.trackEvent({
      category: 'message',
      action: 'quick_reply_used',
      metadata: { templateId },
    });
  },

  /**
   * Track file attached
   */
  trackFileAttached(fileType: string, fileSize: number): void {
    analytics.trackEvent({
      category: 'message',
      action: 'file_attached',
      label: fileType,
      value: fileSize,
      metadata: { unit: 'bytes' },
    });
  },
};

// ============================================================================
// USER ACTION ANALYTICS
// ============================================================================

export const userActionAnalytics = {
  /**
   * Track search performed
   */
  trackSearch(query: string, resultsCount: number): void {
    analytics.trackEvent({
      category: 'user_action',
      action: 'search',
      value: resultsCount,
      metadata: { query: query.substring(0, 50) }, // Truncate for privacy
    });
  },

  /**
   * Track filter applied
   */
  trackFilterApplied(filterType: string, filterValue: string): void {
    analytics.trackEvent({
      category: 'user_action',
      action: 'filter_applied',
      label: filterType,
      metadata: { value: filterValue },
    });
  },

  /**
   * Track agent status changed
   */
  trackStatusChanged(from: string, to: string): void {
    analytics.trackEvent({
      category: 'user_action',
      action: 'status_changed',
      metadata: { from, to },
    });
  },

  /**
   * Track keyboard shortcut used
   */
  trackKeyboardShortcut(shortcut: string): void {
    analytics.trackEvent({
      category: 'user_action',
      action: 'keyboard_shortcut',
      label: shortcut,
    });
  },
};

// ============================================================================
// PERFORMANCE ANALYTICS
// ============================================================================

export const performanceAnalytics = {
  /**
   * Track page load time
   */
  trackPageLoad(pageName: string, loadTime: number): void {
    analytics.trackPerformance({
      name: `page_load_${pageName}`,
      value: loadTime,
      unit: 'ms',
    });
  },

  /**
   * Track API response time
   */
  trackApiResponse(endpoint: string, duration: number, success: boolean): void {
    analytics.trackPerformance({
      name: `api_response_${endpoint}`,
      value: duration,
      unit: 'ms',
      metadata: { success },
    });
  },

  /**
   * Track component render time
   */
  trackComponentRender(componentName: string, renderTime: number): void {
    analytics.trackPerformance({
      name: `component_render_${componentName}`,
      value: renderTime,
      unit: 'ms',
    });
  },
};

// ============================================================================
// ERROR ANALYTICS
// ============================================================================

export const errorAnalytics = {
  /**
   * Track error occurred
   */
  trackError(errorName: string, errorMessage: string, context?: string): void {
    analytics.trackEvent({
      category: 'error',
      action: 'occurred',
      label: errorName,
      metadata: {
        message: errorMessage,
        context,
      },
    });
  },

  /**
   * Track API error
   */
  trackApiError(endpoint: string, statusCode: number, errorMessage: string): void {
    analytics.trackEvent({
      category: 'error',
      action: 'api_error',
      label: endpoint,
      value: statusCode,
      metadata: { message: errorMessage },
    });
  },
};

