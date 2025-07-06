import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import eslint from 'vite-plugin-eslint';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint({
      fix: true,
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      failOnError: false,
      failOnWarning: false,
    }),
    checker({ typescript: true }),
  ],
  // https://vitest.dev/config/
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts', './src/i18n.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    passWithNoTests: true,
  },
});
