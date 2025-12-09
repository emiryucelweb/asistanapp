/**
 * Storybook Main Configuration
 * UI component development and documentation
 * 
 * Features:
 * - React 18 support
 * - TypeScript
 * - Tailwind CSS
 * - Chromatic integration
 * - Accessibility testing
 */

import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'path';

const config: StorybookConfig = {
  // Stories location
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  
  // Addons
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',           // Accessibility testing
    '@storybook/addon-coverage',       // Coverage in Storybook
    '@chromatic-com/storybook',        // Chromatic integration
  ],
  
  // Framework
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  
  // Docs
  docs: {
    autodocs: 'tag',
  },
  
  // Static dirs
  staticDirs: ['../public'],
  
  // Vite config customization
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
          '@/features': path.resolve(__dirname, '../src/features'),
          '@/shared': path.resolve(__dirname, '../src/shared'),
          '@/hooks': path.resolve(__dirname, '../src/shared/hooks'),
          '@/utils': path.resolve(__dirname, '../src/shared/utils'),
          '@/stores': path.resolve(__dirname, '../src/shared/stores'),
          '@/ui': path.resolve(__dirname, '../src/shared/ui'),
          '@/config': path.resolve(__dirname, '../src/shared/config'),
          '@/types': path.resolve(__dirname, '../src/types'),
        },
      },
    });
  },
  
  // TypeScript
  typescript: {
    check: false, // Disable type checking in Storybook (handled by TSC)
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
};

export default config;

