import fs from 'node:fs';
import path from 'node:path';
import { evaluate } from '@mdx-js/mdx';
import matter from 'gray-matter';
import type { MDXModule } from 'mdx/types';
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
}

export interface PostData {
  metadata: PostMetadata;
  Content: React.ComponentType;
}

// すべての記事を取得
export async function getAllPosts(): Promise<PostData[]> {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const files = fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.mdx'));

  const posts = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(postsDirectory, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      // slugが指定されていなければファイル名から生成
      const slug = data.slug || file.replace(/\.mdx$/, '');

      // MDXを評価してReactコンポーネントを取得
      const { default: Content } = (await evaluate(content, mdxConfig)) as MDXModule;

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
        },
        Content,
      };
    })
  );

  // 日付でソート（新しい順）
  return posts.sort((a, b) => (a.metadata.createdAt > b.metadata.createdAt ? -1 : 1));
}

// スラッグから記事を取得
export async function getPostBySlug(slug: string | string[]): Promise<PostData> {
  const slugPath = Array.isArray(slug) ? slug.join('/') : slug;
  const posts = await getAllPosts();
  const post = posts.find((p) => p.metadata.slug === slugPath);

  if (!post) {
    throw new Error(`Post not found: ${slugPath}`);
  }

  return post;
}
