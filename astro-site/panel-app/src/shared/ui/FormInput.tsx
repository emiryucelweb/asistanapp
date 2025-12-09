/**
 * Form Input Component with Validation Feedback
 */
import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  success,
  helperText,
  icon,
  required,
  className = '',
  ...props
}) => {
  const hasError = !!error;
  const hasSuccess = !!success;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          {...props}
          className={`
            w-full px-4 py-2.5 rounded-lg
            border transition-all duration-200
            bg-white dark:bg-slate-900
            text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            focus:outline-none focus:ring-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${hasError 
              ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20' 
              : hasSuccess
              ? 'border-green-300 dark:border-green-600 focus:border-green-500 focus:ring-green-500/20'
              : 'border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20'
            }
            ${className}
          `}
        />
        
        {(hasError || hasSuccess) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {hasError ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </div>
        )}
      </div>
      
      {(error || success || helperText) && (
        <div className="mt-1.5 flex items-start gap-1">
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {success}
            </p>
          )}
          {!error && !success && helperText && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  required?: boolean;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  error,
  success,
  helperText,
  required,
  className = '',
  ...props
}) => {
  const hasError = !!error;
  const hasSuccess = !!success;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        {...props}
        className={`
          w-full px-4 py-2.5 rounded-lg
          border transition-all duration-200
          bg-white dark:bg-slate-900
          text-gray-900 dark:text-gray-100
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          focus:outline-none focus:ring-2
          disabled:opacity-50 disabled:cursor-not-allowed
          resize-none
          ${hasError 
            ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20' 
            : hasSuccess
            ? 'border-green-300 dark:border-green-600 focus:border-green-500 focus:ring-green-500/20'
            : 'border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20'
          }
          ${className}
        `}
      />
      
      {(error || success || helperText) && (
        <div className="mt-1.5 flex items-start gap-1">
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {success}
            </p>
          )}
          {!error && !success && helperText && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  required?: boolean;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  error,
  success,
  helperText,
  required,
  className = '',
  children,
  ...props
}) => {
  const hasError = !!error;
  const hasSuccess = !!success;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        {...props}
        className={`
          w-full px-4 py-2.5 rounded-lg
          border transition-all duration-200
          bg-white dark:bg-slate-900
          text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${hasError 
            ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20' 
            : hasSuccess
            ? 'border-green-300 dark:border-green-600 focus:border-green-500 focus:ring-green-500/20'
            : 'border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20'
          }
          ${className}
        `}
      >
        {children}
      </select>
      
      {(error || success || helperText) && (
        <div className="mt-1.5 flex items-start gap-1">
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {success}
            </p>
          )}
          {!error && !success && helperText && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

