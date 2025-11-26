import type { Meta, StoryObj } from '@storybook/react';
import { PostCard } from './post-card';
import type { PostMetadata } from '@/lib/posts';

const meta = {
  title: 'elements/PostCard',
  component: PostCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPost: PostMetadata = {
  slug: 'example-post',
  title: 'サンプル記事',
  date: '2024-01-15',
  description: 'これはサンプル記事の説明文です。記事の内容を簡潔に説明しています。',
  tags: ['nextjs', 'typescript', 'react'],
  icon: 'FileText',
};

export const Default: Story = {
  args: {
    metadata: mockPost,
  },
};

export const WithoutDescription: Story = {
  args: {
    metadata: {
      ...mockPost,
      description: undefined,
    },
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

export const WithoutIcon: Story = {
  args: {
    metadata: {
      ...mockPost,
      icon: undefined,
    },
  },
};

export const LongTitle: Story = {
  args: {
    metadata: {
      ...mockPost,
      title: '非常に長いタイトルの記事 - Next.js 16とTypeScriptで作るモダンなブログシステムの構築方法',
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

