/**
 * ReportCategoryCard Component - Single Report Category Card
 * 
 * Enterprise-grade reusable card component
 * Implements hover effects and accessibility
 * 
 * Features:
 * - Icon with color coding
 * - Title and description
 * - "View Details" action
 * - Hover animations
 * - Keyboard navigation
 * - ARIA labels
 * 
 * @author Enterprise Team
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

interface ReportCategoryCardProps {
  /**
   * Category icon component
   */
  icon: React.ReactNode;
  
  /**
   * Icon background color class
   */
  iconColor: string;
  
  /**
   * Category title
   */
  title: string;
  
  /**
   * Category description
   */
  description: string;
  
  /**
   * Click handler
   */
  onClick: () => void;
}

/**
 * ReportCategoryCard - Reusable category card component
 * 
 * Implements:
 * - Hover effects (scale, shadow)
 * - Interactive states
 * - Semantic HTML (button element)
 * - ARIA labels
 * - Keyboard navigation
 */
export function ReportCategoryCard(props: ReportCategoryCardProps) {
  const {
    icon,
    iconColor,
    title,
    description,
    onClick,
  } = props;
  const { t } = useTranslation('admin');

  return (
    <button
      onClick={onClick}
      className="w-full bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-slate-700 text-left group hover:scale-[1.02] active:scale-[0.98]"
      aria-label={`${title} - ${description}`}
      type="button"
    >
      {/* Icon */}
      <div className="flex items-start justify-between mb-4">
        <div 
          className={`${iconColor} rounded-lg p-3 group-hover:scale-110 transition-transform duration-300`}
          aria-hidden="true"
        >
          <div className="text-white">
            {icon}
          </div>
        </div>
        
        {/* Arrow Indicator */}
        <div className="text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300">
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </div>
      </div>

      {/* Content */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* View Details Text */}
      <div className="mt-4 flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 font-medium group-hover:gap-3 transition-all">
        <span>{t('reports.viewDetails')}</span>
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </div>
    </button>
  );
}

