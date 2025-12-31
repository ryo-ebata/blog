import type { PostMetadata } from './posts';

export interface TagCount {
  tag: string;
  count: number;
}

export function aggregateTags(posts: PostMetadata[]): TagCount[] {
  const tagMap = new Map<string, number>();

  for (const post of posts) {
    if (!post.tags) continue;
    for (const tag of post.tags) {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function filterPostsByTags(posts: PostMetadata[], tags: string[]): PostMetadata[] {
  if (tags.length === 0) return posts;

  return posts.filter((post) => {
    if (!post.tags) return false;
    return tags.some((tag) => post.tags?.includes(tag));
  });
}
