import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/micro-cms/blog', () => ({
  getAllPostsMetadata: vi.fn(async () => [
    {
      slug: 'a',
      title: 'A記事',
      description: '概要A',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z',
      tags: ['Rust'],
    },
  ]),
}));

import { GET } from './route';

describe('feed.json', () => {
  it('JSON Feed 1.1 を application/feed+json で返す', async () => {
    const response = await GET();
    expect(response.headers.get('content-type')).toContain('application/feed+json');

    const feed = await response.json();
    expect(feed.version).toBe('https://jsonfeed.org/version/1.1');
    expect(feed.feed_url).toContain('/feed.json');
    expect(feed.items).toHaveLength(1);
    expect(feed.items[0].url).toContain('/blog/a');
    expect(feed.items[0].title).toBe('A記事');
    expect(feed.items[0].date_published).toBe('2025-01-01T00:00:00.000Z');
    expect(feed.items[0].tags).toEqual(['Rust']);
  });
});
