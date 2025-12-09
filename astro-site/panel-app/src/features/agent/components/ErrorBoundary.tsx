/**
 * Error Boundary Component - Production Error Handler
 * 
 * Enterprise-grade error boundary for graceful error handling
 * 
 * Features:
 * - Catches React component errors
 * - Logs errors to monitoring service
 * - Displays user-friendly fallback UI
 * - Automatic error recovery option
 * - Full i18n support
 * 
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<CustomFallback />}>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
import React, { ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { logger } from '@/shared/utils/logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: { componentStack: string }) => void;
}

/**
 * Error Fallback Component - User-friendly error UI with i18n
 */
const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  const { t } = useTranslation('agent');

  const handleGoHome = (): void => {
    window.location.href = '/agent';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Error Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          {/* Icon */}
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
            {t('errors.somethingWentWrong')}
          </h1>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
            {t('errors.errorDescription')}
          </p>

          {/* Error Details (DEV only) */}
          {import.meta.env.DEV && error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm font-mono text-red-900 dark:text-red-300 break-all">
                {error.message}
              </p>
              {error.stack && (
                <details className="mt-2">
                  <summary className="text-xs text-red-700 dark:text-red-400 cursor-pointer">
                    {t('errors.stackTrace')}
                  </summary>
                  <pre className="mt-2 text-xs text-red-800 dark:text-red-300 overflow-auto max-h-40">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={resetErrorBoundary}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              type="button"
              aria-label={t('errors.tryAgain')}
            >
              <RefreshCw className="w-5 h-5" />
              <span>{t('errors.tryAgain')}</span>
            </button>
            <button
              onClick={handleGoHome}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              type="button"
              aria-label={t('errors.goHome')}
            >
              <Home className="w-5 h-5" />
              <span>{t('errors.goHome')}</span>
            </button>
          </div>
        </div>

        {/* Support Info */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          {t('errors.persistentIssue')}{' '}
          <a
            href="mailto:support@asistanapp.com"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {t('errors.supportTeam')}
          </a>
        </p>
      </div>
    </div>
  );
};

/**
 * ErrorBoundary - Catches and handles component errors gracefully
 * 
 * This component uses react-error-boundary library for a modern,
 * functional approach to error boundaries with full hook support.
 */
const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ 
  children, 
  fallback,
  onError 
}) => {
  const handleError = (error: Error, info: { componentStack?: string | null }): void => {
    // Log to monitoring service
    logger.error('[ErrorBoundary] Component error caught', {
      error: error.message,
      stack: error.stack,
      componentStack: info.componentStack ?? 'No component stack available',
    });

    // Call optional error handler
    if (onError) {
      onError(error, { componentStack: info.componentStack ?? '' });
    }

    // TODO: Send to error tracking service (Sentry, DataDog, etc.)
    // if (import.meta.env.PROD) {
    //   sentryService.captureException(error, {
    //     contexts: {
    //       react: {
    //         componentStack: info.componentStack,
    //       },
    //     },
    //   });
    // }
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={fallback ? () => <>{fallback}</> : ErrorFallback}
      onError={handleError}
      onReset={() => {
        // Reset any state that needs to be reset on error boundary reset
        // This is called when user clicks "Try Again"
        logger.info('[ErrorBoundary] Error boundary reset triggered');
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
