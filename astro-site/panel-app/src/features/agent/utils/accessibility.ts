/**
 * Accessibility Utilities
 * WCAG 2.1 AA Compliance helpers
 * 
 * @module agent/utils/accessibility
 */

// NOTE: ARIA_LABELS constant is deprecated but kept for backwards compatibility
import { ARIA_LABELS } from '../constants';

// ============================================================================
// FOCUS MANAGEMENT
// ============================================================================

/**
 * Focus trap for modals and dialogs
 */
export class FocusTrap {
  private element: HTMLElement;
  private focusableElements: HTMLElement[] = [];
  private previousActiveElement: HTMLElement | null = null;

  constructor(element: HTMLElement) {
    this.element = element;
    this.updateFocusableElements();
  }

  /**
   * Update list of focusable elements
   */
  private updateFocusableElements(): void {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    this.focusableElements = Array.from(
      this.element.querySelectorAll<HTMLElement>(selector)
    );
  }

  /**
   * Activate focus trap
   */
  activate(): void {
    this.previousActiveElement = document.activeElement as HTMLElement;
    this.updateFocusableElements();

    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }

    document.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Deactivate focus trap
   */
  deactivate(): void {
    document.removeEventListener('keydown', this.handleKeyDown);

    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
    }
  }

  /**
   * Handle keyboard navigation
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab') return;

    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  };
}

/**
 * Create and activate focus trap
 */
export function createFocusTrap(element: HTMLElement): FocusTrap {
  return new FocusTrap(element);
}

/**
 * Focus first error in form
 */
export function focusFirstError(formElement: HTMLElement): void {
  const errorElements = formElement.querySelectorAll('[aria-invalid="true"]');
  
  if (errorElements.length > 0) {
    const firstError = errorElements[0] as HTMLElement;
    firstError.focus();
    
    // Scroll into view
    firstError.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }
}

/**
 * Focus element by ref
 */
export function focusElement(element: HTMLElement | null): void {
  if (element) {
    element.focus();
  }
}

// ============================================================================
// ARIA HELPERS
// ============================================================================

/**
 * Generate unique ARIA ID
 */
let ariaIdCounter = 0;

export function generateAriaId(prefix: string = 'aria'): string {
  ariaIdCounter++;
  return `${prefix}-${ariaIdCounter}`;
}

/**
 * Get ARIA label from constants
 * ⚠️  DEPRECATED: Use i18n instead - t('aria.labelKey')
 * This function is kept for backwards compatibility only.
 * @deprecated Use i18n translations: agent:aria.*
 */
export function getAriaLabel(key: keyof typeof ARIA_LABELS): string {
  return ARIA_LABELS[key];
}

/**
 * Create ARIA live region announcement
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// ============================================================================
// KEYBOARD NAVIGATION
// ============================================================================

/**
 * Handle escape key
 */
export function handleEscapeKey(
  event: KeyboardEvent,
  callback: () => void
): void {
  if (event.key === 'Escape') {
    event.preventDefault();
    callback();
  }
}

/**
 * Handle enter key
 */
export function handleEnterKey(
  event: KeyboardEvent,
  callback: () => void
): void {
  if (event.key === 'Enter') {
    event.preventDefault();
    callback();
  }
}

/**
 * Handle space key
 */
export function handleSpaceKey(
  event: KeyboardEvent,
  callback: () => void
): void {
  if (event.key === ' ' || event.key === 'Spacebar') {
    event.preventDefault();
    callback();
  }
}

/**
 * Handle arrow keys navigation
 */
export interface ArrowKeyHandlers {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
}

export function handleArrowKeys(
  event: KeyboardEvent,
  handlers: ArrowKeyHandlers
): void {
  switch (event.key) {
    case 'ArrowUp':
      if (handlers.onUp) {
        event.preventDefault();
        handlers.onUp();
      }
      break;
    case 'ArrowDown':
      if (handlers.onDown) {
        event.preventDefault();
        handlers.onDown();
      }
      break;
    case 'ArrowLeft':
      if (handlers.onLeft) {
        event.preventDefault();
        handlers.onLeft();
      }
      break;
    case 'ArrowRight':
      if (handlers.onRight) {
        event.preventDefault();
        handlers.onRight();
      }
      break;
  }
}

// ============================================================================
// COLOR CONTRAST
// ============================================================================

/**
 * Calculate relative luminance (WCAG formula)
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const val = c / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  // Simple RGB extraction (works for hex colors like #RRGGBB)
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');

  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);

  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);

  const l1 = getRelativeLuminance(r1, g1, b1);
  const l2 = getRelativeLuminance(r2, g2, b2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standard
 */
export function meetsWCAGAA(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  const threshold = isLargeText ? 3.0 : 4.5;
  return ratio >= threshold;
}

/**
 * Check if contrast ratio meets WCAG AAA standard
 */
export function meetsWCAGAAA(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  const threshold = isLargeText ? 4.5 : 7.0;
  return ratio >= threshold;
}

// ============================================================================
// SCREEN READER UTILITIES
// ============================================================================

/**
 * Hide element from screen readers
 */
export function hideFromScreenReader(element: HTMLElement): void {
  element.setAttribute('aria-hidden', 'true');
}

/**
 * Show element to screen readers
 */
export function showToScreenReader(element: HTMLElement): void {
  element.removeAttribute('aria-hidden');
}

/**
 * Mark element as presentational
 */
export function markAsPresentational(element: HTMLElement): void {
  element.setAttribute('role', 'presentation');
}

// ============================================================================
// REDUCED MOTION
// ============================================================================

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation duration based on user preference
 */
export function getAnimationDuration(defaultDuration: number): number {
  return prefersReducedMotion() ? 0 : defaultDuration;
}

// ============================================================================
// SKIP LINKS
// ============================================================================

/**
 * Create skip to content link
 * @param targetId - ID of the target element
 * @param label - Accessible label (should be provided via i18n)
 */
export function createSkipLink(targetId: string, label: string): HTMLAnchorElement {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = label;
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-white focus:text-black';
  
  return skipLink;
}

// ============================================================================
// LANDMARK REGIONS
// ============================================================================

/**
 * Ensure proper landmark structure
 */
export interface LandmarkValidation {
  hasMain: boolean;
  hasNavigation: boolean;
  hasHeader: boolean;
  hasFooter: boolean;
  issues: string[];
}

export function validateLandmarks(): LandmarkValidation {
  const issues: string[] = [];
  
  const mainElements = document.querySelectorAll('main, [role="main"]');
  const navElements = document.querySelectorAll('nav, [role="navigation"]');
  const headerElements = document.querySelectorAll('header, [role="banner"]');
  const footerElements = document.querySelectorAll('footer, [role="contentinfo"]');

  if (mainElements.length === 0) {
    issues.push('Missing main landmark');
  } else if (mainElements.length > 1) {
    issues.push('Multiple main landmarks detected');
  }

  if (navElements.length === 0) {
    issues.push('Missing navigation landmark');
  }

  if (headerElements.length === 0) {
    issues.push('Missing header banner');
  }

  return {
    hasMain: mainElements.length === 1,
    hasNavigation: navElements.length > 0,
    hasHeader: headerElements.length > 0,
    hasFooter: footerElements.length > 0,
    issues,
  };
}

