import { cacheLife } from 'next/cache';

const isDev = process.env.NODE_ENV === 'development';

/**
 * ブログコンテンツを扱う'use cache'関数(blog.ts, content-renderer.tsx)の共通キャッシュポリシー。
 * 開発中はMarkdown編集を数秒で反映させ、本番はcacheComponents/PPRの安定性を優先する。
 * cacheLifeは引数のユニオン型に対してオーバーロード解決できないため呼び出し自体を分岐する。
 */
export const applyContentCacheLife = (): void => {
  if (isDev) {
    cacheLife({ stale: 5, revalidate: 5, expire: 10 });
    return;
  }
  cacheLife('hours');
};
