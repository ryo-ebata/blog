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
        const { data } = matter(fileContents);

        // data.draftがtrueの場合はスキップ
        if (data.draft) {
          return null;
        }

        // slugが指定されていなければファイル名から生成
        const slug = data.slug || file.replace(/\.mdx$/, '');

        return {
          metadata: {
            slug,
            title: data.title || 'Untitled',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt || data.createdAt,
            description: data.description,
            tags: data.tags,
            icon: data.icon,
            author: data.author,
            draft: data.draft || false,
          },
          fileName: file,
        };
      })
    )
  ).filter((post) => post !== null);

  // 日付でソート（新しい順）
  return posts.sort((a, b) => (a.metadata.createdAt > b.metadata.createdAt ? -1 : 1));
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

  return posts.filter((post): post is PostData => post !== null);
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

    // slugが指定されていなければファイル名から生成
    const postSlug = data.slug || slugPath;

    // MDXを評価してReactコンポーネントを取得
    const { default: Content } = (await evaluate(content, mdxConfig)) as MDXModule;

    if (!Content) {
      throw new Error(`Failed to evaluate MDX content for: ${slugPath}`);
    }

    return {
      metadata: {
        slug: postSlug,
        title: data.title || 'Untitled',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt || data.createdAt,
        description: data.description,
        tags: data.tags,
        icon: data.icon,
        author: data.author,
        draft: data.draft || false,
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
