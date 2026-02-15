import { describe, expect, it } from 'vitest';
import type { MicroCMSBlog } from './types';
import { toBaseContentMetadata } from './types';

const createMockBlog = (overrides: Partial<MicroCMSBlog> = {}): MicroCMSBlog => ({
  id: 'test-id',
  title: 'テスト記事',
  content: '<p>テスト</p>',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-02T00:00:00Z',
  ...overrides,
});

describe('toBaseContentMetadata', () => {
  it('publishedAtがある場合はcreatedAtとして優先する', () => {
    const blog = createMockBlog({ publishedAt: '2025-01-05T00:00:00Z' });
    const result = toBaseContentMetadata(blog);
    expect(result.createdAt).toBe('2025-01-05T00:00:00Z');
  });

  it('publishedAtがない場合はcreatedAtを使用する', () => {
    const blog = createMockBlog();
    const result = toBaseContentMetadata(blog);
    expect(result.createdAt).toBe('2025-01-01T00:00:00Z');
  });

  it('slugがある場合はslugを使用する', () => {
    const blog = createMockBlog({ slug: 'custom-slug' });
    const result = toBaseContentMetadata(blog);
    expect(result.slug).toBe('custom-slug');
  });

  it('slugがない場合はidにフォールバックする', () => {
    const blog = createMockBlog();
    const result = toBaseContentMetadata(blog);
    expect(result.slug).toBe('test-id');
  });

  it('tagsを名前の配列に変換する', () => {
    const blog = createMockBlog({
      tags: [
        { id: 'tag1', name: 'React', createdAt: '', updatedAt: '' },
        { id: 'tag2', name: 'TypeScript', createdAt: '', updatedAt: '' },
      ],
    });
    const result = toBaseContentMetadata(blog);
    expect(result.tags).toEqual(['React', 'TypeScript']);
  });

  it('tagsがない場合はundefinedを返す', () => {
    const blog = createMockBlog();
    const result = toBaseContentMetadata(blog);
    expect(result.tags).toBeUndefined();
  });

  it('characterCountを設定する', () => {
    const blog = createMockBlog();
    const result = toBaseContentMetadata(blog, 1234);
    expect(result.characterCount).toBe(1234);
  });

  it('eyecatchを含める', () => {
    const blog = createMockBlog({
      eyecatch: { url: 'https://example.com/image.jpg', width: 800, height: 600 },
    });
    const result = toBaseContentMetadata(blog);
    expect(result.eyecatch).toEqual({
      url: 'https://example.com/image.jpg',
      width: 800,
      height: 600,
    });
  });

  it('descriptionを含める', () => {
    const blog = createMockBlog({ description: 'テスト説明' });
    const result = toBaseContentMetadata(blog);
    expect(result.description).toBe('テスト説明');
  });
});
