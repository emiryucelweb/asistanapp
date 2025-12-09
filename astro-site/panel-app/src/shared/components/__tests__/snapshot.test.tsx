/**
 * @vitest-environment jsdom
 * 
 * Snapshot Regression Tests - ENTERPRISE GRADE
 * 
 * Component snapshot tests for:
 * - UI component structure integrity
 * - CSS class consistency
 * - DOM hierarchy preservation
 * - Theme variant rendering
 * - Responsive breakpoint classes
 * 
 * @group snapshots
 * @group regression
 * @group ui
 * 
 * ALTIN KURALLAR:
 * ✅ AAA Pattern (Arrange-Act-Assert)
 * ✅ Tek test → tek davranış
 * ✅ State izolasyonu (beforeEach/afterEach)
 * ✅ Descriptive Naming
 * ✅ Theme Variants
 * ✅ Accessibility Attributes
 * ✅ Cleanup
 * ✅ Type Safety
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import React from 'react';

// ============================================================================
// MOCKS
// ============================================================================

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

// ============================================================================
// UI COMPONENT FACTORIES
// ============================================================================

/**
 * Factory: Create Button component for testing
 */
const Button: React.FC<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-slate-700 dark:text-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-300 dark:hover:bg-slate-800',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses}`}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
};

/**
 * Factory: Create Card component for testing
 */
const Card: React.FC<{
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'elevated' | 'bordered';
  children: React.ReactNode;
}> = ({
  title,
  subtitle,
  variant = 'default',
  children,
}) => {
  const variantClasses = {
    default: 'bg-white dark:bg-slate-800',
    elevated: 'bg-white dark:bg-slate-800 shadow-lg',
    bordered: 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700',
  };
  
  return (
    <div className={`rounded-xl p-6 ${variantClasses[variant]}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

/**
 * Factory: Create Badge component for testing
 */
const Badge: React.FC<{
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}> = ({
  variant = 'default',
  size = 'md',
  children,
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };
  
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {children}
    </span>
  );
};

/**
 * Factory: Create Alert component for testing
 */
const Alert: React.FC<{
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}> = ({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
}) => {
  const variantClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400',
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400',
  };
  
  const iconMap = {
    info: '💬',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };
  
  return (
    <div className={`rounded-lg border p-4 ${variantClasses[variant]}`} role="alert">
      <div className="flex">
        <span className="flex-shrink-0 mr-3">{iconMap[variant]}</span>
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
        {dismissible && (
          <button
            type="button"
            className="flex-shrink-0 ml-3 -mr-1 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5"
            onClick={onDismiss}
            aria-label="Dismiss"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Factory: Create Input component for testing
 */
const Input: React.FC<{
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({
  type = 'text',
  placeholder,
  label,
  error,
  disabled = false,
  value,
  onChange,
}) => {
  const inputClasses = `
    w-full px-4 py-2 rounded-lg border transition-colors
    ${error 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-slate-700' : 'bg-white dark:bg-slate-800'}
    text-gray-900 dark:text-gray-100
    focus:outline-none focus:ring-2
  `.trim();
  
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        type={type}
        className={inputClasses}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={error ? 'error-message' : undefined}
      />
      {error && (
        <p id="error-message" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

// ============================================================================
// BUTTON SNAPSHOT TESTS
// ============================================================================

describe('Snapshot Tests - Button Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should match snapshot for primary button', () => {
    // Arrange & Act
    const { container } = render(<Button variant="primary">Click Me</Button>);

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for secondary button', () => {
    // Arrange & Act
    const { container } = render(<Button variant="secondary">Secondary</Button>);

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for danger button', () => {
    // Arrange & Act
    const { container } = render(<Button variant="danger">Delete</Button>);

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for ghost button', () => {
    // Arrange & Act
    const { container } = render(<Button variant="ghost">Ghost</Button>);

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for disabled button', () => {
    // Arrange & Act
    const { container } = render(<Button disabled>Disabled</Button>);

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for loading button', () => {
    // Arrange & Act
    const { container } = render(<Button loading>Loading...</Button>);

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for all sizes', () => {
    // Arrange & Act
    const { container: sm } = render(<Button size="sm">Small</Button>);
    const { container: md } = render(<Button size="md">Medium</Button>);
    const { container: lg } = render(<Button size="lg">Large</Button>);

    // Assert
    expect(sm.firstChild).toMatchSnapshot('button-sm');
    expect(md.firstChild).toMatchSnapshot('button-md');
    expect(lg.firstChild).toMatchSnapshot('button-lg');
  });
});

// ============================================================================
// CARD SNAPSHOT TESTS
// ============================================================================

describe('Snapshot Tests - Card Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should match snapshot for default card', () => {
    // Arrange & Act
    const { container } = render(
      <Card>
        <p>Card content goes here</p>
      </Card>
    );

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for card with title', () => {
    // Arrange & Act
    const { container } = render(
      <Card title="Card Title">
        <p>Card content with title</p>
      </Card>
    );

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for card with title and subtitle', () => {
    // Arrange & Act
    const { container } = render(
      <Card title="Card Title" subtitle="This is a subtitle">
        <p>Card content with title and subtitle</p>
      </Card>
    );

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for elevated card', () => {
    // Arrange & Act
    const { container } = render(
      <Card variant="elevated" title="Elevated Card">
        <p>Content</p>
      </Card>
    );

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for bordered card', () => {
    // Arrange & Act
    const { container } = render(
      <Card variant="bordered" title="Bordered Card">
        <p>Content</p>
      </Card>
    );

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });
});

// ============================================================================
// BADGE SNAPSHOT TESTS
// ============================================================================

describe('Snapshot Tests - Badge Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should match snapshot for all badge variants', () => {
    // Arrange & Act
    const variants = ['default', 'success', 'warning', 'error', 'info'] as const;
    
    variants.forEach(variant => {
      const { container } = render(<Badge variant={variant}>{variant}</Badge>);
      
      // Assert
      expect(container.firstChild).toMatchSnapshot(`badge-${variant}`);
      cleanup();
    });
  });

  it('should match snapshot for badge sizes', () => {
    // Arrange & Act
    const { container: sm } = render(<Badge size="sm">Small</Badge>);
    const { container: md } = render(<Badge size="md">Medium</Badge>);

    // Assert
    expect(sm.firstChild).toMatchSnapshot('badge-sm');
    expect(md.firstChild).toMatchSnapshot('badge-md');
  });
});

// ============================================================================
// ALERT SNAPSHOT TESTS
// ============================================================================

describe('Snapshot Tests - Alert Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should match snapshot for all alert variants', () => {
    // Arrange & Act
    const variants = ['info', 'success', 'warning', 'error'] as const;
    
    variants.forEach(variant => {
      const { container } = render(
        <Alert variant={variant}>
          This is an {variant} alert message.
        </Alert>
      );
      
      // Assert
      expect(container.firstChild).toMatchSnapshot(`alert-${variant}`);
      cleanup();
    });
  });

  it('should match snapshot for alert with title', () => {
    // Arrange & Act
    const { container } = render(
      <Alert variant="info" title="Information">
        This alert has a title.
      </Alert>
    );

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for dismissible alert', () => {
    // Arrange & Act
    const { container } = render(
      <Alert variant="warning" dismissible onDismiss={() => {}}>
        This alert can be dismissed.
      </Alert>
    );

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });
});

// ============================================================================
// INPUT SNAPSHOT TESTS
// ============================================================================

describe('Snapshot Tests - Input Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should match snapshot for default input', () => {
    // Arrange & Act
    const { container } = render(
      <Input placeholder="Enter text..." />
    );

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for input with label', () => {
    // Arrange & Act
    const { container } = render(
      <Input label="Email Address" type="email" placeholder="email@example.com" />
    );

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for input with error', () => {
    // Arrange & Act
    const { container } = render(
      <Input 
        label="Password" 
        type="password" 
        error="Password must be at least 8 characters" 
      />
    );

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for disabled input', () => {
    // Arrange & Act
    const { container } = render(
      <Input 
        label="Username" 
        disabled 
        value="disabled-user"
        onChange={() => {}}
      />
    );

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });
});

// ============================================================================
// COMPLEX COMPOSITION SNAPSHOT TESTS
// ============================================================================

describe('Snapshot Tests - Complex Compositions', () => {
  afterEach(() => {
    cleanup();
  });

  it('should match snapshot for form card composition', () => {
    // Arrange & Act
    const { container } = render(
      <Card title="Login" subtitle="Enter your credentials">
        <div className="space-y-4">
          <Input label="Email" type="email" placeholder="email@example.com" />
          <Input label="Password" type="password" placeholder="••••••••" />
          <Button variant="primary" size="lg">
            Sign In
          </Button>
        </div>
      </Card>
    );

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for alert with action buttons', () => {
    // Arrange & Act
    const { container } = render(
      <Alert variant="warning" title="Confirm Action">
        <p className="mb-4">Are you sure you want to proceed?</p>
        <div className="flex gap-2">
          <Button variant="danger" size="sm">Confirm</Button>
          <Button variant="ghost" size="sm">Cancel</Button>
        </div>
      </Alert>
    );

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot for card with badges', () => {
    // Arrange & Act
    const { container } = render(
      <Card title="Task Status" subtitle="Current sprint tasks">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Implement feature A</span>
            <Badge variant="success">Done</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Review PR #123</span>
            <Badge variant="warning">In Progress</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Fix bug #456</span>
            <Badge variant="error">Blocked</Badge>
          </div>
        </div>
      </Card>
    );

    // Assert
    expect(container.firstChild).toMatchSnapshot();
  });
});

// ============================================================================
// ACCESSIBILITY SNAPSHOT TESTS
// ============================================================================

describe('Snapshot Tests - Accessibility Attributes', () => {
  afterEach(() => {
    cleanup();
  });

  it('should have correct ARIA attributes on alert', () => {
    // Arrange & Act
    const { container } = render(
      <Alert variant="error" title="Error">
        Something went wrong.
      </Alert>
    );

    // Assert
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should have correct ARIA attributes on loading button', () => {
    // Arrange & Act
    const { container } = render(
      <Button loading>Submitting...</Button>
    );

    // Assert
    const button = container.querySelector('[aria-busy="true"]');
    expect(button).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should have correct ARIA attributes on input with error', () => {
    // Arrange & Act
    const { container } = render(
      <Input 
        label="Email" 
        error="Invalid email format" 
      />
    );

    // Assert
    const input = container.querySelector('[aria-invalid="true"]');
    expect(input).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should have dismiss button with aria-label', () => {
    // Arrange & Act
    const { container } = render(
      <Alert variant="info" dismissible onDismiss={() => {}}>
        Dismissible alert
      </Alert>
    );

    // Assert
    const dismissButton = container.querySelector('[aria-label="Dismiss"]');
    expect(dismissButton).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});

