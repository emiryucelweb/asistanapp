/**
 * Vitest Setup File
 * Global test configuration and utilities
 * 
 * Runs before all test files
 * 
 * Memory Optimization:
 * - Aggressive cleanup after each test
 * - Garbage collection hints
 * - DOM cleanup
 */

import { expect, afterEach, beforeEach, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Memory cleanup helper
const triggerGC = () => {
  if (typeof global.gc === 'function') {
    global.gc();
  }
};

// Cleanup after each test - critical for memory management
afterEach(() => {
  // React Testing Library cleanup
  cleanup();
  
  // Clear all mocks
  vi.clearAllMocks();
  vi.resetAllMocks();
  
  // Clear timers
  vi.clearAllTimers();
  
  // Clear localStorage mock
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.clear();
  }
  
  // Clear sessionStorage mock
  if (typeof window !== 'undefined' && window.sessionStorage) {
    window.sessionStorage.clear();
  }
});

// Aggressive cleanup after all tests in a file
afterAll(() => {
  // Reset modules to free memory
  vi.resetModules();
  
  // Trigger garbage collection if available
  triggerGC();
});

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollTo
(window.scrollTo as any) = vi.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
});

// Suppress console errors in tests (opt-in per test)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
       args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Custom matchers (if needed)
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

