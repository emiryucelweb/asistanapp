 

/* =========================================
   Smart Suggestions Analytics Hook
   Performance Metrics & ML Insights
========================================= */

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/shared/utils/logger';
import { apiService } from '@/services/api-service';
import { useBusiness } from '@/providers/business-context';

// ===========================================
// 🏗️ TYPES & INTERFACES
// ===========================================

export interface SuggestionUsage {
  suggestionId: string;
  businessType: string;
  category: 'greeting' | 'appointment' | 'info' | 'support' | 'sales';
  context: string[];
  originalText: string;
  suggestedText: string;
  finalText: string;
  usageType: 'accepted' | 'modified' | 'rejected' | 'ignored';
  modificationRatio: number;
  responseTime: number;
  conversationId: string;
  sessionId: string;
}

export interface PerformanceMetrics {
  tenantId: string;
  businessType: string;
  period: 'hour' | 'day' | 'week' | 'month';
  timestamp: number;
  totalSuggestions: number;
  acceptedCount: number;
  modifiedCount: number;
  rejectedCount: number;
  ignoredCount: number;
  acceptanceRate: number;
  modificationRate: number;
  avgResponseTime: number;
  avgModificationRatio: number;
  topSuggestions: Array<{
    suggestionId: string;
    text: string;
    usageCount: number;
    successRate: number;
  }>;
}

export interface LearningInsights {
  tenantId: string;
  businessType: string;
  agentId: string;
  patterns: {
    preferredCategories: string[];
    commonModifications: Array<{
      pattern: string;
      frequency: number;
      suggestion: string;
    }>;
    timeBasedPreferences: Record<string, string[]>;
    contextualPreferences: Record<string, string[]>;
  };
  recommendations: Array<{
    type: 'new_suggestion' | 'modify_existing' | 'remove_suggestion';
    category: string;
    suggestion: string;
    confidence: number;
    reasoning: string;
  }>;
  lastUpdated: number;
}

export interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  variants: Array<{
    id: string;
    name: string;
    weight: number;
    config: any;
  }>;
  metrics: {
    participantCount: number;
    conversionRate: number;
    avgResponseTime: number;
    acceptanceRate: number;
  };
  startDate: number;
  endDate?: number;
}

export interface RealtimeMetrics {
  totalSuggestions: number;
  acceptedCount: number;
  modifiedCount: number;
  rejectedCount: number;
  ignoredCount: number;
  lastResponseTime: number;
  lastModificationRatio: number;
}

// ===========================================
// 🎣 ANALYTICS HOOK
// ===========================================

export const useSuggestionsAnalytics = () => {
  const { config } = useBusiness();
  const businessType = config.type;

  // State
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [realtimeMetrics, setRealtimeMetrics] = useState<RealtimeMetrics | null>(null);
  const [learningInsights, setLearningInsights] = useState<LearningInsights | null>(null);
  const [abTests, setAbTests] = useState<ABTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===========================================
  // 📊 USAGE TRACKING
  // ===========================================

  const trackSuggestionUsage = useCallback(async (usage: SuggestionUsage) => {
    try {
      const response = await apiService.post<{ success: boolean; data?: { trackingId: string }; error?: string }>('/suggestions/track', usage);
      
      if (response.data.success && response.data.data) {
        // Trigger real-time metrics update
        await fetchRealtimeMetrics();
        
        return response.data.data.trackingId;
      } else {
        throw new Error(response.data.error || 'Failed to track suggestion usage');
      }
    } catch (error) {
      logger.error('Failed to track suggestion usage:', error);
      setError(error instanceof Error ? error.message : 'Failed to track usage');
      return null;
    }
   
  // TODO: Missing fetchRealtimeMetrics - circular dependency
  }, []);

  // ===========================================
  // 📈 METRICS FETCHING
  // ===========================================

  const fetchPerformanceMetrics = useCallback(async (period: PerformanceMetrics['period'] = 'day') => {
    if (!businessType) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.get<{ success: boolean; data?: PerformanceMetrics; error?: string }>(`/suggestions/metrics/${businessType}?period=${period}`);
      
      if (response.data.success && response.data.data) {
        setPerformanceMetrics(response.data.data);
      } else {
        throw new Error(response.data.error || 'Failed to fetch metrics');
      }
    } catch (error) {
      logger.error('Failed to fetch performance metrics:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  }, [businessType]);

  const fetchRealtimeMetrics = useCallback(async () => {
    if (!businessType) return;

    try {
      const response = await apiService.get<{ success: boolean; data?: RealtimeMetrics }>(`/suggestions/metrics/${businessType}/realtime`);
      
      if (response.data.success && response.data.data) {
        setRealtimeMetrics(response.data.data);
      }
    } catch (error) {
      logger.error('Failed to fetch real-time metrics:', error);
    }
  }, [businessType]);

  const fetchLearningInsights = useCallback(async (agentId?: string) => {
    if (!businessType) return;

    setLoading(true);
    setError(null);

    try {
      const url = agentId 
        ? `/suggestions/insights/${businessType}?agentId=${agentId}`
        : `/suggestions/insights/${businessType}`;
        
      const response = await apiService.get<{ success: boolean; data?: LearningInsights; error?: string }>(url);
      
      if (response.data.success && response.data.data) {
        setLearningInsights(response.data.data);
      } else {
        throw new Error(response.data.error || 'Failed to fetch insights');
      }
    } catch (error) {
      logger.error('Failed to fetch learning insights:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch insights');
    } finally {
      setLoading(false);
    }
  }, [businessType]);

  // ===========================================
  // 🧪 A/B TESTING
  // ===========================================

  const fetchABTests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.get<{ success: boolean; data?: ABTest[]; error?: string }>('/suggestions/ab-tests');
      
      if (response.data.success && response.data.data) {
        setAbTests(response.data.data);
      } else {
        throw new Error(response.data.error || 'Failed to fetch A/B tests');
      }
    } catch (error) {
      logger.error('Failed to fetch A/B tests:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch A/B tests');
    } finally {
      setLoading(false);
    }
  }, []);

  const createABTest = useCallback(async (testConfig: {
    name: string;
    description: string;
    businessType?: string;
    variants: Array<{
      id: string;
      name: string;
      weight: number;
      config: any;
    }>;
    endDate?: number;
  }) => {
    try {
      const response = await apiService.post<{ success: boolean; data?: { testId: string }; error?: string }>('/suggestions/ab-tests', {
        ...testConfig,
        businessType: testConfig.businessType || businessType,
      });
      
      if (response.data.success && response.data.data) {
        // Refresh A/B tests list
        await fetchABTests();
        return response.data.data.testId;
      } else {
        throw new Error(response.data.error || 'Failed to create A/B test');
      }
    } catch (error) {
      logger.error('Failed to create A/B test:', error);
      setError(error instanceof Error ? error.message : 'Failed to create A/B test');
      return null;
    }
  }, [businessType, fetchABTests]);

  const getABTestVariant = useCallback(async (testId: string): Promise<string | null> => {
    try {
      const response = await apiService.get<{ success: boolean; data?: { variantId: string } }>(`/suggestions/ab-tests/${testId}/variant`);
      
      if (response.data.success && response.data.data) {
        return response.data.data.variantId;
      }
    } catch (error) {
      logger.error('Failed to get A/B test variant:', error);
    }
    
    return null;
  }, []);

  // ===========================================
  // 📤 DATA EXPORT
  // ===========================================

  const exportData = useCallback(async (options: {
    startDate?: number;
    endDate?: number;
    format?: 'json' | 'csv';
  } = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (options.startDate) queryParams.set('startDate', options.startDate.toString());
      if (options.endDate) queryParams.set('endDate', options.endDate.toString());
      if (options.format) queryParams.set('format', options.format);
      
      const response = await apiService.get<{ success: boolean; data?: any; error?: string }>(`/suggestions/export?${queryParams.toString()}`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || 'Failed to export data');
      }
    } catch (error) {
      logger.error('Failed to export data:', error);
      setError(error instanceof Error ? error.message : 'Failed to export data');
      return null;
    }
  }, []);

  // ===========================================
  // 🔄 AUTO REFRESH & EFFECTS
  // ===========================================

  // Auto-refresh real-time metrics
  useEffect(() => {
    if (!businessType) return;

    // Initial fetch
    fetchRealtimeMetrics();

    // Set up interval for real-time updates
    const interval = setInterval(fetchRealtimeMetrics, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [businessType, fetchRealtimeMetrics]);

  // Initial data fetch
  useEffect(() => {
    if (!businessType) return;

    fetchPerformanceMetrics();
    fetchLearningInsights();
    fetchABTests();
  }, [businessType, fetchPerformanceMetrics, fetchLearningInsights, fetchABTests]);

  // ===========================================
  // 📊 COMPUTED VALUES
  // ===========================================

  const acceptanceRate = realtimeMetrics 
    ? (realtimeMetrics.acceptedCount / (realtimeMetrics.totalSuggestions || 1)) * 100
    : 0;

  const modificationRate = realtimeMetrics 
    ? (realtimeMetrics.modifiedCount / (realtimeMetrics.totalSuggestions || 1)) * 100
    : 0;

  const rejectionRate = realtimeMetrics 
    ? (realtimeMetrics.rejectedCount / (realtimeMetrics.totalSuggestions || 1)) * 100
    : 0;

  const hasData = realtimeMetrics?.totalSuggestions && realtimeMetrics.totalSuggestions > 0;

  const topRecommendations = learningInsights?.recommendations
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3) || [];

  // ===========================================
  // 🎯 RETURN VALUES
  // ===========================================

  return {
    // Data
    performanceMetrics,
    realtimeMetrics,
    learningInsights,
    abTests,
    
    // Computed values
    acceptanceRate,
    modificationRate,
    rejectionRate,
    hasData,
    topRecommendations,
    
    // State
    loading,
    error,
    
    // Actions
    trackSuggestionUsage,
    fetchPerformanceMetrics,
    fetchRealtimeMetrics,
    fetchLearningInsights,
    fetchABTests,
    createABTest,
    getABTestVariant,
    exportData,
    
    // Utility
    refresh: () => {
      fetchPerformanceMetrics();
      fetchLearningInsights();
      fetchABTests();
      fetchRealtimeMetrics();
    },
  };
};

export default useSuggestionsAnalytics;
