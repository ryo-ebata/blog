import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { playwright } from '@vitest/browser-playwright';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const getDirname = () => {
  if (typeof __dirname !== 'undefined') {
    return __dirname;
  }
  return path.dirname(fileURLToPath(import.meta.url));
};

const dirname = getDirname();

/* More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon */
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(dirname),
      'next-view-transitions': path.resolve(dirname, 'vitest.next-view-transitions-mock.ts'),
      'server-only': path.resolve(dirname, 'vitest.server-only-mock.ts'),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          environment: 'jsdom',
          exclude: ['**/node_modules/**', '**/stories/**'],
          include: ['**/*.test.{ts,tsx}'],
          name: 'unit',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        extends: true,
        plugins: [
          /*
           * The plugin will run tests for the stories defined in your Storybook config
           * See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
           */
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          browser: {
            enabled: true,
            headless: true,
            instances: [{ browser: 'chromium' }],
            provider: playwright({}),
          },
          exclude: ['**/node_modules/**'],
          name: 'storybook',
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});
