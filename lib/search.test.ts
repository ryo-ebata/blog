import { describe, expect, it } from 'vitest';

import type { PostMetadata } from './posts';
import { filterPostsByTitle } from './search';

/*
 * テスト用定数
 */
const EXPECTED_SINGLE_RESULT = 1;
const EXPECTED_DOUBLE_RESULT = 2;
const EXPECTED_NO_RESULT = 0;
const FIRST_INDEX = 0;

const mockPosts: PostMetadata[] = [
  {
    createdAt: '2024-01-01',
    description: 'Reactの基本的なフックについて解説',
    slug: 'react-hooks',
    tags: ['React', 'JavaScript'],
    title: 'React Hooksの使い方',
    updatedAt: '2024-01-01',
  },
  {
    createdAt: '2024-01-02',
    description: 'Next.jsの基本的な使い方',
    slug: 'nextjs-intro',
    tags: ['Next.js', 'React'],
    title: 'Next.js入門ガイド',
    updatedAt: '2024-01-02',
  },
  {
    createdAt: '2024-01-03',
    description: 'TypeScriptの基本を学ぶ',
    slug: 'typescript-basics',
    tags: ['TypeScript'],
    title: 'TypeScript基礎講座',
    updatedAt: '2024-01-03',
  },
  {
    createdAt: '2024-01-04',
    slug: 'daily-note',
    tags: ['日記'],
    title: '日記：今日の出来事',
    updatedAt: '2024-01-04',
  },
];

describe('filterPostsByTitle', () => {
  it('空の検索クエリでは全ての記事を返す', () => {
    const result = filterPostsByTitle(mockPosts, '');
    expect(result).toEqual(mockPosts);
  });

  it('タイトルに含まれるキーワードでフィルタリングする', () => {
    const result = filterPostsByTitle(mockPosts, 'React');
    expect(result).toHaveLength(EXPECTED_SINGLE_RESULT);
    expect(result[FIRST_INDEX].slug).toBe('react-hooks');
  });

  it('部分一致でフィルタリングする', () => {
    const result = filterPostsByTitle(mockPosts, '入門');
    expect(result).toHaveLength(EXPECTED_SINGLE_RESULT);
    expect(result[FIRST_INDEX].slug).toBe('nextjs-intro');
  });

  it('大文字小文字を区別しない', () => {
    const result = filterPostsByTitle(mockPosts, 'react');
    expect(result).toHaveLength(EXPECTED_SINGLE_RESULT);
    expect(result[FIRST_INDEX].slug).toBe('react-hooks');
  });

  it('複数の記事にマッチする場合すべてを返す', () => {
    const postsWithSharedWord: PostMetadata[] = [
      ...mockPosts,
      {
        createdAt: '2024-01-05',
        slug: 'react-patterns',
        tags: ['React'],
        title: 'React設計パターン',
        updatedAt: '2024-01-05',
      },
    ];
    const result = filterPostsByTitle(postsWithSharedWord, 'React');
    expect(result).toHaveLength(EXPECTED_DOUBLE_RESULT);
    expect(result.map((post) => post.slug)).toContain('react-hooks');
    expect(result.map((post) => post.slug)).toContain('react-patterns');
  });

  it('マッチしない場合は空配列を返す', () => {
    const result = filterPostsByTitle(mockPosts, 'Python');
    expect(result).toHaveLength(EXPECTED_NO_RESULT);
  });

  it('空白のみの検索クエリでは全ての記事を返す', () => {
    const result = filterPostsByTitle(mockPosts, '   ');
    expect(result).toEqual(mockPosts);
  });

  it('日本語で検索できる', () => {
    const result = filterPostsByTitle(mockPosts, '日記');
    expect(result).toHaveLength(EXPECTED_SINGLE_RESULT);
    expect(result[FIRST_INDEX].slug).toBe('daily-note');
  });
});
