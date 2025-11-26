import type { Meta, StoryObj } from '@storybook/react';
import type { PostMetadata } from '@/lib/posts';
import { PostList } from './post-list';

const meta = {
  title: 'elements/PostList',
  component: PostList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PostList>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPosts: PostMetadata[] = [
  {
    slug: 'example-post-1',
    title: 'サンプル記事1',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    description: 'これは最初のサンプル記事の説明文です。',
    tags: ['nextjs', 'typescript'],
    icon: 'FileText',
  },
  {
    slug: 'example-post-2',
    title: 'サンプル記事2',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
    description: 'これは2番目のサンプル記事の説明文です。',
    tags: ['react', 'tailwindcss'],
    icon: 'Code',
  },
  {
    slug: 'example-post-3',
    title: 'サンプル記事3',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05',
    description: 'これは3番目のサンプル記事の説明文です。',
    tags: ['mdx', 'blog'],
  },
];

export const WithPosts: Story = {
  args: {
    posts: mockPosts,
  },
};

export const Empty: Story = {
  args: {
    posts: [],
  },
};

export const SinglePost: Story = {
  args: {
    posts: [mockPosts[0]],
  },
};
