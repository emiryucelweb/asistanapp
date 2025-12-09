/**
 * Storybook Preview Configuration
 * Global decorators, parameters, and styles
 */

import type { Preview } from '@storybook/react';
import '../src/index.css'; // Tailwind CSS

const preview: Preview = {
  parameters: {
    // Actions
    actions: { argTypesRegex: '^on[A-Z].*' },
    
    // Controls
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    
    // Backgrounds
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0f172a',
        },
        {
          name: 'gray',
          value: '#f1f5f9',
        },
      ],
    },
    
    // Viewport
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
      },
    },
    
    // Layout
    layout: 'centered',
    
    // Docs
    docs: {
      toc: true,
    },
    
    // Accessibility
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'label',
            enabled: true,
          },
          {
            id: 'button-name',
            enabled: true,
          },
        ],
      },
    },
  },
  
  // Global types
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Internationalization locale',
      defaultValue: 'tr',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'tr', title: 'Türkçe' },
          { value: 'en', title: 'English' },
        ],
        showName: true,
      },
    },
  },
};

export default preview;

