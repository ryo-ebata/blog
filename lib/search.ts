import type { PostMetadata } from './posts';

export function filterPostsByTitle(posts: PostMetadata[], query: string): PostMetadata[] {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return posts;
  }

  const lowerQuery = trimmedQuery.toLowerCase();

  return posts.filter((post) => post.title.toLowerCase().includes(lowerQuery));
}
