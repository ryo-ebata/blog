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

import type { ContentMetadataWithFile } from '@/lib/content';
import type { MetadataRoute } from 'next';
import { getAllPostsMetadata } from '@/lib/posts';
import { siteConfig } from '@/config/site';

/* 優先度定数 */
const PRIORITY_HIGHEST = 1;
const PRIORITY_HIGH = 0.8;
const PRIORITY_MEDIUM = 0.7;

/**
 * 静的ページのサイトマップエントリを生成する
 */
const createStaticPages = (): MetadataRoute.Sitemap => {
  const now = new Date();
  return [
    {
      changeFrequency: 'monthly',
      lastModified: now,
      priority: PRIORITY_HIGHEST,
      url: siteConfig.url,
    },
    {
      changeFrequency: 'monthly',
      lastModified: now,
      priority: PRIORITY_HIGH,
      url: `${siteConfig.url}/about`,
    },
    {
      changeFrequency: 'daily',
      lastModified: now,
      priority: PRIORITY_HIGH,
      url: `${siteConfig.url}/blog`,
    },
  ];
};

/**
 * ブログ記事のサイトマップエントリを生成する
 */
const createBlogPostEntries = (posts: ContentMetadataWithFile[]): MetadataRoute.Sitemap =>
  posts.map((post: ContentMetadataWithFile) => ({
    changeFrequency: 'weekly',
    lastModified: new Date(post.metadata.updatedAt || post.metadata.createdAt),
    priority: PRIORITY_MEDIUM,
    url: `${siteConfig.url}/blog/${post.metadata.slug}`,
  }));

/**
 * サイトマップを生成する関数
 */
const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const posts = await getAllPostsMetadata();
  const staticPages = createStaticPages();
  const blogPosts = createBlogPostEntries(posts);

  return [...staticPages, ...blogPosts];
};

export default sitemap;
