import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      all: true,
      exclude: ['docs', 'test', 'vitest.config.ts', 'dist', 'lib/types.ts'],
      extension: ['.ts'],
      clean: true,
      thresholds: {
        lines: 100,
        statements: 100,
        branches: 100,
        functions: 100,
      },
    },
    mockReset: true,
    alias: {
      '@/': new URL('./lib/', import.meta.url).pathname, 
    },
  },
});
