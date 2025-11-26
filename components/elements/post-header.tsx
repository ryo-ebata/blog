import type { PostMetadata } from '@/lib/posts';
import { TagList } from '../composites/tag-list';

interface PostHeaderProps {
  metadata: PostMetadata;
}

export function PostHeader({ metadata }: PostHeaderProps) {
  const formattedDate = new Date(metadata.date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        {metadata.title}
      </h1>
      <time className="text-gray-600 dark:text-gray-400 text-base">{formattedDate}</time>
      {metadata.tags && <TagList tags={metadata.tags} />}
    </header>
  );
}
