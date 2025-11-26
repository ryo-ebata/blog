import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '@/contexts/theme-provider';
import { ThemeToggle } from './theme-toggle';

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
