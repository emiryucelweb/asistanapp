/**
 * Page Loading States
 * Context-specific loading screens for different pages
 * @module PageLoadingState
 */

import React from 'react';
import { cn } from '@/lib/utils';
import {
  ModernSkeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonStatsCard,
  SkeletonChart,
  SkeletonListItem,
  SkeletonMessage,
} from './ModernSkeleton';

/**
 * Dashboard Loading State
 */
export const DashboardLoadingState: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('space-y-6 animate-in fade-in duration-300', className)}>
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <SkeletonText width={250} height={32} />
        <SkeletonText width={350} height={16} />
      </div>
      <ModernSkeleton width={150} height={40} variant="rounded" />
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonStatsCard key={i} />
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkeletonChart height={300} />
      <SkeletonChart height={300} />
    </div>

    {/* Recent Activity */}
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <SkeletonText width={200} height={20} />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonListItem key={i} />
        ))}
      </div>
    </div>
  </div>
);

/**
 * Conversations Loading State
 */
export const ConversationsLoadingState: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300', className)}>
    {/* Conversation List */}
    <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <ModernSkeleton width="100%" height={40} variant="rounded" />
      </div>
      <div>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonListItem key={i} />
        ))}
      </div>
    </div>

    {/* Conversation Detail */}
    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SkeletonAvatar width={48} height={48} />
            <div className="space-y-2">
              <SkeletonText width={150} />
              <SkeletonText width={100} className="h-3" />
            </div>
          </div>
          <ModernSkeleton width={120} height={36} variant="rounded" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 space-y-4 min-h-[400px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonMessage key={i} align={i % 2 === 0 ? 'left' : 'right'} />
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <ModernSkeleton width="100%" height={44} variant="rounded" />
      </div>
    </div>
  </div>
);

/**
 * Table Loading State
 */
export const TableLoadingState: React.FC<{ 
  rows?: number;
  columns?: number;
  className?: string;
}> = ({
  rows = 10,
  columns = 5,
  className,
}) => (
  <div className={cn('bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in duration-300', className)}>
    {/* Table Header */}
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <SkeletonText key={i} width={`${100 / columns}%`} height={20} />
        ))}
      </div>
    </div>

    {/* Table Body */}
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-4">
          <SkeletonAvatar width={32} height={32} />
          {Array.from({ length: columns - 1 }).map((_, j) => (
            <div key={j} className="flex-1">
              <SkeletonText width="80%" />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

/**
 * Profile Loading State
 */
export const ProfileLoadingState: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('space-y-6 animate-in fade-in duration-300', className)}>
    {/* Header */}
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-6">
        <SkeletonAvatar width={120} height={120} />
        <div className="flex-1 space-y-3">
          <SkeletonText width="40%" height={28} />
          <SkeletonText width="60%" height={16} />
          <div className="flex gap-2 mt-4">
            <ModernSkeleton width={100} height={36} variant="rounded" />
            <ModernSkeleton width={100} height={36} variant="rounded" />
          </div>
        </div>
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonStatsCard key={i} />
      ))}
    </div>

    {/* Details */}
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <SkeletonText width={120} height={16} />
          <SkeletonText width="60%" height={16} />
        </div>
      ))}
    </div>
  </div>
);

/**
 * Settings Loading State
 */
export const SettingsLoadingState: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('space-y-6 animate-in fade-in duration-300', className)}>
    {/* Tabs */}
    <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
      {Array.from({ length: 4 }).map((_, i) => (
        <ModernSkeleton key={i} width={120} height={40} variant="rounded" />
      ))}
    </div>

    {/* Settings Sections */}
    {Array.from({ length: 3 }).map((_, sectionIndex) => (
      <div
        key={sectionIndex}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6"
      >
        <SkeletonText width={200} height={24} />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
            <div className="space-y-2">
              <SkeletonText width={150} height={16} />
              <SkeletonText width={250} height={14} />
            </div>
            <ModernSkeleton width={48} height={24} variant="rounded" />
          </div>
        ))}
      </div>
    ))}
  </div>
);

/**
 * Team Chat Loading State
 */
export const TeamChatLoadingState: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in duration-300', className)}>
    {/* Channels Sidebar */}
    <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
      <SkeletonText width="60%" height={20} />
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <SkeletonAvatar width={32} height={32} />
            <SkeletonText width="70%" />
          </div>
        ))}
      </div>
    </div>

    {/* Chat Area */}
    <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <SkeletonAvatar width={40} height={40} />
          <div className="space-y-2">
            <SkeletonText width={150} />
            <SkeletonText width={100} className="h-2" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-6 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonMessage key={i} align={i % 3 === 0 ? 'right' : 'left'} />
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <ModernSkeleton width="100%" height={44} variant="rounded" />
      </div>
    </div>
  </div>
);

/**
 * Generic Page Loading - Fallback
 */
export const GenericPageLoadingState: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('space-y-6 animate-in fade-in duration-300', className)}>
    <div className="flex items-center justify-between">
      <SkeletonText width={250} height={32} />
      <ModernSkeleton width={120} height={40} variant="rounded" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <SkeletonText width="60%" height={20} />
          <SkeletonText width="100%" height={100} />
          <SkeletonText width="40%" height={16} />
        </div>
      ))}
    </div>
  </div>
);

export default DashboardLoadingState;

