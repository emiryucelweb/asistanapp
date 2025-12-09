/**
 * Toast Utilities Tests
 * Enterprise-grade tests for toast notification system
 * 
 * @group utils
 * @group ui
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import toast from 'react-hot-toast';
import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showLoading,
  showPromise,
  dismissToast,
  showCustomToast,
  showConfirmToast,
} from '../toast';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn((msg, config) => `success-${msg}`),
    error: vi.fn((msg, config) => `error-${msg}`),
    loading: vi.fn((msg, config) => `loading-${msg}`),
    promise: vi.fn((promise, messages, config) => `promise-toast`),
    dismiss: vi.fn(),
    __esModule: true,
  },
}));

// Mock React.createElement for custom toasts
vi.mock('react', () => ({
  default: {
    createElement: vi.fn((type, props, ...children) => ({
      type,
      props,
      children,
    })),
  },
  createElement: vi.fn((type, props, ...children) => ({
    type,
    props,
    children,
  })),
}));

describe('Toast Utilities - Enterprise Grade Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Success Toast', () => {
    it('should show success toast with default duration', () => {
      const result = showSuccess('Operation successful');
      
      expect(toast.success).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        'Operation successful',
        expect.objectContaining({
          duration: 4000,
          icon: '✅',
          position: 'top-right',
          style: expect.objectContaining({
            background: '#10b981',
            color: '#fff',
          }),
        })
      );
      expect(result).toBe('success-Operation successful');
    });

    it('should show success toast with custom duration', () => {
      showSuccess('Custom duration success', 6000);
      
      expect(toast.success).toHaveBeenCalledWith(
        'Custom duration success',
        expect.objectContaining({
          duration: 6000,
        })
      );
    });
  });

  describe('Error Toast', () => {
    it('should show error toast with default duration', () => {
      const result = showError('An error occurred');
      
      expect(toast.error).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        'An error occurred',
        expect.objectContaining({
          duration: 4000,
          icon: '❌',
          style: expect.objectContaining({
            background: '#ef4444',
            color: '#fff',
          }),
        })
      );
      expect(result).toBe('error-An error occurred');
    });

    it('should show error toast with custom duration', () => {
      showError('Critical error', 8000);
      
      expect(toast.error).toHaveBeenCalledWith(
        'Critical error',
        expect.objectContaining({
          duration: 8000,
        })
      );
    });
  });

  describe('Warning Toast', () => {
    it('should show warning toast with default duration', () => {
      // Warning uses toast() not toast.warning()
      const mockToast = vi.fn();
      (toast as any) = Object.assign(mockToast, toast);
      
      showWarning('Warning message');
      
      expect(mockToast).toHaveBeenCalledWith(
        'Warning message',
        expect.objectContaining({
          duration: 4000,
          icon: '⚠️',
          style: expect.objectContaining({
            background: '#f59e0b',
            color: '#fff',
          }),
        })
      );
    });

    it('should show warning toast with custom duration', () => {
      const mockToast = vi.fn();
      (toast as any) = Object.assign(mockToast, toast);
      
      showWarning('Custom warning', 5000);
      
      expect(mockToast).toHaveBeenCalledWith(
        'Custom warning',
        expect.objectContaining({
          duration: 5000,
        })
      );
    });
  });

  describe('Info Toast', () => {
    it('should show info toast with default duration', () => {
      const mockToast = vi.fn();
      (toast as any) = Object.assign(mockToast, toast);
      
      showInfo('Information message');
      
      expect(mockToast).toHaveBeenCalledWith(
        'Information message',
        expect.objectContaining({
          duration: 4000,
          icon: 'ℹ️',
          style: expect.objectContaining({
            background: '#3b82f6',
            color: '#fff',
          }),
        })
      );
    });

    it('should show info toast with custom duration', () => {
      const mockToast = vi.fn();
      (toast as any) = Object.assign(mockToast, toast);
      
      showInfo('Important info', 7000);
      
      expect(mockToast).toHaveBeenCalledWith(
        'Important info',
        expect.objectContaining({
          duration: 7000,
        })
      );
    });
  });

  describe('Loading Toast', () => {
    it('should show loading toast', () => {
      const result = showLoading('Loading data...');
      
      expect(toast.loading).toHaveBeenCalled();
      expect(toast.loading).toHaveBeenCalledWith(
        'Loading data...',
        expect.objectContaining({
          style: expect.objectContaining({
            background: '#6366f1',
            color: '#fff',
          }),
        })
      );
      expect(result).toBe('loading-Loading data...');
    });
  });

  describe('Promise Toast', () => {
    it('should show promise toast for async operation', async () => {
      const promise = Promise.resolve('success');
      const messages = {
        loading: 'Saving...',
        success: 'Saved successfully!',
        error: 'Save failed',
      };

      const result = showPromise(promise, messages);

      expect(toast.promise).toHaveBeenCalledWith(
        promise,
        messages,
        expect.objectContaining({
          position: 'top-right',
          duration: 4000,
        })
      );
      expect(result).toBe('promise-toast');
    });

    it('should handle promise rejection', async () => {
      const promise = Promise.reject(new Error('Failed'));
      const messages = {
        loading: 'Processing...',
        success: 'Done!',
        error: 'Failed!',
      };

      showPromise(promise, messages);

      expect(toast.promise).toHaveBeenCalledWith(
        promise,
        messages,
        expect.any(Object)
      );

      // Catch the rejection to prevent unhandled promise rejection
      await promise.catch(() => {});
    });
  });

  describe('Dismiss Toast', () => {
    it('should dismiss specific toast by ID', () => {
      dismissToast('toast-123');
      
      expect(toast.dismiss).toHaveBeenCalledWith('toast-123');
    });

    it('should dismiss all toasts when no ID provided', () => {
      dismissToast();
      
      expect(toast.dismiss).toHaveBeenCalledWith();
    });
  });

  describe('Custom Toast with Action', () => {
    it('should create custom toast with action button', () => {
      const mockAction = vi.fn();
      const mockToast = vi.fn();
      (toast as any) = Object.assign(mockToast, toast);

      showCustomToast('Custom message', {
        label: 'Undo',
        onClick: mockAction,
      });

      expect(mockToast).toHaveBeenCalled();
      const callArgs = mockToast.mock.calls[0];
      expect(callArgs[1]).toMatchObject({
        position: 'top-right',
        style: expect.objectContaining({
          background: '#1f2937',
          color: '#fff',
        }),
      });
    });

    it('should create custom toast without action button', () => {
      const mockToast = vi.fn();
      (toast as any) = Object.assign(mockToast, toast);

      showCustomToast('Simple custom message');

      expect(mockToast).toHaveBeenCalled();
    });
  });

  describe('Confirm Toast', () => {
    it('should create confirmation toast with confirm and cancel buttons', () => {
      const mockOnConfirm = vi.fn();
      const mockOnCancel = vi.fn();
      const mockToast = vi.fn();
      (toast as any) = Object.assign(mockToast, toast);

      showConfirmToast('Are you sure?', mockOnConfirm, mockOnCancel);

      expect(mockToast).toHaveBeenCalled();
      const callArgs = mockToast.mock.calls[0];
      expect(callArgs[1]).toMatchObject({
        duration: Infinity,
        style: expect.objectContaining({
          background: '#fff',
          color: '#000',
          minWidth: '300px',
        }),
      });
    });

    it('should create confirmation toast without cancel callback', () => {
      const mockOnConfirm = vi.fn();
      const mockToast = vi.fn();
      (toast as any) = Object.assign(mockToast, toast);

      showConfirmToast('Confirm action?', mockOnConfirm);

      expect(mockToast).toHaveBeenCalled();
    });
  });

  describe('Toast Configuration', () => {
    it('should use consistent configuration across all toast types', () => {
      showSuccess('Test');
      showError('Test');
      showLoading('Test');

      expect(toast.success).toHaveBeenCalledWith(
        'Test',
        expect.objectContaining({
          position: 'top-right',
          style: expect.objectContaining({
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
          }),
        })
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty messages', () => {
      showSuccess('');
      expect(toast.success).toHaveBeenCalledWith('', expect.any(Object));
    });

    it('should handle very long messages', () => {
      const longMessage = 'A'.repeat(500);
      showError(longMessage);
      expect(toast.error).toHaveBeenCalledWith(longMessage, expect.any(Object));
    });

    it('should handle zero duration (fallback to default)', () => {
      // Duration 0 is falsy, so it falls back to default 4000
      showSuccess('Quick toast', 0);
      expect(toast.success).toHaveBeenCalledWith(
        'Quick toast',
        expect.objectContaining({
          duration: 4000, // Fallback to default
        })
      );
    });

    it('should handle special characters in messages', () => {
      const specialMessage = 'Special <>&"\'';
      showInfo(specialMessage);
      expect(toast).toHaveBeenCalled();
    });
  });

  describe('Return Values', () => {
    it('should return toast ID from showSuccess', () => {
      const result = showSuccess('Success');
      expect(result).toBe('success-Success');
    });

    it('should return toast ID from showError', () => {
      const result = showError('Error');
      expect(result).toBe('error-Error');
    });

    it('should return toast ID from showLoading', () => {
      const result = showLoading('Loading');
      expect(result).toBe('loading-Loading');
    });

    it('should return toast ID from showPromise', () => {
      const promise = Promise.resolve();
      const result = showPromise(promise, {
        loading: 'L',
        success: 'S',
        error: 'E',
      });
      expect(result).toBe('promise-toast');
    });
  });
});

