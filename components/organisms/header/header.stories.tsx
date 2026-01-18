import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './header';
import { ThemeProvider } from '@/contexts/theme-provider';

const meta = {
  component: Header,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  title: 'elements/Header',
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
