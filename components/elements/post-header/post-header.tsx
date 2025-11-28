'use client';

import { TagList } from '@/components/composites/tag-list';
import { MdxHeading } from '@/components/mdx/heading/heading';
import { MdxParagraph } from '@/components/mdx/paragragh/paragragh';
import type { PostMetadata } from '@/lib/posts';
import { Time } from '../time/time';

interface PostHeaderProps {
  metadata: PostMetadata;
}

export function PostHeader({ metadata }: PostHeaderProps) {
  return (
    <div className="mb-8 space-y-4 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <MdxHeading as="h1">{metadata.title}</MdxHeading>
      <div className="flex items-center gap-4">
        {metadata.tags && <TagList tags={metadata.tags} />}
        <Time date={metadata.createdAt} />
      </div>
      <MdxParagraph>{metadata.description}</MdxParagraph>
    </div>
  );
}
