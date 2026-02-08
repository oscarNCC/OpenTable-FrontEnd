import type { Config } from 'tailwindcss';
import sharedConfig from '../../packages/config/tailwind/tailwind.config';

export default {
  ...sharedConfig,
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
} satisfies Config;
