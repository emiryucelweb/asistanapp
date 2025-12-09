/**
 * Type Helpers Tests
 * 
 * @group utils
 * @group helpers
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  toBoolean,
  toString,
  toNumber,
  toArray,
  isDefined,
  isNullable,
} from '../type-helpers';

describe('Type Helpers - Enterprise Grade Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

describe('toBoolean', () => {
  it('should convert true to true', () => {
    expect(toBoolean(true)).toBe(true);
  });

  it('should convert false to false', () => {
    expect(toBoolean(false)).toBe(false);
  });

  it('should convert null to false', () => {
    expect(toBoolean(null)).toBe(false);
  });

  it('should convert undefined to false', () => {
    expect(toBoolean(undefined)).toBe(false);
  });

  it('should handle all falsy values as false', () => {
    expect(toBoolean(null)).toBe(false);
    expect(toBoolean(undefined)).toBe(false);
    expect(toBoolean(false)).toBe(false);
  });

  it('should only return true for explicit true value', () => {
    expect(toBoolean(true)).toBe(true);
    expect(toBoolean(1 as any)).toBe(false);
    expect(toBoolean('true' as any)).toBe(false);
    expect(toBoolean({} as any)).toBe(false);
  });
});

describe('toString', () => {
  it('should convert string to string', () => {
    expect(toString('hello')).toBe('hello');
  });

  it('should convert null to empty string by default', () => {
    expect(toString(null)).toBe('');
  });

  it('should convert undefined to empty string by default', () => {
    expect(toString(undefined)).toBe('');
  });

  it('should use custom default value for null', () => {
    expect(toString(null, 'default')).toBe('default');
  });

  it('should use custom default value for undefined', () => {
    expect(toString(undefined, 'N/A')).toBe('N/A');
  });

  it('should preserve empty string', () => {
    expect(toString('')).toBe('');
  });

  it('should preserve whitespace string', () => {
    expect(toString('   ')).toBe('   ');
  });

  it('should handle various default values', () => {
    expect(toString(null, '0')).toBe('0');
    expect(toString(undefined, 'unknown')).toBe('unknown');
    expect(toString(null, '')).toBe('');
  });
});

describe('toNumber', () => {
  it('should convert number to number', () => {
    expect(toNumber(42)).toBe(42);
  });

  it('should convert null to 0 by default', () => {
    expect(toNumber(null)).toBe(0);
  });

  it('should convert undefined to 0 by default', () => {
    expect(toNumber(undefined)).toBe(0);
  });

  it('should use custom default value for null', () => {
    expect(toNumber(null, -1)).toBe(-1);
  });

  it('should use custom default value for undefined', () => {
    expect(toNumber(undefined, 100)).toBe(100);
  });

  it('should preserve zero', () => {
    expect(toNumber(0)).toBe(0);
  });

  it('should preserve negative numbers', () => {
    expect(toNumber(-42)).toBe(-42);
  });

  it('should preserve decimal numbers', () => {
    expect(toNumber(3.14)).toBe(3.14);
  });

  it('should handle various default values', () => {
    expect(toNumber(null, 999)).toBe(999);
    expect(toNumber(undefined, -999)).toBe(-999);
    expect(toNumber(null, 0)).toBe(0);
  });
});

describe('toArray', () => {
  it('should convert array to array', () => {
    const arr = [1, 2, 3];
    expect(toArray(arr)).toEqual([1, 2, 3]);
    expect(toArray(arr)).toBe(arr);
  });

  it('should convert null to empty array by default', () => {
    expect(toArray(null)).toEqual([]);
  });

  it('should convert undefined to empty array by default', () => {
    expect(toArray(undefined)).toEqual([]);
  });

  it('should use custom default value for null', () => {
    expect(toArray<number>(null, [1, 2])).toEqual([1, 2]);
  });

  it('should use custom default value for undefined', () => {
    expect(toArray<string>(undefined, ['a', 'b'])).toEqual(['a', 'b']);
  });

  it('should preserve empty array', () => {
    expect(toArray([])).toEqual([]);
  });

  it('should preserve array with one element', () => {
    expect(toArray([42])).toEqual([42]);
  });

  it('should preserve array of objects', () => {
    const arr = [{ id: 1 }, { id: 2 }];
    expect(toArray(arr)).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('should preserve array of strings', () => {
    expect(toArray(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
  });
});

describe('isDefined', () => {
  it('should return true for defined values', () => {
    expect(isDefined(0)).toBe(true);
    expect(isDefined('')).toBe(true);
    expect(isDefined(false)).toBe(true);
    expect(isDefined([])).toBe(true);
    expect(isDefined({})).toBe(true);
    expect(isDefined('hello')).toBe(true);
    expect(isDefined(42)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isDefined(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isDefined(undefined)).toBe(false);
  });

  it('should act as type guard', () => {
    const value: string | null | undefined = 'hello';
    
    if (isDefined(value)) {
      // TypeScript should know value is string here
      expect(value.length).toBe(5);
    }
  });

  it('should filter out nullables from array', () => {
    const arr: (number | null | undefined)[] = [1, null, 2, undefined, 3];
    const filtered = arr.filter(isDefined);
    
    expect(filtered).toEqual([1, 2, 3]);
    // TypeScript should infer filtered as number[]
  });
});

describe('isNullable', () => {
  it('should return false for defined values', () => {
    expect(isNullable(0)).toBe(false);
    expect(isNullable('')).toBe(false);
    expect(isNullable(false)).toBe(false);
    expect(isNullable([])).toBe(false);
    expect(isNullable({})).toBe(false);
    expect(isNullable('hello')).toBe(false);
    expect(isNullable(42)).toBe(false);
  });

  it('should return true for null', () => {
    expect(isNullable(null)).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(isNullable(undefined)).toBe(true);
  });

  it('should act as type guard', () => {
    const value: string | null | undefined = null;
    
    if (isNullable(value)) {
      // TypeScript should know value is null | undefined here
      expect(value).toBeNull();
    }
  });

  it('should be opposite of isDefined', () => {
    const testValues = [
      null,
      undefined,
      0,
      '',
      false,
      [],
      {},
      'hello',
      42,
    ];

    testValues.forEach(value => {
      expect(isNullable(value)).toBe(!isDefined(value));
    });
  });
});

describe('Edge Cases', () => {
  it('should handle NaN for toNumber', () => {
    expect(toNumber(NaN)).toBe(NaN);
  });

  it('should handle Infinity for toNumber', () => {
    expect(toNumber(Infinity)).toBe(Infinity);
    expect(toNumber(-Infinity)).toBe(-Infinity);
  });

  it('should handle special string values', () => {
    expect(toString('\n')).toBe('\n');
    expect(toString('\t')).toBe('\t');
    expect(toString('0')).toBe('0');
  });

  it('should handle nested arrays', () => {
    const nested = [[1, 2], [3, 4]];
    expect(toArray(nested)).toEqual([[1, 2], [3, 4]]);
  });

  it('should handle very large arrays', () => {
    const large = Array.from({ length: 10000 }, (_, i) => i);
    expect(toArray(large).length).toBe(10000);
  });

  it('should handle very large numbers', () => {
    expect(toNumber(Number.MAX_SAFE_INTEGER)).toBe(Number.MAX_SAFE_INTEGER);
    expect(toNumber(Number.MIN_SAFE_INTEGER)).toBe(Number.MIN_SAFE_INTEGER);
  });

  it('should handle very long strings', () => {
    const long = 'a'.repeat(10000);
    expect(toString(long).length).toBe(10000);
  });
});

describe('Type Safety', () => {
  it('should preserve type in toArray', () => {
    const numbers: number[] | null = [1, 2, 3];
    const result = toArray(numbers);
    
    expect(result).toEqual([1, 2, 3]);
    // TypeScript should infer result as number[]
  });

  it('should work with custom types', () => {
    interface User {
      id: number;
      name: string;
    }

    const users: User[] | null = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];

    const result = toArray(users);
    expect(result).toEqual(users);
    // TypeScript should infer result as User[]
  });

  it('should handle union types correctly', () => {
    const value: string | number | null = null;
    
    expect(isDefined(value)).toBe(false);
    expect(isNullable(value)).toBe(true);
  });
});

describe('Performance', () => {
  it('should handle rapid toBoolean calls', () => {
    const iterations = 100000;
    const start = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      toBoolean(i % 2 === 0);
    }
    
    const duration = performance.now() - start;
    
    // Should complete in less than 100ms
    expect(duration).toBeLessThan(100);
  });

  it('should handle rapid toString calls', () => {
    const iterations = 100000;
    const start = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      toString(`value-${i}`);
    }
    
    const duration = performance.now() - start;
    
    // Should complete in less than 100ms
    expect(duration).toBeLessThan(100);
  });

  it('should handle rapid isDefined calls', () => {
    const iterations = 100000;
    const values = [null, undefined, 0, '', false, 'test', 42];
    const start = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      isDefined(values[i % values.length]);
    }
    
    const duration = performance.now() - start;
    
    // Should complete in less than 100ms
    expect(duration).toBeLessThan(100);
  });
});

// Error Handling Tests
describe('Error Handling', () => {
  it('should handle Symbol values in isDefined', () => {
    // Arrange
    const symbol = Symbol('test');
    
    // Act & Assert
    expect(isDefined(symbol)).toBe(true);
    expect(isNullable(symbol)).toBe(false);
  });

  it('should handle functions in toArray', () => {
    // Arrange
    const fn = () => 'test';
    
    // Act & Assert
    expect(() => toArray(fn as any)).not.toThrow();
  });

  it('should handle object with null prototype', () => {
    // Arrange
    const obj = Object.create(null);
    obj.value = 'test';
    
    // Act & Assert
    expect(isDefined(obj)).toBe(true);
    expect(isNullable(obj)).toBe(false);
  });
});
});
