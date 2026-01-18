import { unstable_cache } from 'next/cache';
import path from 'node:path';
import {
  type BaseContentData,
  type BaseContentMetadata,
  countCharacters,
  getAllContent,
  getAllContentMetadataInternal,
  getContentBySlug,
  isFuturePost,
} from './content';

/* Content.tsから再エクスポート（後方互換性のため） */
export { countCharacters, isFuturePost };

/*
 * マジックナンバーの定数定義
 */
const CACHE_REVALIDATE_SECONDS = 3600;

const postsDirectory = path.join(process.cwd(), 'posts');

/*
 * PostMetadataはBaseContentMetadataのエイリアス
 */
export type PostMetadata = BaseContentMetadata;

/*
 * PostDataはBaseContentDataのエイリアス
 */
export type PostData = BaseContentData;

/*
 * メタデータのみを取得（内部実装）
 */
const getAllPostsMetadataInternal = () =>
  Promise.resolve(getAllContentMetadataInternal(postsDirectory));

/*
 * すべての記事のメタデータを取得（キャッシュ付き）
 */
export const getAllPostsMetadata = unstable_cache(
  getAllPostsMetadataInternal,
  ['all-posts-metadata'],
  {
    revalidate: CACHE_REVALIDATE_SECONDS,
    tags: ['posts'],
  }
);

/*
 * すべての記事を取得（メタデータ + Content）
 */
export const getAllPosts = async (): Promise<PostData[]> => {
  const postsWithFiles = await getAllPostsMetadata();
  return getAllContent(postsDirectory, postsWithFiles);
};

/*
 * スラッグから記事を取得
 */
export const getPostBySlug = (slug: string | string[]): Promise<PostData> =>
  getContentBySlug(slug, postsDirectory, 'Post');
