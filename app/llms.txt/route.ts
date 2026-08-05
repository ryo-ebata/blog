import type { BaseContentMetadata } from '@/lib/content';
import { getAllPostsMetadata } from '@/lib/micro-cms/blog';
import { siteConfig } from '@/config/site';

const formatTags = (tags?: string[]): string => {
  if (!tags) {
    return '';
  }
  return ` [${tags.join(', ')}]`;
};

const formatDescription = (description?: string): string => {
  if (!description) {
    return '';
  }
  return `Description: ${description}`;
};

/** 全記事のupdatedAt/createdAtのうち最も新しい日付をYYYY-MM-DD形式で返す(記事が無ければ現在日時) */
const getLastUpdated = (posts: BaseContentMetadata[]): string => {
  const latest = posts.reduce((max, post) => {
    const timestamp = new Date(post.updatedAt || post.createdAt).getTime();
    return Math.max(max, timestamp);
  }, 0);
  return new Date(latest || Date.now()).toISOString().slice(0, 10);
};

export const GET = async () => {
  const posts = await getAllPostsMetadata();
  const siteUrl = siteConfig.url;

  const llmsContent = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.author.bio}

## URL
${siteUrl}

## Links
${Object.entries(siteConfig.links)
  .map(([key, url]) => `- ${key}: ${url}`)
  .join('\n')}

## Posts
${posts
  .map((post: BaseContentMetadata) => {
    const postUrl = `${siteUrl}/blog/${post.slug}`;
    const tags = formatTags(post.tags);
    return `- ${post.title}${tags}
  URL: ${postUrl}
  Created: ${post.createdAt}
  ${formatDescription(post.description)}`;
  })
  .join('\n')}

## Last Updated
${getLastUpdated(posts)}
`;

  return new Response(llmsContent, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  });
};
