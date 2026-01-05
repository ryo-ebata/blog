import fs from 'node:fs';
import path from 'node:path';
import { evaluate } from '@mdx-js/mdx';
import matter from 'gray-matter';
import type { MDXModule } from 'mdx/types';
import { unstable_cache } from 'next/cache';
import type { ComponentType } from 'react';
import { mdxConfig } from '@/config/mdx';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostMetadata {
  slug: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  tags?: string[];
  icon?: string;
  author?: string;
  draft?: boolean;
  characterCount?: number;
}

export interface PostData {
  metadata: PostMetadata;
  Content: ComponentType;
}

// メタデータとファイル名のペア
interface PostMetadataWithFile {
  metadata: PostMetadata;
  fileName: string;
}

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
function countCharacters(content: string): number {
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
async function getAllPostsMetadataInternal(): Promise<PostMetadataWithFile[]> {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const files = fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.mdx'));

  const posts = (
    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(postsDirectory, file);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        // data.draftがtrueの場合はスキップ
        if (data.draft) {
          return null;
        }

        // createdAtとupdatedAtを取得
        const createdAt = data.createdAt;
        const updatedAt = data.updatedAt || data.createdAt;

        // 未来日付（予約投稿）の場合はスキップ
        if (isFuturePost(createdAt, updatedAt)) {
          return null;
        }

        // slugが指定されていなければファイル名から生成
        const slug = data.slug || file.replace(/\.mdx$/, '');

        // 文字数をカウント
        const characterCount = countCharacters(content);

        return {
          metadata: {
            slug,
            title: data.title || 'Untitled',
            createdAt,
            updatedAt,
            description: data.description,
            tags: data.tags,
            icon: data.icon,
            author: data.author,
            draft: data.draft || false,
            characterCount,
          },
          fileName: file,
        };
      })
    )
  ).filter((post) => post !== null);

  // 日付でソート（新しい順、updatedAtがあれば優先）
  return posts.sort((a, b) => {
    const dateA = new Date(a.metadata.updatedAt || a.metadata.createdAt).getTime();
    const dateB = new Date(b.metadata.updatedAt || b.metadata.createdAt).getTime();
    return dateB - dateA;
  });
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

  const posts: (PostData | null)[] = await Promise.all(
    postsWithFiles.map(async ({ metadata, fileName }): Promise<PostData | null> => {
      try {
        const filePath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { content } = matter(fileContents);

        // MDXを評価してReactコンポーネントを取得
        const { default: Content } = (await evaluate(content, mdxConfig)) as MDXModule;

        if (!Content) {
          console.warn(`Failed to evaluate MDX content for: ${fileName}`);
          return null;
        }

        return {
          metadata,
          Content,
        };
      } catch (error) {
        console.error(`Failed to load post "${fileName}":`, error);
        return null;
      }
    })
  );

  const filteredPosts = posts.filter((post): post is PostData => post !== null);

  // 日付でソート（新しい順、updatedAtがあれば優先）
  return filteredPosts.sort((a, b) => {
    const dateA = new Date(a.metadata.updatedAt || a.metadata.createdAt).getTime();
    const dateB = new Date(b.metadata.updatedAt || b.metadata.createdAt).getTime();
    return dateB - dateA;
  });
}

// スラッグから記事を取得
export async function getPostBySlug(slug: string | string[]): Promise<PostData> {
  const slugPath = Array.isArray(slug) ? slug.join('/') : slug;
  const filePath = path.join(postsDirectory, `${slugPath}.mdx`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Post not found: ${slugPath}`);
  }

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    // draftがtrueの場合はエラー
    if (data.draft) {
      throw new Error(`Post not found: ${slugPath}`);
    }

    // createdAtとupdatedAtを取得
    const createdAt = data.createdAt;
    const updatedAt = data.updatedAt || data.createdAt;

    // 未来日付（予約投稿）の場合はエラー
    if (isFuturePost(createdAt, updatedAt)) {
      throw new Error(`Post not found: ${slugPath}`);
    }

    // slugが指定されていなければファイル名から生成
    const postSlug = data.slug || slugPath;

    // MDXを評価してReactコンポーネントを取得
    const { default: Content } = (await evaluate(content, mdxConfig)) as MDXModule;

    if (!Content) {
      throw new Error(`Failed to evaluate MDX content for: ${slugPath}`);
    }

    // 文字数をカウント
    const characterCount = countCharacters(content);

    return {
      metadata: {
        slug: postSlug,
        title: data.title || 'Untitled',
        createdAt,
        updatedAt,
        description: data.description,
        tags: data.tags,
        icon: data.icon,
        author: data.author,
        draft: data.draft || false,
        characterCount,
      },
      Content,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load post "${slugPath}": ${error.message}`);
    }
    throw new Error(`Failed to load post "${slugPath}"`);
  }
}
