 

/**
 * Reusable Form Field Component
 * Generic field component with error handling
 */
import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'url';
  placeholder?: string;
  required?: boolean;
  error?: FieldError;
  register: UseFormRegister<any>;
  className?: string;
  helpText?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  error,
  register,
  className = '',
  helpText,
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        {...register(name)}
        className={`w-full px-4 py-2.5 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors`}
        placeholder={placeholder}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
          <span>⚠️</span> {error.message}
        </p>
      )}
      {helpText && !error && (
        <p className="mt-1.5 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default FormField;

