'use client';

import type { PostMetadata } from '@/lib/posts';
import { EmptyState } from './empty-state';
import { PostCard } from './post-card';

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
