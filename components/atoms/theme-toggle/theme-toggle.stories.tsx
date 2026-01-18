import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@/contexts/theme-provider';
import { ThemeToggle } from './theme-toggle';

const meta = {
  component: ThemeToggle,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'elements/ThemeToggle',
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
