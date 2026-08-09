import path from 'node:path';

export const BLOG_CONTENT_ROOT = path.join(process.cwd(), 'blog-obsidian', 'public', 'blogs');
export const BLOG_ASSETS_URL_PREFIX = '/blog-assets';
export const INDEX_FILE_NAME = 'index.md';

export const slugToArticleDir = (slug: string): string =>
  path.join(BLOG_CONTENT_ROOT, ...slug.split('/'));

export const slugToIndexFile = (slug: string): string =>
  path.join(slugToArticleDir(slug), INDEX_FILE_NAME);

/* 絶対URL・ルート相対URL・data URIはそのまま外部/既解決のURLとして扱う */
export const isResolvedUrl = (url: string): boolean =>
  url.startsWith('http://') ||
  url.startsWith('https://') ||
  url.startsWith('/') ||
  url.startsWith('data:');

/**
 * 記事ディレクトリ相対の画像パス(images/foo.png)を配信URL(/blog-assets/{slug}/images/foo.png)に解決する。
 * 既に解決済み(絶対URL/ルート相対/data URI)ならそのまま返す。
 * 本文中の画像(remark-resolve-images.ts)とフロントマターのeyecatch(types.ts)の両方から共通で使う。
 */
export const resolveAssetUrl = (slug: string, url: string): string => {
  if (isResolvedUrl(url)) {
    return url;
  }
  const normalizedPath = url.replace(/^\.?\//, '');
  return `${BLOG_ASSETS_URL_PREFIX}/${slug}/${normalizedPath}`;
};
