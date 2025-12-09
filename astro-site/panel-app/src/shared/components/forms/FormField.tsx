 

/**
 * Form Field Component
 * 
 * Reusable form field with built-in error handling
 * Works seamlessly with React Hook Form
 */

import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { getSecurityAttributes } from '@/shared/utils/security/formSecurity';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  icon?: React.ReactNode;
  helpText?: string;
  showPasswordToggle?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  register,
  error,
  icon,
  helpText,
  showPasswordToggle = false,
  type = 'text',
  ...inputProps
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  
  const inputType = showPasswordToggle && type === 'password'
    ? (showPassword ? 'text' : 'password')
    : type;

  // Auto-generate security attributes based on field type and name
  const securityAttrs = getSecurityAttributes(type, name, {
    // Allow overriding via inputProps
    autocomplete: inputProps.autoComplete,
    inputMode: inputProps.inputMode,
  });

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {inputProps.required && (
          <span className="text-red-500 ml-1" aria-label="required">*</span>
        )}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          id={name}
          type={inputType}
          {...register(name)}
          {...inputProps}
          autoComplete={inputProps.autoComplete || securityAttrs.autocomplete}
          inputMode={(inputProps.inputMode || securityAttrs.inputMode) as React.HTMLAttributes<HTMLInputElement>['inputMode']}
          spellCheck={inputProps.spellCheck !== undefined ? inputProps.spellCheck : securityAttrs.spellcheck}
          autoCapitalize={(inputProps.autoCapitalize || securityAttrs.autoCapitalize) as React.HTMLAttributes<HTMLInputElement>['autoCapitalize']}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : helpText ? `${name}-help` : undefined}
          className={`
            w-full ${icon ? 'pl-10' : 'pl-4'} ${showPasswordToggle ? 'pr-10' : 'pr-4'} py-3
            bg-gray-50 dark:bg-slate-900/50
            border ${error ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'}
            rounded-lg
            text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            ${inputProps.className || ''}
          `}
        />
        
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      
      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="text-sm text-red-600 dark:text-red-400 flex items-start gap-1"
        >
          <span className="mt-0.5">⚠️</span>
          <span>{error.message}</span>
        </p>
      )}
      
      {helpText && !error && (
        <p
          id={`${name}-help`}
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          {helpText}
        </p>
      )}
    </div>
  );
};

/**
 * Checkbox Field Component
 */
interface CheckboxFieldProps {
  label: string | React.ReactNode;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  helpText?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  name,
  register,
  error,
  helpText,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-start">
        <input
          id={name}
          type="checkbox"
          {...register(name)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : helpText ? `${name}-help` : undefined}
          className="w-4 h-4 mt-1 text-blue-600 bg-gray-100 dark:bg-slate-900 border-gray-300 dark:border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
        />
        <label
          htmlFor={name}
          className="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
        >
          {label}
        </label>
      </div>
      
      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="text-sm text-red-600 dark:text-red-400 ml-7"
        >
          ⚠️ {error.message}
        </p>
      )}
      
      {helpText && !error && (
        <p
          id={`${name}-help`}
          className="text-sm text-gray-500 dark:text-gray-400 ml-7"
        >
          {helpText}
        </p>
      )}
    </div>
  );
};

/**
 * Textarea Field Component
 */
interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  helpText?: string;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  name,
  register,
  error,
  helpText,
  ...textareaProps
}) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {textareaProps.required && (
          <span className="text-red-500 ml-1" aria-label="required">*</span>
        )}
      </label>
      
      <textarea
        id={name}
        {...register(name)}
        {...textareaProps}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : helpText ? `${name}-help` : undefined}
        className={`
          w-full px-4 py-3
          bg-gray-50 dark:bg-slate-900/50
          border ${error ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'}
          rounded-lg
          text-gray-900 dark:text-white
          placeholder-gray-500 dark:placeholder-gray-400
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all
          disabled:opacity-50 disabled:cursor-not-allowed
          resize-y
          ${textareaProps.className || ''}
        `}
      />
      
      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="text-sm text-red-600 dark:text-red-400"
        >
          ⚠️ {error.message}
        </p>
      )}
      
      {helpText && !error && (
        <p
          id={`${name}-help`}
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          {helpText}
        </p>
      )}
    </div>
  );
};

