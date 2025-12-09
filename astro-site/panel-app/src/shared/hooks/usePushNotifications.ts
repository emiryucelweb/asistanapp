 

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/shared/utils/logger';

interface NotificationState {
  permission: NotificationPermission;
  isSupported: boolean;
  isPWA: boolean;
}

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface NotificationPreferences {
  enabled: boolean;
  types: {
    newMessage: boolean;
    assignment: boolean;
    customerUpdate: boolean;
    systemAlert: boolean;
    teamMention: boolean;
    deadlineReminder: boolean;
  };
  quiet: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
  sound: {
    enabled: boolean;
    volume: number;
    customSound?: string;
  };
  desktop: boolean;
  mobile: boolean;
  email: boolean;
}

interface NotificationHistory {
  id: string;
  title: string;
  message: string;
  type: string;
  timestamp: string;
  isRead: boolean;
  action?: {
    type: string;
    data: any;
  };
}

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationState>({
    permission: 'default' as NotificationPermission,
    isSupported: false,
    isPWA: false
  });
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enabled: true,
    types: {
      newMessage: true,
      assignment: true,
      customerUpdate: true,
      systemAlert: true,
      teamMention: true,
      deadlineReminder: true
    },
    quiet: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00'
    },
    sound: {
      enabled: true,
      volume: 70,
    },
    desktop: true,
    mobile: true,
    email: false
  });
  const [notifications, setNotifications] = useState<NotificationHistory[]>([]);
  const [loading, setLoading] = useState(false);

  // Check if notifications are supported
  const checkSupport = useCallback(() => {
    const isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    
    setPermission(prev => ({
      ...prev,
      isSupported,
      isPWA,
      permission: isSupported ? Notification.permission : 'denied'
    }));

    return { isSupported, isPWA };
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!permission.isSupported) {
      throw new Error('Notifications are not supported in this browser');
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(prev => ({ ...prev, permission: result }));
      
      if (result === 'granted') {
        await subscribeToPush();
      }
      
      return result;
    } catch (error) {
      logger.error('Failed to request notification permission:', error);
      throw error;
    }
   
  // TODO: Missing subscribeToPush dependency - circular
  }, [permission.isSupported]);

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async () => {
    if (!permission.isSupported || permission.permission !== 'granted') {
      throw new Error('Notification permission not granted');
    }

    setLoading(true);
    try {
      // Register service worker if not already registered
      let registration = await navigator.serviceWorker.getRegistration();
      
      if (!registration) {
        registration = await navigator.serviceWorker.register('/sw.js');
        logger.debug('Service Worker registered');
      }

      // Get VAPID public key from server
      const vapidResponse = await fetch('/api/push-notifications/vapid-public-key');
      const { publicKey } = await vapidResponse.json();

      // Subscribe to push service
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource
      });

      // Send subscription to server
      const subscriptionData = {
        endpoint: pushSubscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(pushSubscription.getKey('p256dh')!),
          auth: arrayBufferToBase64(pushSubscription.getKey('auth')!)
        }
      };

      const response = await fetch('/api/push-notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscriptionData,
          preferences
        })
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe to push notifications');
      }

      setSubscription(subscriptionData);
      return subscriptionData;
    } catch (error) {
      logger.error('Failed to subscribe to push notifications:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [permission, preferences]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const pushSubscription = await registration.pushManager.getSubscription();
        if (pushSubscription) {
          await pushSubscription.unsubscribe();
        }
      }

      // Notify server about unsubscription
      await fetch('/api/push-notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription })
      });

      setSubscription(null);
    } catch (error) {
      logger.error('Failed to unsubscribe from push notifications:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [subscription]);

  // Update notification preferences
  const updatePreferences = useCallback(async (newPreferences: Partial<NotificationPreferences>) => {
    const updatedPreferences = { ...preferences, ...newPreferences };
    
    try {
      const response = await fetch('/api/push-notifications/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPreferences)
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      setPreferences(updatedPreferences);
      
      // If notifications are enabled and we don't have a subscription, create one
      if (updatedPreferences.enabled && !subscription && permission.permission === 'granted') {
        await subscribeToPush();
      }
    } catch (error) {
      logger.error('Failed to update notification preferences:', error);
      throw error;
    }
  }, [preferences, subscription, permission.permission, subscribeToPush]);

  // Load notification history
  const loadNotificationHistory = useCallback(async () => {
    try {
      const response = await fetch('/api/push-notifications/history');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      logger.error('Failed to load notification history:', error);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await fetch(`/api/push-notifications/${notificationId}/read`, {
        method: 'PUT'
      });

      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      ));
    } catch (error) {
      logger.error('Failed to mark notification as read:', error);
    }
  }, []);

  // Clear all notifications
  const clearAll = useCallback(async () => {
    try {
      await fetch('/api/push-notifications/clear-all', {
        method: 'DELETE'
      });
      setNotifications([]);
    } catch (error) {
      logger.error('Failed to clear notifications:', error);
    }
  }, []);

  // Show test notification
  const showTestNotification = useCallback(async () => {
    if (permission.permission !== 'granted') {
      throw new Error('Notification permission not granted');
    }

    try {
      await fetch('/api/push-notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription })
      });
    } catch (error) {
      logger.error('Failed to send test notification:', error);
      throw error;
    }
  }, [permission.permission, subscription]);

  // Load preferences from server
  const loadPreferences = useCallback(async () => {
    try {
      const response = await fetch('/api/push-notifications/preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences || preferences);
      }
    } catch (error) {
      logger.error('Failed to load preferences:', error);
    }
  }, [preferences]);

  // Initialize on mount
  useEffect(() => {
    checkSupport();
    loadPreferences();
    loadNotificationHistory();

    // Listen for push messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'PUSH_NOTIFICATION') {
          // Reload notification history when new push notification is received
          loadNotificationHistory();
        }
      });
    }
  }, [checkSupport, loadPreferences, loadNotificationHistory]);

  // Check if notifications are enabled
  const isEnabled = permission.permission === 'granted' && preferences.enabled && !!subscription;

  // Get unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    // State
    permission,
    subscription,
    preferences,
    notifications,
    loading,
    isEnabled,
    unreadCount,

    // Actions
    requestPermission,
    subscribeToPush,
    unsubscribe,
    updatePreferences,
    markAsRead,
    clearAll,
    showTestNotification,

    // Utils
    checkSupport,
    loadNotificationHistory,
    loadPreferences
  };
};

// Helper functions
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
