import type { Meta, StoryObj } from '@storybook/react';
import { SiteHeader } from './site-header';
import { ThemeProvider } from '@/contexts/theme-provider';

const meta = {
  title: 'elements/SiteHeader',
  component: SiteHeader,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

