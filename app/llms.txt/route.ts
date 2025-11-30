import { siteConfig } from '@/config/site';
import { getAllPostsMetadata } from '@/lib/posts';

export async function GET() {
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
  .map((post) => {
    const postUrl = `${siteUrl}/blog/${post.metadata.slug}`;
    const tags = post.metadata.tags ? ` [${post.metadata.tags.join(', ')}]` : '';
    return `- ${post.metadata.title}${tags}
  URL: ${postUrl}
  Created: ${post.metadata.createdAt}
  ${post.metadata.description ? `Description: ${post.metadata.description}` : ''}`;
  })
  .join('\n')}
`;

  return new Response(llmsContent, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  });
}
