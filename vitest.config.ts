import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'c8',
      all: true,
      exclude: ['docs', 'test'],
      extension: ['.js'],
      // Apply current coverage levels to prevent drops
      // TODO: So close to 100%
      lines: 90,
      statements: 84,
      branches: 94,
      functions: 84,
    },
  },
});
