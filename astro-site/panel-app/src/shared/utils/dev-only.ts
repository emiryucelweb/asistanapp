 
// NOTE: Test/fixture file - `any` accepted for mock data flexibility

/**
 * Development-Only Utilities
 * These functions are only active in development mode
 */

import { logger } from '@/shared/utils/logger';

/**
 * Development-only console log
 * Automatically suppressed in production
 */
export const devLog = (...args: any[]) => {
  if (import.meta.env.DEV) {
    logger.debug('[DEV]', ...args);
  }
};

/**
 * Development-only console warn
 */
export const devWarn = (...args: any[]) => {
  if (import.meta.env.DEV) {
    logger.warn('[DEV]', ...args);
  }
};

/**
 * Development-only console error
 */
export const devError = (...args: any[]) => {
  if (import.meta.env.DEV) {
    logger.error('[DEV]', ...args);
  }
};

/**
 * Check if running in development mode
 */
export const isDev = () => import.meta.env.DEV;

/**
 * Check if running in production mode
 */
export const isProd = () => import.meta.env.PROD;

/**
 * Execute function only in development
 */
export const devOnly = (fn: () => void) => {
  if (import.meta.env.DEV) {
    fn();
  }
};

/**
 * Show development warning banner
 */
export const showDevWarning = (message: string) => {
  if (import.meta.env.DEV) {
    console.warn(
      '%c⚠️ DEV MODE WARNING',
      'background: #f59e0b; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
      message
    );
  }
};


