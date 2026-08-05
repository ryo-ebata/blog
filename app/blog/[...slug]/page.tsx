import { generateMetadata as generatePageMetadata } from '@/lib/metadata';
import { getAllPostsMetadata, getPostBySlug } from '@/lib/micro-cms/blog';
import type { MicroCMSContentData } from '@/lib/micro-cms/types';
import { siteConfig } from '@/config/site';

import type { Metadata } from 'next';

import { BlogPostContainer } from './container';

interface Props {
  params: Promise<{ slug: string[] }>;
}

/* dynamicParams(旧: false固定の完全SSG)はcacheComponentsと非互換のため廃止。
   generateStaticParamsに無いslugはビルド後の新ISR挙動(即座にloading.tsxの
   App Shellを表示し裏で完全prerenderへ昇格)でオンデマンド生成される。
   本当に存在しないslugはBlogPostContainer側でgetPostBySlug失敗時にnotFound()
   を呼ぶため、404という見た目の挙動は変わらない。 */

/*
 * 静的パラメータ生成
 */
export const generateStaticParams = async () => {
  const posts = await getAllPostsMetadata();
  return posts.map((post) => ({
    slug: post.slug.split('/'),
  }));
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
const buildMetadata = (post: MicroCMSContentData): Metadata => {
  const postUrl = `${siteConfig.url}/blog/${post.metadata.slug}`;
  const description = getDescription(post.metadata.description);

  /* eyecatch があればそれを OG に、無ければ記事タイトル焼き込みの動的 OG を使う */
  const ogImage =
    post.metadata.eyecatch?.url ??
    `${siteConfig.url}/og?title=${encodeURIComponent(post.metadata.title)}`;

  return generatePageMetadata({
    description,
    image: ogImage,
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
