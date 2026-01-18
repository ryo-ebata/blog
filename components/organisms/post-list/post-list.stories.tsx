import type { Meta, StoryObj } from '@storybook/react';
import type { PostMetadata } from '@/lib/posts';
import { PostList } from './post-list';

const meta = {
  component: PostList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  title: 'elements/PostList',
} satisfies Meta<typeof PostList>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPosts: PostMetadata[] = [
  {
    createdAt: '2024-01-15',
    description: 'これは最初のサンプル記事の説明文です。',
    icon: 'FileText',
    slug: 'example-post-1',
    tags: ['nextjs', 'typescript'],
    title: 'サンプル記事1',
    updatedAt: '2024-01-15',
  },
  {
    createdAt: '2024-01-10',
    description: 'これは2番目のサンプル記事の説明文です。',
    icon: 'Code',
    slug: 'example-post-2',
    tags: ['react', 'tailwindcss'],
    title: 'サンプル記事2',
    updatedAt: '2024-01-10',
  },
  {
    createdAt: '2024-01-05',
    description: 'これは3番目のサンプル記事の説明文です。',
    slug: 'example-post-3',
    tags: ['mdx', 'blog'],
    title: 'サンプル記事3',
    updatedAt: '2024-01-05',
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

const FIRST_POST_INDEX = 0;

export const SinglePost: Story = {
  args: {
    posts: [mockPosts[FIRST_POST_INDEX]],
  },
};
