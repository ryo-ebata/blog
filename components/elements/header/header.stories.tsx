import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@/contexts/theme-provider';
import { Header } from './header';

const meta = {
  title: 'elements/Header',
  component: Header,
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
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
