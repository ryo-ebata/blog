import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { BLOG_CONTENT_ROOT, INDEX_FILE_NAME } from './paths';

const EXCLUDED_DIR_NAMES = new Set(['images']);

export const isNodeError = (error: unknown): error is NodeJS.ErrnoException =>
  error instanceof Error && 'code' in error;

const scanDir = async (dir: string, relativeSegments: string[]): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true });
  const slugs: string[] = [];

  const hasIndexFile = entries.some((entry) => entry.isFile() && entry.name === INDEX_FILE_NAME);
  if (hasIndexFile && relativeSegments.length > 0) {
    slugs.push(relativeSegments.join('/'));
  }

  const nestedSlugs = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory() && !EXCLUDED_DIR_NAMES.has(entry.name))
      .map((entry) => scanDir(path.join(dir, entry.name), [...relativeSegments, entry.name]))
  );
  slugs.push(...nestedSlugs.flat());

  return slugs;
};

/** blog-obsidian/public/blogs配下からindex.mdを持つディレクトリを再帰探索し、slug一覧を返す */
export const listArticleSlugs = async (): Promise<string[]> => {
  try {
    return await scanDir(BLOG_CONTENT_ROOT, []);
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};
