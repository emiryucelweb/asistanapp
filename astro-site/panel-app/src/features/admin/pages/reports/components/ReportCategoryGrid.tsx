/**
 * ReportCategoryGrid Component - Report Categories Grid
 * 
 * Enterprise-grade grid displaying all report categories
 * Implements filtering and responsive layout
 * 
 * Features:
 * - Category filtering (all/specific)
 * - Responsive grid (1-2-3 columns)
 * - Card composition pattern
 * - Empty state handling
 * 
 * @author Enterprise Team
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  MessageSquare,
  Award,
  Clock,
  Users,
  Target,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { ReportCategoryCard } from './ReportCategoryCard';
import type { ReportCategory } from '../hooks';

interface CategoryDefinition {
  id: ReportCategory;
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  description: string;
}

interface ReportCategoryGridProps {
  /**
   * Selected category filter ('all' or specific category)
   */
  selectedCategory: ReportCategory | 'all';
  
  /**
   * Callback when category card is clicked
   */
  onCategoryClick: (category: ReportCategory) => void;
}

/**
 * Get all available report categories with metadata
 * Using function to access t() from hook
 */
const getCategories = (t: (key: string) => string): CategoryDefinition[] => [
  {
    id: 'ai',
    icon: <Activity className="w-6 h-6" />,
    iconColor: 'bg-purple-500',
    title: t('reports.categories.ai.title'),
    description: t('reports.categories.ai.description'),
  },
  {
    id: 'channels',
    icon: <MessageSquare className="w-6 h-6" />,
    iconColor: 'bg-blue-500',
    title: t('reports.categories.channels.title'),
    description: t('reports.categories.channels.description'),
  },
  {
    id: 'satisfaction',
    icon: <Award className="w-6 h-6" />,
    iconColor: 'bg-orange-500',
    title: t('reports.categories.satisfaction.title'),
    description: t('reports.categories.satisfaction.description'),
  },
  {
    id: 'time',
    icon: <Clock className="w-6 h-6" />,
    iconColor: 'bg-teal-500',
    title: t('reports.categories.time.title'),
    description: t('reports.categories.time.description'),
  },
  {
    id: 'team',
    icon: <Users className="w-6 h-6" />,
    iconColor: 'bg-indigo-500',
    title: t('reports.categories.team.title'),
    description: t('reports.categories.team.description'),
  },
  {
    id: 'conversion',
    icon: <Target className="w-6 h-6" />,
    iconColor: 'bg-green-500',
    title: t('reports.categories.conversion.title'),
    description: t('reports.categories.conversion.description'),
  },
  {
    id: 'financial',
    icon: <DollarSign className="w-6 h-6" />,
    iconColor: 'bg-emerald-500',
    title: t('reports.categories.financial.title'),
    description: t('reports.categories.financial.description'),
  },
  {
    id: 'trends',
    icon: <TrendingUp className="w-6 h-6" />,
    iconColor: 'bg-pink-500',
    title: t('reports.categories.trends.title'),
    description: t('reports.categories.trends.description'),
  },
  {
    id: 'sla',
    icon: <AlertCircle className="w-6 h-6" />,
    iconColor: 'bg-red-500',
    title: t('reports.categories.sla.title'),
    description: t('reports.categories.sla.description'),
  },
];

/**
 * ReportCategoryGrid - Professional category grid
 * 
 * Implements:
 * - Filtering by category
 * - Responsive grid layout
 * - Card composition
 * - Empty states
 */
export function ReportCategoryGrid(props: ReportCategoryGridProps) {
  const { selectedCategory, onCategoryClick } = props;
  const { t } = useTranslation('admin');

  /**
   * Get categories with translations
   */
  const CATEGORIES = getCategories(t);

  /**
   * Filter categories based on selection
   */
  const filteredCategories = selectedCategory === 'all'
    ? CATEGORIES
    : CATEGORIES.filter(cat => cat.id === selectedCategory);

  return (
    <div>
      {/* Section Title */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
          {selectedCategory === 'all' ? t('reports.allReports') : t('reports.selectedReport')}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          {selectedCategory === 'all' 
            ? t('reports.selectCategory')
            : t('reports.clickForDetails')
          }
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredCategories.map((category) => (
          <ReportCategoryCard
            key={category.id}
            icon={category.icon}
            iconColor={category.iconColor}
            title={category.title}
            description={category.description}
            onClick={() => onCategoryClick(category.id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 mb-4">
            <Activity className="w-16 h-16 mx-auto opacity-50" aria-hidden="true" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {t('reports.noReportsFound')}
          </p>
        </div>
      )}
    </div>
  );
}

