import type { Preview } from '@storybook/nextjs-vite';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { StorybookThemeProvider } from './ThemeProviderWrapper';
import '../app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  decorators: [
    (Story) => (
      <NuqsAdapter>
        <StorybookThemeProvider>
          <Story />
        </StorybookThemeProvider>
      </NuqsAdapter>
    ),
  ],
};

export default preview;
