/**
 * Modern Loader Component
 * Enterprise-grade loading animations with smooth transitions
 * @module ModernLoader
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface ModernLoaderProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'ring' | 'brand';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'dark';
  className?: string;
  text?: string;
}

/**
 * Modern Loader with multiple variants
 * Features: GPU-accelerated animations, smooth transitions
 */
export const ModernLoader: React.FC<ModernLoaderProps> = ({
  variant = 'spinner',
  size = 'md',
  color = 'primary',
  className = '',
  text,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    dark: 'text-gray-900',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div className={cn(sizeClasses[size], colorClasses[color])}>
        {variant === 'spinner' && <SpinnerVariant />}
        {variant === 'dots' && <DotsVariant />}
        {variant === 'pulse' && <PulseVariant />}
        {variant === 'bars' && <BarsVariant />}
        {variant === 'ring' && <RingVariant />}
        {variant === 'brand' && <BrandVariant />}
      </div>
      {text && (
        <p className={cn('text-sm font-medium animate-pulse', colorClasses[color])}>
          {text}
        </p>
      )}
    </div>
  );
};

/**
 * Smooth Spinner - Modern circular spinner
 */
const SpinnerVariant: React.FC = () => (
  <svg
    className="animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

/**
 * Animated Dots - Three bouncing dots
 */
const DotsVariant: React.FC = () => (
  <div className="flex items-center justify-center gap-1 w-full h-full">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="w-2 h-2 rounded-full bg-current animate-bounce"
        style={{
          animationDelay: `${i * 0.15}s`,
          animationDuration: '0.6s',
        }}
      />
    ))}
  </div>
);

/**
 * Pulse Variant - Expanding circles
 */
const PulseVariant: React.FC = () => (
  <div className="relative w-full h-full">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="absolute inset-0 rounded-full border-2 border-current animate-ping"
        style={{
          animationDelay: `${i * 0.4}s`,
          animationDuration: '1.5s',
        }}
      />
    ))}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-1/3 h-1/3 rounded-full bg-current" />
    </div>
  </div>
);

/**
 * Bars Variant - Audio-like bars
 */
const BarsVariant: React.FC = () => (
  <div className="flex items-center justify-center gap-1 w-full h-full">
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        className="w-1 bg-current rounded-full animate-pulse"
        style={{
          height: `${30 + (i % 2) * 20}%`,
          animationDelay: `${i * 0.15}s`,
          animationDuration: '1s',
        }}
      />
    ))}
  </div>
);

/**
 * Ring Variant - Rotating ring with gradient
 */
const RingVariant: React.FC = () => (
  <div className="relative w-full h-full">
    <div className="absolute inset-0 rounded-full border-4 border-current opacity-20" />
    <div
      className="absolute inset-0 rounded-full border-4 border-transparent border-t-current animate-spin"
      style={{ animationDuration: '0.8s' }}
    />
  </div>
);

/**
 * Brand Variant - Logo animation (placeholder)
 */
const BrandVariant: React.FC = () => (
  <div className="relative w-full h-full">
    <svg
      className="animate-pulse"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" opacity="0.2" />
      <path
        d="M50 10 L50 30 M50 70 L50 90 M10 50 L30 50 M70 50 L90 50"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        className="animate-spin"
        style={{ transformOrigin: '50% 50%', animationDuration: '2s' }}
      />
    </svg>
  </div>
);

/**
 * Full Page Loader - Centered on screen with backdrop
 */
export const FullPageLoader: React.FC<Omit<ModernLoaderProps, 'className'>> = (props) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
    <ModernLoader {...props} size="xl" />
  </div>
);

/**
 * Inline Loader - Small inline loader
 */
export const InlineLoader: React.FC<Omit<ModernLoaderProps, 'size' | 'className'>> = (props) => (
  <ModernLoader {...props} size="sm" className="inline-flex" />
);

/**
 * Button Loader - For loading buttons (dots variant by default)
 */
export const ButtonLoader: React.FC<{ variant?: 'spinner' | 'dots' }> = ({ variant = 'dots' }) => {
  if (variant === 'dots') {
    return (
      <div className="flex items-center justify-center gap-0.5 h-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1 h-1 rounded-full bg-current animate-bounce"
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: '0.6s',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

export default ModernLoader;

