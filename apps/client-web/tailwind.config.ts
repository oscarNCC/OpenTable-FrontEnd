import type { Config } from 'tailwindcss';
import sharedConfig from '../../packages/config/tailwind/tailwind.config';

const sharedTheme = sharedConfig.theme && typeof sharedConfig.theme === 'object' && 'extend' in sharedConfig.theme
  ? (sharedConfig.theme as { extend?: Record<string, unknown> }).extend
  : {};
export default {
  ...sharedConfig,
  theme: {
    extend: {
      ...sharedTheme,
      colors: {
        ...(typeof sharedTheme === 'object' && sharedTheme && 'colors' in sharedTheme ? (sharedTheme as { colors: Record<string, unknown> }).colors : {}),
        brand: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
    },
  },
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
} satisfies Config;
