import { cacheTag } from 'next/cache';
import type { BaseContentMetadata } from '@/lib/content';
import { toBaseContentMetadata } from './types';
import type { BlogArticleData } from './types';
import { listArticleSlugs, isNodeError } from './fs-scan';
import { readArticleFile } from './read-article';
import { countMarkdownCharacters, extractPlainText } from './extract-text';
import { applyContentCacheLife } from './cache-policy';

const sortByDateDescending = (a: BaseContentMetadata, b: BaseContentMetadata): number => {
  const dateA = new Date(a.createdAt).getTime();
  const dateB = new Date(b.createdAt).getTime();
  return dateB - dateA;
};

export const getAllPostsMetadata = async (): Promise<BaseContentMetadata[]> => {
  'use cache';
  applyContentCacheLife();
  cacheTag('posts');

  const slugs = await listArticleSlugs();

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { frontmatter, content } = await readArticleFile(slug);
      const plainText = extractPlainText(content);
      return {
        ...toBaseContentMetadata(slug, frontmatter, plainText.length),
        searchText: plainText,
      };
    })
  );

  return posts.sort(sortByDateDescending);
};

export const getPostBySlug = async (slug: string | string[]): Promise<BlogArticleData> => {
  'use cache';
  applyContentCacheLife();
  cacheTag('posts');

  const slugPath = Array.isArray(slug) ? slug.join('/') : slug;
  cacheTag(`post-${slugPath}`);

  try {
    const { frontmatter, content } = await readArticleFile(slugPath);
    return {
      contentMarkdown: content,
      metadata: toBaseContentMetadata(slugPath, frontmatter, countMarkdownCharacters(content)),
    };
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      throw new Error(`Post not found: ${slugPath}`, { cause: error });
    }
    throw error;
  }
};
