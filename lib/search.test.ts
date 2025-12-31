import { describe, expect, it } from 'vitest';
import type { PostMetadata } from './posts';
import { filterPostsByTitle } from './search';

const mockPosts: PostMetadata[] = [
  {
    slug: 'react-hooks',
    title: 'React Hooksの使い方',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    description: 'Reactの基本的なフックについて解説',
    tags: ['React', 'JavaScript'],
  },
  {
    slug: 'nextjs-intro',
    title: 'Next.js入門ガイド',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02',
    description: 'Next.jsの基本的な使い方',
    tags: ['Next.js', 'React'],
  },
  {
    slug: 'typescript-basics',
    title: 'TypeScript基礎講座',
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03',
    description: 'TypeScriptの基本を学ぶ',
    tags: ['TypeScript'],
  },
  {
    slug: 'daily-note',
    title: '日記：今日の出来事',
    createdAt: '2024-01-04',
    updatedAt: '2024-01-04',
    tags: ['日記'],
  },
];

describe('filterPostsByTitle', () => {
  it('空の検索クエリでは全ての記事を返す', () => {
    const result = filterPostsByTitle(mockPosts, '');
    expect(result).toEqual(mockPosts);
  });

  it('タイトルに含まれるキーワードでフィルタリングする', () => {
    const result = filterPostsByTitle(mockPosts, 'React');
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('react-hooks');
  });

  it('部分一致でフィルタリングする', () => {
    const result = filterPostsByTitle(mockPosts, '入門');
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('nextjs-intro');
  });

  it('大文字小文字を区別しない', () => {
    const result = filterPostsByTitle(mockPosts, 'react');
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('react-hooks');
  });

  it('複数の記事にマッチする場合すべてを返す', () => {
    const postsWithSharedWord: PostMetadata[] = [
      ...mockPosts,
      {
        slug: 'react-patterns',
        title: 'React設計パターン',
        createdAt: '2024-01-05',
        updatedAt: '2024-01-05',
        tags: ['React'],
      },
    ];
    const result = filterPostsByTitle(postsWithSharedWord, 'React');
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.slug)).toContain('react-hooks');
    expect(result.map((p) => p.slug)).toContain('react-patterns');
  });

  it('マッチしない場合は空配列を返す', () => {
    const result = filterPostsByTitle(mockPosts, 'Python');
    expect(result).toHaveLength(0);
  });

  it('空白のみの検索クエリでは全ての記事を返す', () => {
    const result = filterPostsByTitle(mockPosts, '   ');
    expect(result).toEqual(mockPosts);
  });

  it('日本語で検索できる', () => {
    const result = filterPostsByTitle(mockPosts, '日記');
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('daily-note');
  });
});
