import type { BaseContentMetadata } from '@/lib/content';
import type { MetadataRoute } from 'next';
import { getAllPostsMetadata } from '@/lib/micro-cms/blog';
import { aggregateTags } from '@/lib/tags';
import { siteConfig } from '@/config/site';

/* 優先度定数 */
const PRIORITY_HIGHEST = 1;
const PRIORITY_HIGH = 0.8;
const PRIORITY_MEDIUM = 0.7;

const createStaticPages = (): MetadataRoute.Sitemap => {
  const now = new Date();
  return [
    {
      changeFrequency: 'monthly',
      lastModified: now,
      priority: PRIORITY_HIGHEST,
      url: siteConfig.url,
    },
    {
      changeFrequency: 'monthly',
      lastModified: now,
      priority: PRIORITY_HIGH,
      url: `${siteConfig.url}/about`,
    },
    {
      changeFrequency: 'daily',
      lastModified: now,
      priority: PRIORITY_HIGH,
      url: `${siteConfig.url}/blog`,
    },
    {
      changeFrequency: 'monthly',
      lastModified: now,
      priority: PRIORITY_MEDIUM,
      url: `${siteConfig.url}/sitemap-page`,
    },
  ];
};

const createBlogPostEntries = (posts: BaseContentMetadata[]): MetadataRoute.Sitemap =>
  posts.map((post) => ({
    changeFrequency: 'weekly',
    lastModified: new Date(post.updatedAt || post.createdAt),
    priority: PRIORITY_MEDIUM,
    url: `${siteConfig.url}/blog/${post.slug}`,
  }));

const createTagEntries = (posts: BaseContentMetadata[]): MetadataRoute.Sitemap =>
  aggregateTags(posts).map(({ tag }) => ({
    changeFrequency: 'weekly',
    lastModified: new Date(),
    priority: PRIORITY_MEDIUM,
    url: `${siteConfig.url}/blog/tag/${encodeURIComponent(tag)}`,
  }));

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const posts = await getAllPostsMetadata();
  const staticPages = createStaticPages();
  const blogPosts = createBlogPostEntries(posts);
  const tagPages = createTagEntries(posts);

  return [...staticPages, ...blogPosts, ...tagPages];
};

export default sitemap;
