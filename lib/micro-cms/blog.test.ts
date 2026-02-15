import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { MicroCMSBlog, MicroCMSListResponse } from './types';

const mockGetList = vi.fn();

vi.mock('./client', () => ({
  microCmsClient: {
    getList: mockGetList,
  },
}));

vi.mock('./count-characters', () => ({
  countHtmlCharacters: vi.fn(() => 100),
}));

const createMockBlog = (overrides: Partial<MicroCMSBlog> = {}): MicroCMSBlog => ({
  id: 'test-id',
  title: 'テスト記事',
  slug: 'test-post',
  content: '<p>テスト本文</p>',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-02T00:00:00.000Z',
  publishedAt: '2025-01-01T00:00:00.000Z',
  tags: [
    {
      id: 'tag-1',
      name: 'TypeScript',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    },
  ],
  ...overrides,
});

describe('blog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllPostsMetadata', () => {
    it('全記事のメタデータを取得する', async () => {
      const mockResponse: MicroCMSListResponse<MicroCMSBlog> = {
        contents: [createMockBlog()],
        totalCount: 1,
        offset: 0,
        limit: 100,
      };
      mockGetList.mockResolvedValueOnce(mockResponse);

      const { getAllPostsMetadata } = await import('./blog');
      const result = await getAllPostsMetadata();

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('テスト記事');
      expect(result[0].slug).toBe('test-post');
      expect(result[0].tags).toEqual(['TypeScript']);
      expect(result[0].createdAt).toBe('2025-01-01T00:00:00.000Z');
      expect(result[0].updatedAt).toBe('2025-01-02T00:00:00.000Z');
    });

    it('100件を超える場合にページネーションで全件取得する', async () => {
      const firstBatch = Array.from({ length: 100 }, (_, i) =>
        createMockBlog({ id: `id-${i}`, slug: `post-${i}` })
      );
      const secondBatch = [createMockBlog({ id: 'id-100', slug: 'post-100' })];

      mockGetList
        .mockResolvedValueOnce({
          contents: firstBatch,
          totalCount: 101,
          offset: 0,
          limit: 100,
        })
        .mockResolvedValueOnce({
          contents: secondBatch,
          totalCount: 101,
          offset: 100,
          limit: 100,
        });

      const { getAllPostsMetadata } = await import('./blog');
      const result = await getAllPostsMetadata();

      expect(result).toHaveLength(101);
      expect(mockGetList).toHaveBeenCalledTimes(2);
    });

    it('日付降順でソートされる', async () => {
      const older = createMockBlog({
        id: 'older',
        slug: 'older',
        publishedAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      });
      const newer = createMockBlog({
        id: 'newer',
        slug: 'newer',
        publishedAt: '2025-01-10T00:00:00.000Z',
        updatedAt: '2025-01-10T00:00:00.000Z',
      });

      mockGetList.mockResolvedValueOnce({
        contents: [older, newer],
        totalCount: 2,
        offset: 0,
        limit: 100,
      });

      const { getAllPostsMetadata } = await import('./blog');
      const result = await getAllPostsMetadata();

      expect(result[0].slug).toBe('newer');
      expect(result[1].slug).toBe('older');
    });

    it('publishedAtがない場合はcreatedAtをcreatedAtとして使用する', async () => {
      const blog = createMockBlog({
        publishedAt: undefined,
        createdAt: '2025-01-05T00:00:00.000Z',
      });

      mockGetList.mockResolvedValueOnce({
        contents: [blog],
        totalCount: 1,
        offset: 0,
        limit: 100,
      });

      const { getAllPostsMetadata } = await import('./blog');
      const result = await getAllPostsMetadata();

      expect(result[0].createdAt).toBe('2025-01-05T00:00:00.000Z');
    });
  });

  describe('getPostBySlug', () => {
    it('slugで記事を取得する', async () => {
      const blog = createMockBlog();
      mockGetList.mockResolvedValueOnce({
        contents: [blog],
        totalCount: 1,
        offset: 0,
        limit: 1,
      });

      const { getPostBySlug } = await import('./blog');
      const result = await getPostBySlug('test-post');

      expect(result.metadata.slug).toBe('test-post');
      expect(result.contentHtml).toBe('<p>テスト本文</p>');
      expect(mockGetList).toHaveBeenCalledWith({
        endpoint: 'blog',
        queries: { limit: 1, filters: 'slug[equals]test-post' },
      });
    });

    it('配列slugを結合して検索する', async () => {
      const blog = createMockBlog({ slug: 'dir/nested-post' });
      mockGetList.mockResolvedValueOnce({
        contents: [blog],
        totalCount: 1,
        offset: 0,
        limit: 1,
      });

      const { getPostBySlug } = await import('./blog');
      const result = await getPostBySlug(['dir', 'nested-post']);

      expect(result.metadata.slug).toBe('dir/nested-post');
      expect(mockGetList).toHaveBeenCalledWith({
        endpoint: 'blog',
        queries: { limit: 1, filters: 'slug[equals]dir/nested-post' },
      });
    });

    it('記事が見つからない場合にエラーをスローする', async () => {
      mockGetList.mockResolvedValueOnce({
        contents: [],
        totalCount: 0,
        offset: 0,
        limit: 1,
      });

      const { getPostBySlug } = await import('./blog');
      await expect(getPostBySlug('not-found')).rejects.toThrow('Post not found: not-found');
    });
  });
});
