import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './theme-toggle';
import { ThemeProvider } from '@/contexts/theme-provider';

const meta = {
  title: 'elements/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

