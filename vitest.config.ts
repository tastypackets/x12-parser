import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'c8',
      all: true,
      exclude: ['docs', 'test', 'vitest.config.ts', 'dist'],
      extension: ['.ts'],
      lines: 100,
      statements: 100,
      branches: 100,
      functions: 100,
    },
    mockReset: true,
    alias: {
      '@/': './lib/',
    },
  },
});
