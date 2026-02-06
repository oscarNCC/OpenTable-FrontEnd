import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@monorepo/shared-types': path.resolve(__dirname, '../../packages/shared-types/src'),
      '@monorepo/config': path.resolve(__dirname, '../../packages/config'),
      '@monorepo/store': path.resolve(__dirname, '../../packages/store/src'),
      '@monorepo/analytics': path.resolve(__dirname, '../../packages/analytics/src'),
      '@monorepo/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
});
