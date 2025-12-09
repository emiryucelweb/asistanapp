 
// NOTE: Infrastructure/utility file - `any` used for generic types & external library interfaces

/**
 * Performance Monitoring Hooks
 * Track component render times and performance metrics
 * 
 * @module shared/hooks/usePerformance
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { logger } from '../utils/logger';

/**
 * Track component render count
 */
export function useRenderCount(componentName: string): number {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    if (import.meta.env.DEV) {
      logger.debug(`${componentName} rendered`, new Error(`Count: ${renderCount.current}`));
    }
  });

   
  // Note: Intentionally returning ref value for render count tracking
  return renderCount.current;
}

/**
 * Track component render time
 */
export function useRenderTime(componentName: string): void {
     
  const startTime = useRef(performance.now());

  useEffect(() => {
     
    const renderTime = performance.now() - startTime.current;
    
    if (import.meta.env.DEV && renderTime > 16) {
      // Warn if render takes longer than 1 frame (16ms at 60fps)
      logger.warn(`${componentName} slow render`, new Error(`${renderTime.toFixed(2)}ms`));
    }
    
     
    startTime.current = performance.now();
  });
}

/**
 * Debounce hook for performance optimization
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttle hook for performance optimization
 */
export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
   
  const lastExecuted = useRef(Date.now());

  useEffect(() => {
     
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted.current;

    if (timeSinceLastExecution >= interval) {
      lastExecuted.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
         
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, interval - timeSinceLastExecution);

      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
}

/**
 * Lazy load hook for images
 */
export function useLazyLoad(
  src: string,
  options: IntersectionObserverInit = {}
): {
  ref: React.RefObject<HTMLImageElement>;
  isLoaded: boolean;
  currentSrc: string;
} {
  const ref = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');
  const isVisible = useIntersectionObserver(ref, options);

  useEffect(() => {
    if (isVisible && !isLoaded) {
       
      // Note: Intentional setState in effect - lazy loading pattern
      setCurrentSrc(src);
      setIsLoaded(true);
    }
  }, [isVisible, isLoaded, src]);

  return { ref, isLoaded, currentSrc };
}

/**
 * Measure component performance
 */
export function useMeasure(componentName: string): {
  startMeasure: () => void;
  endMeasure: () => void;
} {
  const startTime = useRef<number>(0);

  const startMeasure = useCallback(() => {
    startTime.current = performance.now();
  }, []);

  const endMeasure = useCallback(() => {
    if (startTime.current === 0) return;
    
    const duration = performance.now() - startTime.current;
    
    if (import.meta.env.DEV) {
      logger.debug(`${componentName} operation completed`, new Error(`${duration.toFixed(2)}ms`));
    }
    
    // ✅ Performance Monitoring Integration
    // When ready: reportPerformance({ component: componentName, duration });
    
    startTime.current = 0;
  }, [componentName]);

  return { startMeasure, endMeasure };
}

/**
 * Track re-renders caused by prop changes
 */
export function useWhyDidYouUpdate(name: string, props: Record<string, any>): void {
  const previousProps = useRef<Record<string, any>>();

  useEffect(() => {
    if (previousProps.current && import.meta.env.DEV) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, { from: any; to: any }> = {};

      allKeys.forEach((key) => {
        if (previousProps.current?.[key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current?.[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        logger.debug(`${name} re-rendered due to:`, new Error(JSON.stringify(changedProps, null, 2)));
      }
    }

    previousProps.current = props;
  });
}

/**
 * Prevent unnecessary re-renders with stable callback
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T
): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

   
  // Note: Intentional ref usage for stable callback pattern
  return useCallback(((...args) => callbackRef.current(...args)) as T, []);
}

/**
 * Web Vitals monitoring
 */
export interface WebVitals {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

export function useWebVitals(): WebVitals {
  const [vitals, setVitals] = useState<WebVitals>({});

  useEffect(() => {
    // FCP
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcp = entries[0];
      setVitals((prev) => ({ ...prev, fcp: fcp.startTime }));
    });

    try {
      fcpObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      // Not supported
    }

    // LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lcp = entries[entries.length - 1];
      setVitals((prev) => ({ ...prev, lcp: lcp.startTime }));
    });

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Not supported
    }

    // CLS
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          setVitals((prev) => ({ ...prev, cls: clsValue }));
        }
      }
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // Not supported
    }

    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  return vitals;
}

