import { getAllPostsMetadata } from '@/lib/blog-content/blog';
import { siteConfig } from '@/config/site';

/**
 * JSON Feed 1.1 (https://jsonfeed.org/version/1.1) を配信する。
 * 既存の RSS(app/rss.xml) と同じく getAllPostsMetadata の結果を変換する。
 */
export const GET = async () => {
  const posts = await getAllPostsMetadata();
  const siteUrl = siteConfig.url;

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: siteConfig.name,
    description: siteConfig.description,
    home_page_url: siteUrl,
    feed_url: `${siteUrl}/feed.json`,
    language: 'ja',
    items: posts.map((post) => {
      const url = `${siteUrl}/blog/${post.slug}`;
      return {
        id: url,
        url,
        title: post.title,
        date_published: new Date(post.createdAt).toISOString(),
        ...(post.updatedAt && { date_modified: new Date(post.updatedAt).toISOString() }),
        ...(post.description && { summary: post.description }),
        ...(post.tags && post.tags.length > 0 && { tags: post.tags }),
      };
    }),
  };

  return new Response(JSON.stringify(feed), {
    headers: {
      'content-type': 'application/feed+json; charset=utf-8',
    },
  });
};
