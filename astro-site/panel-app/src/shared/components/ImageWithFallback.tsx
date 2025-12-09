/**
 * ImageWithFallback Component
 * 
 * Displays an image with automatic fallback to placeholder on error
 * Prevents broken image icons and provides better UX
 * 
 * Features:
 * - Automatic fallback on load error
 * - Loading state indicator
 * - Customizable fallback UI
 * - Lazy loading support
 * - Responsive className support
 * 
 * @module shared/components/ImageWithFallback
 */

import React, { useState, ImgHTMLAttributes } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageWithFallbackProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onError'> {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Fallback image URL (optional) */
  fallbackSrc?: string;
  /** Custom fallback UI (optional) */
  fallbackComponent?: React.ReactNode;
  /** Show loading indicator */
  showLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ✅ PRODUCTION READY: Image with automatic fallback handling
 * Prevents broken image icons and provides graceful degradation
 */
const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = '/placeholder-image.png',
  fallbackComponent,
  showLoading = false,
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(showLoading);
  const [currentSrc, setCurrentSrc] = useState(src);

  // Handle image load error
  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      
      // Try fallback image if provided
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
      }
    }
    setIsLoading(false);
  };

  // Handle image load success
  const handleLoad = () => {
    setIsLoading(false);
  };

  // If error and fallbackComponent provided, show custom fallback
  if (hasError && currentSrc === fallbackSrc && fallbackComponent) {
    return <>{fallbackComponent}</>;
  }

  // If error and no fallback image works, show default placeholder
  if (hasError && currentSrc === fallbackSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="w-8 h-8 text-gray-400 dark:text-gray-600" />
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}>
          <div className="flex items-center justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.6s',
                }}
              />
            ))}
          </div>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={className}
        loading="lazy"
        {...props}
      />
    </>
  );
};

export default ImageWithFallback;



