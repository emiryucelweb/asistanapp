/**
 * Custom Render Utility
 * 
 * Wraps React Testing Library render with common providers
 * All tests should use this instead of direct render
 * 
 * @usage
 * ```typescript
 * import { renderWithProviders } from '@/test/utils/custom-render';
 * 
 * renderWithProviders(<MyComponent />, {
 *   providers: ['router', 'i18n'],
 *   initialRoute: '/dashboard'
 * });
 * ```
 */

import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { mockUseTranslation } from '../mocks/i18n.mock';

// ============================================================================
// TYPES
// ============================================================================

export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * Which providers to include
   * @default ['router', 'query', 'i18n']
   */
  providers?: Array<'router' | 'query' | 'i18n' | 'theme'>;
  
  /**
   * Initial route for MemoryRouter
   * @default '/'
   */
  initialRoute?: string;
  
  /**
   * Custom i18n translations
   */
  i18nTranslations?: Record<string, string>;
  
  /**
   * QueryClient options
   */
  queryClientOptions?: {
    defaultOptions?: any;
  };
  
  /**
   * Theme mode
   * @default 'light'
   */
  theme?: 'light' | 'dark';
}

// ============================================================================
// PROVIDER COMPONENTS
// ============================================================================

/**
 * Query Client Provider Wrapper
 */
const QueryProvider: React.FC<{ children: React.ReactNode; options?: any }> = ({ 
  children, 
  options 
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
      mutations: {
        retry: false,
      },
      ...options?.defaultOptions,
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

/**
 * Router Provider Wrapper
 */
const RouterProvider: React.FC<{ 
  children: React.ReactNode; 
  initialRoute: string;
}> = ({ children, initialRoute }) => {
  return (
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="*" element={<>{children}</>} />
      </Routes>
    </MemoryRouter>
  );
};

/**
 * Theme Provider Wrapper (Simple)
 */
const ThemeProvider: React.FC<{ 
  children: React.ReactNode; 
  theme: 'light' | 'dark';
}> = ({ children, theme }) => {
  // Add theme class to document
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, [theme]);

  return <>{children}</>;
};

// ============================================================================
// CUSTOM RENDER
// ============================================================================

/**
 * Custom render function with all providers
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  const {
    providers = ['router', 'query', 'i18n'],
    initialRoute = '/',
    i18nTranslations = {},
    queryClientOptions,
    theme = 'light',
    ...renderOptions
  } = options;

  // Build wrapper component with selected providers
  const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    let content = <>{children}</>;

    // Apply providers in reverse order (innermost first)
    if (providers.includes('theme')) {
      content = <ThemeProvider theme={theme}>{content}</ThemeProvider>;
    }

    if (providers.includes('router')) {
      content = <RouterProvider initialRoute={initialRoute}>{content}</RouterProvider>;
    }

    if (providers.includes('query')) {
      content = <QueryProvider options={queryClientOptions}>{content}</QueryProvider>;
    }

    // i18n is handled via mock, not provider
    // But we can provide custom translations
    if (providers.includes('i18n') && Object.keys(i18nTranslations).length > 0) {
      // i18n mock is set up globally, custom translations passed via options
    }

    return content;
  };

  return render(ui, { wrapper: AllProviders, ...renderOptions });
}

// ============================================================================
// SPECIALIZED RENDERS
// ============================================================================

/**
 * Render with only Router
 */
export function renderWithRouter(
  ui: React.ReactElement,
  { initialRoute = '/', ...options }: Omit<CustomRenderOptions, 'providers'> = {}
): RenderResult {
  return renderWithProviders(ui, {
    ...options,
    providers: ['router'],
    initialRoute,
  });
}

/**
 * Render with Router + Query
 */
export function renderWithQuery(
  ui: React.ReactElement,
  options: Omit<CustomRenderOptions, 'providers'> = {}
): RenderResult {
  return renderWithProviders(ui, {
    ...options,
    providers: ['router', 'query'],
  });
}

/**
 * Render with all providers (default)
 */
export function renderWithAllProviders(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult {
  return renderWithProviders(ui, {
    ...options,
    providers: ['router', 'query', 'i18n', 'theme'],
  });
}

// ============================================================================
// HELPER UTILITIES
// ============================================================================

/**
 * Wait for loading states to complete
 */
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

/**
 * Create mock component for testing
 */
export const createMockComponent = (displayName: string) => {
  const MockComponent = () => <div data-testid={displayName}>{displayName}</div>;
  MockComponent.displayName = displayName;
  return MockComponent;
};

// Re-export everything from RTL
export * from '@testing-library/react';
export { renderWithProviders as render };

