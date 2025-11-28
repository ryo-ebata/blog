'use client';

import { icons } from 'lucide-react';
import Link from 'next/link';
import { TagList } from '@/components/composites/tag-list';
import { MdxHeading } from '@/components/mdx/heading/heading';
import type { PostMetadata } from '@/lib/posts';
import { Time } from '../time/time';

interface PostCardProps {
  metadata: PostMetadata;
}

export function PostCard({ metadata }: PostCardProps) {
  // アイコンの取得（lucide-reactから）
  const IconComponent = metadata.icon
    ? (icons[metadata.icon as keyof typeof icons] as React.ComponentType<{
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
          <Link href={`/blog/${metadata.slug}`}>
            <MdxHeading as="h2">{metadata.title}</MdxHeading>
          </Link>
          <div className="flex items-center gap-4 mt-2">
            {metadata.tags && <TagList tags={metadata.tags} />}
            <Time date={metadata.createdAt} />
          </div>

          {metadata.description && (
            <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              {metadata.description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
