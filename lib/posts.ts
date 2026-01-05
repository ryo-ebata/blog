import path from 'node:path';
import { unstable_cache } from 'next/cache';
import type { BaseContentData, BaseContentMetadata } from './content';
import { getAllContent, getAllContentMetadataInternal, getContentBySlug } from './content';

const postsDirectory = path.join(process.cwd(), 'posts');

// PostMetadataはBaseContentMetadataのエイリアス
export type PostMetadata = BaseContentMetadata;

// PostDataはBaseContentDataのエイリアス
export type PostData = BaseContentData;

/**
 * 投稿が未来日付（予約投稿）かどうかをチェック
 * createdAtまたはupdatedAtが現在日付より未来の場合、trueを返す
 * 時刻は無視し、日付のみで比較する
 * @param createdAt 作成日（YYYY-MM-DD形式）
 * @param updatedAt 更新日（YYYY-MM-DD形式）
 * @param today 現在の日付（デフォルトは現在時刻）
 */
export function isFuturePost(
  createdAt: string,
  updatedAt: string,
  today: Date = new Date()
): boolean {
  // 現在の日付を00:00:00に設定（時刻を無視）
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const createdDate = new Date(createdAt);
  // 作成日の日付を00:00:00に設定（時刻を無視）
  const createdDateOnly = new Date(
    createdDate.getFullYear(),
    createdDate.getMonth(),
    createdDate.getDate()
  );

  const updatedDate = new Date(updatedAt);
  // 更新日の日付を00:00:00に設定（時刻を無視）
  const updatedDateOnly = new Date(
    updatedDate.getFullYear(),
    updatedDate.getMonth(),
    updatedDate.getDate()
  );

  // createdAtまたはupdatedAtが未来日付の場合、予約投稿とみなす
  // 同じ日付の場合は表示する（> ではなく >= を使わない）
  return createdDateOnly > todayDateOnly || updatedDateOnly > todayDateOnly;
}

/**
 * MDXコンテンツから文字数をカウント
 * Markdownの記法（見出し、リンク、画像、コードブロックなど）を除去してテキストのみをカウント
 */
export function countCharacters(content: string): number {
  // コードブロックを除去（```で囲まれた部分）
  let text = content.replace(/```[\s\S]*?```/g, '');

  // インラインコードを除去（`で囲まれた部分）
  text = text.replace(/`[^`]+`/g, '');

  // 画像記法を除去（![alt](url)）
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');

  // リンク記法を除去（[text](url)）
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 見出し記法を除去（#）
  text = text.replace(/^#{1,6}\s+/gm, '');

  // リスト記法を除去（-、*、+、数字.）
  text = text.replace(/^[\s]*[-*+]\s+/gm, '');
  text = text.replace(/^[\s]*\d+\.\s+/gm, '');

  // 引用記法を除去（>）
  text = text.replace(/^>\s+/gm, '');

  // 水平線を除去（---、***）
  text = text.replace(/^[-*]{3,}$/gm, '');

  // 太字・斜体記法を除去（**、*、__、_）
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');
  text = text.replace(/_([^_]+)_/g, '$1');

  // 打ち消し線を除去（~~）
  text = text.replace(/~~([^~]+)~~/g, '$1');

  // HTMLタグを除去
  text = text.replace(/<[^>]+>/g, '');

  // 改行、タブ、連続する空白を単一の空白に変換
  text = text.replace(/\s+/g, ' ');

  // 前後の空白を除去
  text = text.trim();

  // 文字数をカウント（空白を含む）
  return text.length;
}

// メタデータのみを取得（内部実装）
async function getAllPostsMetadataInternal() {
  return getAllContentMetadataInternal(postsDirectory);
}

// すべての記事のメタデータを取得（キャッシュ付き）
export const getAllPostsMetadata = unstable_cache(
  getAllPostsMetadataInternal,
  ['all-posts-metadata'],
  {
    revalidate: 3600, // 1時間ごとに再検証
    tags: ['posts'],
  }
);

// すべての記事を取得（メタデータ + Content）
export async function getAllPosts(): Promise<PostData[]> {
  const postsWithFiles = await getAllPostsMetadata();
  return getAllContent(postsDirectory, postsWithFiles);
}

// スラッグから記事を取得
export async function getPostBySlug(slug: string | string[]): Promise<PostData> {
  return getContentBySlug(slug, postsDirectory, 'Post');
}
