import type { ContentMetadataWithFile } from '@/lib/content';
import { getAllPostsMetadata } from '@/lib/posts';
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
  .map((post: ContentMetadataWithFile) => {
    const postUrl = `${siteUrl}/blog/${post.metadata.slug}`;
    const tags = formatTags(post.metadata.tags);
    return `- ${post.metadata.title}${tags}
  URL: ${postUrl}
  Created: ${post.metadata.createdAt}
  ${formatDescription(post.metadata.description)}`;
  })
  .join('\n')}
`;

  return new Response(llmsContent, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  });
};
