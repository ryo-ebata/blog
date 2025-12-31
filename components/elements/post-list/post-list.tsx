'use client';

import { ArticleCard } from '@/components/composites/article-card/article-card';
import { EmptyState } from '@/components/elements/empty-state/empty-state';
import type { PostMetadata } from '@/lib/posts';

interface PostListProps {
  posts: PostMetadata[];
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <ArticleCard
          key={post.slug}
          title={post.title}
          href={`/blog/${post.slug}`}
          date={post.createdAt}
          tags={post.tags}
          description={post.description}
          icon={post.icon ? { type: 'icon', name: post.icon } : undefined}
          isExternal={false}
        />
      ))}
    </div>
  );
}
