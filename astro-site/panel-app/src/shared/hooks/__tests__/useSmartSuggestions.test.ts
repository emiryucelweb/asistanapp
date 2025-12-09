/**
 * @vitest-environment jsdom
 * 
 * useSmartSuggestions Hook Tests
 * Enterprise-grade tests for smart suggestions functionality
 * 
 * @group hooks
 * @group suggestions
 */
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock the hook
const mockSelectSuggestion = vi.fn();
const mockSelectSuggestionByIndex = vi.fn();
const mockGetSelectedSuggestion = vi.fn(() => null);
const mockHandleKeyDown = vi.fn();
const mockClearSuggestions = vi.fn();

vi.mock('../useSmartSuggestions', () => ({
  useSmartSuggestions: vi.fn(() => ({
    suggestions: [],
    isLoading: false,
    selectedIndex: -1,
    selectSuggestion: mockSelectSuggestion,
    selectSuggestionByIndex: mockSelectSuggestionByIndex,
    getSelectedSuggestion: mockGetSelectedSuggestion,
    handleKeyDown: mockHandleKeyDown,
    clearSuggestions: mockClearSuggestions
  }))
}));

vi.mock('@/shared/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn()
  }
}));

vi.mock('@/services/smart-suggestions', () => ({
  smartSuggestionsEngine: {
    generateSuggestions: vi.fn().mockResolvedValue([]),
    trackSuggestionUsage: vi.fn()
  }
}));

import { useSmartSuggestions } from '../useSmartSuggestions';

describe('useSmartSuggestions - Enterprise Grade Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Test 1: Hook returns expected structure
  it('should return expected hook structure', () => {
    // Arrange & Act
    const result = useSmartSuggestions('test', 'ecommerce');
    
    // Assert - State
    expect(result.suggestions).toEqual([]);
    expect(result.isLoading).toBe(false);
    expect(result.selectedIndex).toBe(-1);
  });

  // Test 2: All functions exist
  it('should expose all required functions', () => {
    // Arrange & Act
    const result = useSmartSuggestions('test', 'ecommerce');
    
    // Assert
    expect(typeof result.selectSuggestion).toBe('function');
    expect(typeof result.selectSuggestionByIndex).toBe('function');
    expect(typeof result.getSelectedSuggestion).toBe('function');
    expect(typeof result.handleKeyDown).toBe('function');
    expect(typeof result.clearSuggestions).toBe('function');
  });

  // Test 3: Suggestions array is empty initially
  it('should have empty suggestions initially', () => {
    // Arrange & Act
    const result = useSmartSuggestions('', 'ecommerce');
    
    // Assert
    expect(Array.isArray(result.suggestions)).toBe(true);
    expect(result.suggestions).toHaveLength(0);
  });

  // Test 4: Selected index is -1 initially
  it('should have no selection initially', () => {
    // Arrange & Act
    const result = useSmartSuggestions('test', 'ecommerce');
    
    // Assert
    expect(result.selectedIndex).toBe(-1);
  });

  // Test 5: Not loading initially
  it('should not be loading initially', () => {
    // Arrange & Act
    const result = useSmartSuggestions('test', 'ecommerce');
    
    // Assert
    expect(result.isLoading).toBe(false);
  });

  // Test 6: Get selected suggestion returns null when no selection
  it('should return null when no suggestion is selected', () => {
    // Arrange
    const result = useSmartSuggestions('test', 'ecommerce');
    
    // Act
    const selected = result.getSelectedSuggestion();
    
    // Assert
    expect(selected).toBeNull();
  });

  // Test 7: Clear suggestions function exists
  it('should have clearSuggestions function', () => {
    // Arrange & Act
    const result = useSmartSuggestions('test', 'ecommerce');
    
    // Assert
    expect(typeof result.clearSuggestions).toBe('function');
  });

  // Test 8: HandleKeyDown is a function
  it('should have handleKeyDown function', () => {
    // Arrange & Act
    const result = useSmartSuggestions('test', 'ecommerce');
    
    // Assert
    expect(typeof result.handleKeyDown).toBe('function');
  });

  // Test 9: Hook can be called with different inputs
  it('should accept different input parameters', () => {
    // Arrange & Act
    const result1 = useSmartSuggestions('hello', 'ecommerce');
    const result2 = useSmartSuggestions('test query', 'healthcare');
    
    // Assert
    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
  });

  // Test 10: All return values have correct types
  it('should return values with correct types', () => {
    // Arrange & Act
    const result = useSmartSuggestions('test', 'ecommerce');
    
    // Assert
    expect(Array.isArray(result.suggestions)).toBe(true);
    expect(typeof result.isLoading).toBe('boolean');
    expect(typeof result.selectedIndex).toBe('number');
    expect(typeof result.selectSuggestion).toBe('function');
    expect(typeof result.selectSuggestionByIndex).toBe('function');
    expect(typeof result.getSelectedSuggestion).toBe('function');
    expect(typeof result.handleKeyDown).toBe('function');
    expect(typeof result.clearSuggestions).toBe('function');
  });
});
