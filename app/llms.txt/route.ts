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

export const GET = async () => {
  const posts = await getAllPostsMetadata();
  const siteUrl = siteConfig.url;

  const llmsContent = `# ${siteConfig.name}

## About
${siteConfig.description}

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
`;

  return new Response(llmsContent, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  });
};
