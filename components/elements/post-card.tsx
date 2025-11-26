'use client';

import { icons } from 'lucide-react';
import Link from 'next/link';
import type { PostData } from '@/lib/posts';
import { TagList } from './tag-list';

interface PostCardProps {
  post: PostData;
};

export function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.metadata.date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // アイコンの取得（lucide-reactから）
  const IconComponent = post.metadata.icon
    ? (icons[post.metadata.icon as keyof typeof icons] as React.ComponentType<{
        className?: string;
      }>)
    : null;

  return (
    <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-4">
        {IconComponent && (
          <div className="shrink-0 mt-1">
            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <IconComponent className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </div>
          </div>
        )}
        <div className="flex-1">
          <Link href={`/blog/${post.metadata.slug}`}>
            <h2 className="text-2xl font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-gray-900 dark:text-gray-100">
              {post.metadata.title}
            </h2>
          </Link>

          <time className="text-gray-600 dark:text-gray-400 text-sm block mt-2">
            {formattedDate}
          </time>

          {post.metadata.description && (
            <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              {post.metadata.description}
            </p>
          )}

          {post.metadata.tags && <TagList tags={post.metadata.tags} />}
        </div>
      </div>
    </article>
  );
}
