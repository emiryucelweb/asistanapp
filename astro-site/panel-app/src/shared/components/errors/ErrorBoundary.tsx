/**
 * Global Error Boundary Component
 * Catches React rendering errors and provides fallback UI
 * 
 * @module shared/components/errors/ErrorBoundary
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { logger } from '@/shared/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

/**
 * Global Error Boundary
 * 
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error
    logger.error('React Error Boundary caught an error', error, {
      componentStack: errorInfo.componentStack,
      errorCount: this.state.errorCount + 1,
    });

    // Update state
    this.setState((prevState) => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // ✅ Error Monitoring Integration
    // When ready: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 md:p-12 border-t-4 border-red-500">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4">
                Bir Şeyler Ters Gitti
              </h1>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
                Üzgünüz, beklenmeyen bir hata oluştu. Ekibimiz bilgilendirildi ve sorunu çözmek için çalışıyoruz.
              </p>

              {/* Error Details (Development only) */}
              {this.props.showDetails && this.state.error && (
                <div className="mb-8 p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Bug className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Hata Detayları (Geliştirici Modu)
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-red-600 dark:text-red-400 font-mono">
                      {this.state.error.message}
                    </p>
                    {this.state.errorInfo && (
                      <details className="text-xs text-gray-600 dark:text-gray-400">
                        <summary className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-100">
                          Component Stack
                        </summary>
                        <pre className="mt-2 p-2 bg-white dark:bg-slate-800 rounded overflow-x-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  Tekrar Dene
                </button>
                <button
                  onClick={this.handleReload}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  Sayfayı Yenile
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-colors"
                >
                  <Home className="w-5 h-5" />
                  Ana Sayfa
                </button>
              </div>

              {/* Error Count Warning */}
              {this.state.errorCount > 1 && (
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
                    ⚠️ Bu hata {this.state.errorCount} kez tekrar etti. Sayfayı yenilemeyi deneyin.
                  </p>
                </div>
              )}

              {/* Support Info */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Sorun devam ederse{' '}
                  <a
                    href="mailto:support@example.com"
                    className="text-orange-600 dark:text-orange-400 hover:underline"
                  >
                    destek ekibiyle iletişime geçin
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

