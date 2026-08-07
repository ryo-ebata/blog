import { readFile } from 'node:fs/promises';
import matter from 'gray-matter';
import { frontmatterSchema, type Frontmatter } from './types';
import { slugToIndexFile } from './paths';

export interface RawArticle {
  frontmatter: Frontmatter;
  content: string;
}

export const readArticleFile = async (slug: string): Promise<RawArticle> => {
  const filePath = slugToIndexFile(slug);
  const raw = await readFile(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const frontmatter = frontmatterSchema.parse(data);
  return { frontmatter, content: content.trim() };
};
