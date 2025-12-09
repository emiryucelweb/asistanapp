/**
 * Feature-level Error Boundary
 * Lighter error boundary for feature modules that shows inline errors
 * 
 * @module shared/components/errors/FeatureErrorBoundary
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { logger } from '@/shared/utils/logger';
import i18n from '@/shared/i18n/config';

interface Props {
  children: ReactNode;
  featureName: string;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showReset?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Feature Error Boundary
 * Use this for individual features/modules to prevent entire app crash
 * 
 * Usage:
 * ```tsx
 * <FeatureErrorBoundary featureName="Agent Conversations">
 *   <ConversationList />
 * </FeatureErrorBoundary>
 * ```
 */
export class FeatureErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error(`Feature Error in ${this.props.featureName}`, error, {
      componentStack: errorInfo.componentStack,
      feature: this.props.featureName,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  handleDismiss = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default inline error UI
      return (
        <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {this.props.featureName} Yüklenemedi
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Bu bölüm yüklenirken bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.
              </p>

              {/* Error Message (Development) */}
              {import.meta.env.DEV && this.state.error && (
                <p className="text-xs text-red-600 dark:text-red-400 font-mono mb-3 p-2 bg-red-100 dark:bg-red-900/20 rounded">
                  {this.state.error.message}
                </p>
              )}

              {/* Actions */}
              {this.props.showReset !== false && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={this.handleReset}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {i18n.t('common:retry')}
                  </button>
                  <button
                    onClick={this.handleDismiss}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-gray-100 text-sm font-medium rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                    {i18n.t('common:close')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default FeatureErrorBoundary;

