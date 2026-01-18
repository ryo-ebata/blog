import { describe, expect, it } from 'vitest';
import { aggregateTags, filterPostsByTags } from './tags';
import type { PostMetadata } from './posts';

/* テスト用定数 */
const EXPECTED_DOUBLE_RESULT = 2;
const EXPECTED_TRIPLE_RESULT = 3;
const EXPECTED_SINGLE_TAG_COUNT = 1;

const mockPosts: PostMetadata[] = [
  {
    createdAt: '2024-01-01',
    slug: 'react-hooks',
    tags: ['React', 'TypeScript'],
    title: 'React Hooksの使い方',
    updatedAt: '2024-01-01',
  },
  {
    createdAt: '2024-01-02',
    slug: 'nextjs-intro',
    tags: ['React', 'Next.js'],
    title: 'Next.js入門ガイド',
    updatedAt: '2024-01-02',
  },
  {
    createdAt: '2024-01-03',
    slug: 'keiba',
    tags: ['競馬'],
    title: '競馬の楽しみ方',
    updatedAt: '2024-01-03',
  },
  {
    createdAt: '2024-01-04',
    slug: 'no-tags',
    title: 'タグなしの記事',
    updatedAt: '2024-01-04',
  },
];

describe('aggregateTags', () => {
  it('全記事からタグと記事数を集計し、記事数の多い順にソートする', () => {
    const result = aggregateTags(mockPosts);
    expect(result).toEqual([
      { count: 2, tag: 'React' },
      { count: 1, tag: 'TypeScript' },
      { count: 1, tag: 'Next.js' },
      { count: 1, tag: '競馬' },
    ]);
  });

  it('タグがない記事は無視する', () => {
    const result = aggregateTags(mockPosts);
    expect(result.every((tagItem) => tagItem.tag !== undefined)).toBe(true);
  });

  it('空配列を渡すと空配列を返す', () => {
    expect(aggregateTags([])).toEqual([]);
  });

  it('同じ記事数のタグは元の順序を維持する', () => {
    const result = aggregateTags(mockPosts);
    const singleCountTags = result.filter((tagItem) => tagItem.count === EXPECTED_SINGLE_TAG_COUNT);
    expect(singleCountTags.length).toBe(EXPECTED_TRIPLE_RESULT);
  });
});

describe('filterPostsByTags', () => {
  it('空のタグ配列では全ての記事を返す', () => {
    const result = filterPostsByTags(mockPosts, []);
    expect(result).toEqual(mockPosts);
  });

  it('単一タグでOR検索する', () => {
    const result = filterPostsByTags(mockPosts, ['React']);
    expect(result).toHaveLength(EXPECTED_DOUBLE_RESULT);
    expect(result.map((post) => post.slug)).toContain('react-hooks');
    expect(result.map((post) => post.slug)).toContain('nextjs-intro');
  });

  it('複数タグでOR検索する（いずれかを含む記事を返す）', () => {
    const result = filterPostsByTags(mockPosts, ['TypeScript', '競馬']);
    expect(result).toHaveLength(EXPECTED_DOUBLE_RESULT);
    expect(result.map((post) => post.slug)).toContain('react-hooks');
    expect(result.map((post) => post.slug)).toContain('keiba');
  });

  it('タグがない記事はフィルタリングで除外される', () => {
    const result = filterPostsByTags(mockPosts, ['React']);
    expect(result.map((post) => post.slug)).not.toContain('no-tags');
  });

  it('存在しないタグで検索すると空配列を返す', () => {
    const result = filterPostsByTags(mockPosts, ['存在しないタグ']);
    expect(result).toEqual([]);
  });

  it('全てのタグを指定するとタグを持つ全ての記事を返す', () => {
    const result = filterPostsByTags(mockPosts, ['React', 'TypeScript', 'Next.js', '競馬']);
    expect(result).toHaveLength(EXPECTED_TRIPLE_RESULT);
    expect(result.map((post) => post.slug)).not.toContain('no-tags');
  });
});
