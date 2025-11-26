import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './pagination';

const meta = {
  title: 'elements/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
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
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 5,
    basePath: '/blog',
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 3,
    totalPages: 5,
    basePath: '/blog',
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 5,
    totalPages: 5,
    basePath: '/blog',
  },
};

export const ManyPages: Story = {
  args: {
    currentPage: 10,
    totalPages: 20,
    basePath: '/blog',
  },
};

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
    basePath: '/blog',
  },
};
