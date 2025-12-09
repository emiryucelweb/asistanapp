/**
 * Toast Notification Utilities
 * Professional toast notifications for user feedback
 */
import toast, { Toast } from 'react-hot-toast';
import React from 'react';
import i18n from '@/shared/i18n/config';

// Toast configuration
const toastConfig = {
  duration: 4000,
  position: 'top-right' as const,
  style: {
    borderRadius: '12px',
    padding: '16px',
    fontSize: '14px',
  },
};

// Success toast
export const showSuccess = (message: string, duration?: number) => {
  return toast.success(message, {
    ...toastConfig,
    duration: duration || toastConfig.duration,
    icon: '✅',
    style: {
      ...toastConfig.style,
      background: '#10b981',
      color: '#fff',
    },
  });
};

// Error toast
export const showError = (message: string, duration?: number) => {
  return toast.error(message, {
    ...toastConfig,
    duration: duration || toastConfig.duration,
    icon: '❌',
    style: {
      ...toastConfig.style,
      background: '#ef4444',
      color: '#fff',
    },
  });
};

// Warning toast
export const showWarning = (message: string, duration?: number) => {
  return toast(message, {
    ...toastConfig,
    duration: duration || toastConfig.duration,
    icon: '⚠️',
    style: {
      ...toastConfig.style,
      background: '#f59e0b',
      color: '#fff',
    },
  });
};

// Info toast
export const showInfo = (message: string, duration?: number) => {
  return toast(message, {
    ...toastConfig,
    duration: duration || toastConfig.duration,
    icon: 'ℹ️',
    style: {
      ...toastConfig.style,
      background: '#3b82f6',
      color: '#fff',
    },
  });
};

// Loading toast
export const showLoading = (message: string) => {
  return toast.loading(message, {
    ...toastConfig,
    style: {
      ...toastConfig.style,
      background: '#6366f1',
      color: '#fff',
    },
  });
};

// Promise toast (for async operations)
export const showPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    },
    {
      ...toastConfig,
      style: toastConfig.style,
    }
  );
};

// Dismiss toast
export const dismissToast = (toastId?: string) => {
  if (toastId) {
    toast.dismiss(toastId);
  } else {
    toast.dismiss();
  }
};

// Custom toast with action button
export const showCustomToast = (
  message: string,
  action?: {
    label: string;
    onClick: () => void;
  }
) => {
  return toast(
    (t: Toast) =>
      React.createElement(
        'div',
        { className: 'flex items-center gap-3' },
        React.createElement('span', null, message),
        action &&
          React.createElement(
            'button',
            {
              onClick: () => {
                action.onClick();
                toast.dismiss(t.id);
              },
              className:
                'px-3 py-1 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors',
            },
            action.label
          )
      ),
    {
      ...toastConfig,
      style: {
        ...toastConfig.style,
        background: '#1f2937',
        color: '#fff',
      },
    }
  );
};

// Confirmation toast (replacement for window.confirm)
export const showConfirmToast = (
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  return toast(
    (t: Toast) =>
      React.createElement(
        'div',
        { className: 'flex flex-col gap-3' },
        React.createElement('p', { className: 'font-medium' }, message),
        React.createElement(
          'div',
          { className: 'flex gap-2' },
          React.createElement(
            'button',
            {
              onClick: () => {
                onConfirm();
                toast.dismiss(t.id);
              },
              className:
                'flex-1 px-3 py-1.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors',
            },
            i18n.t('common:confirm')
          ),
          React.createElement(
            'button',
            {
              onClick: () => {
                onCancel?.();
                toast.dismiss(t.id);
              },
              className:
                'flex-1 px-3 py-1.5 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors',
            },
            i18n.t('common:cancel')
          )
        )
      ),
    {
      ...toastConfig,
      duration: Infinity, // Don't auto-dismiss
      style: {
        ...toastConfig.style,
        background: '#fff',
        color: '#000',
        minWidth: '300px',
      },
    }
  );
};

