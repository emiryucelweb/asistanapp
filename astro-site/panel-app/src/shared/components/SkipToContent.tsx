/**
 * SkipToContent Component
 * 
 * Accessibility feature that allows keyboard users to skip navigation
 * and jump directly to main content
 * 
 * Features:
 * - WCAG 2.1 AA compliant
 * - Keyboard accessible (Tab key)
 * - Visually hidden until focused
 * - Smooth scroll to main content
 * - Screen reader friendly
 * 
 * @module shared/components/SkipToContent
 */

import React from 'react';

interface SkipToContentProps {
  /** Target element ID to skip to */
  targetId?: string;
  /** Custom label text */
  label?: string;
}

/**
 * ✅ ACCESSIBILITY: Skip to content link
 * Allows keyboard users to bypass navigation and jump to main content
 * WCAG 2.1 AA requirement
 */
const SkipToContent: React.FC<SkipToContentProps> = ({
  targetId = 'main-content',
  label = 'Ana içeriğe geç',
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.focus();
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-orange-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all"
      aria-label={label}
    >
      {label}
    </a>
  );
};

export default SkipToContent;



