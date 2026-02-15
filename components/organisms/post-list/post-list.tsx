'use client';

import { ArticleCard } from '@/components/organisms/article-card/article-card';
import { EmptyState } from '@/components/molecules/empty-state/empty-state';
import type { BaseContentMetadata } from '@/lib/content';

const EMPTY_LENGTH = 0;

interface PostListProps {
  basePath?: string;
  posts: BaseContentMetadata[];
}

export const PostList = ({ basePath = '/blog', posts }: PostListProps) => {
  if (posts.length === EMPTY_LENGTH) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <ArticleCard
          key={post.slug}
          title={post.title}
          href={`${basePath}/${post.slug}`}
          date={post.createdAt}
          tags={post.tags}
          description={post.description}
          eyecatch={post.eyecatch}
          isExternal={false}
        />
      ))}
    </div>
  );
};
