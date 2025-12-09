 
// NOTE: Infrastructure/utility file - `any` used for generic types & external library interfaces

/**
 * React Query Configuration
 * QueryClient setup with default options
 * Environment-based cache configuration for optimal performance
 */
import { QueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { logger } from '@/shared/utils/logger';

/**
 * Environment-based configuration
 */
const isDevelopment = import.meta.env.DEV;

/**
 * Cache times based on environment
 * Development: Shorter cache for faster iteration
 * Production: Longer cache for better performance
 */
export const CACHE_TIMES = {
  // Stale time - how long data is considered fresh
  staleTime: {
    short: isDevelopment ? 10 * 1000 : 30 * 1000,       // 10s dev, 30s prod
    medium: isDevelopment ? 30 * 1000 : 5 * 60 * 1000,   // 30s dev, 5min prod
    long: isDevelopment ? 60 * 1000 : 10 * 60 * 1000,    // 1min dev, 10min prod
    veryLong: isDevelopment ? 2 * 60 * 1000 : 30 * 60 * 1000, // 2min dev, 30min prod
  },
  // Garbage collection time - when to delete inactive cache
  gcTime: {
    short: isDevelopment ? 30 * 1000 : 5 * 60 * 1000,    // 30s dev, 5min prod
    medium: isDevelopment ? 5 * 60 * 1000 : 10 * 60 * 1000, // 5min dev, 10min prod
    long: isDevelopment ? 10 * 60 * 1000 : 30 * 60 * 1000,  // 10min dev, 30min prod
  },
} as const;

/**
 * Default Query Client Configuration
 * ✅ ENTERPRISE-READY: Environment-aware caching strategy
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time - environment-aware
      staleTime: CACHE_TIMES.staleTime.medium,
      
      // Cache time (gcTime in v4) - environment-aware
      cacheTime: CACHE_TIMES.gcTime.medium,
      
      // Refetch on window focus (disabled in prod for performance)
      refetchOnWindowFocus: isDevelopment,
      
      // Refetch on mount if stale
      refetchOnMount: true,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
      
      // Retry failed requests (fewer retries in prod)
      retry: isDevelopment ? 1 : 2,
      
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Error handler
      onError: (error: any) => {
        logger.error('Query Error:', error);
        
        // Show toast notification for errors
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else if (error.message) {
          toast.error(error.message);
        } else {
          toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
      },
    },
    mutations: {
      // Retry failed mutations
      retry: 0,
      
      // Error handler
      onError: (error: any) => {
        logger.error('Mutation Error:', error);
        
        // Show toast notification for errors
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else if (error.message) {
          toast.error(error.message);
        } else {
          toast.error('İşlem başarısız oldu. Lütfen tekrar deneyin.');
        }
      },
    },
  },
});

// Log cache configuration on startup
logger.info(`React Query initialized (${isDevelopment ? 'Development' : 'Production'} mode)`, {
  staleTime: CACHE_TIMES.staleTime.medium / 1000 + 's',
  gcTime: CACHE_TIMES.gcTime.medium / 1000 + 's',
});

/**
 * Query Keys Factory
 * Centralized query key management
 */
export const queryKeys = {
  // Dashboard
  dashboard: {
    kpis: (range: string) => ['dashboard', 'kpis', range] as const,
    revenueTrend: (range: string) => ['dashboard', 'revenue-trend', range] as const,
    conversationTrend: (range: string) => ['dashboard', 'conversation-trend', range] as const,
    aiPerformance: (range: string) => ['dashboard', 'ai-performance', range] as const,
    channelDistribution: (range: string) => ['dashboard', 'channel-distribution', range] as const,
    teamPerformance: (range: string) => ['dashboard', 'team-performance', range] as const,
    alerts: () => ['dashboard', 'alerts'] as const,
  },
  
  // Conversations
  conversations: {
    all: () => ['conversations'] as const,
    list: (params?: any) => ['conversations', 'list', params] as const,
    detail: (id: string) => ['conversations', 'detail', id] as const,
    messages: (conversationId: string, params?: any) => ['conversations', 'messages', conversationId, params] as const,
    search: (query: string) => ['conversations', 'search', query] as const,
  },
  
  // Agents
  agents: {
    all: () => ['agents'] as const,
    list: (params?: any) => ['agents', 'list', params] as const,
    detail: (id: string) => ['agents', 'detail', id] as const,
    my: () => ['agents', 'my'] as const,
    workload: (id: string) => ['agents', 'workload', id] as const,
    metrics: (id: string, params?: any) => ['agents', 'metrics', id, params] as const,
  },
  
  // Assignment
  assignment: {
    all: () => ['assignment'] as const,
    metrics: (params?: any) => ['assignment', 'metrics', params] as const,
    rules: () => ['assignment', 'rules'] as const,
    rule: (id: string) => ['assignment', 'rule', id] as const,
    workload: () => ['assignment', 'workload'] as const,
  },
  
  // Reports
  reports: {
    all: () => ['reports'] as const,
    category: (category: string, range: string) => ['reports', category, range] as const,
  },
  
  // Team
  team: {
    all: () => ['team'] as const,
    list: (params?: any) => ['team', 'list', params] as const,
    detail: (id: string) => ['team', 'detail', id] as const,
  },
  
  // Settings
  settings: {
    all: () => ['settings'] as const,
    profile: () => ['settings', 'profile'] as const,
    business: () => ['settings', 'business'] as const,
    ai: () => ['settings', 'ai'] as const,
  },
};

export default queryClient;

