/**
 * useReportsData Hook - Reports State & Data Management
 * 
 * Enterprise-grade state management for Reports page
 * Centralizes all report data, calculations, and state
 * 
 * Features:
 * - Date range management
 * - Category selection
 * - Modal state
 * - Dynamic data calculations
 * - Quick stats generation
 * 
 * @author Enterprise Team
 */
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MessageCircle,
  Activity,
  TrendingUp,
  Award,
} from 'lucide-react';

/**
 * Report categories enum
 */
export type ReportCategory = 
  | 'ai' 
  | 'channels' 
  | 'satisfaction' 
  | 'time' 
  | 'team' 
  | 'conversion' 
  | 'financial' 
  | 'trends' 
  | 'sla';

/**
 * Date range options
 */
export type DateRange = '24h' | '7d' | '30d' | '90d' | 'custom';

/**
 * Quick stat card interface
 */
export interface QuickStat {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

// Note: DATE_RANGE_LABELS and CATEGORY_LABELS moved to hook for i18n support

/**
 * Get data multiplier based on date range
 * Used to scale mock data realistically
 */
function getDataMultiplier(dateRange: DateRange): number {
  const multipliers: Record<DateRange, number> = {
    '24h': 0.1,
    '7d': 0.25,
    '30d': 1,
    '90d': 2.8,
    'custom': 1,
  };
  
  return multipliers[dateRange];
}

/**
 * useReportsData - Centralized reports data management
 */
export function useReportsData() {
  // ==================== HOOKS ====================
  const { t } = useTranslation('admin');
  
  // ==================== STATE ====================
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | 'all'>('all');
  const [detailModalOpen, setDetailModalOpen] = useState<ReportCategory | null>(null);
  
  // ==================== LABELS ====================
  
  /**
   * Date range labels for UI (i18n)
   */
  const DATE_RANGE_LABELS: Record<DateRange, string> = useMemo(() => ({
    '24h': t('reports.dateRanges.24h'),
    '7d': t('reports.dateRanges.7d'),
    '30d': t('reports.dateRanges.30d'),
    '90d': t('reports.dateRanges.90d'),
    'custom': t('reports.dateRanges.custom'),
  }), [t]);
  
  /**
   * Category labels for UI (i18n)
   */
  const CATEGORY_LABELS: Record<ReportCategory | 'all', string> = useMemo(() => ({
    all: t('reports.data.allReports'),
    ai: t('reports.data.categories.ai'),
    channels: t('reports.data.categories.channels'),
    satisfaction: t('reports.data.categories.satisfaction'),
    time: t('reports.data.categories.time'),
    team: t('reports.data.categories.team'),
    conversion: t('reports.data.categories.conversion'),
    financial: t('reports.data.categories.financial'),
    trends: t('reports.data.categories.trends'),
    sla: t('reports.data.categories.sla'),
  }), [t]);

  // ==================== CALCULATIONS ====================
  
  /**
   * Calculate data multiplier based on selected date range
   */
  const multiplier = useMemo(() => {
    return getDataMultiplier(dateRange);
  }, [dateRange]);

  /**
   * Calculate total conversations based on date range
   * Base: 2,744 conversations in 30 days
   */
  const totalConversations = useMemo(() => {
    const baseConversations = 2744;
    return Math.round(baseConversations * multiplier);
  }, [multiplier]);

  /**
   * Generate quick stats for dashboard
   * Dynamically calculated based on date range
   */
  const quickStats = useMemo((): QuickStat[] => {
    return [
      {
        label: t('reports.data.totalConversations'),
        value: totalConversations.toLocaleString('tr-TR'),
        change: 12.5,
        icon: <MessageCircle className="w-6 h-6" />,
        color: 'bg-blue-500',
      },
      {
        label: t('reports.data.aiSuccessRate'),
        value: '%87',
        change: 5.2,
        icon: <Activity className="w-6 h-6" />,
        color: 'bg-purple-500',
      },
      {
        label: t('reports.data.conversionRate'),
        value: '%47.3',
        change: 8.4,
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'bg-green-500',
      },
      {
        label: t('reports.data.customerSatisfaction'),
        value: '4.6/5.0',
        change: 2.1,
        icon: <Award className="w-6 h-6" />,
        color: 'bg-orange-500',
      },
    ];
  }, [totalConversations, t]);

  // ==================== HELPERS ====================

  /**
   * Get label for category
   */
  const getCategoryLabel = (category: ReportCategory | 'all'): string => {
    return CATEGORY_LABELS[category] || 'Rapor';
  };

  /**
   * Get label for date range
   */
  const getDateRangeLabel = (range: DateRange): string => {
    return DATE_RANGE_LABELS[range];
  };

  /**
   * Open detail modal for category
   */
  const openDetailModal = (category: ReportCategory) => {
    setDetailModalOpen(category);
  };

  /**
   * Close detail modal
   */
  const closeDetailModal = () => {
    setDetailModalOpen(null);
  };

  // ==================== RETURN ====================

  return {
    // State
    dateRange,
    selectedCategory,
    detailModalOpen,
    
    // Setters
    setDateRange,
    setSelectedCategory,
    setDetailModalOpen,
    
    // Calculated Data
    multiplier,
    totalConversations,
    quickStats,
    
    // Helpers
    getCategoryLabel,
    getDateRangeLabel,
    openDetailModal,
    closeDetailModal,
  };
}

