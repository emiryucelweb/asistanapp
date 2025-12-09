 

/**
 * Form Security Utilities
 * 
 * Enterprise-grade form security helpers
 * - Auto

complete attributes mapping
 * - Input mode for mobile keyboards
 * - CSP nonce management
 * - Input sanitization
 * 
 * @module shared/utils/security/formSecurity
 */

/**
 * HTML autocomplete attribute values
 * Based on WHATWG HTML Living Standard
 * @see https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofilling-form-controls:-the-autocomplete-attribute
 */
export const AUTOCOMPLETE = {
  // General
  OFF: 'off',
  ON: 'on',
  
  // Name
  NAME: 'name',
  GIVEN_NAME: 'given-name',
  ADDITIONAL_NAME: 'additional-name',
  FAMILY_NAME: 'family-name',
  NICKNAME: 'nickname',
  
  // Contact
  EMAIL: 'email',
  TEL: 'tel',
  TEL_COUNTRY_CODE: 'tel-country-code',
  TEL_NATIONAL: 'tel-national',
  TEL_AREA_CODE: 'tel-area-code',
  TEL_LOCAL: 'tel-local',
  TEL_EXTENSION: 'tel-extension',
  
  // Address
  STREET_ADDRESS: 'street-address',
  ADDRESS_LINE1: 'address-line1',
  ADDRESS_LINE2: 'address-line2',
  ADDRESS_LINE3: 'address-line3',
  COUNTRY: 'country',
  COUNTRY_NAME: 'country-name',
  POSTAL_CODE: 'postal-code',
  
  // Authentication
  USERNAME: 'username',
  NEW_PASSWORD: 'new-password',
  CURRENT_PASSWORD: 'current-password',
  ONE_TIME_CODE: 'one-time-code',
  
  // Organization
  ORGANIZATION: 'organization',
  ORGANIZATION_TITLE: 'organization-title',
  
  // URLs
  URL: 'url',
  PHOTO: 'photo',
  IMPP: 'impp', // Instant messaging protocol
  
  // Language
  LANGUAGE: 'language',
  
  // Birthday
  BDAY: 'bday',
  BDAY_DAY: 'bday-day',
  BDAY_MONTH: 'bday-month',
  BDAY_YEAR: 'bday-year',
  
  // Gender
  SEX: 'sex',
  
  // Transaction
  TRANSACTION_CURRENCY: 'transaction-currency',
  TRANSACTION_AMOUNT: 'transaction-amount',
} as const;

/**
 * Input mode for mobile keyboards
 * Optimizes virtual keyboard layout on mobile devices
 */
export const INPUT_MODE = {
  NONE: 'none',
  TEXT: 'text',
  DECIMAL: 'decimal',
  NUMERIC: 'numeric',
  TEL: 'tel',
  SEARCH: 'search',
  EMAIL: 'email',
  URL: 'url',
} as const;

/**
 * Get recommended autocomplete attribute for input type
 */
export function getAutocompleteForType(
  inputType: string,
  fieldName?: string
): string {
  const name = fieldName?.toLowerCase() || '';
  
  // Email fields
  if (inputType === 'email' || name.includes('email')) {
    return AUTOCOMPLETE.EMAIL;
  }
  
  // Password fields
  if (inputType === 'password') {
    if (name.includes('new') || name.includes('confirm')) {
      return AUTOCOMPLETE.NEW_PASSWORD;
    }
    return AUTOCOMPLETE.CURRENT_PASSWORD;
  }
  
  // Tel fields
  if (inputType === 'tel' || name.includes('phone') || name.includes('tel')) {
    return AUTOCOMPLETE.TEL;
  }
  
  // Name fields
  if (name.includes('name')) {
    if (name.includes('first') || name.includes('given')) {
      return AUTOCOMPLETE.GIVEN_NAME;
    }
    if (name.includes('last') || name.includes('family') || name.includes('surname')) {
      return AUTOCOMPLETE.FAMILY_NAME;
    }
    if (name.includes('full')) {
      return AUTOCOMPLETE.NAME;
    }
    return AUTOCOMPLETE.NAME;
  }
  
  // Username
  if (name.includes('username') || name.includes('user')) {
    return AUTOCOMPLETE.USERNAME;
  }
  
  // URL fields
  if (inputType === 'url' || name.includes('url') || name.includes('website')) {
    return AUTOCOMPLETE.URL;
  }
  
  // Default
  return AUTOCOMPLETE.ON;
}

/**
 * Get recommended inputmode for input type
 */
export function getInputModeForType(
  inputType: string,
  fieldName?: string
): string {
  const name = fieldName?.toLowerCase() || '';
  
  // Email
  if (inputType === 'email' || name.includes('email')) {
    return INPUT_MODE.EMAIL;
  }
  
  // Tel
  if (inputType === 'tel' || name.includes('phone') || name.includes('tel')) {
    return INPUT_MODE.TEL;
  }
  
  // Number/Numeric
  if (inputType === 'number' || name.includes('age') || name.includes('count')) {
    return INPUT_MODE.NUMERIC;
  }
  
  // Decimal
  if (name.includes('price') || name.includes('amount') || name.includes('salary')) {
    return INPUT_MODE.DECIMAL;
  }
  
  // URL
  if (inputType === 'url' || name.includes('url') || name.includes('website')) {
    return INPUT_MODE.URL;
  }
  
  // Search
  if (inputType === 'search' || name.includes('search') || name.includes('query')) {
    return INPUT_MODE.SEARCH;
  }
  
  // Default
  return INPUT_MODE.TEXT;
}

/**
 * CSP Nonce management for inline scripts/styles
 */
let cspNonce: string | null = null;

/**
 * Get CSP nonce from meta tag
 * The nonce is set by the backend in the HTML template
 */
export function getCSPNonce(): string | null {
  if (cspNonce) {
    return cspNonce;
  }
  
  if (typeof document === 'undefined') {
    return null;
  }
  
  const metaTag = document.querySelector('meta[name="csp-nonce"]');
  if (metaTag) {
    cspNonce = metaTag.getAttribute('content');
    return cspNonce;
  }
  
  return null;
}

/**
 * Set CSP nonce (typically called by backend template)
 */
export function setCSPNonce(nonce: string): void {
  cspNonce = nonce;
}

/**
 * Create inline script with CSP nonce
 */
export function createScriptWithNonce(code: string): HTMLScriptElement | null {
  if (typeof document === 'undefined') {
    return null;
  }
  
  const script = document.createElement('script');
  const nonce = getCSPNonce();
  
  if (nonce) {
    script.setAttribute('nonce', nonce);
  }
  
  script.textContent = code;
  return script;
}

/**
 * Create inline style with CSP nonce
 */
export function createStyleWithNonce(css: string): HTMLStyleElement | null {
  if (typeof document === 'undefined') {
    return null;
  }
  
  const style = document.createElement('style');
  const nonce = getCSPNonce();
  
  if (nonce) {
    style.setAttribute('nonce', nonce);
  }
  
  style.textContent = css;
  return style;
}

/**
 * Security attributes for form inputs
 */
export interface SecurityAttributes {
  autocomplete?: string;
  inputMode?: string;
  spellcheck?: boolean;
  autoCapitalize?: 'off' | 'on' | 'words' | 'characters';
}

/**
 * Get recommended security attributes for an input field
 * 
 * @param inputType - HTML input type
 * @param fieldName - Field name/ID
 * @param options - Custom options to override defaults
 * @returns Security attributes object
 * 
 * @example
 * ```tsx
 * const attrs = getSecurityAttributes('email', 'user-email');
 * // { autocomplete: 'email', inputMode: 'email', spellcheck: false, autoCapitalize: 'off' }
 * 
 * <input type="email" {...attrs} />
 * ```
 */
export function getSecurityAttributes(
  inputType: string,
  fieldName?: string,
  options?: Partial<SecurityAttributes>
): SecurityAttributes {
  const attrs: SecurityAttributes = {
    autocomplete: getAutocompleteForType(inputType, fieldName),
    inputMode: getInputModeForType(inputType, fieldName),
    spellcheck: false,
    autoCapitalize: 'off',
  };
  
  // Override with custom options
  if (options) {
    Object.assign(attrs, options);
  }
  
  // Special cases
  if (inputType === 'password') {
    attrs.spellcheck = false;
    attrs.autoCapitalize = 'off';
  }
  
  if (inputType === 'email') {
    attrs.spellcheck = false;
    attrs.autoCapitalize = 'off';
  }
  
  return attrs;
}

/**
 * Sensitive field patterns
 */
const SENSITIVE_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /key/i,
  /ssn/i,
  /credit.*card/i,
  /cvv/i,
  /pin/i,
];

/**
 * Check if a field is sensitive (should disable autocomplete)
 */
export function isSensitiveField(fieldName: string): boolean {
  return SENSITIVE_PATTERNS.some(pattern => pattern.test(fieldName));
}

/**
 * Get autocomplete attribute for sensitive fields
 */
export function getAutocompleteForSensitiveField(fieldName: string): string {
  if (isSensitiveField(fieldName)) {
    return AUTOCOMPLETE.OFF;
  }
  return AUTOCOMPLETE.ON;
}

/**
 * Sanitize form data before submission
 * Removes leading/trailing whitespace from string values
 */
export function sanitizeFormData<T extends Record<string, any>>(data: T): T {
  const sanitized = { ...data };
  
  for (const key in sanitized) {
    const value = sanitized[key];
    
    if (typeof value === 'string') {
      sanitized[key] = value.trim() as any;
    }
  }
  
  return sanitized;
}

/**
 * Form security best practices checklist
 */
export const FORM_SECURITY_CHECKLIST = {
  autocomplete: {
    title: 'Autocomplete Attributes',
    description: 'All inputs should have appropriate autocomplete attributes',
    importance: 'high',
    wcag: 'WCAG 2.1 Level A - 1.3.5 Identify Input Purpose',
  },
  inputmode: {
    title: 'Input Mode',
    description: 'Mobile-friendly input modes for better UX',
    importance: 'medium',
    wcag: 'WCAG 2.1 Level AA - 1.4.13 Content on Hover or Focus',
  },
  validation: {
    title: 'Client & Server Validation',
    description: 'Never trust client-side validation alone',
    importance: 'critical',
    wcag: 'WCAG 2.1 Level A - 3.3.1 Error Identification',
  },
  csrf: {
    title: 'CSRF Protection',
    description: 'All state-changing requests must have CSRF tokens',
    importance: 'critical',
    wcag: 'N/A (Security Best Practice)',
  },
  sanitization: {
    title: 'Input Sanitization',
    description: 'Sanitize all user inputs on frontend and backend',
    importance: 'critical',
    wcag: 'N/A (Security Best Practice)',
  },
} as const;

