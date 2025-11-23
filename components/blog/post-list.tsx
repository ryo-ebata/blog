import type { PostData } from '@/lib/posts';
import { EmptyState } from './empty-state';
import { PostCard } from './post-card';

type PostListProps = {
  posts: PostData[];
};

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
