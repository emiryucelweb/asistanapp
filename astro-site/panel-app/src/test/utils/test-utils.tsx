/**
 * Test Utilities
 * Custom render functions and helpers for testing React components
 */

import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { ReactElement, ReactNode } from 'react';

/**
 * Create a fresh QueryClient for each test
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * All Providers wrapper for testing
 */
interface AllProvidersProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

export function AllProviders({ children, queryClient }: AllProvidersProps) {
  const client = queryClient || createTestQueryClient();

  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}

/**
 * Custom render with all providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const { queryClient, ...renderOptions } = options || {};

  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders queryClient={queryClient}>{children}</AllProviders>
    ),
    ...renderOptions,
  });
}

/**
 * Wait for loading states to complete
 */
export async function waitForLoadingToFinish() {
  const { waitFor } = await import('@testing-library/react');
  return waitFor(
    () => {
      const loadingSpinners = document.querySelectorAll('[role="status"]');
      const loadingTexts = document.querySelectorAll('[aria-busy="true"]');
      if (loadingSpinners.length > 0 || loadingTexts.length > 0) {
        throw new Error('Still loading...');
      }
    },
    { timeout: 3000 }
  );
}

/**
 * Simulate user typing with delay
 */
export async function userType(element: HTMLElement, text: string) {
  const userEvent = (await import('@testing-library/user-event')).default;
  const user = userEvent.setup();
  await user.type(element, text);
}

/**
 * Fill form helper
 */
export async function fillForm(fields: Record<string, { element: HTMLElement; value: string }>) {
  const userEvent = (await import('@testing-library/user-event')).default;
  const user = userEvent.setup();

  for (const [_field, { element, value }] of Object.entries(fields)) {
    await user.clear(element);
    await user.type(element, value);
  }
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react';



