import type { Meta, StoryObj } from '@storybook/react';
import { PostHeader } from './post-header';
import type { PostMetadata } from '@/lib/posts';

const meta = {
  component: PostHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  title: 'elements/PostHeader',
} satisfies Meta<typeof PostHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPost: PostMetadata = {
  createdAt: '2024-01-15',
  description: 'これはサンプル記事の説明文です。',
  slug: 'example-post',
  tags: ['nextjs', 'typescript', 'react'],
  title: 'サンプル記事',
  updatedAt: '2024-01-15',
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
