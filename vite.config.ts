import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker';

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
    checker({ typescript: true })
  ],
});
