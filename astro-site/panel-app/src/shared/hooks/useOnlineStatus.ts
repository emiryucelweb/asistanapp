/**
 * useOnlineStatus Hook
 * 
 * Monitors network connectivity status
 * Provides real-time online/offline detection
 * 
 * Features:
 * - Real-time network status
 * - Automatic reconnection detection
 * - Toast notifications (optional)
 * - Browser API integration
 * 
 * @module shared/hooks/useOnlineStatus
 */

import { useState, useEffect } from 'react';
import { showSuccess, showWarning } from '@/shared/utils/toast';
import { logger } from '@/shared/utils/logger';

interface UseOnlineStatusOptions {
  /** Show toast notifications on status change */
  showNotifications?: boolean;
  /** Callback when going online */
  onOnline?: () => void;
  /** Callback when going offline */
  onOffline?: () => void;
}

interface UseOnlineStatusReturn {
  /** Current online status */
  isOnline: boolean;
  /** Time of last status change */
  lastStatusChange: Date | null;
}

/**
 * ✅ PRODUCTION READY: Online/Offline status detection
 * Monitors network connectivity and provides real-time status
 * Useful for showing offline banners and preventing failed requests
 */
export function useOnlineStatus(options: UseOnlineStatusOptions = {}): UseOnlineStatusReturn {
  const {
    showNotifications = true,
    onOnline,
    onOffline,
  } = options;

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastStatusChange, setLastStatusChange] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      logger.info('Network connection restored');
      setIsOnline(true);
      setLastStatusChange(new Date());

      if (showNotifications) {
        showSuccess('İnternet bağlantısı geri geldi');
      }

      if (onOnline) {
        onOnline();
      }
    };

    const handleOffline = () => {
      logger.warn('Network connection lost');
      setIsOnline(false);
      setLastStatusChange(new Date());

      if (showNotifications) {
        showWarning('İnternet bağlantısı kesildi');
      }

      if (onOffline) {
        onOffline();
      }
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showNotifications, onOnline, onOffline]);

  return {
    isOnline,
    lastStatusChange,
  };
}

