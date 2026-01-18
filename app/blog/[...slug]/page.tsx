import { generateMetadata as generatePageMetadata } from '@/lib/metadata';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { siteConfig } from '@/config/site';

import type { Metadata } from 'next';

import { BlogPostContainer } from './container';

interface Props {
  params: Promise<{ slug: string[] }>;
}

/* ISR設定: 1時間ごとに再検証 */
export const revalidate = 3600;

/* 新しい記事をオンデマンド生成 */
export const dynamicParams = true;

/*
 * 静的パラメータ生成
 */
export const generateStaticParams = async () => {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.metadata.slug.split('/'),
  }));
};

/*
 * 著者情報を取得するヘルパー関数
 */
const getAuthors = (author: string | undefined): string[] | undefined => {
  if (author) {
    return [author];
  }
  return undefined;
};

/*
 * 説明文を取得するヘルパー関数
 */
const getDescription = (description: string | undefined): string => {
  if (description) {
    return description;
  }
  return siteConfig.description;
};

/*
 * メタデータを生成するヘルパー関数
 */
const buildMetadata = (post: Awaited<ReturnType<typeof getPostBySlug>>): Metadata => {
  const postUrl = `${siteConfig.url}/blog/${post.metadata.slug}`;
  const authors = getAuthors(post.metadata.author);
  const description = getDescription(post.metadata.description);

  return generatePageMetadata({
    authors,
    description,
    imageAlt: post.metadata.title,
    modifiedTime: post.metadata.updatedAt,
    publishedTime: post.metadata.createdAt,
    tags: post.metadata.tags,
    title: post.metadata.title,
    type: 'article',
    url: postUrl,
  });
};

/*
 * メタデータ生成（SEO対策）
 */
export const generateMetadata = async ({ params }: Props) => {
  const { slug: pageSlug } = await params;

  try {
    const post = await getPostBySlug(pageSlug);
    return buildMetadata(post);
  } catch {
    return {};
  }
};

const BlogPostPage = async ({ params }: Props) => {
  const { slug: pageSlug } = await params;

  return <BlogPostContainer slug={pageSlug} />;
};

export default BlogPostPage;
