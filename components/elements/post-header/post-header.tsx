'use client';

import type { PostMetadata } from '@/lib/posts';
import { TagList } from '@/components/composites/tag-list';
import { formatDateJapanese } from '@/utils/date';
import { Timer, User } from 'lucide-react';
import { MdxHeading } from '@/components/mdx/heading/heading';

interface PostHeaderProps {
  metadata: PostMetadata;
}

export function PostHeader({ metadata }: PostHeaderProps) {
    const isUpdated = metadata.updatedAt !== metadata.createdAt;

  return (
    <header className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <MdxHeading as="h1">{metadata.title}</MdxHeading>
      <DateComponent date={metadata.createdAt} />
      {isUpdated && <DateComponent date={metadata.updatedAt} />}
      {metadata.author && <AuthorComponent author={metadata.author} />}
      {metadata.tags && <TagList tags={metadata.tags} />}
    </header>
  );
}

const DateComponent = ({ date }: { date: string }) => {
  return <time className="text-gray-600 dark:text-gray-400 text-base flex items-center">
    <Timer className="w-3.5 h-3.5 mr-1" />
    {formatDateJapanese(date)}
    </time>;
};

const AuthorComponent = ({ author }: { author: string }) => {
  return <p className="text-gray-600 dark:text-gray-400 text-base flex items-center">
    <User className="w-3.5 h-3.5 mr-1" />
    {author}
    </p>;
};
