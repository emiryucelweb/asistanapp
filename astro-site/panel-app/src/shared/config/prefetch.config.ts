/**
 * Prefetch Configuration
 * 
 * Enterprise-grade route prefetching strategy
 * Improves perceived performance by loading likely next pages
 * 
 * @module shared/config/prefetch
 */

import { logger } from '@/shared/utils/logger';

/**
 * Routes that should be prefetched on idle
 * Prefetch after user authenticates to reduce subsequent navigation time
 */
export const PREFETCH_ROUTES = {
  // Agent Panel Routes
  agent: {
    // Critical routes - prefetch immediately after login
    critical: [
      '/agent/conversations',
      '/agent/dashboard',
    ],
    // Secondary routes - prefetch on idle
    secondary: [
      '/agent/profile',
      '/agent/ai-chat',
    ],
    // Tertiary routes - prefetch on user hover/focus
    tertiary: [
      '/agent/conversations/:id', // Dynamic route pattern
    ],
  },
  
  // Admin Panel Routes
  admin: {
    critical: [
      '/admin/dashboard',
      '/admin/agents',
    ],
    secondary: [
      '/admin/team-chat',
      '/admin/reports',
    ],
    tertiary: [
      '/admin/settings',
    ],
  },
  
  // Super Admin Panel Routes
  superAdmin: {
    critical: [
      '/super-admin/dashboard',
      '/super-admin/tenants',
    ],
    secondary: [
      '/super-admin/system',
    ],
    tertiary: [],
  },
} as const;

/**
 * Prefetch Strategy Configuration
 */
export const PREFETCH_CONFIG = {
  /**
   * Time to wait after authentication before prefetching critical routes (ms)
   */
  criticalDelay: 1000, // 1 second
  
  /**
   * Time to wait before prefetching secondary routes (ms)
   */
  secondaryDelay: 3000, // 3 seconds
  
  /**
   * Enable prefetch on hover/focus for tertiary routes
   */
  enableHoverPrefetch: true,
  
  /**
   * Hover delay before triggering prefetch (ms)
   */
  hoverDelay: 50,
  
  /**
   * Maximum concurrent prefetch requests
   */
  maxConcurrent: 3,
  
  /**
   * Prefetch only on fast connections (3G and above)
   */
  onlyFastConnection: true,
  
  /**
   * Prefetch only when device is not low on battery
   */
  respectBatterySaver: true,
} as const;

/**
 * Get prefetch routes for a specific role
 */
export function getPrefetchRoutesForRole(role: 'agent' | 'admin' | 'super-admin') {
  const roleKey = role === 'super-admin' ? 'superAdmin' : role;
  return PREFETCH_ROUTES[roleKey];
}

/**
 * Check if connection is fast enough for prefetching
 */
export function shouldPrefetch(): boolean {
  if (!PREFETCH_CONFIG.onlyFastConnection) return true;
  
  // Check network connection type
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  if (!connection) return true; // If API not available, allow prefetch
  
  const slowConnections = ['slow-2g', '2g'];
  const effectiveType = connection.effectiveType;
  
  if (slowConnections.includes(effectiveType)) {
    return false;
  }
  
  return true;
}

/**
 * Check if device is low on battery
 */
export async function isBatteryLow(): Promise<boolean> {
  if (!PREFETCH_CONFIG.respectBatterySaver) return false;
  
  try {
    const battery = await (navigator as any).getBattery?.();
    if (!battery) return false;
    
    // Consider low if charging is false and level is below 20%
    return !battery.charging && battery.level < 0.2;
  } catch {
    return false; // If API not available, allow prefetch
  }
}

/**
 * Prefetch a route using link preload
 */
export function prefetchRoute(path: string): void {
  // Create link element with rel="prefetch"
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = path;
  link.as = 'document';
  
  // Add to head
  document.head.appendChild(link);
}

/**
 * Prefetch multiple routes with delay
 */
export async function prefetchRoutes(routes: string[], delay: number = 0): Promise<void> {
  // Check if we should prefetch
  if (!shouldPrefetch()) {
    logger.debug('[Prefetch] Skipped due to slow connection');
    return;
  }
  
  if (await isBatteryLow()) {
    logger.debug('[Prefetch] Skipped due to low battery');
    return;
  }
  
  // Wait for specified delay
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  // Prefetch routes with concurrency limit
  const { maxConcurrent } = PREFETCH_CONFIG;
  const chunks = [];
  
  for (let i = 0; i < routes.length; i += maxConcurrent) {
    chunks.push(routes.slice(i, i + maxConcurrent));
  }
  
  for (const chunk of chunks) {
    await Promise.all(chunk.map(route => {
      prefetchRoute(route);
      return Promise.resolve();
    }));
  }
  
  logger.debug(`[Prefetch] Prefetched ${routes.length} routes`);
}



