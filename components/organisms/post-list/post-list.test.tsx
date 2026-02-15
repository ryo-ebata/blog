import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { BaseContentMetadata } from '@/lib/content';
import { PostList } from './post-list';

const createMockPost = (overrides: Partial<BaseContentMetadata> = {}): BaseContentMetadata => ({
  slug: 'test-post',
  title: 'テスト記事',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-02T00:00:00Z',
  ...overrides,
});

describe('PostList', () => {
  it('投稿のリストをレンダリングする', () => {
    const posts = [
      createMockPost({ slug: 'post-1', title: '記事1' }),
      createMockPost({ slug: 'post-2', title: '記事2' }),
    ];
    render(<PostList posts={posts} />);
    expect(screen.getByText('記事1')).toBeInTheDocument();
    expect(screen.getByText('記事2')).toBeInTheDocument();
  });

  it('投稿が空の場合EmptyStateを表示する', () => {
    render(<PostList posts={[]} />);
    expect(screen.getByText('No Projects Yet')).toBeInTheDocument();
  });

  it('デフォルトのbasePathを使用する', () => {
    const posts = [createMockPost()];
    render(<PostList posts={posts} />);
    const links = screen.getAllByRole('link');
    const postLink = links.find((link) => link.getAttribute('href')?.includes('/blog/test-post'));
    expect(postLink).toBeDefined();
  });

  it('カスタムbasePathを使用する', () => {
    const posts = [createMockPost()];
    render(<PostList posts={posts} basePath="/notes" />);
    const links = screen.getAllByRole('link');
    const postLink = links.find((link) => link.getAttribute('href')?.includes('/notes/test-post'));
    expect(postLink).toBeDefined();
  });
});
