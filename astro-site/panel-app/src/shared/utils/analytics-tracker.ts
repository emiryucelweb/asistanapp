 
// NOTE: Infrastructure/utility file - `any` used for generic types & external library interfaces

/**
 * Analytics Tracking System
 * Enterprise-grade event tracking for user behavior analytics
 * 
 * @module shared/utils/analytics-tracker
 */

import { advancedLogger } from './advanced-logger';

export enum EventCategory {
  USER = 'user',
  CONVERSATION = 'conversation',
  MESSAGE = 'message',
  NAVIGATION = 'navigation',
  PERFORMANCE = 'performance',
  ERROR = 'error',
  ENGAGEMENT = 'engagement',
  CONVERSION = 'conversion',
}

export interface AnalyticsEvent {
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId: string;
}

export interface UserProperties {
  userId: string;
  role?: string;
  tenantId?: string;
  plan?: string;
  signupDate?: string;
  lastActive?: string;
  [key: string]: any;
}

export interface PageView {
  path: string;
  title?: string;
  referrer?: string;
  loadTime?: number;
  metadata?: Record<string, any>;
}

/**
 * Analytics Tracker Class
 * Tracks user behavior and custom events
 */
class AnalyticsTracker {
  private enabled: boolean;
  private userId?: string;
  private sessionId: string;
  private eventQueue: AnalyticsEvent[] = [];
  private maxQueueSize = 50;
  private flushInterval: number;
  private flushTimer?: number;

  constructor() {
    this.enabled = import.meta.env.PROD;
    this.sessionId = this.generateSessionId();
    this.flushInterval = 10000; // 10 seconds
    this.startAutoFlush();
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `analytics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Start auto-flush timer
   */
  private startAutoFlush(): void {
    if (typeof window === 'undefined') return;

    this.flushTimer = window.setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * Enable/disable tracking
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Set user ID
   */
  setUserId(userId: string): void {
    this.userId = userId;
    advancedLogger.setUserId(userId);
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: UserProperties): void {
    if (!this.enabled) return;

    // ✅ Analytics Integration - User Properties
    // When ready: import { gtag } from '@/lib/integrations/analytics';
    // gtag('set', 'user_properties', properties);
    
    // When ready: import mixpanel from 'mixpanel-browser';
    // mixpanel.people.set(properties);

    advancedLogger.info('User properties set', { properties });
  }

  /**
   * Track event
   */
  track(
    category: EventCategory,
    action: string,
    label?: string,
    value?: number,
    metadata?: Record<string, any>
  ): void {
    if (!this.enabled) return;

    const event: AnalyticsEvent = {
      category,
      action,
      label,
      value,
      metadata,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId,
    };

    // Add to queue
    this.eventQueue.push(event);

    // Auto flush if queue is full
    if (this.eventQueue.length >= this.maxQueueSize) {
      this.flush();
    }

    // Log event
    advancedLogger.debug('Analytics event tracked', {
      category,
      action,
      label,
      value,
      metadata,
    });

    // ✅ Analytics Integration - Event Tracking
    // When ready: import { gtag } from '@/lib/integrations/analytics';
    // gtag('event', action, {
    //   event_category: category,
    //   event_label: label,
    //   value: value,
    //   ...metadata,
    // });

    // When ready: import mixpanel from 'mixpanel-browser';
    // mixpanel.track(action, {
    //   category,
    //   label,
    //   value,
    //   ...metadata,
    // });
  }

  /**
   * Track page view
   */
  trackPageView(pageView: PageView): void {
    if (!this.enabled) return;

    advancedLogger.info('Page view tracked', pageView);

    // ✅ Analytics Integration - Page View
    // When ready: import { gtag } from '@/lib/integrations/analytics';
    // gtag('config', 'GA_MEASUREMENT_ID', {
    //   page_path: pageView.path,
    //   page_title: pageView.title,
    //   page_referrer: pageView.referrer,
    // });

    // When ready: import mixpanel from 'mixpanel-browser';
    // mixpanel.track('Page View', pageView);

    this.track(EventCategory.NAVIGATION, 'page_view', pageView.path, pageView.loadTime, pageView.metadata);
  }

  /**
   * Track user action
   */
  trackAction(action: string, metadata?: Record<string, any>): void {
    this.track(EventCategory.USER, action, undefined, undefined, metadata);
  }

  /**
   * Track conversation event
   */
  trackConversation(action: string, conversationId: string, metadata?: Record<string, any>): void {
    this.track(EventCategory.CONVERSATION, action, conversationId, undefined, metadata);
  }

  /**
   * Track message event
   */
  trackMessage(action: string, messageId: string, metadata?: Record<string, any>): void {
    this.track(EventCategory.MESSAGE, action, messageId, undefined, metadata);
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: Record<string, any>): void {
    this.track(EventCategory.ERROR, error.name, error.message, undefined, {
      stack: error.stack,
      ...context,
    });
  }

  /**
   * Track performance metric
   */
  trackPerformance(metric: string, value: number, metadata?: Record<string, any>): void {
    this.track(EventCategory.PERFORMANCE, metric, undefined, value, metadata);
  }

  /**
   * Track conversion event
   */
  trackConversion(action: string, value?: number, metadata?: Record<string, any>): void {
    this.track(EventCategory.CONVERSION, action, undefined, value, metadata);
  }

  /**
   * Flush event queue to remote
   */
  private async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // ✅ Analytics Backend Integration
      // When ready: import { sendEvents } from '@/lib/integrations/analytics';
      // await sendEvents(events);
      
      // Example: Send to backend analytics service
      // await fetch('/api/analytics/events', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(events),
      // });

      advancedLogger.debug('Analytics events flushed', { count: events.length });
    } catch (error) {
      advancedLogger.error('Failed to flush analytics events', error as Error);
      // Re-queue failed events
      this.eventQueue.unshift(...events);
    }
  }

  /**
   * Force flush
   */
  async forceFlush(): Promise<void> {
    await this.flush();
  }

  /**
   * Get event queue
   */
  getQueue(): AnalyticsEvent[] {
    return [...this.eventQueue];
  }

  /**
   * Clear queue
   */
  clearQueue(): void {
    this.eventQueue = [];
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}

// Export singleton instance
export const analyticsTracker = new AnalyticsTracker();

// Export for easy usage
export default analyticsTracker;

/**
 * React hook for analytics
 */
export function useAnalytics() {
  return {
    track: analyticsTracker.track.bind(analyticsTracker),
    trackPageView: analyticsTracker.trackPageView.bind(analyticsTracker),
    trackAction: analyticsTracker.trackAction.bind(analyticsTracker),
    trackConversation: analyticsTracker.trackConversation.bind(analyticsTracker),
    trackMessage: analyticsTracker.trackMessage.bind(analyticsTracker),
    trackError: analyticsTracker.trackError.bind(analyticsTracker),
    trackPerformance: analyticsTracker.trackPerformance.bind(analyticsTracker),
    trackConversion: analyticsTracker.trackConversion.bind(analyticsTracker),
    setUserId: analyticsTracker.setUserId.bind(analyticsTracker),
    setUserProperties: analyticsTracker.setUserProperties.bind(analyticsTracker),
  };
}

