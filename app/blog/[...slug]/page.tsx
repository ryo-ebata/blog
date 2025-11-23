import { notFound } from 'next/navigation';
import { BackLink } from '@/components/blog/back-link';
import { BlogContainer } from '@/components/blog/blog-container';
import { PostContent } from '@/components/blog/post-content';
import { PostHeader } from '@/components/blog/post-header';
import { getAllPosts, getPostBySlug } from '@/lib/posts';

type Props = {
  params: Promise<{ slug: string[] }>;
};

// 静的パラメータ生成
export async function generateStaticParams() {
  const posts = await getAllPosts();
  // 上位50記事のみビルド時生成、残りはオンデマンド
  return posts.slice(0, 50).map((post) => ({
    slug: post.slug.split('/'),
  }));
}

// メタデータ生成（SEO対策）
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  try {
    const post = await getPostBySlug(slug);
    return {
      title: post.title,
      description: post.description,
      openGraph: {
        title: post.title,
        description: post.description,
        type: 'article',
        publishedTime: post.date,
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;

  let post: Awaited<ReturnType<typeof getPostBySlug>>;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <BlogContainer maxWidth="3xl">
      <BackLink />
      <PostHeader post={post} />
      <PostContent html={post.html} />
    </BlogContainer>
  );
}

// ISR設定
export const revalidate = 3600; // 1時間
export const dynamicParams = true; // 新しい記事をオンデマンド生成
