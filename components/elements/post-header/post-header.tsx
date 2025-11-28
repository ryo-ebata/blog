'use client';

import { TagList } from '@/components/composites/tag-list';
import { MdxHeading } from '@/components/mdx/heading/heading';
import type { PostMetadata } from '@/lib/posts';
import { Author } from '../author/author';
import { Time } from '../time/time';

interface PostHeaderProps {
  metadata: PostMetadata;
}

export function PostHeader({ metadata }: PostHeaderProps) {
  const isUpdated = metadata.updatedAt !== metadata.createdAt;

  return (
    <header className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <MdxHeading as="h1">{metadata.title}</MdxHeading>
      <Time date={metadata.createdAt} />
      {isUpdated && <Time date={metadata.updatedAt} />}
      {metadata.author && <Author author={metadata.author} />}
      {metadata.tags && <TagList tags={metadata.tags} />}
    </header>
  );
}
