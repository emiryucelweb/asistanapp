/**
 * Type Helper Utilities
 * 
 * Enterprise-grade type conversion and validation utilities
 * Provides type-safe runtime conversions
 * 
 * @module shared/utils/type-helpers
 */

/**
 * Type-safe boolean converter for nullable boolean values
 * 
 * Design Decision: Treats null/undefined as false for UI rendering
 * This enables consistent boolean checks while preserving semantic nullability
 * in state management (null = "never interacted", false = "explicitly off")
 * 
 * @param value - Boolean, null, or undefined value
 * @returns Guaranteed boolean (true or false)
 * 
 * @example
 * ```ts
 * toBoolean(true)        // true
 * toBoolean(false)       // false
 * toBoolean(null)        // false
 * toBoolean(undefined)   // false
 * 
 * // Usage in React components
 * {toBoolean(showModal) && <Modal />}
 * 
 * // Usage in conditions
 * if (toBoolean(isFullscreen)) {
 *   // Handle fullscreen
 * }
 * ```
 */
export function toBoolean(value: boolean | null | undefined): boolean {
  return value === true;
}

/**
 * Type-safe string converter with default fallback
 * 
 * @param value - String, null, or undefined value
 * @param defaultValue - Default value if null/undefined
 * @returns Guaranteed string
 * 
 * @example
 * ```ts
 * toString('hello', '')     // 'hello'
 * toString(null, 'default') // 'default'
 * toString(undefined, '')   // ''
 * ```
 */
export function toString(value: string | null | undefined, defaultValue: string = ''): string {
  return value ?? defaultValue;
}

/**
 * Type-safe number converter with default fallback
 * 
 * @param value - Number, null, or undefined value
 * @param defaultValue - Default value if null/undefined
 * @returns Guaranteed number
 * 
 * @example
 * ```ts
 * toNumber(42, 0)        // 42
 * toNumber(null, 0)      // 0
 * toNumber(undefined, 0) // 0
 * ```
 */
export function toNumber(value: number | null | undefined, defaultValue: number = 0): number {
  return value ?? defaultValue;
}

/**
 * Type-safe array converter with default fallback
 * 
 * @param value - Array, null, or undefined value
 * @param defaultValue - Default value if null/undefined
 * @returns Guaranteed array
 * 
 * @example
 * ```ts
 * toArray([1, 2, 3], [])  // [1, 2, 3]
 * toArray(null, [])        // []
 * toArray(undefined, [])   // []
 * ```
 */
export function toArray<T>(value: T[] | null | undefined, defaultValue: T[] = []): T[] {
  return value ?? defaultValue;
}

/**
 * Type guard for non-null/undefined values
 * 
 * @param value - Any value
 * @returns True if value is not null or undefined
 * 
 * @example
 * ```ts
 * const values = [1, null, 2, undefined, 3];
 * const filtered = values.filter(isDefined); // [1, 2, 3]
 * ```
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Type guard for nullable values
 * 
 * @param value - Any value
 * @returns True if value is null or undefined
 * 
 * @example
 * ```ts
 * if (isNullable(user)) {
 *   // Handle missing user
 * }
 * ```
 */
export function isNullable<T>(value: T | null | undefined): value is null | undefined {
  return value === null || value === undefined;
}

