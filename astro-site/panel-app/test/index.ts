/**
 * Test Utilities - Main Export
 * 
 * Single import point for all test utilities
 * 
 * @usage
 * ```typescript
 * import { 
 *   renderWithProviders,
 *   createMockUser,
 *   setupI18nMock,
 *   AGENT_USER
 * } from '@/test';
 * ```
 */

// Render utilities
export * from './utils/custom-render';

// Test factories
export * from './utils/test-factories';
export * from './utils/mock-factories';
export * from './utils/test-utils';

// Mocks
export * from './mocks/i18n.mock';

// Fixtures
export * from './fixtures/common';

// Re-export types
export type * from './utils/test-factories';

