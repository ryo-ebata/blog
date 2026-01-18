import type { Meta, StoryObj } from '@storybook/react';
import { BlogTitle } from './blog-title';

const meta = {
  argTypes: {
    title: {
      control: 'text',
      description: 'ブログのタイトル',
    },
  },
  component: BlogTitle,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  title: 'elements/BlogTitle',
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
