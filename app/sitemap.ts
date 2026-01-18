/**
 * サイトマップ生成ファイル
 *
 * Next.jsのMetadataRoute.Sitemap型を使用して、サイトの構造を検索エンジンに伝えるための
 * XMLサイトマップを動的に生成します。
 *
 * このファイルはNext.jsの特別なファイル名規則に従っており、`/sitemap.xml`として
 * 自動的に公開されます。検索エンジンクローラーがサイトのページを効率的に発見できるようになります。
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { getAllPostsMetadata } from '@/lib/posts';

/**
 * サイトマップを生成する関数
 *
 * Next.jsのMetadataRoute.Sitemap型に準拠したサイトマップエントリの配列を返します。
 * 各エントリには、URL、最終更新日、更新頻度、優先度などの情報が含まれます。
 *
 * この関数は以下のページを含みます：
 * - トップページ
 * - アバウトページ
 * - ブログ一覧ページ
 * - 各ブログ記事ページ（postsフォルダ内のMDXファイル）
 *
 * 注意: draft: trueの記事は自動的に除外されます（getAllPostsMetadata内で処理）。
 *
 * @returns {Promise<MetadataRoute.Sitemap>} サイトマップエントリの配列
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // すべての公開済み記事のメタデータを取得
  // Draft: trueの記事は自動的に除外される
  const posts = await getAllPostsMetadata();

  // 基本ページのサイトマップエントリ
  const staticPages: MetadataRoute.Sitemap = [
    // トップページ（ルートURL）
    {
      // サイトのルートURL
      url: siteConfig.url,
      // 最終更新日時（現在の日時を設定）
      lastModified: new Date(),
      // 更新頻度: 'monthly' - 月に1回程度更新されることを示す
      // その他の値: 'always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'
      changeFrequency: 'monthly',
      // 優先度: 1.0（最高）- トップページは最も重要なので最高優先度を設定
      // 範囲: 0.0 ～ 1.0
      priority: 1,
    },
    // アバウトページ
    {
      // アバウトページのURL
      url: `${siteConfig.url}/about`,
      // 最終更新日時（現在の日時を設定）
      lastModified: new Date(),
      // 更新頻度: 'monthly' - 月に1回程度更新されることを示す
      changeFrequency: 'monthly',
      // 優先度: 0.8 - トップページより低いが、重要なページとして設定
      priority: 0.8,
    },
    // ブログ一覧ページ
    {
      // ブログ一覧ページのURL
      url: `${siteConfig.url}/blog`,
      // 最終更新日時（現在の日時を設定）
      lastModified: new Date(),
      // 更新頻度: 'daily' - ブログは頻繁に更新されるため、日次更新を示す
      changeFrequency: 'daily',
      // 優先度: 0.8 - アバウトページと同様の優先度
      priority: 0.8,
    },
  ];

  // 各ブログ記事のサイトマップエントリを生成
  const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
    // ブログ記事のURL: /blog/[slug]の形式
    url: `${siteConfig.url}/blog/${post.metadata.slug}`,
    // 最終更新日時: 記事のupdatedAtを使用（なければcreatedAt）
    // Dateオブジェクトに変換（YYYY-MM-DD形式の文字列をDateに変換）
    lastModified: new Date(post.metadata.updatedAt || post.metadata.createdAt),
    // 更新頻度: 'weekly' - ブログ記事は週に1回程度更新される可能性があることを示す
    changeFrequency: 'weekly',
    // 優先度: 0.7 - 個別記事は一覧ページより低い優先度
    priority: 0.7,
  }));

  // 基本ページとブログ記事を結合して返す
  return [...staticPages, ...blogPosts];
}
