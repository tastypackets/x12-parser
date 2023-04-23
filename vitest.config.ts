import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'c8',
      all: true,
      exclude: ['docs', 'test', 'vitest.config.ts'],
      extension: ['.ts'],
      // Apply current coverage levels to prevent drops
      // TODO: So close to 100%
      lines: 90,
      statements: 90,
      branches: 85,
      functions: 90,
    },
    mockReset: true,
    alias: {
      '@/': './lib/',
    },
  },
});
