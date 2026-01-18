import fs from 'node:fs';
import path from 'node:path';
import { evaluate } from '@mdx-js/mdx';
import matter from 'gray-matter';
import type { MDXModule } from 'mdx/types';
import type { ComponentType } from 'react';
import { mdxConfig } from '@/config/mdx';
import { countCharacters, isFuturePost } from './posts';

/**
 * 共通のコンテンツメタデータ型
 */
export interface BaseContentMetadata {
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

/**
 * 共通のコンテンツデータ型
 */
export interface BaseContentData {
  metadata: BaseContentMetadata;
  Content: ComponentType;
}

/**
 * メタデータとファイル名のペア
 */
export interface ContentMetadataWithFile {
  metadata: BaseContentMetadata;
  fileName: string;
}

/**
 * メタデータのみを取得（内部実装）
 */
export function getAllContentMetadataInternal(directory: string): ContentMetadataWithFile[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const files = fs.readdirSync(directory).filter((file) => file.endsWith('.mdx'));

  const contents = files
    .map((file) => {
      const filePath = path.join(directory, file);
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
    .filter((content) => content !== null);

  // 日付でソート（新しい順、updatedAtがあれば優先）
  return contents.sort((a, b) => {
    const dateA = new Date(a.metadata.updatedAt || a.metadata.createdAt).getTime();
    const dateB = new Date(b.metadata.updatedAt || b.metadata.createdAt).getTime();
    return dateB - dateA;
  });
}

/**
 * すべてのコンテンツを取得（メタデータ + Content）
 */
export async function getAllContent(
  directory: string,
  metadataList: ContentMetadataWithFile[]
): Promise<BaseContentData[]> {
  const contents: (BaseContentData | null)[] = await Promise.all(
    metadataList.map(async ({ metadata, fileName }): Promise<BaseContentData | null> => {
      try {
        const filePath = path.join(directory, fileName);
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
        console.error(`Failed to load content "${fileName}":`, error);
        return null;
      }
    })
  );

  const filteredContents = contents.filter(
    (content): content is BaseContentData => content !== null
  );

  // 日付でソート（新しい順、updatedAtがあれば優先）
  return filteredContents.sort((a, b) => {
    const dateA = new Date(a.metadata.updatedAt || a.metadata.createdAt).getTime();
    const dateB = new Date(b.metadata.updatedAt || b.metadata.createdAt).getTime();
    return dateB - dateA;
  });
}

/**
 * スラッグからコンテンツを取得
 */
export async function getContentBySlug(
  slug: string | string[],
  directory: string,
  contentType: string
): Promise<BaseContentData> {
  const slugPath = Array.isArray(slug) ? slug.join('/') : slug;
  const filePath = path.join(directory, `${slugPath}.mdx`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`${contentType} not found: ${slugPath}`);
  }

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    // draftがtrueの場合はエラー
    if (data.draft) {
      throw new Error(`${contentType} not found: ${slugPath}`);
    }

    // createdAtとupdatedAtを取得
    const createdAt = data.createdAt;
    const updatedAt = data.updatedAt || data.createdAt;

    // 未来日付（予約投稿）の場合はエラー
    if (isFuturePost(createdAt, updatedAt)) {
      throw new Error(`${contentType} not found: ${slugPath}`);
    }

    // slugが指定されていなければファイル名から生成
    const contentSlug = data.slug || slugPath;

    // MDXを評価してReactコンポーネントを取得
    const { default: Content } = (await evaluate(content, mdxConfig)) as MDXModule;

    if (!Content) {
      throw new Error(`Failed to evaluate MDX content for: ${slugPath}`);
    }

    // 文字数をカウント
    const characterCount = countCharacters(content);

    return {
      metadata: {
        slug: contentSlug,
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
      throw new Error(`Failed to load ${contentType} "${slugPath}": ${error.message}`, {
        cause: error,
      });
    }
    throw new Error(`Failed to load ${contentType} "${slugPath}"`, { cause: error });
  }
}
