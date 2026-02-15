'use client';

import { ArticleCard } from '@/components/organisms/article-card/article-card';
import { EmptyState } from '@/components/molecules/empty-state/empty-state';
import type { BaseContentMetadata } from '@/lib/content';

interface PostListProps {
  basePath?: string;
  posts: BaseContentMetadata[];
}

export function PostList({ basePath = '/blog', posts }: PostListProps) {
  if (posts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {posts.map((post) => (
        <ArticleCard
          key={post.slug}
          title={post.title}
          href={`${basePath}/${post.slug}`}
          slug={post.slug}
          date={post.createdAt}
          tags={post.tags}
          description={post.description}
          eyecatch={post.eyecatch}
          isExternal={false}
        />
      ))}
    </div>
  );
}
