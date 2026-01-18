'use client';

import { EmptyState } from '@/components/molecules/empty-state/empty-state';
import { ArticleCard } from '@/components/organisms/article-card/article-card';
import type { NoteMetadata } from '@/lib/notes';
import type { PostMetadata } from '@/lib/posts';

interface PostListProps {
  posts: (PostMetadata | NoteMetadata)[];
  basePath?: string;
}

export function PostList({ posts, basePath = '/blog' }: PostListProps) {
  if (posts.length === 0) {
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
          icon={post.icon ? { name: post.icon, type: 'icon' } : undefined}
          isExternal={false}
        />
      ))}
    </div>
  );
}
