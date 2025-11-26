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
    return {
      title: post.metadata.title,
      description: post.metadata.description,
      openGraph: {
        title: post.metadata.title,
        description: post.metadata.description,
        type: 'article',
        publishedTime: post.metadata.date,
      },
    };
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
