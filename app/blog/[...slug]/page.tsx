import { siteConfig } from '@/config/site';
import { generateMetadata as generatePageMetadata } from '@/lib/metadata';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { BlogPostContainer } from './container';

interface Props {
  params: Promise<{ slug: string[] }>;
}

// 静的パラメータ生成
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.metadata.slug.split('/'),
  }));
}

// メタデータ生成（SEO対策）
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  try {
    const post = await getPostBySlug(slug);
    const postUrl = `${siteConfig.url}/blog/${post.metadata.slug}`;

    return generatePageMetadata({
      authors: post.metadata.author ? [post.metadata.author] : undefined,
      description: post.metadata.description || siteConfig.description,
      imageAlt: post.metadata.title,
      modifiedTime: post.metadata.updatedAt,
      publishedTime: post.metadata.createdAt,
      tags: post.metadata.tags,
      title: post.metadata.title,
      type: 'article',
      url: postUrl,
    });
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  return <BlogPostContainer slug={slug} />;
}

// ISR設定
export const revalidate = 3600; // 1時間
export const dynamicParams = true; // 新しい記事をオンデマンド生成
