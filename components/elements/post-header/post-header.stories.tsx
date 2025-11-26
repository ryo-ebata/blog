import type { Meta, StoryObj } from '@storybook/react';
import type { PostMetadata } from '@/lib/posts';
import { PostHeader } from './post-header';

const meta = {
  title: 'elements/PostHeader',
  component: PostHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PostHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPost: PostMetadata = {
  slug: 'example-post',
  title: 'サンプル記事',
  createdAt: '2024-01-15',
  updatedAt: '2024-01-15',
  description: 'これはサンプル記事の説明文です。',
  tags: ['nextjs', 'typescript', 'react'],
};

export const Default: Story = {
  args: {
    metadata: mockPost,
  },
};

export const WithoutTags: Story = {
  args: {
    metadata: {
      ...mockPost,
      tags: undefined,
    },
  },
};

export const LongTitle: Story = {
  args: {
    metadata: {
      ...mockPost,
      title:
        '非常に長いタイトルの記事 - Next.js 16とTypeScriptで作るモダンなブログシステムの構築方法について詳しく解説します',
    },
  },
};

export const ManyTags: Story = {
  args: {
    metadata: {
      ...mockPost,
      tags: ['nextjs', 'typescript', 'react', 'tailwindcss', 'mdx', 'blog'],
    },
  },
};
