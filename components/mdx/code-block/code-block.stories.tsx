import type { Meta, StoryObj } from '@storybook/react';
import { CodeBlock } from './code-block';
import { ThemeProvider } from '@/contexts/theme-provider';

const meta = {
  title: 'mdx/CodeBlock',
  component: CodeBlock,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

