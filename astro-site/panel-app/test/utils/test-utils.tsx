/**
 * Test Utils - Re-export from custom-render
 * 
 * This file provides backward compatibility for existing tests
 * that import from '@/test/utils/test-utils'
 */

export {
  renderWithProviders,
  renderWithRouter,
  renderWithQuery,
  renderWithAllProviders,
  waitForLoadingToFinish,
  createMockComponent,
} from './custom-render';

// Re-export all RTL utilities
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

