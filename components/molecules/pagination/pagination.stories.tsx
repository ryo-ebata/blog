import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './pagination';

const meta = {
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: '現在のページ番号',
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: '総ページ数',
    },
    basePath: {
      control: 'text',
      description: 'ベースパス',
    },
  },
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'elements/Pagination',
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {
  args: {
    basePath: '/blog',
    currentPage: 1,
    totalPages: 5,
  },
};

export const MiddlePage: Story = {
  args: {
    basePath: '/blog',
    currentPage: 3,
    totalPages: 5,
  },
};

export const LastPage: Story = {
  args: {
    basePath: '/blog',
    currentPage: 5,
    totalPages: 5,
  },
};

export const ManyPages: Story = {
  args: {
    basePath: '/blog',
    currentPage: 10,
    totalPages: 20,
  },
};

export const SinglePage: Story = {
  args: {
    basePath: '/blog',
    currentPage: 1,
    totalPages: 1,
  },
};
