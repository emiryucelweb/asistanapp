import React from 'react';
import { logger } from '@/shared/utils/logger';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { I18nextProvider } from 'react-i18next';

import App from './App.tsx';
// Zustand stores are used directly without providers

import { initializeI18n } from '@/shared/i18n/config';
import './index.css';

// Create a client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry mutations on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

// Error boundary for the entire app
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('React Error Boundary caught an error:', error, errorInfo);
    
    // Send error to monitoring service
    if (window.location.hostname !== 'localhost') {
      // In production, send to error tracking service
      // e.g., Sentry, LogRocket, etc.
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-lg font-medium text-gray-900 mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left bg-red-50 p-4 rounded-md">
                <summary className="cursor-pointer text-red-800 font-medium">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs text-red-700 whitespace-pre-wrap">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Performance monitoring with Web Vitals
import { reportWebVitals } from './shared/utils/performance/webVitals';

// Initialize Web Vitals tracking
reportWebVitals();

// Import Performance Monitor component for development
const PerformanceMonitor = import.meta.env.DEV
  ? React.lazy(() => import('./shared/components/PerformanceMonitor'))
  : null;

// 🔥 CRITICAL FIX: Initialize i18n BEFORE React render
// This ensures translations are loaded and ready before any component renders
async function bootstrapApp() {
  try {
    logger.info('🚀 Bootstrapping application...');
    
    // Step 1: Initialize i18n and WAIT for it
    logger.info('📦 Initializing i18n...');
    const i18nInstance = await initializeI18n();
    logger.info('✅ i18n initialized successfully', {
      language: i18nInstance.language,
      languages: i18nInstance.languages
    });
    
    // Step 2: NOW render React app with fully initialized i18n
    logger.info('🎨 Rendering React app...');
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <ErrorBoundary>
          <I18nextProvider i18n={i18nInstance}>
<React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-blue-600 animate-bounce"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.6s',
                }}
              />
            ))}
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
              <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                  <App />
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: '#363636',
                        color: '#fff',
                      },
                      success: {
                        duration: 3000,
                        iconTheme: {
                          primary: '#10b981',
                          secondary: '#fff',
                        },
                      },
                      error: {
                        duration: 5000,
                        iconTheme: {
                          primary: '#ef4444',
                          secondary: '#fff',
                        },
                      },
                      loading: {
                        duration: Infinity,
                      },
                    }}
                  />
                  {import.meta.env.DEV && (
                    <>
                      <ReactQueryDevtools initialIsOpen={false} />
                      {PerformanceMonitor && (
                        <React.Suspense fallback={null}>
                          <PerformanceMonitor />
                        </React.Suspense>
                      )}
                    </>
                  )}
                </BrowserRouter>
              </QueryClientProvider>
            </React.Suspense>
          </I18nextProvider>
        </ErrorBoundary>
      </React.StrictMode>
    );
    
    logger.info('✅ Application bootstrapped successfully');
  } catch (error) {
    logger.error('❌ Failed to bootstrap application', error as Error);
    
    // Show error UI
    document.getElementById('root')!.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f9fafb;">
        <div style="max-width: 400px; text-align: center; padding: 2rem;">
          <svg style="width: 48px; height: 48px; color: #ef4444; margin: 0 auto 1rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h1 style="font-size: 1.25rem; font-weight: 600; color: #111827; margin-bottom: 0.5rem;">
            Uygulama Yüklenemedi
          </h1>
          <p style="color: #6b7280; margin-bottom: 1rem;">
            Bir hata oluştu. Lütfen sayfayı yenileyin.
          </p>
          <button 
            onclick="window.location.reload()" 
            style="background: #3b82f6; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; border: none; cursor: pointer; font-weight: 500;">
            Sayfayı Yenile
          </button>
          ${import.meta.env.DEV ? `
            <details style="margin-top: 1rem; text-align: left; background: #fef2f2; padding: 1rem; border-radius: 0.5rem;">
              <summary style="cursor: pointer; color: #991b1b; font-weight: 500;">Hata Detayları (Dev)</summary>
              <pre style="margin-top: 0.5rem; font-size: 0.75rem; color: #7f1d1d; white-space: pre-wrap;">${error}</pre>
            </details>
          ` : ''}
        </div>
      </div>
    `;
  }
}

// Start the app
bootstrapApp();
