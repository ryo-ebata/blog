import type { ComponentType } from 'react';
import type { MDXModule } from 'mdx/types';
import { evaluate } from '@mdx-js/mdx';
import { mdxConfig } from '@/config/mdx';
import fs from 'node:fs';
import matter from 'gray-matter';
import path from 'node:path';

/**
 * 日付から時刻を除去して日付のみを取得する
 */
const getDateOnly = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

/**
 * 投稿が未来日付（予約投稿）かどうかをチェック
 */
export const isFuturePost = (
  createdAt: string,
  updatedAt: string,
  today: Date = new Date()
): boolean => {
  const todayDateOnly = getDateOnly(today);
  const createdDateOnly = getDateOnly(new Date(createdAt));
  const updatedDateOnly = getDateOnly(new Date(updatedAt));
  return createdDateOnly > todayDateOnly || updatedDateOnly > todayDateOnly;
};

/**
 * コードブロックとインラインコードを除去する
 */
const removeCodeBlocks = (text: string): string => {
  let result = text.replace(/```[\s\S]*?```/g, '');
  result = result.replace(/`[^`]+`/g, '');
  return result;
};

/**
 * 画像とリンク記法を除去する
 */
const removeLinksAndImages = (text: string): string => {
  let result = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');
  result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  return result;
};

/**
 * 見出し、リスト、引用、水平線記法を除去する
 */
const removeBlockElements = (text: string): string => {
  let result = text.replace(/^#{1,6}\s+/gm, '');
  result = result.replace(/^[\s]*[-*+]\s+/gm, '');
  result = result.replace(/^[\s]*\d+\.\s+/gm, '');
  result = result.replace(/^>\s+/gm, '');
  result = result.replace(/^[-*]{3,}$/gm, '');
  return result;
};

/**
 * 太字・斜体・打ち消し線記法を除去する
 */
const removeInlineFormatting = (text: string): string => {
  let result = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  result = result.replace(/\*([^*]+)\*/g, '$1');
  result = result.replace(/__([^_]+)__/g, '$1');
  result = result.replace(/_([^_]+)_/g, '$1');
  result = result.replace(/~~([^~]+)~~/g, '$1');
  return result;
};

/**
 * HTMLタグを除去し、空白を正規化する
 */
const normalizeWhitespace = (text: string): string => {
  let result = text.replace(/<[^>]+>/g, '');
  result = result.replace(/\s+/g, ' ');
  return result.trim();
};

/**
 * MDXコンテンツから文字数をカウント
 */
export const countCharacters = (content: string): number => {
  let text = removeCodeBlocks(content);
  text = removeLinksAndImages(text);
  text = removeBlockElements(text);
  text = removeInlineFormatting(text);
  text = normalizeWhitespace(text);
  return text.length;
};

/**
 * 共通のコンテンツメタデータ型
 */
export interface BaseContentMetadata {
  author?: string;
  characterCount?: number;
  createdAt: string;
  description?: string;
  draft?: boolean;
  icon?: string;
  slug: string;
  tags?: string[];
  title: string;
  updatedAt: string;
}

/**
 * 共通のコンテンツデータ型
 */
export interface BaseContentData {
  Content: ComponentType;
  metadata: BaseContentMetadata;
}

/**
 * メタデータとファイル名のペア
 */
export interface ContentMetadataWithFile {
  fileName: string;
  metadata: BaseContentMetadata;
}

/**
 * Gray-matterから取得したデータの型
 */
interface FrontmatterData {
  author?: string;
  createdAt: string;
  description?: string;
  draft?: boolean;
  icon?: string;
  slug?: string;
  tags?: string[];
  title?: string;
  updatedAt?: string;
}

/**
 * 日付でコンテンツをソートする
 */
const sortByDate = <TContent extends { metadata: BaseContentMetadata }>(
  contents: TContent[]
): TContent[] =>
  contents.sort((contentA, contentB) => {
    const dateA = new Date(contentA.metadata.updatedAt || contentA.metadata.createdAt).getTime();
    const dateB = new Date(contentB.metadata.updatedAt || contentB.metadata.createdAt).getTime();
    return dateB - dateA;
  });

/**
 * Frontmatterデータからメタデータを構築する
 */
const buildMetadata = (
  data: FrontmatterData,
  slug: string,
  characterCount: number
): BaseContentMetadata => {
  const updatedAt = data.updatedAt || data.createdAt;
  return {
    author: data.author,
    characterCount,
    createdAt: data.createdAt,
    description: data.description,
    draft: data.draft || false,
    icon: data.icon,
    slug,
    tags: data.tags,
    title: data.title || 'Untitled',
    updatedAt,
  };
};

/**
 * 単一ファイルからメタデータを抽出する
 */
const extractMetadataFromFile = (
  directory: string,
  file: string
): ContentMetadataWithFile | null => {
  const filePath = path.join(directory, file);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContents);
  const frontmatter = data as FrontmatterData;

  /*
   * Data.draftがtrueの場合はスキップ
   */
  if (frontmatter.draft) {
    return null;
  }

  const updatedAt = frontmatter.updatedAt || frontmatter.createdAt;

  /*
   * 未来日付（予約投稿）の場合はスキップ
   */
  if (isFuturePost(frontmatter.createdAt, updatedAt)) {
    return null;
  }

  const slug = frontmatter.slug || file.replace(/\.mdx$/, '');
  const characterCount = countCharacters(content);

  return {
    fileName: file,
    metadata: buildMetadata(frontmatter, slug, characterCount),
  };
};

/**
 * メタデータのみを取得（内部実装）
 */
export const getAllContentMetadataInternal = (directory: string): ContentMetadataWithFile[] => {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const files = fs.readdirSync(directory).filter((file) => file.endsWith('.mdx'));

  const contents = files
    .map((file) => extractMetadataFromFile(directory, file))
    .filter((content) => content !== null);

  return sortByDate(contents);
};

/**
 * MDXコンテンツを評価してReactコンポーネントを取得する
 */
const evaluateMdxContent = async (content: string): Promise<ComponentType | null> => {
  const { default: Content } = (await evaluate(content, mdxConfig)) as MDXModule;
  return Content || null;
};

/**
 * 単一コンテンツファイルを処理する
 */
const processContentFile = async (
  directory: string,
  fileName: string,
  metadata: BaseContentMetadata
): Promise<BaseContentData | null> => {
  try {
    const filePath = path.join(directory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { content } = matter(fileContents);

    const Content = await evaluateMdxContent(content);

    if (!Content) {
      return null;
    }

    return { Content, metadata };
  } catch {
    return null;
  }
};

/**
 * すべてのコンテンツを取得（メタデータ + Content）
 */
export const getAllContent = async (
  directory: string,
  metadataList: ContentMetadataWithFile[]
): Promise<BaseContentData[]> => {
  const contents = await Promise.all(
    metadataList.map(({ fileName, metadata }) => processContentFile(directory, fileName, metadata))
  );

  const filteredContents = contents.filter(
    (content): content is BaseContentData => content !== null
  );

  return sortByDate(filteredContents);
};

/**
 * スラッグからファイルパスを解決し、存在確認を行う
 */
const resolveContentFilePath = (
  slug: string | string[],
  directory: string,
  contentType: string
): { filePath: string; slugPath: string } => {
  const slugPath = Array.isArray(slug) ? slug.join('/') : slug;
  const filePath = path.join(directory, `${slugPath}.mdx`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`${contentType} not found: ${slugPath}`);
  }

  return { filePath, slugPath };
};

/**
 * Frontmatterのバリデーションを行う
 */
const validateFrontmatter = (
  data: FrontmatterData,
  slugPath: string,
  contentType: string
): void => {
  if (data.draft) {
    throw new Error(`${contentType} not found: ${slugPath}`);
  }

  const updatedAt = data.updatedAt || data.createdAt;

  if (isFuturePost(data.createdAt, updatedAt)) {
    throw new Error(`${contentType} not found: ${slugPath}`);
  }
};

/**
 * ファイルからコンテンツデータを構築する
 */
const buildContentData = async (
  filePath: string,
  slugPath: string,
  contentType: string
): Promise<BaseContentData> => {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContents);
  const frontmatter = data as FrontmatterData;

  validateFrontmatter(frontmatter, slugPath, contentType);

  const contentSlug = frontmatter.slug || slugPath;
  const Content = await evaluateMdxContent(content);

  if (!Content) {
    throw new Error(`Failed to evaluate MDX content for: ${slugPath}`);
  }

  const characterCount = countCharacters(content);

  return {
    Content,
    metadata: buildMetadata(frontmatter, contentSlug, characterCount),
  };
};

/**
 * スラッグからコンテンツを取得
 */
export const getContentBySlug = async (
  slug: string | string[],
  directory: string,
  contentType: string
): Promise<BaseContentData> => {
  const { slugPath, filePath } = resolveContentFilePath(slug, directory, contentType);

  try {
    return await buildContentData(filePath, slugPath, contentType);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load ${contentType} "${slugPath}": ${error.message}`, {
        cause: error,
      });
    }
    throw new Error(`Failed to load ${contentType} "${slugPath}"`, { cause: error });
  }
};
