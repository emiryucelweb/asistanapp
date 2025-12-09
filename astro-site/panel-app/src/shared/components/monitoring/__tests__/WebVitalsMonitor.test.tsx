/**
 * WebVitalsMonitor Component Tests
 * Golden Rules: AAA Pattern, Metric Reporting, Rating Calculation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { WebVitalsMonitor } from '../WebVitalsMonitor';

// Mock useWebVitals hook
vi.mock('@/shared/hooks/usePerformance', () => ({
  useWebVitals: vi.fn(),
}));

// Mock logger
vi.mock('@/shared/utils/logger', () => ({
  logger: {
    info: vi.fn(),
  },
}));

import { useWebVitals } from '@/shared/hooks/usePerformance';
import { logger } from '@/shared/utils/logger';

describe('WebVitalsMonitor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should return null (no visual output)', () => {
      // Arrange
      vi.mocked(useWebVitals).mockReturnValue({
        fcp: 1500,
        lcp: 2000,
        fid: 80,
        cls: 0.05,
        ttfb: 600,
      });

      // Act
      const { container } = render(<WebVitalsMonitor />);

      // Assert
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Metric Reporting', () => {
    it('should report all metrics when enabled', () => {
      // Arrange
      const onMetric = vi.fn();
      vi.mocked(useWebVitals).mockReturnValue({
        fcp: 1500,
        lcp: 2000,
        fid: 80,
        cls: 0.05,
        ttfb: 600,
      });

      // Act
      render(<WebVitalsMonitor enabled={true} onMetric={onMetric} />);

      // Assert
      expect(onMetric).toHaveBeenCalledTimes(5);
      expect(onMetric).toHaveBeenCalledWith({ name: 'FCP', value: 1500, rating: 'good' });
      expect(onMetric).toHaveBeenCalledWith({ name: 'LCP', value: 2000, rating: 'good' });
      expect(onMetric).toHaveBeenCalledWith({ name: 'FID', value: 80, rating: 'good' });
      expect(onMetric).toHaveBeenCalledWith({ name: 'CLS', value: 0.05, rating: 'good' });
      expect(onMetric).toHaveBeenCalledWith({ name: 'TTFB', value: 600, rating: 'good' });
    });

    it('should not report when disabled', () => {
      // Arrange
      const onMetric = vi.fn();
      vi.mocked(useWebVitals).mockReturnValue({
        fcp: 1500,
        lcp: 2000,
        fid: 80,
        cls: 0.05,
        ttfb: 600,
      });

      // Act
      render(<WebVitalsMonitor enabled={false} onMetric={onMetric} />);

      // Assert
      expect(onMetric).not.toHaveBeenCalled();
    });

    it('should skip undefined metrics', () => {
      // Arrange
      const onMetric = vi.fn();
      vi.mocked(useWebVitals).mockReturnValue({
        fcp: 1500,
        lcp: undefined,
        fid: undefined,
        cls: 0.05,
        ttfb: 600,
      });

      // Act
      render(<WebVitalsMonitor enabled={true} onMetric={onMetric} />);

      // Assert
      expect(onMetric).toHaveBeenCalledTimes(3); // Only FCP, CLS, TTFB
    });
  });

  describe('Rating Calculation - FCP', () => {
    it('should rate FCP as good (<= 1800ms)', () => {
      // Arrange
      const onMetric = vi.fn();
      vi.mocked(useWebVitals).mockReturnValue({
        fcp: 1500,
        lcp: undefined,
        fid: undefined,
        cls: undefined,
        ttfb: undefined,
      });

      // Act
      render(<WebVitalsMonitor enabled={true} onMetric={onMetric} />);

      // Assert
      expect(onMetric).toHaveBeenCalledWith({ name: 'FCP', value: 1500, rating: 'good' });
    });

    it('should rate FCP as needs-improvement (1800-3000ms)', () => {
      // Arrange
      const onMetric = vi.fn();
      vi.mocked(useWebVitals).mockReturnValue({
        fcp: 2500,
        lcp: undefined,
        fid: undefined,
        cls: undefined,
        ttfb: undefined,
      });

      // Act
      render(<WebVitalsMonitor enabled={true} onMetric={onMetric} />);

      // Assert
      expect(onMetric).toHaveBeenCalledWith({ name: 'FCP', value: 2500, rating: 'needs-improvement' });
    });

    it('should rate FCP as poor (> 3000ms)', () => {
      // Arrange
      const onMetric = vi.fn();
      vi.mocked(useWebVitals).mockReturnValue({
        fcp: 3500,
        lcp: undefined,
        fid: undefined,
        cls: undefined,
        ttfb: undefined,
      });

      // Act
      render(<WebVitalsMonitor enabled={true} onMetric={onMetric} />);

      // Assert
      expect(onMetric).toHaveBeenCalledWith({ name: 'FCP', value: 3500, rating: 'poor' });
    });
  });

  describe('Rating Calculation - LCP', () => {
    it('should rate LCP as good (<= 2500ms)', () => {
      // Arrange
      const onMetric = vi.fn();
      vi.mocked(useWebVitals).mockReturnValue({
        fcp: undefined,
        lcp: 2000,
        fid: undefined,
        cls: undefined,
        ttfb: undefined,
      });

      // Act
      render(<WebVitalsMonitor enabled={true} onMetric={onMetric} />);

      // Assert
      expect(onMetric).toHaveBeenCalledWith({ name: 'LCP', value: 2000, rating: 'good' });
    });

    it('should rate LCP as needs-improvement (2500-4000ms)', () => {
      // Arrange
      const onMetric = vi.fn();
      vi.mocked(useWebVitals).mockReturnValue({
        fcp: undefined,
        lcp: 3500,
        fid: undefined,
        cls: undefined,
        ttfb: undefined,
      });

      // Act
      render(<WebVitalsMonitor enabled={true} onMetric={onMetric} />);

      // Assert
      expect(onMetric).toHaveBeenCalledWith({ name: 'LCP', value: 3500, rating: 'needs-improvement' });
    });

    it('should rate LCP as poor (> 4000ms)', () => {
      // Arrange
      const onMetric = vi.fn();
      vi.mocked(useWebVitals).mockReturnValue({
        fcp: undefined,
        lcp: 5000,
        fid: undefined,
        cls: undefined,
        ttfb: undefined,
      });

      // Act
      render(<WebVitalsMonitor enabled={true} onMetric={onMetric} />);

      // Assert
      expect(onMetric).toHaveBeenCalledWith({ name: 'LCP', value: 5000, rating: 'poor' });
    });
  });

  describe('Rating Calculation - FID', () => {
    it('should rate FID as good (<= 100ms)', () => {
      // Arrange
      const onMetric = vi.fn();
      vi.mocked(useWebVitals).mockReturnValue({
        fcp: undefined,
        lcp: undefined,
        fid: 80,
        cls: undefined,
        ttfb: undefined,
      });

      // Act
      render(<WebVitalsMonitor enabled={true} onMetric={onMetric} />);

      // Assert
      expect(onMetric).toHaveBeenCalledWith({ name: 'FID', value: 80, rating: 'good' });
    });

    it('should rate FID as needs-improvement (100-300ms)', () => {
      // Arrange
      const onMetric = vi.fn();
      vi.mocked(useWebVitals).mockReturnValue({
        fcp: undefined,
        lcp: undefined,
        fid: 200,
        cls: undefined,
        ttfb: undefined,
      });

      // Act
      render(<WebVitalsMonitor enabled={true} onMetric={onMetric} />);

      // Assert
      expect(onMetric).toHaveBeenCalledWith({ name: 'FID', value: 200, rating: 'needs-improvement' });
    });

    it('should rate FID as poor (> 300ms)', () => {
      // Arrange
      const onMetric = vi.fn();
      vi.mocked(useWebVitals).mockReturnValue({
        fcp: undefined,
        lcp: undefined,
        fid: 400,
        cls: undefined,
        ttfb: undefined,
      });

      // Act
      render(<WebVitalsMonitor enabled={true} onMetric={onMetric} />);

      // Assert
      expect(onMetric).toHaveBeenCalledWith({ name: 'FID', value: 400, rating: 'poor' });
    });
  });

  describe('Rating Calculation - CLS', () => {
    it('should rate CLS as good (<= 0.1)', () => {
      // Arrange
      const onMetric = vi.fn();
      vi.mocked(useWebVitals).mockReturnValue({
        fcp: undefined,
        lcp: undefined,
        fid: undefined,
        cls: 0.05,
        ttfb: undefined,
      });

      // Act
      render(<WebVitalsMonitor enabled={true} onMetric={onMetric} />);

      // Assert
      expect(onMetric).toHaveBeenCalledWith({ name: 'CLS', value: 0.05, rating: 'good' });
    });

    it('should rate CLS as needs-improvement (0.1-0.25)', () => {
      // Arrange
      const onMetric = vi.fn();
      vi.mocked(useWebVitals).mockReturnValue({
        fcp: undefined,
        lcp: undefined,
        fid: undefined,
        cls: 0.15,
        ttfb: undefined,
      });

      // Act
      render(<WebVitalsMonitor enabled={true} onMetric={onMetric} />);

      // Assert
      expect(onMetric).toHaveBeenCalledWith({ name: 'CLS', value: 0.15, rating: 'needs-improvement' });
    });

    it('should rate CLS as poor (> 0.25)', () => {
      // Arrange
      const onMetric = vi.fn();
      vi.mocked(useWebVitals).mockReturnValue({
        fcp: undefined,
        lcp: undefined,
        fid: undefined,
        cls: 0.35,
        ttfb: undefined,
      });

      // Act
      render(<WebVitalsMonitor enabled={true} onMetric={onMetric} />);

      // Assert
      expect(onMetric).toHaveBeenCalledWith({ name: 'CLS', value: 0.35, rating: 'poor' });
    });
  });

  describe('Rating Calculation - TTFB', () => {
    it('should rate TTFB as good (<= 800ms)', () => {
      // Arrange
      const onMetric = vi.fn();
      vi.mocked(useWebVitals).mockReturnValue({
        fcp: undefined,
        lcp: undefined,
        fid: undefined,
        cls: undefined,
        ttfb: 600,
      });

      // Act
      render(<WebVitalsMonitor enabled={true} onMetric={onMetric} />);

      // Assert
      expect(onMetric).toHaveBeenCalledWith({ name: 'TTFB', value: 600, rating: 'good' });
    });

    it('should rate TTFB as needs-improvement (800-1800ms)', () => {
      // Arrange
      const onMetric = vi.fn();
      vi.mocked(useWebVitals).mockReturnValue({
        fcp: undefined,
        lcp: undefined,
        fid: undefined,
        cls: undefined,
        ttfb: 1200,
      });

      // Act
      render(<WebVitalsMonitor enabled={true} onMetric={onMetric} />);

      // Assert
      expect(onMetric).toHaveBeenCalledWith({ name: 'TTFB', value: 1200, rating: 'needs-improvement' });
    });

    it('should rate TTFB as poor (> 1800ms)', () => {
      // Arrange
      const onMetric = vi.fn();
      vi.mocked(useWebVitals).mockReturnValue({
        fcp: undefined,
        lcp: undefined,
        fid: undefined,
        cls: undefined,
        ttfb: 2500,
      });

      // Act
      render(<WebVitalsMonitor enabled={true} onMetric={onMetric} />);

      // Assert
      expect(onMetric).toHaveBeenCalledWith({ name: 'TTFB', value: 2500, rating: 'poor' });
    });
  });

  describe('Logging', () => {
    it('should log metrics', () => {
      // Arrange
      vi.mocked(useWebVitals).mockReturnValue({
        fcp: 1500,
        lcp: undefined,
        fid: undefined,
        cls: undefined,
        ttfb: undefined,
      });

      // Act
      render(<WebVitalsMonitor enabled={true} />);

      // Assert
      expect(logger.info).toHaveBeenCalledWith(
        'Web Vital: FCP',
        expect.any(Error)
      );
    });
  });
});

