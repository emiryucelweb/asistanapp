/**
 * Modern Skeleton Component
 * Advanced skeleton screens with shimmer effects
 * @module ModernSkeleton
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'shimmer' | 'none';
  className?: string;
}

/**
 * Base Skeleton Component with advanced animations
 */
export const ModernSkeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  animation = 'shimmer',
  className,
  ...props
}) => {
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse bg-gray-200 dark:bg-gray-700',
    wave: 'animate-wave bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]',
    shimmer: 'relative overflow-hidden bg-gray-200 dark:bg-gray-700 before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/60 dark:before:via-white/10 before:to-transparent',
    none: 'bg-gray-200 dark:bg-gray-700',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
      role="status"
      aria-label="Loading..."
      {...props}
    />
  );
};

/**
 * Skeleton Text - For text lines
 */
export const SkeletonText: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
  <ModernSkeleton variant="text" {...props} />
);

/**
 * Skeleton Avatar - For user avatars
 */
export const SkeletonAvatar: React.FC<Omit<SkeletonProps, 'variant'>> = ({
  width = 40,
  height = 40,
  ...props
}) => (
  <ModernSkeleton variant="circular" width={width} height={height} {...props} />
);

/**
 * Skeleton Card - Modern card layout
 */
export const SkeletonCard: React.FC<{ className?: string; animation?: SkeletonProps['animation'] }> = ({
  className,
  animation = 'shimmer',
}) => (
  <div className={cn('bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4', className)}>
    <div className="flex items-center gap-4">
      <SkeletonAvatar animation={animation} />
      <div className="flex-1 space-y-2">
        <SkeletonText width="60%" animation={animation} />
        <SkeletonText width="40%" className="h-3" animation={animation} />
      </div>
    </div>
    <div className="space-y-2">
      <SkeletonText width="100%" animation={animation} />
      <SkeletonText width="90%" animation={animation} />
      <SkeletonText width="75%" animation={animation} />
    </div>
    <div className="flex gap-2">
      <ModernSkeleton width={80} height={32} variant="rounded" animation={animation} />
      <ModernSkeleton width={80} height={32} variant="rounded" animation={animation} />
    </div>
  </div>
);

/**
 * Skeleton List Item - For list views
 */
export const SkeletonListItem: React.FC<{ animation?: SkeletonProps['animation'] }> = ({
  animation = 'shimmer',
}) => (
  <div className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
    <SkeletonAvatar width={48} height={48} animation={animation} />
    <div className="flex-1 space-y-2">
      <SkeletonText width="70%" animation={animation} />
      <SkeletonText width="50%" className="h-3" animation={animation} />
    </div>
    <ModernSkeleton width={80} height={32} variant="rounded" animation={animation} />
  </div>
);

/**
 * Skeleton Table Row - For table views
 */
export const SkeletonTableRow: React.FC<{ columns?: number; animation?: SkeletonProps['animation'] }> = ({
  columns = 5,
  animation = 'shimmer',
}) => (
  <tr className="border-b border-gray-200 dark:border-gray-700">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <SkeletonText animation={animation} />
      </td>
    ))}
  </tr>
);

/**
 * Skeleton Stats Card - For dashboard KPIs
 */
export const SkeletonStatsCard: React.FC<{ animation?: SkeletonProps['animation'] }> = ({
  animation = 'shimmer',
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-3">
    <div className="flex items-center justify-between">
      <SkeletonText width={100} height={16} animation={animation} />
      <ModernSkeleton variant="circular" width={40} height={40} animation={animation} />
    </div>
    <SkeletonText width="70%" height={32} animation={animation} />
    <SkeletonText width="50%" height={14} animation={animation} />
  </div>
);

/**
 * Skeleton Chart - For chart placeholders
 */
export const SkeletonChart: React.FC<{ 
  height?: number; 
  animation?: SkeletonProps['animation'];
  className?: string;
}> = ({
  height = 300,
  animation = 'shimmer',
  className,
}) => (
  <div className={cn('bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4', className)}>
    <div className="flex items-center justify-between">
      <SkeletonText width="40%" height={20} animation={animation} />
      <ModernSkeleton width={100} height={32} variant="rounded" animation={animation} />
    </div>
    <ModernSkeleton width="100%" height={height} variant="rounded" animation={animation} />
  </div>
);

/**
 * Skeleton Message - For chat messages
 */
export const SkeletonMessage: React.FC<{ 
  align?: 'left' | 'right';
  animation?: SkeletonProps['animation'];
}> = ({
  align = 'left',
  animation = 'shimmer',
}) => (
  <div className={cn('flex gap-3', align === 'right' && 'flex-row-reverse')}>
    <SkeletonAvatar width={32} height={32} animation={animation} />
    <div className={cn('max-w-[70%] space-y-2', align === 'right' && 'items-end')}>
      <SkeletonText width={60} className="h-2" animation={animation} />
      <ModernSkeleton 
        width={Math.random() * 150 + 100} 
        height={60} 
        variant="rounded" 
        animation={animation}
      />
      <SkeletonText width={80} className="h-2" animation={animation} />
    </div>
  </div>
);

/**
 * Skeleton Grid - Grid of cards
 */
export const SkeletonGrid: React.FC<{
  count?: number;
  columns?: 1 | 2 | 3 | 4;
  animation?: SkeletonProps['animation'];
}> = ({
  count = 6,
  columns = 3,
  animation = 'shimmer',
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridClasses[columns])}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} animation={animation} />
      ))}
    </div>
  );
};

export default ModernSkeleton;

