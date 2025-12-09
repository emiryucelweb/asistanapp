/**
 * Loading Transition Component
 * Smooth transitions between loading and loaded states
 * @module LoadingTransition
 */

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ModernLoader } from './ModernLoader';

interface LoadingTransitionProps {
  isLoading: boolean;
  loadingComponent?: ReactNode;
  children: ReactNode;
  className?: string;
  minLoadingTime?: number; // Minimum time to show loading (prevents flash)
  fallbackDelay?: number; // Delay before showing loading (prevents flash for fast loads)
}

/**
 * LoadingTransition - Smooth transition wrapper
 * 
 * Features:
 * - Prevents loading flash for fast operations
 * - Ensures minimum loading time for UX consistency
 * - Smooth fade-in/out transitions
 * 
 * @example
 * ```tsx
 * <LoadingTransition isLoading={isLoading} fallbackDelay={200}>
 *   <YourContent />
 * </LoadingTransition>
 * ```
 */
export const LoadingTransition: React.FC<LoadingTransitionProps> = ({
  isLoading,
  loadingComponent,
  children,
  className,
  minLoadingTime = 500,
  fallbackDelay = 200,
}) => {
  const [shouldShowLoading, setShouldShowLoading] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const loadingStartRef = React.useRef<number | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (isLoading) {
      // Delay showing loading to prevent flash for fast operations
      timeoutRef.current = setTimeout(() => {
        setShouldShowLoading(true);
        setIsTransitioning(true);
        loadingStartRef.current = Date.now();
      }, fallbackDelay);
    } else {
      // Clear the delay timeout if loading finished before delay
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // If we were showing loading, ensure minimum loading time
      if (shouldShowLoading && loadingStartRef.current) {
        const elapsed = Date.now() - loadingStartRef.current;
        const remaining = Math.max(0, minLoadingTime - elapsed);

        setTimeout(() => {
          setShouldShowLoading(false);
          setTimeout(() => setIsTransitioning(false), 300); // Wait for fade-out
          loadingStartRef.current = null;
        }, remaining);
      } else {
        setShouldShowLoading(false);
        setIsTransitioning(false);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading, fallbackDelay, minLoadingTime, shouldShowLoading]);

  const defaultLoading = (
    <div className="flex items-center justify-center min-h-[400px]">
      <ModernLoader variant="spinner" size="lg" />
    </div>
  );

  return (
    <div className={cn('relative', className)}>
      {/* Loading State */}
      <div
        className={cn(
          'transition-opacity duration-300',
          shouldShowLoading ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'
        )}
      >
        {loadingComponent || defaultLoading}
      </div>

      {/* Content */}
      <div
        className={cn(
          'transition-opacity duration-300',
          shouldShowLoading ? 'opacity-0 pointer-events-none' : 'opacity-100',
          isTransitioning && 'absolute inset-0'
        )}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * Suspense Loading Wrapper
 * For use with React Suspense
 */
export const SuspenseLoader: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
}> = ({ children, fallback }) => {
  const defaultFallback = (
    <div className="flex items-center justify-center min-h-screen">
      <ModernLoader variant="brand" size="xl" text="Loading..." />
    </div>
  );

  return (
    <React.Suspense fallback={fallback || defaultFallback}>
      {children}
    </React.Suspense>
  );
};

export default LoadingTransition;

