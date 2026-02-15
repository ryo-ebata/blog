import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/config/env', () => ({
  envConfig: {
    qiita: {
      QIITA_API_ACCESS_TOKEN: 'test-token',
      QIITA_API_URL: 'https://qiita.com/api/v2',
    },
  },
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

const createMockQiitaArticle = (overrides: Record<string, unknown> = {}) => ({
  body: 'テスト本文',
  coediting: false,
  comments_count: 0,
  created_at: '2025-01-01T00:00:00Z',
  group: null,
  id: 'test-id',
  likes_count: 10,
  organization_url_name: 'test-org',
  page_views_count: 100,
  private: false,
  reactions_count: 5,
  rendered_body: '<p>テスト</p>',
  slide: false,
  stocks_count: 3,
  tags: [{ name: 'React', versions: [] }],
  team_membership: null,
  title: 'テスト記事',
  updated_at: '2025-01-02T00:00:00Z',
  url: 'https://qiita.com/test/items/test-id',
  user: {
    description: 'テストユーザー',
    facebook_id: '',
    followees_count: 0,
    followers_count: 0,
    github_login_name: null,
    id: 'test-user',
    items_count: 1,
    linkedin_id: '',
    location: '',
    name: 'テスト',
    organization: '',
    permanent_id: 1,
    profile_image_url: 'https://example.com/avatar.jpg',
    team_only: false,
    twitter_screen_name: '',
    website_url: '',
  },
  ...overrides,
});

describe('getQiitaArticles', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('正常にQiita記事を取得する', async () => {
    const mockArticle = createMockQiitaArticle();
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([mockArticle]),
    } as Response);

    const { getQiitaArticles } = await import('./qiita');
    const result = await getQiitaArticles();

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('テスト記事');
    expect(result[0].likes_count).toBe(10);
  });

  it('API失敗時に空配列を返す', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response);

    const { getQiitaArticles } = await import('./qiita');
    const result = await getQiitaArticles();

    expect(result).toEqual([]);
  });

  it('ネットワークエラー時に空配列を返す', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const { getQiitaArticles } = await import('./qiita');
    const result = await getQiitaArticles();

    expect(result).toEqual([]);
  });

  it('Zodパースエラー時に空配列を返す', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ invalid: 'data' }]),
    } as Response);

    const { getQiitaArticles } = await import('./qiita');
    const result = await getQiitaArticles();

    expect(result).toEqual([]);
  });
});
