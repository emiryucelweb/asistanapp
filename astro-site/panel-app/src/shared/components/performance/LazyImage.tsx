/**
 * Lazy Image Component
 * Optimized image loading with intersection observer
 * 
 * @module shared/components/performance/LazyImage
 */

import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '@/shared/hooks/usePerformance';

export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  threshold?: number;
  rootMargin?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Lazy Image
 * Only loads when visible in viewport
 * 
 * Features:
 * - Intersection Observer API
 * - Placeholder support
 * - Loading states
 * - Error handling
 * - Fade-in animation
 * 
 * Usage:
 * ```tsx
 * <LazyImage
 *   src="/image.jpg"
 *   alt="Description"
 *   placeholder="/placeholder.jpg"
 *   className="w-full h-auto"
 * />
 * ```
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  threshold = 0.1,
  rootMargin = '50px',
  onLoad,
  onError,
  className = '',
  ...props
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  
  const isVisible = useIntersectionObserver(imgRef, {
    threshold,
    rootMargin,
  });

  useEffect(() => {
    if (isVisible && !isLoaded && !isError) {
      const img = new Image();
      
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
        if (onLoad) onLoad();
      };
      
      img.onerror = () => {
        setIsError(true);
        if (onError) onError();
      };
      
      img.src = src;
    }
  }, [isVisible, src, isLoaded, isError, onLoad, onError]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-50'
      } ${className}`}
      {...props}
    />
  );
};

export default LazyImage;

