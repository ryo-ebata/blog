import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const postsDirectory = path.join(process.cwd(), 'posts');

export interface PostMetadata {
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  icon?: string;
}

export interface PostData {
  slug: string;
  metadata: PostMetadata;
  html: string;
}

// 再帰的にMDXファイルを探索
function getAllMdxFiles(dir: string, baseDir: string = postsDirectory): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      // ディレクトリの場合は再帰的に探索
      files.push(...getAllMdxFiles(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      // ファイルの場合は相対パスを追加（拡張子を除く）
      const slug = relativePath.replace(/\.mdx$/, '');
      files.push(slug);
    }
  }

  return files;
}

// すべての記事を取得
export async function getAllPosts(): Promise<PostData[]> {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const slugs = getAllMdxFiles(postsDirectory);
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      try {
        return await getPostBySlug(slug);
      } catch {
        return null;
      }
    })
  );

  // nullを除外して日付でソート（新しい順）
  const validPosts = posts.filter((post): post is PostData => post !== null);
  return validPosts.sort((a, b) => (a.metadata.date > b.metadata.date ? -1 : 1));
}

// スラッグから記事を取得（slugはディレクトリ構造を含む可能性がある）
export async function getPostBySlug(slug: string | string[]): Promise<PostData> {
  // slugが配列の場合は結合（Next.jsの[...slug]から）
  const slugPath = Array.isArray(slug) ? slug.join('/') : slug;
  const fullPath = path.join(postsDirectory, `${slugPath}.mdx`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${slugPath}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Frontmatterを解析
  const { data, content } = matter(fileContents);

  // MDXをHTMLに変換
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypePrettyCode, {
      theme: 'github-dark',
      keepBackground: false,
    })
    .use(rehypeStringify)
    .process(content);

  return {
    slug: slugPath,
    metadata: {
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString().split('T')[0],
      description: data.description,
      tags: data.tags,
      icon: data.icon,
    },
    html: String(result),
  };
}
