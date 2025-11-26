'use client';

import { EmptyState } from '@/components/elements/empty-state/empty-state';
import { PostCard } from '@/components/elements/post-card/post-card';
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
        <PostCard key={post.slug} metadata={post} />
      ))}
    </div>
  );
}
