import type { BaseContentMetadata } from './content';

export const filterPostsByTitle = (
  posts: BaseContentMetadata[],
  query: string
): BaseContentMetadata[] => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return posts;
  }

  const lowerQuery = trimmedQuery.toLowerCase();

  return posts.filter((post) => post.title.toLowerCase().includes(lowerQuery));
};
