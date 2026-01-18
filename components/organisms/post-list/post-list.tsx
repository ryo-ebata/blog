'use client';

import { ArticleCard } from '@/components/organisms/article-card/article-card';
import { EmptyState } from '@/components/molecules/empty-state/empty-state';
import type { NoteMetadata } from '@/lib/notes';
import type { PostMetadata } from '@/lib/posts';

const EMPTY_LENGTH = 0;

interface PostListProps {
  basePath?: string;
  posts: (NoteMetadata | PostMetadata)[];
}

const getIcon = (icon?: string) => {
  if (icon) {
    return { name: icon, type: 'icon' as const };
  }
  return undefined;
};

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
          icon={getIcon(post.icon)}
          isExternal={false}
        />
      ))}
    </div>
  );
};
