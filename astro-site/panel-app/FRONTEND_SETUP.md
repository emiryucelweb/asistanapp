# 🚀 Frontend Setup & Developer Guide

**AsistanApp Panel - Frontend Development Guide**

This guide helps new developers get started with the frontend codebase quickly and efficiently.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Design System](#design-system)
5. [Testing Strategy](#testing-strategy)
6. [Performance Best Practices](#performance-best-practices)
7. [Common Patterns](#common-patterns)
8. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
```bash
- Node.js >= 18.x
- npm >= 9.x
- Git
```

### Installation
```bash
# Clone repository
git clone https://github.com/your-org/asistanapp.git
cd asistanapp

# Install dependencies
npm install

# Start development server
cd apps/panel
npm run dev
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Configure variables
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCK_API=true
VITE_ENABLE_TRACING=false
```

---

## 📁 Project Structure

```
apps/panel/
├── src/
│   ├── features/              # Feature-based modules
│   │   ├── admin/            # Admin panel features
│   │   ├── agent/            # Agent panel features
│   │   ├── super-admin/      # Super admin features
│   │   └── shared/           # Shared features
│   ├── shared/
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Utility functions
│   │   └── pages/            # Shared pages (login, help)
│   ├── services/
│   │   └── api/              # API service layer
│   ├── styles/               # Global styles & theme
│   │   ├── theme.ts          # Design system tokens
│   │   └── design-tokens.css # CSS variables
│   └── types/                # TypeScript type definitions
├── tests/
│   ├── e2e/                  # Playwright E2E tests
│   └── setup.ts              # Test configuration
├── .storybook/               # Storybook configuration
└── public/
    └── locales/              # i18n translation files
```

### Feature-based Architecture
Each feature follows this structure:
```
features/[panel]/[feature]/
├── components/               # UI components
├── hooks/                    # Feature-specific hooks
├── pages/                    # Page components
├── services/                 # Business logic
├── types/                    # TypeScript types
└── utils/                    # Utility functions
```

---

## 🛠 Development Workflow

### 1. Create a New Feature
```bash
# Create feature structure
mkdir -p src/features/admin/new-feature/{components,hooks,pages}

# Create component
touch src/features/admin/new-feature/components/NewFeature.tsx

# Create tests
touch src/features/admin/new-feature/components/__tests__/NewFeature.test.tsx

# Create Storybook story
touch src/features/admin/new-feature/components/NewFeature.stories.tsx
```

### 2. Component Development
```typescript
// src/features/admin/new-feature/components/NewFeature.tsx
import React from 'react';
import { theme } from '@/styles/theme';

interface NewFeatureProps {
  title: string;
  onAction: () => void;
}

export const NewFeature: React.FC<NewFeatureProps> = ({ title, onAction }) => {
  return (
    <div className={theme.components.card.base}>
      <h2>{title}</h2>
      <button onClick={onAction} className={theme.components.button.base}>
        Action
      </button>
    </div>
  );
};
```

### 3. Write Tests
```typescript
// __tests__/NewFeature.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NewFeature } from '../NewFeature';

describe('NewFeature', () => {
  it('should render title', () => {
    render(<NewFeature title="Test" onAction={vi.fn()} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### 4. Create Storybook Story
```typescript
// NewFeature.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { NewFeature } from './NewFeature';

const meta: Meta<typeof NewFeature> = {
  title: 'Admin/NewFeature',
  component: NewFeature,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Default Title',
    onAction: () => console.log('Action clicked'),
  },
};
```

---

## 🎨 Design System

### Using Theme Tokens
```typescript
import { theme } from '@/styles/theme';

// Colors
const primaryColor = theme.colors.primary[500];

// Spacing
const padding = theme.spacing[4]; // 1rem (16px)

// Typography
const fontSize = theme.typography.fontSize.base;

// Components
const buttonClass = `${theme.components.button.base} ${theme.components.button.variants.primary}`;
```

### Tailwind CSS with Theme
```typescript
// Use Tailwind classes that map to theme tokens
<div className="bg-primary-500 p-4 rounded-lg shadow-md">
  Content
</div>

// Or use theme object for dynamic styles
<div style={{ 
  backgroundColor: theme.colors.primary[500],
  padding: theme.spacing[4],
  borderRadius: theme.borderRadius.lg 
}}>
  Content
</div>
```

### Dark Mode
```typescript
// Dark mode classes are automatically applied
<div className="bg-white dark:bg-slate-800">
  Light background in light mode, dark in dark mode
</div>

// Check current theme
import { useTheme } from '@/contexts/ThemeContext';

const { theme, toggleTheme } = useTheme();
console.log(theme); // 'light' or 'dark'
```

---

## 🧪 Testing Strategy

### Unit Tests (Vitest + React Testing Library)
```bash
# Run all tests
npm test

# Run specific test file
npm test NewFeature.test.tsx

# Run with coverage
npm run test:coverage

# Run in watch mode
npm test -- --watch
```

### E2E Tests (Playwright)
```bash
# Run E2E tests
npm run test:e2e

# Run specific spec
npm run test:e2e user-flows.spec.ts

# Run with UI
npm run test:e2e -- --ui

# Debug mode
npm run test:e2e -- --debug
```

### Visual Regression (Storybook + Chromatic)
```bash
# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook

# Run Chromatic (requires token)
npm run chromatic
```

### Accessibility Tests (axe-core)
```bash
# Run accessibility audit
npm run test:a11y

# Run Lighthouse
npm run lighthouse
```

---

## ⚡ Performance Best Practices

### 1. Code Splitting & Lazy Loading
```typescript
// Lazy load routes
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('@/features/admin/pages/AdminDashboard'));

// Use in route
<Route path="/admin/dashboard" element={
  <Suspense fallback={<LoadingSpinner />}>
    <AdminDashboard />
  </Suspense>
} />
```

### 2. Memo & UseMemo
```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return complexCalculation(data);
}, [data]);

// Memoize components
const MemoizedComponent = React.memo(MyComponent);

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

### 3. React Query (Data Fetching)
```typescript
import { useQuery } from 'react-query';

const { data, isLoading, error } = useQuery('conversations', 
  () => conversationsApi.getAll(),
  {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  }
);
```

### 4. Bundle Size Optimization
```bash
# Analyze bundle
npm run build
npm run preview

# Check bundle size
du -sh dist/assets/*

# Use dynamic imports for large libraries
const Chart = await import('chart.js');
```

---

## 🔄 Common Patterns

### 1. Custom Hooks
```typescript
// useDebounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
const searchTerm = 'query';
const debouncedSearch = useDebounce(searchTerm, 300);
```

### 2. API Service Pattern
```typescript
// services/api/my-feature.api.ts
export const myFeatureApi = {
  async getAll() {
    const response = await apiClient.get('/my-feature');
    return response.data;
  },
  
  async getById(id: string) {
    const response = await apiClient.get(`/my-feature/${id}`);
    return response.data;
  },
  
  async create(data: MyFeature) {
    const response = await apiClient.post('/my-feature', data);
    return response.data;
  },
};
```

### 3. Modal Pattern
```typescript
const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <ModalHeader>Title</ModalHeader>
  <ModalBody>Content</ModalBody>
  <ModalFooter>
    <Button onClick={() => setIsOpen(false)}>Close</Button>
  </ModalFooter>
</Modal>
```

### 4. Form Handling
```typescript
import { useForm } from 'react-hook-form';

const { register, handleSubmit, formState: { errors } } = useForm();

const onSubmit = (data) => {
  console.log(data);
};

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('email', { required: true })} />
  {errors.email && <span>Email is required</span>}
  <button type="submit">Submit</button>
</form>
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. TypeScript Errors
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache

# Rebuild types
npm run type-check
```

#### 2. Vite Build Errors
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Rebuild
npm run build
```

#### 3. Test Failures
```bash
# Update snapshots
npm test -- -u

# Clear test cache
npm run test:coverage -- --clearCache
```

#### 4. Storybook Issues
```bash
# Clear Storybook cache
rm -rf node_modules/.cache/storybook

# Rebuild
npm run storybook
```

### Debug Tools

#### React DevTools
- Install browser extension
- Inspect component tree
- Profile performance

#### Vite DevTools
```bash
# Enable debug mode
DEBUG=vite:* npm run dev
```

#### Network Inspection
```typescript
// Enable API logging
import { logger } from '@/shared/utils/logger';

logger.debug('API call', { endpoint, method, data });
```

---

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [Storybook](https://storybook.js.org/)

### Internal Docs
- [TESTING.md](./TESTING.md) - Comprehensive testing guide
- [AUDIT_REPORT.md](./AUDIT_REPORT.md) - Frontend audit results
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines

### Code Style
- Follow Airbnb React/JSX Style Guide
- Use Prettier for formatting
- ESLint for linting
- TypeScript for type safety

---

## 🤝 Getting Help

### Contact
- **Frontend Lead**: [email]
- **Design System**: [email]
- **DevOps**: [email]

### Resources
- Slack: `#frontend-dev`
- Wiki: [Internal Wiki Link]
- Issues: [GitHub Issues](https://github.com/your-org/asistanapp/issues)

---

**Last Updated**: October 30, 2025  
**Version**: 1.0.0  
**Maintainer**: Frontend Team


