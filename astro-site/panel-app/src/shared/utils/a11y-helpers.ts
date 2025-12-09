/**
 * Accessibility Helpers
 * Utilities for keyboard navigation and ARIA attributes
 */

/**
 * Handle keyboard events for interactive elements
 * Triggers callback on Enter or Space key
 */
export const handleKeyPress = (
  event: React.KeyboardEvent,
  callback: () => void
): void => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    callback();
  }
};

/**
 * Props for making a div/span clickable and keyboard accessible
 * Usage: <div {...makeClickable(() => handleClick())} />
 */
export const makeClickable = (onClick: () => void) => ({
  role: 'button' as const,
  tabIndex: 0,
  onClick: () => onClick(),
  onKeyDown: (e: React.KeyboardEvent) => handleKeyPress(e, onClick),
});

/**
 * Props for interactive elements that should behave like buttons
 */
export const buttonProps = (onClick: () => void, label?: string) => ({
  role: 'button' as const,
  tabIndex: 0,
  onClick: () => onClick(),
  onKeyDown: (e: React.KeyboardEvent) => handleKeyPress(e, onClick),
  'aria-label': label,
});

/**
 * Props for dismissible/closeable elements
 */
export const closeButtonProps = (onClose: () => void) => ({
  role: 'button' as const,
  tabIndex: 0,
  onClick: () => onClose(),
  onKeyDown: (e: React.KeyboardEvent) => handleKeyPress(e, onClose),
  'aria-label': 'Close',
});

