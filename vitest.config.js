import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    fileParallelism: false,
    globals: true,
    setupFiles: ['dotenv/config'],
    coverage: {
      exclude: ['src/Commons/config.js'],
    },
  },
});
