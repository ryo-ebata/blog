import type { Meta, StoryObj } from '@storybook/react';
import { BlogTitle } from './blog-title';

const meta = {
  title: 'elements/BlogTitle',
  component: BlogTitle,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'ブログのタイトル',
    },
  },
} satisfies Meta<typeof BlogTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'ブログ',
  },
};

export const CustomTitle: Story = {
  args: {
    title: '技術ブログ',
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Next.js 16とTypeScriptで作るモダンなブログ',
  },
};

