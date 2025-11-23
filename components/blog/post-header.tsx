import type { PostData } from '@/lib/posts';
import { TagList } from './tag-list';

type PostHeaderProps = {
  post: PostData;
};

export function PostHeader({ post }: PostHeaderProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="mb-8 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <h1 className="text-4xl font-bold mb-2 text-gray-900">{post.title}</h1>
      <time className="text-gray-600 text-base">{formattedDate}</time>
      {post.tags && <TagList tags={post.tags} />}
    </header>
  );
}
