// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://asistanapp.com.tr',
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        '@': new URL('./src/', import.meta.url).pathname
      }
    }
  }
});