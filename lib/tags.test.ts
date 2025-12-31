import { describe, expect, it } from 'vitest';
import type { PostMetadata } from './posts';
import { aggregateTags, filterPostsByTags } from './tags';

const mockPosts: PostMetadata[] = [
  {
    slug: 'react-hooks',
    title: 'React Hooksの使い方',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    tags: ['React', 'TypeScript'],
  },
  {
    slug: 'nextjs-intro',
    title: 'Next.js入門ガイド',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02',
    tags: ['React', 'Next.js'],
  },
  {
    slug: 'keiba',
    title: '競馬の楽しみ方',
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03',
    tags: ['競馬'],
  },
  {
    slug: 'no-tags',
    title: 'タグなしの記事',
    createdAt: '2024-01-04',
    updatedAt: '2024-01-04',
  },
];

describe('aggregateTags', () => {
  it('全記事からタグと記事数を集計し、記事数の多い順にソートする', () => {
    const result = aggregateTags(mockPosts);
    expect(result).toEqual([
      { tag: 'React', count: 2 },
      { tag: 'TypeScript', count: 1 },
      { tag: 'Next.js', count: 1 },
      { tag: '競馬', count: 1 },
    ]);
  });

  it('タグがない記事は無視する', () => {
    const result = aggregateTags(mockPosts);
    expect(result.every((t) => t.tag !== undefined)).toBe(true);
  });

  it('空配列を渡すと空配列を返す', () => {
    expect(aggregateTags([])).toEqual([]);
  });

  it('同じ記事数のタグは元の順序を維持する', () => {
    const result = aggregateTags(mockPosts);
    const singleCountTags = result.filter((t) => t.count === 1);
    expect(singleCountTags.length).toBe(3);
  });
});

describe('filterPostsByTags', () => {
  it('空のタグ配列では全ての記事を返す', () => {
    const result = filterPostsByTags(mockPosts, []);
    expect(result).toEqual(mockPosts);
  });

  it('単一タグでOR検索する', () => {
    const result = filterPostsByTags(mockPosts, ['React']);
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.slug)).toContain('react-hooks');
    expect(result.map((p) => p.slug)).toContain('nextjs-intro');
  });

  it('複数タグでOR検索する（いずれかを含む記事を返す）', () => {
    const result = filterPostsByTags(mockPosts, ['TypeScript', '競馬']);
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.slug)).toContain('react-hooks');
    expect(result.map((p) => p.slug)).toContain('keiba');
  });

  it('タグがない記事はフィルタリングで除外される', () => {
    const result = filterPostsByTags(mockPosts, ['React']);
    expect(result.map((p) => p.slug)).not.toContain('no-tags');
  });

  it('存在しないタグで検索すると空配列を返す', () => {
    const result = filterPostsByTags(mockPosts, ['存在しないタグ']);
    expect(result).toEqual([]);
  });

  it('全てのタグを指定するとタグを持つ全ての記事を返す', () => {
    const result = filterPostsByTags(mockPosts, ['React', 'TypeScript', 'Next.js', '競馬']);
    expect(result).toHaveLength(3);
    expect(result.map((p) => p.slug)).not.toContain('no-tags');
  });
});
