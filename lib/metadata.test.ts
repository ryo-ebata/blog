import { describe, expect, it } from 'vitest';
import { generateMetadata } from './metadata';

describe('generateMetadata', () => {
  describe('websiteタイプ', () => {
    it('基本的なメタデータを生成する', () => {
      const result = generateMetadata({
        title: 'テストタイトル',
        description: 'テスト説明',
      });

      expect(result.title).toBe('テストタイトル');
      expect(result.description).toBe('テスト説明');
    });

    it('OGPメタデータを含む', () => {
      const result = generateMetadata({
        title: 'テストタイトル',
        description: 'テスト説明',
      });

      expect(result.openGraph).toBeDefined();
      expect(result.openGraph).toMatchObject({
        description: 'テスト説明',
        locale: 'ja_JP',
        type: 'website',
      });
    });

    it('websiteタイプではサイト名付きのOGタイトルを生成する', () => {
      const result = generateMetadata({
        title: 'テストタイトル',
        description: 'テスト説明',
      });

      const ogTitle = result.openGraph && 'title' in result.openGraph ? result.openGraph.title : '';
      expect(ogTitle).toContain('テストタイトル');
      expect(ogTitle).toContain('|');
    });

    it('Twitterカードメタデータを含む', () => {
      const result = generateMetadata({
        title: 'テストタイトル',
        description: 'テスト説明',
      });

      expect(result.twitter).toBeDefined();
      const twitterCard =
        result.twitter && 'card' in result.twitter ? result.twitter.card : undefined;
      expect(twitterCard).toBe('summary_large_image');
    });
  });

  describe('articleタイプ', () => {
    it('記事メタデータを生成する', () => {
      const result = generateMetadata({
        title: '記事タイトル',
        description: '記事説明',
        type: 'article',
        publishedTime: '2025-01-01T00:00:00Z',
        modifiedTime: '2025-01-02T00:00:00Z',
        tags: ['React', 'TypeScript'],
      });

      expect(result.openGraph).toBeDefined();
      if (result.openGraph && 'type' in result.openGraph) {
        expect(result.openGraph.type).toBe('article');
      }
    });

    it('articleタイプではサイト名なしのOGタイトルを生成する', () => {
      const result = generateMetadata({
        title: '記事タイトル',
        description: '記事説明',
        type: 'article',
      });

      const ogTitle = result.openGraph && 'title' in result.openGraph ? result.openGraph.title : '';
      expect(ogTitle).toBe('記事タイトル');
    });
  });

  describe('OGP画像', () => {
    it('画像指定なしの場合openGraphにimagesプロパティが存在しない', () => {
      const result = generateMetadata({
        title: 'テスト',
        description: 'テスト',
      });

      expect(result.openGraph).toBeDefined();
      expect(result.openGraph).not.toHaveProperty('images');
    });

    it('画像指定なしの場合twitterにimagesプロパティが存在しない', () => {
      const result = generateMetadata({
        title: 'テスト',
        description: 'テスト',
      });

      expect(result.twitter).toBeDefined();
      expect(result.twitter).not.toHaveProperty('images');
    });

    it('絶対URLの画像をそのまま使用する', () => {
      const result = generateMetadata({
        title: 'テスト',
        description: 'テスト',
        image: 'https://example.com/image.jpg',
      });

      const images =
        result.openGraph && 'images' in result.openGraph ? result.openGraph.images : [];
      expect(Array.isArray(images) && images.length > 0 ? images[0] : {}).toMatchObject({
        url: 'https://example.com/image.jpg',
      });
    });

    it('相対パスの画像にサイトURLを付与する', () => {
      const result = generateMetadata({
        title: 'テスト',
        description: 'テスト',
        image: '/custom-image.jpg',
      });

      const images =
        result.openGraph && 'images' in result.openGraph ? result.openGraph.images : [];
      expect(Array.isArray(images) && images.length > 0 ? images[0] : {}).toMatchObject({
        url: expect.stringContaining('/custom-image.jpg'),
      });
    });
  });
});
